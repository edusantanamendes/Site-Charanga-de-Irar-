---
name: "Charanga de Irará"
description: "Editorial Cultural + Modern Heritage, em azul institucional e branco."
colors:
  primary: "#04006c"
  primary-dark: "#05054f"
  primary-hover: "#17138f"
  primary-light: "#e9edf7"
  primary-soft: "#f3f5fa"
  primary-mid: "#c8d0ff"
  background: "#ffffff"
  paper: "#f0f2f7"
  background-soft: "#f5f6f9"
  surface: "#ffffff"
  text: "#202637"
  text-muted: "#565e70"
  text-on-primary: "#ffffff"
  text-on-primary-muted: "#d3daf4"
  border: "#d5d9e2"
  border-strong: "#9ba3b3"
  border-on-primary: "#ffffff2e"
  focus: "#3844c8"
  selection: "#c8d0ff80"
  modal-scrim: "#05052edb"
  success: "#285537"
  success-background: "#eaf3ec"
  success-border: "#c0d5c6"
  error: "#963c38"
  error-hover: "#7b2d2a"
  error-background: "#fbefed"
  error-border: "#e9c4be"
  skeleton: "#e5e9f3"
typography:
  display:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "clamp(2.5rem, 6.7vw, 6rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  display-heritage:
    fontFamily: '"Playfair Display", Georgia, serif'
    fontSize: "clamp(2.5rem, 6.7vw, 6rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Playfair Display", Georgia, serif'
    fontSize: "clamp(2.5rem, 5.2vw, 4.75rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  section:
    fontFamily: '"Playfair Display", Georgia, serif'
    fontSize: "clamp(2rem, 3.5vw, 3.25rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: '"Playfair Display", Georgia, serif'
    fontSize: "clamp(1.5rem, 2.2vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.15
  body:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  body-small:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
  control:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "0.8125rem"
  caption:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "0.75rem"
  admin-headline:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
rounded:
  sm: "2px"
  md: "4px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
  "16": "4rem"
  "20": "5rem"
  page-gutter: "clamp(1.25rem, 4.2vw, 4rem)"
  section-space: "clamp(3rem, 6.2vw, 5.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-on-primary}"
    typography: "{typography.control}"
    rounded: "{rounded.sm}"
    padding: "11px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.control}"
    rounded: "{rounded.sm}"
    padding: "11px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  text-link:
    textColor: "{colors.primary}"
    typography: "{typography.control}"
    padding: "9px 0"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "12px"
  filter-tab:
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    padding: "12px 0"
  filter-tab-selected:
    textColor: "{colors.primary}"
  public-nav-link:
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
  admin-card:
    backgroundColor: "{colors.background}"
    padding: "26px"
  event-row:
    padding: "24px 0"
  dialog:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
---

# Design System: Charanga de Irará

## Overview

**Creative North Star: "Programa de concerto"**

A identidade Editorial Cultural + Modern Heritage apresenta a Charanga com a autoridade de seu nome e de sua marca original. Azul institucional, branco e superfícies frias discretas dão suporte à leitura; a combinação de Manrope com Playfair Display aproxima orientação contemporânea e memória cultural sem simular papel envelhecido.

O sistema distingue leitura e operação. Títulos editoriais, índices diretos e regras finas organizam as páginas públicas; tabelas e formulários do painel usam a mesma paleta com tipografia mais contida. Fotografias publicadas e legendas documentais sustentam o acervo. Quando não há imagem cadastrada, a marca original ou um estado textual explícito ocupa esse lugar.

**Key Characteristics:**

- Azul institucional e branco, com fundos frios discretos.
- Manrope na orientação; Playfair Display nos títulos de leitura.
- Hierarquia editorial, índices diretos e divisórias finas.
- Controles quase retos; superfícies planas e diálogos elevados.
- Marca original e fotografias reais, com contexto e créditos disponíveis.

Registro extraído de `frontend/src/styles/tokens.css`, `base.css`, `public.css`, `admin.css` e dos componentes implementados em `frontend/src`. Os valores do frontmatter correspondem ao código; `.impeccable/design.json` acrescenta estados, movimento, pontos de quebra e exemplos isolados. Suas faixas tonais são prévias derivadas para o painel, sem criar novas cores autorizadas. Restrições de identidade vêm de `PRODUCT.md`; composição específica de página permanece no briefing da superfície.

## Colors

A paleta tem um único acento institucional: azul profundo sobre branco, apoiado por cinzas frios e variações discretas do próprio azul.

### Primary

