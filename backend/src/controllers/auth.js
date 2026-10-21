import bcrypt from "bcryptjs";
import { digest, HttpError, randomToken } from "../utils/security.js";
import {
  loginSchema,
  recoverySchema,
  resetSchema,
} from "../validators/index.js";

const dummyHash = bcrypt.hashSync(randomToken(), 12);
export function authController(db, config, mailer) {
  const cookieOptions = {
    httpOnly: true,
    secure: config.production,
    sameSite: "strict",
    path: "/api",
    maxAge: 8 * 60 * 60 * 1000,
  };
  return {
    async login(req, res) {
      const { email, password } = loginSchema.parse(req.body);
      const admin = await db.administrator.findUnique({ where: { email } });
      const valid = await bcrypt.compare(
        password,
        admin?.passwordHash || dummyHash,
      );
      if (
        !admin ||
        !valid ||
        (admin.lockedUntil && admin.lockedUntil > new Date())
      ) {
        if (admin) {
          const attempts =
            admin.lockedUntil && admin.lockedUntil < new Date()
              ? 1
              : admin.failedLogins + 1;
          await db.administrator.update({
            where: { id: admin.id },
            data: {
              failedLogins: attempts,
              lockedUntil:
                attempts >= 10 ? new Date(Date.now() + 15 * 60 * 1000) : null,
            },
          });
        }
        throw new HttpError(
          401,
          "E-mail ou senha inválidos, ou acesso temporariamente bloqueado.",
        );
      }
      const token = randomToken();
      const csrfToken = randomToken();
      await db.$transaction([
        db.administrator.update({
          where: { id: admin.id },
          data: { failedLogins: 0, lockedUntil: null },
        }),
        db.session.deleteMany({
          where: {
            OR: [
              { expiresAt: { lt: new Date() } },
              ...(req.cookies.charanga_session
                ? [
                    {
                      tokenHash: digest(
                        req.cookies.charanga_session,
                        config.sessionSecret,
                      ),
                    },
                  ]
                : []),
            ],
          },
        }),
        db.session.create({
          data: {
            tokenHash: digest(token, config.sessionSecret),
            csrfToken,
            adminId: admin.id,
            expiresAt: new Date(Date.now() + cookieOptions.maxAge),
          },
        }),
      ]);
      res
        .cookie("charanga_session", token, cookieOptions)
        .json({
          user: { id: admin.id, name: admin.name, email: admin.email },
          csrfToken,
        });
    },
    session(req, res) {
      res.json({ user: req.session.admin, csrfToken: req.session.csrfToken });
    },
    async logout(req, res) {
      await db.session.delete({ where: { id: req.session.id } });
      res
        .clearCookie("charanga_session", {
          ...cookieOptions,
          maxAge: undefined,
        })
        .json({ success: true });
    },
    async recover(req, res) {
      const { email } = recoverySchema.parse(req.body);
      const admin = await db.administrator.findUnique({ where: { email } });
      if (admin && mailer.enabled) {
        const token = randomToken();
        await db.$transaction([
          db.passwordReset.deleteMany({
            where: {
              OR: [{ adminId: admin.id }, { expiresAt: { lt: new Date() } }],
            },
          }),
          db.passwordReset.create({
            data: {
              tokenHash: digest(token, config.sessionSecret),
              adminId: admin.id,
              expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            },
          }),
        ]);
        try {
          await mailer.send({
            to: admin.email,
            subject: "Redefinir senha — Charanga de Irará",
            text: `Para definir uma nova senha, acesse:\n${config.siteUrl}/admin/redefinir?token=${token}\n\nEste link expira em 30 minutos. Se você não solicitou, ignore esta mensagem.`,
          });
        } catch {
          console.error("Password reset email delivery failed.");
        }
      }
      res.json({
        message:
          "Se o e-mail estiver cadastrado e o envio configurado, você receberá um link de recuperação.",
      });
    },
    async reset(req, res) {
      const { token, password } = resetSchema.parse(req.body);
      const tokenHash = digest(token, config.sessionSecret);
      const passwordHash = await bcrypt.hash(password, 12);
      await db.$transaction(async (tx) => {
        const reset = await tx.passwordReset.findUnique({
          where: { tokenHash },
        });
        if (!reset || reset.expiresAt < new Date())
          throw new HttpError(
            400,
            "O link é inválido ou expirou. Solicite outro.",
          );
        // Deleting this unique token also makes concurrent reuse roll back.
        await tx.passwordReset.delete({ where: { id: reset.id } });
        await tx.administrator.update({
          where: { id: reset.adminId },
          data: { passwordHash, failedLogins: 0, lockedUntil: null },
        });
        await tx.session.deleteMany({ where: { adminId: reset.adminId } });
        await tx.passwordReset.deleteMany({
          where: { adminId: reset.adminId },
        });
      });
      res
        .clearCookie("charanga_session", {
          ...cookieOptions,
          maxAge: undefined,
        })
        .json({ message: "Senha atualizada. Entre com sua nova senha." });
    },
  };
}
