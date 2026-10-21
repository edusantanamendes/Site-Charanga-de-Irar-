// Revisa apenas os títulos originais conhecidos. Edições do painel prevalecem.
const titles = {
  "nossa-historia": ["Nossa história", "A Charanga e a cidade"],
  "history-intro": [
    "A nossa história tem o som de Irará.",
    "A música como parte de Irará.",
  ],
  "tradition-heading": [
    "A tradição encontra\no seu caminho.",
    "A tradição nas ruas.",
  ],
  "gallery-heading": [
    "A música passa.\nA memória fica.",
    "Registros da Charanga",
  ],
  "events-heading": [
    "Onde a música\nvai nos levar.",
    "Agenda de apresentações",
  ],
  invitation: [
    "Todo encontro merece\numa boa música.",
    "Leve a tradição da Charanga para o seu evento.",
  ],
  "page-history": ["Uma história que\ncontinua a tocar.", "Nossa história"],
  "page-gallery": ["Cada registro,\numa história.", "Galeria"],
  "page-events": ["O nosso próximo\nencontro.", "Agenda"],
  "page-musicians": ["Muitas histórias.\nUma só harmonia.", "Nossos músicos"],
  "page-contact": [
    "Boas histórias começam\ncom um encontro.",
    "Fale com a Charanga",
  ],
  "contact-aside": [
    "A música aproxima.\nO contato também.",
    "Apresentações, parcerias e outros encontros.",
  ],
};

export function editorialTitle(key, value, fallback) {
  const entry = titles[key];
  return entry && (!value || value === entry[0]) ? entry[1] : value || fallback;
}
