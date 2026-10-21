import { rateLimit } from "express-rate-limit";
import { digest, HttpError, safeEqual } from "../utils/security.js";

export const limiter = (limit, windowMs = 15 * 60 * 1000) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    },
  });

export function originGuard(config) {
  return (req, res, next) => {
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      (!req.headers.origin || !config.origins.includes(req.headers.origin))
    )
      return next(new HttpError(403, "Origem da solicitação não autorizada."));
    next();
  };
}

export function requireSession(db, config) {
  return async (req, res, next) => {
    const token = req.cookies.charanga_session;
    if (!token || !/^[a-f0-9]{64}$/.test(token))
      throw new HttpError(401, "Entre para acessar a administração.");
    const session = await db.session.findUnique({
      where: { tokenHash: digest(token, config.sessionSecret) },
      include: { admin: { select: { id: true, name: true, email: true } } },
    });
    if (!session || session.expiresAt < new Date())
      throw new HttpError(401, "Sua sessão expirou. Entre novamente.");
    req.session = session;
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      !safeEqual(req.headers["x-csrf-token"], session.csrfToken)
    )
      throw new HttpError(403, "Solicitação expirada. Recarregue a página.");
    res.set("Cache-Control", "no-store");
    next();
  };
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.name === "ZodError")
    return res
      .status(422)
      .json({
        error: "Revise os campos informados.",
        fields: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
  if (error.code === "P2002")
    return res
      .status(409)
      .json({ error: "Já existe um registro com este identificador." });
  if (error.code === "P2025")
    return res.status(404).json({ error: "Registro não encontrado." });
  if (error.code === "P2003")
    return res
      .status(422)
      .json({ error: "A categoria ou o evento selecionado não existe mais." });
  if (error.code === "LIMIT_FILE_SIZE")
    return res.status(413).json({ error: "A imagem deve ter no máximo 8 MB." });
  const status = error.status || (error.name === "MulterError" ? 422 : 500);
  if (status >= 500)
    console.error("Request failed:", error.name, error.code || "internal");
  res
    .status(status)
    .json({
      error:
        status < 500
          ? error.message
          : "Não foi possível concluir a operação. Tente novamente.",
    });
}