- **Azul institucional** (`primary`): marca, títulos, ações principais, faixas de identidade e informação institucional.
- **Azul profundo** (`primary-dark`): rodapé e fundos de mídia; também resposta de pressão do botão principal.
- **Azul de interação** (`primary-hover`): resposta de ações e links ao apontador.
- **Azuis de apoio** (`primary-light`, `primary-soft`, `primary-mid`): fundos de interação e foco legível sobre campos azuis.
- **Texto sobre azul** (`text-on-primary` e suas variantes): hierarquia de informação nas superfícies institucionais escuras.

### Neutral

- **Branco de base** (`background`, `surface`): página, formulários e conteúdo do painel. Os nomes mantêm seus papéis distintos mesmo com o mesmo valor.
- **Papel frio** (`paper`) e **fundo suave** (`background-soft`): seções de contexto e área de trabalho.
- **Tinta** (`text`) e **tinta secundária** (`text-muted`): leitura principal, descrições e metadados.
- **Regras finas** (`border`, `border-strong`, `border-on-primary`): separação, campos e limites de conteúdo.
- **Véu modal** (`modal-scrim`): separação entre o diálogo e a página.

Sucesso e erro são cores semânticas de estado, acompanhadas de texto; não constituem novos acentos de marca. `focus` identifica navegação por teclado, `selection` a seleção de texto e `skeleton` o carregamento.

**The Azul Autêntico Rule.** Preserve a cor institucional e a imagem original da marca; novas superfícies reutilizam os papéis existentes em vez de introduzir outra paleta de destaque.

## Typography

**Display Font:** Manrope no nome da abertura, com Playfair Display no trecho de continuidade.

**Body Font:** Manrope, com fallback sans-serif.

**Editorial Font:** Playfair Display, com Georgia e serif como fallbacks.

As fontes são locais: Manrope nos pesos regular, médio, semibold e bold; Playfair Display no peso médio. A fonte sem serifa mantém navegação e operação claras, enquanto a serifa identifica títulos de leitura. Não existe uma escala proporcional única: os títulos usam tamanhos fluidos com limites próprios.

### Hierarchy

- **Display / display-heritage:** combinação das duas famílias no nome da instituição; espaçamento negativo e altura compacta.
- **Headline:** títulos de páginas internas, com quebra balanceada.
- **Section:** títulos das principais seções públicas.
- **Title:** subtítulos editoriais e de contexto; a abertura tem uma variante de entrelinha mais folgada.
- **Body / body-small:** texto corrido e descrições; os trechos de história chegam a 64–68ch, com entrelinha ampliada para 1.85 na leitura longa.
- **Control:** botões e links de ação; peso semibold.
- **Label / caption:** filtros, navegação, legendas e metadados; sem caixa alta decorativa obrigatória.
- **Admin-headline:** títulos operacionais em Manrope. Em telas estreitas, a implementação reduz o título principal do painel para 1.75rem.

**The Duas Vozes Rule.** Use Playfair Display para a leitura editorial e Manrope para a orientação e o trabalho; a abertura combina as duas sem estender sua composição a todas as páginas.

## Layout

O contêiner público tem largura máxima de 1240px e margens fluidas pelo token `page-gutter`. O ritmo combina os passos de espaçamento do frontmatter com `section-space`; regras horizontais separam assuntos sem transformar cada trecho em um cartão.

A base é uma coluna. Em 640px, acervo e músicos passam a duas colunas e o índice da abertura passa de duas a quatro entradas por linha. Em 768px, aparecem composições assimétricas, texto ao lado da imagem ou do contexto e índice lateral de história. A navegação pública de desktop entra em 1001px; 1180px refina os intervalos e a composição dos músicos. O cabeçalho público é sticky, e as âncoras têm compensação para permanecer legíveis abaixo dele.

O painel tem barra lateral fixa de 260px e conteúdo de até 1440px. A barra passa a 235px até 1180px e torna-se um menu sobreposto até 900px. Até 640px, formulários ficam em uma coluna, estatísticas em duas e os registros se reorganizam com ações acessíveis na própria linha. Formulários e diálogos também ajustam seus espaços nesse ponto. Não comprima uma tabela inteira para caber em uma tela estreita.

## Elevation & Depth

As superfícies de página são planas. Fundo, contraste, regras finas e espaço estabelecem profundidade; cartões e botões não ganham sombra de repouso. A única sombra compartilhada é `dialog`, registrada com o valor exato no sidecar e usada nos diálogos sobre o véu modal.

