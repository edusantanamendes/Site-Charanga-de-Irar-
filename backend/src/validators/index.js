import { z } from "zod";

const text = (min = 1, max = 500) =>
  z
    .string()
    .trim()
    .min(min, `Informe pelo menos ${min} caracteres.`)
    .max(max, `Use até ${max} caracteres.`);
const optionalText = (max = 500) =>
  z
    .union([text(0, max), z.null()])
    .optional()
    .transform((value) => value || null);
const image = z
  .string()
  .regex(
    /^\/uploads\/[a-f0-9-]+\.webp$/,
    "Selecione uma imagem enviada pelo painel.",
  );
const optionalImage = z
  .union([image, z.literal(""), z.null()])
  .optional()
  .transform((value) => value || null);
const relation = z
  .union([text(1, 40), z.literal(""), z.null()])
  .optional()
  .transform((value) => value || null);
const order = z.number().int().min(0).max(10000).default(0);
const published = z.boolean().default(false);
const email = z
  .email("Informe um e-mail válido.")
  .max(254)
  .transform((value) => value.toLowerCase());
export const password = z
  .string()
  .min(12, "A senha deve ter pelo menos 12 caracteres.")
  .max(72, "Use até 72 caracteres.")
  .refine(
    (value) => Buffer.byteLength(value, "utf8") <= 72,
    "A senha deve ter até 72 bytes.",
  );
const videoUrl = z.url().refine((value) => {
  try {
    const u = new URL(value);
    return (
      u.protocol === "https:" &&
      ((["youtube.com", "www.youtube.com", "youtu.be"].includes(u.hostname) &&
        (/^[\w-]{11}$/.test(u.searchParams.get("v") || "") ||
          /^\/[\w-]{11}$/.test(u.pathname))) ||
        (["vimeo.com", "www.vimeo.com"].includes(u.hostname) &&
          /^\/\d+$/.test(u.pathname)))
    );
  } catch {
    return false;
  }
}, "Use o link de um vídeo do YouTube ou Vimeo.");

export const schemas = {
  events: z
    .object({
      title: text(3, 160),
      slug: text(3, 180).regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use letras minúsculas, números e hífens.",
      ),
      startsAt: z.iso
        .datetime({ offset: true })
        .transform((value) => new Date(value)),
      endsAt: z
        .union([z.iso.datetime({ offset: true }), z.literal(""), z.null()])
        .optional()
        .transform((value) => (value ? new Date(value) : null)),
      location: text(3, 300),
      description: text(10, 12000),
      imageUrl: optionalImage,
      status: z.enum(["CONFIRMED", "CANCELLED", "POSTPONED"]),
      published,
    })
    .refine((value) => !value.endsAt || value.endsAt >= value.startsAt, {
      path: ["endsAt"],
      message: "O término deve ser posterior ao início.",
    }),
  musicians: z.object({
    name: text(2, 160),
    instrument: text(2, 160),
    bio: text(5, 4000),
    role: optionalText(160),
    imageUrl: optionalImage,
    order,
    published,
  }),
  photographs: z.object({
    title: text(2, 160),
    alt: text(5, 500),
    url: image,
    credit: optionalText(200),
    categoryId: relation,
    eventId: relation,
    order,
    published,
  }),
  videos: z.object({
    title: text(2, 160),
    url: videoUrl,
    thumbnailUrl: optionalImage,
    description: text(5, 4000),
    credit: optionalText(200),
    categoryId: relation,
    eventId: relation,
    published,
  }),
  categories: z.object({ name: text(2, 100) }),
  contents: z.object({
    key: text(2, 80).regex(/^[a-z0-9_-]+$/),
    title: text(2, 200),
    body: text(3, 16000),
    section: z.enum(["home", "historia", "tradicao", "timeline", "general"]),
    year: z
      .union([z.number().int().min(1500).max(2200), z.null()])
      .optional()
      .transform((value) => value ?? null),
    order,
    published,
  }),
  socials: z.object({
    label: text(2, 80),
    url: z
      .url()
      .max(500)
      .refine(
        (value) => new URL(value).protocol === "https:",
        "Use um endereço HTTPS.",
      ),
    published,
    order,
  }),
  messages: z.object({
    name: text(2, 160),
    email,
    phone: optionalText(40),
    subject: z.enum([
      "Contratação para apresentações",
      "Informações sobre eventos",
      "Parcerias",
      "Imprensa",
      "Outros assuntos",
    ]),
    body: text(20, 6000),
    status: z.enum(["NEW", "READ", "ARCHIVED"]).default("NEW"),
  }),
};
export const contactSchema = schemas.messages
  .omit({ status: true })
  .extend({
    website: z.string().max(200).optional(),
    consent: z.literal(true, {
      error: "Autorize o uso dos dados para responder à mensagem.",
    }),
  });
export const settingsSchema = z
  .object({
    name: text(3, 160),
    tagline: text(5, 300),
    locationLabel: text(3, 160),
    officialEmail: z.union([email, z.literal("")]),
    whatsapp: z
      .string()
      .regex(/^(\d{10,15})?$/, "Use somente números, com DDI e DDD."),
    logoUrl: optionalImage,
    heroImageUrl: optionalImage,
    heroImageAlt: text(0, 500).default(""),
  })
  .refine((value) => !value.heroImageUrl || value.heroImageAlt.length >= 5, {
    path: ["heroImageAlt"],
    message: "Descreva a fotografia de destaque para acessibilidade.",
  });
export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(200),
});
export const recoverySchema = z.object({ email });
export const resetSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/),
  password,
});
