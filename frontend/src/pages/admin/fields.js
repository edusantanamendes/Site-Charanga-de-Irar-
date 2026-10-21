const field = (name, label, type = "text", extra = {}) => ({
  name,
  label,
  type,
  ...extra,
});
const published = field("published", "Publicar no site", "checkbox");
const order = field("order", "Ordem de exibição", "number", {
  default: 0,
  min: 0,
  max: 10000,
});
const image = (name = "imageUrl", label = "Imagem") =>
  field(name, label, "image");
const title = field("title", "Título", "text", {
  required: true,
  maxLength: 160,
});
const category = field("categoryId", "Categoria", "category");
const event = field("eventId", "Evento relacionado", "event");
export const sections = {
  events: {
    title: "Eventos",
    singular: "evento",
    description: "Organize a agenda e preserve os registros das apresentações.",
    fields: [
      title,
      field("slug", "Endereço da página", "text", {
        required: true,
        help: "Exemplo: alvorada-em-irara. Apenas letras minúsculas, números e hífens.",
      }),
      field("startsAt", "Início", "datetime-local", {
        required: true,
        help: "Horário de Brasília (UTC−03:00).",
      }),
      field("endsAt", "Término", "datetime-local"),
      field("location", "Local", "text", { required: true }),
      field("description", "Descrição", "textarea", {
        required: true,
        minLength: 10,
        maxLength: 12000,
      }),
      image(),
      field("status", "Situação", "select", {
        default: "CONFIRMED",
        options: [
          ["CONFIRMED", "Confirmado"],
          ["CANCELLED", "Cancelado"],
          ["POSTPONED", "Adiado"],
        ],
      }),
      published,
    ],
  },
  musicians: {
    title: "Músicos",
    singular: "músico",
    description: "Cadastre somente informações confirmadas dos integrantes.",
    fields: [
      field("name", "Nome", "text", { required: true }),
      field("instrument", "Instrumento", "text", { required: true }),
      field("role", "Função ou cargo"),
      field("bio", "Biografia", "textarea", {
        required: true,
        minLength: 5,
        maxLength: 4000,
      }),
      image(),
      order,
      published,
    ],
  },
  photographs: {
    title: "Fotografias",
    singular: "fotografia",
    description:
      "Construa o acervo oficial com descrições acessíveis e créditos.",
    fields: [
      title,
      image("url", "Fotografia *"),
      field("alt", "Descrição da imagem para acessibilidade", "textarea", {
        required: true,
        minLength: 5,
        maxLength: 500,
      }),
      field("credit", "Crédito / autoria"),
      category,
      event,
      order,
      published,
    ],
  },
  videos: {
    title: "Vídeos",
    singular: "vídeo",
    description: "Publique vídeos oficiais hospedados no YouTube ou Vimeo.",
    fields: [
      title,
      field("url", "Link do vídeo", "url", {
        required: true,
        help: "YouTube: https://www.youtube.com/watch?v=… ou https://youtu.be/…; Vimeo: https://vimeo.com/…",
      }),
      image("thumbnailUrl", "Imagem de capa"),
      field("description", "Descrição", "textarea", {
        required: true,
        minLength: 5,
      }),
      field("credit", "Crédito / autoria"),
      category,
      event,
      published,
    ],
  },
  categories: {
    title: "Categorias",
    singular: "categoria",
    description: "Organize fotografias e vídeos por temas.",
    fields: [
      field("name", "Nome da categoria", "text", {
        required: true,
        maxLength: 100,
      }),
    ],
  },
  contents: {
    title: "Conteúdo institucional",
    singular: "conteúdo",
    description:
      "Edite os textos e os marcos históricos. Use somente datas e fatos confirmados.",
    fields: [
      field("key", "Identificador", "text", {
        required: true,
        help: "Os identificadores hero, history-intro, alvoradas, lavagem e cultura conectam os textos à página inicial. Preserve-os ao editar.",
      }),
      field("title", "Título", "textarea", { required: true, maxLength: 200 }),
      field("body", "Texto", "textarea", { required: true, maxLength: 16000 }),
      field("section", "Seção", "select", {
        default: "general",
        options: [
          ["home", "Página inicial"],
          ["historia", "Nossa história"],
          ["tradicao", "Nossa tradição"],
          ["timeline", "Linha do tempo"],
          ["general", "Geral"],
        ],
      }),
      field("year", "Ano confirmado (somente linha do tempo)", "number", {
        min: 1500,
        max: 2200,
        help: "1954 é a fundação da Filarmônica, não da Charanga.",
      }),
      order,
      published,
    ],
  },
  messages: {
    title: "Mensagens",
    singular: "mensagem",
    description:
      "Consulte e organize os contatos. Exclua os dados quando não forem mais necessários.",
    fields: [
      field("name", "Nome", "text", { required: true }),
      field("email", "E-mail", "email", { required: true }),
      field("phone", "Telefone"),
      field("subject", "Assunto", "select", {
        options: [
          "Contratação para apresentações",
          "Informações sobre eventos",
          "Parcerias",
          "Imprensa",
          "Outros assuntos",
        ].map((item) => [item, item]),
        default: "Outros assuntos",
      }),
      field("body", "Mensagem", "textarea", { required: true, minLength: 20 }),
      field("status", "Situação da leitura", "select", {
        options: [
          ["NEW", "Nova"],
          ["READ", "Lida"],
          ["ARCHIVED", "Arquivada"],
        ],
        default: "NEW",
      }),
    ],
  },
  socials: {
    title: "Redes sociais",
    singular: "link",
    description: "Divulgue somente os canais oficiais da Charanga.",
    fields: [
      field("label", "Nome da rede", "text", { required: true }),
      field("url", "Endereço HTTPS", "url", { required: true }),
      order,
      published,
    ],
  },
};
export const settingFields = [
  field("name", "Nome do site", "text", { required: true }),
  field("tagline", "Assinatura institucional", "textarea", { required: true }),
  field("locationLabel", "Localidade", "text", { required: true }),
  field("officialEmail", "E-mail oficial para receber mensagens", "email"),
  field("whatsapp", "WhatsApp oficial", "text", {
    help: "Somente números, incluindo DDI e DDD. Deixe vazio para ocultar o botão.",
  }),
  image("logoUrl", "Logomarca oficial"),
  image("heroImageUrl", "Fotografia oficial de destaque"),
  field("heroImageAlt", "Descrição da fotografia de destaque", "textarea", {
    maxLength: 500,
    help: "Obrigatória quando houver fotografia de destaque. Descreva o que aparece na imagem.",
  }),
];