**The Plano Primeiro Rule.** Separe conteúdo com espaço, tonalidade e borda; reserve a elevação existente para janelas que se sobrepõem à página.

As respostas de cor usam `transition-fast`; o deslocamento da barra lateral usa `transition-normal`. A preferência por movimento reduzido desativa transições e animações e mantém a navegação sem rolagem suave.

## Shapes

A linguagem é precisa e quase ortogonal. Botões, campos e navegação do painel usam o raio `sm`; diálogos usam `md`. Figuras, linhas de agenda e contêineres editoriais mantêm cantos retos. Bordas finas delimitam controles e listas; o foco de teclado acrescenta um contorno externo visível.

A logomarca usa `object-fit: contain` sobre branco e conserva sua proporção quadrada. O acervo mostra fotografias na proporção original; a imagem principal da Home pode ter recorte de composição, enquanto a ampliação usa `contain` para mostrar o registro integral.

## Components

### Buttons

Controles diretos, com texto legível e setas SVG quando a ação pede navegação.

- **Primary:** fundo institucional, texto sobre azul, borda correspondente e raio `sm`. Altura mínima de 46px.
- **Secondary:** branco, texto azul e borda forte; o hover adota fundo azul suave e borda institucional. A ação secundária da abertura é uma variação contextual sublinhada.
- **Text link:** sublinhado permanente e alvo mínimo de 44px; o hover muda a cor.
- **States:** hover de cor, pressão mais escura no primário, foco externo de 3px com afastamento de 4px. Controles desabilitados reduzem a opacidade para 0.55 e indicam espera.

### Filters / Status

Filtros são abas textuais, sem cápsula. A seleção usa azul, peso bold e borda inferior de 2px, com `aria-pressed`. Contagens usam números tabulares. Situações de agenda permanecem escritas por extenso e recebem cor semântica, sem depender apenas dela.

### Cards / Containers

O acervo usa figuras abertas com título e categoria abaixo da imagem; a categoria vem depois do título. Músicos usam nome, instrumento abaixo do nome e biografia. Não há caixa elevada ao redor de cada registro.

Cartões operacionais do painel têm fundo branco, borda fina e preenchimento documentado em `admin-card`, reduzido para 20px no celular. Linhas de agenda mantêm data, título, situação e local em posições estáveis; o hover acrescenta fundo azul suave.

### Inputs / Fields

Campos brancos, borda forte, raio `sm` e altura mínima de 46px. Labels permanecem visíveis; placeholders usam tinta secundária. Hover e foco mudam a borda para azul; teclado acrescenta o contorno global. `aria-invalid` muda a borda para erro e acompanha mensagem textual. Alertas de formulário combinam borda, fundo e texto semântico. Textareas permitem redimensionamento vertical.

### Navigation

O cabeçalho público junta marca, nome e links; o destino ativo recebe sublinhado no desktop e peso maior no menu móvel. O menu móvel abre em fluxo sob o cabeçalho, informa seu estado e fecha com Escape. No painel, a seleção ganha fundo azul e texto branco; a barra lateral vira sobreposição com véu em telas menores.

### Chapter index / Lightbox

Índices de capítulo usam links diretos, divisórias e números tabulares quando presentes. A história mantém índice lateral em telas maiores e fluxo vertical nas menores.

A ampliação usa diálogo nativo, imagem integral, legenda, crédito quando disponível e controles de navegação. O vídeo carrega sob demanda. Título e contexto acompanham a mídia; a ausência de fotografia não é preenchida com uma imagem inventada.

## Do's and Don'ts

### Do:

- **Do** preserve a logomarca original, sua proporção e o azul institucional sobre branco.
- **Do** use as duas famílias locais de acordo com seus papéis de leitura e operação.
- **Do** organize conteúdo com hierarquia, espaço e divisórias finas.
- **Do** mantenha categoria e instrumento como metadados abaixo do respectivo título ou nome.
- **Do** mantenha foco visível, labels persistentes e estados descritos por texto.
- **Do** preserve fotografias reais, legendas e créditos disponíveis; mostre a imagem integral na ampliação.

### Don't:

- **Don't** substitua a marca ou o acervo por imagens artificiais.
- **Don't** acrescente chamadas decorativas acima dos títulos para simular hierarquia editorial.
- **Don't** transforme cada seção pública em uma grade de cartões iguais.
- **Don't** aplique sombras de elevação aos contêineres planos do sistema.
- **Don't** introduza outra fonte de destaque ou dependências visuais sem uma mudança de identidade autorizada.
