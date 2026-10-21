import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { schemas, settingsSchema } from "../validators/index.js";
import { HttpError } from "../utils/security.js";
import { forwardMessage } from "../services/mail.js";

const resources = {
  events: ["event", { startsAt: "desc" }],
  musicians: ["musician", { order: "asc" }],
  photographs: ["photograph", { order: "asc" }],
  videos: ["video", { createdAt: "desc" }],
  categories: ["category", { name: "asc" }],
  contents: ["institutionalContent", { order: "asc" }],
  messages: ["message", { createdAt: "desc" }],
  socials: ["socialLink", { order: "asc" }],
};

export function adminController(db, config, mailer) {
  function resource(req) {
    const entry = resources[req.params.resource];
    if (!entry) throw new HttpError(404, "Seção não encontrada.");
    return {
      model: db[entry[0]],
      orderBy: entry[1],
      schema: schemas[req.params.resource],
    };
  }
  return {
    async dashboard(req, res) {
      const [
        events,
        musicians,
        photographs,
        videos,
        messages,
        unread,
        upcoming,
        pending,
      ] = await Promise.all([
        db.event.count(),
        db.musician.count(),
        db.photograph.count(),
        db.video.count(),
        db.message.count(),
        db.message.count({ where: { status: "NEW" } }),
        db.event.findMany({
          where: { startsAt: { gte: new Date() } },
          orderBy: { startsAt: "asc" },
          take: 5,
        }),
        db.message.count({ where: { deliveryStatus: { not: "SENT" } } }),
      ]);
      res.json({
        events,
        musicians,
        photographs,
        videos,
        messages,
        unread,
        upcoming,
        pending,
        mailConfigured: mailer.enabled,
      });
    },
    async list(req, res) {
      const { model, orderBy } = resource(req);
      const page = Math.max(
        1,
        Math.min(10000, Number.parseInt(req.query.page) || 1),
      );
      const pageSize = Math.max(
        1,
        Math.min(100, Number.parseInt(req.query.limit) || 20),
      );
      const [items, total] = await Promise.all([
        model.findMany({
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        model.count(),
      ]);
      res.json({ items, total, page, pageSize });
    },
    async get(req, res) {
      const item = await resource(req).model.findUnique({
        where: { id: req.params.id },
      });
      if (!item) throw new HttpError(404, "Registro não encontrado.");
      res.json(item);
    },
    async save(req, res) {
      const { model, schema } = resource(req);
      const data = schema.parse(req.body);
      if (req.params.resource === "messages" && !req.params.id)
        data.deliveryStatus = "PENDING";
      const item = req.params.id
        ? await model.update({ where: { id: req.params.id }, data })
        : await model.create({ data });
      res.status(req.params.id ? 200 : 201).json(item);
    },
    async remove(req, res) {
      await resource(req).model.delete({ where: { id: req.params.id } });
      res.status(204).end();
    },
    async settings(req, res) {
      res.json(await db.siteSetting.findUnique({ where: { id: "site" } }));
    },
    async updateSettings(req, res) {
      const data = settingsSchema.parse(req.body);
      res.json(
        await db.siteSetting.upsert({
          where: { id: "site" },
          create: { id: "site", ...data },
          update: data,
        }),
      );
    },
    async retry(req, res) {
      const message = await db.message.findUnique({
        where: { id: req.params.id },
      });
      if (!message) throw new HttpError(404, "Mensagem não encontrada.");
      if (message.deliveryStatus === "SENT")
        throw new HttpError(409, "Esta mensagem já foi encaminhada.");
      const sent = await forwardMessage(db, mailer, message);
      if (!sent)
        throw new HttpError(
          503,
          "A mensagem está salva. Verifique o SMTP e o e-mail oficial nas configurações para encaminhá-la.",
        );
      res.json({ success: true });
    },
    async upload(req, res) {
      if (!req.file)
        throw new HttpError(422, "Selecione uma imagem JPEG, PNG ou WebP.");
      const bytes = req.file.buffer;
      const isPng = bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      const isJpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      const isWebp =
        bytes.subarray(0, 4).toString() === "RIFF" &&
        bytes.subarray(8, 12).toString() === "WEBP";
      if (!isPng && !isJpeg && !isWebp)
        throw new HttpError(
          422,
          "Formato não permitido. Use JPEG, PNG ou WebP.",
        );
      let output;
      try {
        const input = sharp(req.file.buffer, {
          limitInputPixels: 40000000,
          failOn: "warning",
        });
        const metadata = await input.metadata();
        if (
          !["jpeg", "png", "webp"].includes(metadata.format) ||
          (metadata.pages || 1) > 1
        )
          throw new Error("Invalid format");
        output = await input
          .rotate()
          .resize({
            width: 2400,
            height: 2400,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 84 })
          .toBuffer();
      } catch {
        throw new HttpError(
          422,
          "Arquivo inválido. Use uma imagem estática JPEG, PNG ou WebP de até 40 megapixels.",
        );
      }
      const filename = `${randomUUID()}.webp`;
      await fs.mkdir(config.uploadDir, { recursive: true });
      await fs.writeFile(path.join(config.uploadDir, filename), output, {
        flag: "wx",
      });
      try {
        const uploaded = await db.upload.create({
          data: { filename, url: `/uploads/${filename}`, size: output.length },
        });
        res.status(201).json({ url: uploaded.url });
      } catch (error) {
        await fs.unlink(path.join(config.uploadDir, filename));
        throw error;
      }
    },
  };
}
