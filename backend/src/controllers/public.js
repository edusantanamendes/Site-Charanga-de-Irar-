import { contactSchema } from "../validators/index.js";
import { HttpError } from "../utils/security.js";
import { forwardMessage } from "../services/mail.js";

export function publicController(db, mailer) {
  const published = { published: true };
  return {
    async site(req, res) {
      const [settings, contents, socials, categories] = await Promise.all([
        db.siteSetting.findUnique({ where: { id: "site" } }),
        db.institutionalContent.findMany({
          where: published,
          orderBy: { order: "asc" },
        }),
        db.socialLink.findMany({ where: published, orderBy: { order: "asc" } }),
        db.category.findMany({ orderBy: { name: "asc" } }),
      ]);
      res.json({ settings, contents, socials, categories });
    },
    async events(req, res) {
      res.json(
        await db.event.findMany({
          where: published,
          orderBy: { startsAt: "asc" },
          take: 500,
        }),
      );
    },
    async event(req, res) {
      const event = await db.event.findFirst({
        where: { ...published, slug: req.params.slug },
      });
      if (!event) throw new HttpError(404, "Evento não encontrado.");
      res.json(event);
    },
    async musicians(req, res) {
      res.json(
        await db.musician.findMany({
          where: published,
          orderBy: { order: "asc" },
          take: 500,
        }),
      );
    },
    async gallery(req, res) {
      const include = { category: true };
      const [photographs, videos] = await Promise.all([
        db.photograph.findMany({
          where: published,
          include,
          orderBy: { order: "asc" },
          take: 1000,
        }),
        db.video.findMany({
          where: published,
          include,
          orderBy: { createdAt: "desc" },
          take: 500,
        }),
      ]);
      res.json({ photographs, videos });
    },
    async contact(req, res) {
      const data = contactSchema.parse(req.body);
      if (data.website)
        return res.status(201).json({ message: "Mensagem recebida." });
      const { consent, website, ...fields } = data;
      const message = await db.message.create({ data: fields });
      await forwardMessage(db, mailer, message);
      res
        .status(201)
        .json({
          message:
            "Sua mensagem foi recebida pela Charanga. Obrigado pelo contato!",
        });
    },
  };
}
