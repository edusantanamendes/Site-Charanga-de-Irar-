import "dotenv/config";
import { pathToFileURL } from "node:url";
import { createDatabase } from "../src/models/database.js";

export const initialContents = [
  {
    key: "hero",
    section: "home",
    title: "Tradição, música e cultura que atravessam gerações.",
    body: "Conheça a história, a tradição e a alegria de uma das mais importantes manifestações musicais e culturais de Irará, Bahia.",
  },
  {
    key: "history-intro",
    section: "home",
    title: "A nossa história tem o som de Irará.",
    body: "Das alvoradas aos cortejos, a Charanga de Irará faz da música um encontro. Uma expressão viva da cultura da nossa cidade, feita por músicos que carregam a tradição e a compartilham com cada nova geração.",
  },
  {
    key: "history-connection",
    section: "home",
    title: "Nossas raízes musicais",
    body: "Ligada à tradição musical da Filarmônica 25 de Dezembro, a Charanga acompanha a vida, a fé e as celebrações da nossa gente.",
  },
  {
    key: "tradition-heading",
    section: "home",
    title: "A tradição encontra\no seu caminho.",
    body: "Nas ruas, nas festas e na memória. A nossa cultura segue em movimento.",
  },
  {
    key: "gallery-heading",
    section: "home",
    title: "A música passa.\nA memória fica.",
    body: "Um acervo para guardar o que a gente vive.",
  },
  {
    key: "events-heading",
    section: "home",
    title: "Onde a música\nvai nos levar.",
    body: "Acompanhe os nossos próximos encontros.",
  },
  {
    key: "invitation",
    section: "general",
    title: "Todo encontro merece\numa boa música.",
    body: "Leve a tradição e a alegria da Charanga para o seu evento.",
  },
  {
    key: "page-history",
    section: "general",
    title: "Uma história que\ncontinua a tocar.",
    body: "A música faz parte da vida de Irará. A nossa história também.",
  },
  {
    key: "page-gallery",
    section: "general",
    title: "Cada registro,\numa história.",
    body: "Encontros, alvoradas e celebrações. A memória da Charanga em imagens e sons.",
  },
  {
    key: "page-events",
    section: "general",
    title: "O nosso próximo\nencontro.",
    body: "Saiba onde encontrar a Charanga e relembre as apresentações que fazem parte da nossa história.",
  },
  {
    key: "page-musicians",
    section: "general",
    title: "Muitas histórias.\nUma só harmonia.",
    body: "Conheça quem mantém viva a nossa tradição e leva a música da Charanga a cada encontro.",
  },
  {
    key: "page-contact",
    section: "general",
    title: "Boas histórias começam\ncom um encontro.",
    body: "Apresentações, parcerias ou uma boa conversa sobre a nossa cultura. Será um prazer receber a sua mensagem.",
  },
  {
    key: "contact-aside",
    section: "general",
    title: "A música aproxima.\nO contato também.",
    body: "Envie sua mensagem pelo formulário. Ela será recebida pela equipe responsável pela Charanga.",
  },
  {
    key: "alvoradas",
    section: "tradicao",
    title: "Alvoradas musicais",
    body: "Quando o dia começa, a música anuncia a celebração. As alvoradas fazem parte da ligação da Charanga com os festejos e a vida da cidade.",
  },
  {
    key: "lavagem",
    section: "tradicao",
    title: "Lavagem de Irará",
    body: "Entre encontros, fé e festa, a Charanga participa de uma das expressões mais marcantes da cultura popular de Irará.",
  },
  {
    key: "cultura",
    section: "tradicao",
    title: "Cultura e tradição",
    body: "Uma memória que permanece viva em cada instrumento, em cada cortejo e no respeito às gerações de músicos da nossa terra.",
  },
  {
    key: "nossa-historia",
    section: "historia",
    title: "Nossa história",
    body: "A Charanga de Irará é uma manifestação musical e cultural do município de Irará, na Bahia. Formada por músicos ligados à tradicional Filarmônica 25 de Dezembro, tem uma presença importante nas celebrações populares da cidade.",
  },
  {
    key: "parte-de-irara",
    section: "historia",
    title: "Uma tradição que faz parte de Irará",
    body: "A sua trajetória se entrelaça com as festividades religiosas, as alvoradas musicais e os cortejos. A presença da Charanga é especialmente marcante na tradicional Lavagem de Irará e nos festejos de Nossa Senhora da Purificação dos Campos.",
  },
  {
    key: "geracoes",
    section: "historia",
    title: "A música que une gerações",
    body: "Entre músicos e comunidade, a música cria vínculos. A Charanga valoriza o conhecimento compartilhado entre gerações e o respeito a quem mantém essa tradição presente na vida de Irará.",
  },
  {
    key: "patrimonio",
    section: "historia",
    title: "Cultura e patrimônio",
    body: "Preservar a memória da Charanga é valorizar a identidade cultural e a tradição musical do município. Fotografias, relatos e registros de apresentações ajudam a manter essa história acessível à comunidade.",
  },
  {
    key: "continua",
    section: "historia",
    title: "Nossa tradição continua",
    body: "A história segue sendo construída nos encontros, nas apresentações e no cuidado com a memória musical de Irará. Este espaço reúne e compartilha os registros oficiais dessa trajetória.",
  },
  {
    key: "filarmonica-1954",
    section: "timeline",
    year: 1954,
    title: "Filarmônica 25 de Dezembro",
    body: "Fundação da instituição à qual estão ligados músicos da Charanga. Esta é a data de fundação da Filarmônica, não a data de fundação da Charanga.",
  },
];

export async function seed(db) {
  await db.siteSetting.upsert({
    where: { id: "site" },
    create: { id: "site", locationLabel: "Irará, Bahia" },
    update: {},
  });
  for (const [order, content] of initialContents.entries())
    await db.institutionalContent.upsert({
      where: { key: content.key },
      create: { ...content, order, published: true },
      update: {},
    });
  for (const name of [
    "Apresentações",
    "Alvoradas",
    "Lavagem de Irará",
    "Eventos",
    "Nossa história",
  ])
    await db.category.upsert({ where: { name }, create: { name }, update: {} });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const db = createDatabase();
  try {
    await seed(db);
    console.log(
      "Conteúdo institucional inicial cadastrado. Nenhum evento, integrante ou administrador fictício foi criado.",
    );
  } finally {
    await db.$disconnect();
  }
}
