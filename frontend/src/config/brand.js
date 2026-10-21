export const brand = {
  name: "Charanga de Irará",
  logoUrl: "/brand/logo-charanga-original.jpeg",
  logoAlt: "Logomarca oficial da Charanga de Irará",
  heroDescription:
    "Preservando a história, celebrando a música e mantendo viva a tradição cultural de Irará, Bahia.",
  legacyHeroDescription:
    "Conheça a história, a tradição e a alegria de uma das mais importantes manifestações musicais e culturais de Irará, Bahia.",
  defaultTagline: "Tradição, música e cultura que atravessam gerações.",
  footerTagline: "Preservando nossa história através da música.",
};

// Atualiza a apresentação do texto inicial conhecido, preservando edições do painel.
export const heroDescription = (value) =>
  !value || value === brand.legacyHeroDescription
    ? brand.heroDescription
    : value;
export const footerTagline = (value) =>
  !value || value === brand.defaultTagline ? brand.footerTagline : value;
