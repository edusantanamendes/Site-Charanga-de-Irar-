# Redesign editorial — Charanga de Irará

> Registro da revisão anterior. A apresentação atual e as alterações posteriores estão em [REFINAMENTO-VISUAL.md](REFINAMENTO-VISUAL.md).

Aplicado em 21/10/2026 nos arquivos da aplicação existente. Direção: **Modern Cultural Editorial Design**.

## Diagnóstico anterior às alterações

Foram examinados os componentes públicos, formulários, navegação, login, painel e estilos, além das capturas desktop e mobile. Os problemas observados foram:

- A Home concentrava título, subtítulo, descrição, duas ações, slogans, uma grande logomarca e elementos musicais na abertura. A repetição da marca ocupava o espaço fotográfico.
- As três tradições usavam cards idênticos com ícones decorativos, reduzindo a diferença entre os conteúdos.
- Páginas internas repetiam cabeçalho com fundo claro, arcos e última linha em itálico, estado vazio central com ícone e o mesmo grande convite azul antes do rodapé.
- A galeria usava texto sobre a imagem; a agenda tratava cada evento como um cartão visual, em vez de uma listagem cultural.
- O formulário de contato era enquadrado por uma caixa arredondada com sombra. O painel já possuía organização funcional adequada, mas tinha o mesmo tratamento ornamental.
- As folhas `index.css` e `brand.css` somavam mais de 5.500 linhas com regras sobrepostas. Animações automáticas eram aplicadas a diversos blocos.

Não havia fotografias oficiais, integrantes ou eventos publicados no banco local. Essa ausência foi tratada como estado real do conteúdo, sem criar documentação fictícia.

## Decisões e comportamento

**Abertura.** Fundo branco, título expressivo à esquerda e área fotográfica maior à direita. Uma ação de leitura e a frase institucional estabelecem a hierarquia. A descrição complementar vai para a base da composição. A fotografia continua sendo gerenciada em Configurações.

**História e tradições.** Composição aberta com largura de leitura controlada, figuras assimétricas e divisores. Alvoradas ocupa o bloco principal; Lavagem e cultura aparecem como capítulos complementares. Fotografias oficiais publicadas nas categorias correspondentes são aproveitadas quando disponíveis. A página História distingue os relatos do marco documentado de 1954, referente à Filarmônica.

**Acervo.** Grade de doze colunas com imagens de tamanhos diferentes e legendas externas. Os filtros, categorias, créditos, lightbox, setas, Escape e vídeos sob demanda continuam operacionais. Sem imagens, espaços identificados mostram o estado de preparação. Não há zoom ou filtros visuais automáticos sobre as fotografias.

**Agenda.** Linhas com data, situação, título, local, horário e acesso ao evento. As informações permanecem ligadas aos mesmos registros da API, com o fuso de Brasília. Eventos realizados e futuros mantêm seus filtros.

**Contato e músicos.** Contato usa coluna institucional e formulário aberto, com feedback real de envio. No celular, o formulário vem antes das informações institucionais para dar acesso direto à mensagem. Músicos usa retratos e biografias quando cadastrados, ou uma apresentação clara do estado atual. O convite de contato amplo aparece apenas na Home.

**Sistema visual.** Azul original `#04006C`, branco e cinzas neutros. Playfair Display nos títulos públicos; Manrope no texto e na operação administrativa. Sem itálico automático, gradientes, arcos, pautas decorativas ou animações de entrada. Interações usam cor, sublinhado, foco visível e feedback de estado. O menu respeita movimento reduzido.

**Painel.** Navegação azul, títulos sem serifa, estatísticas alinhadas, tabelas compactas e formulários com bordas discretas. Os diálogos de edição e confirmação, uploads, autenticação, paginação e CRUDs foram mantidos.

## Arquivos e organização

| Área                          | Arquivos principais                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| Home e história               | `frontend/src/pages/Home.jsx`, `History.jsx`                                        |
| Páginas internas e contato    | `frontend/src/pages/PublicPages.jsx`                                                |
| Navegação e rodapé            | `frontend/src/layouts/PublicLayout.jsx`                                             |
| Figuras, mídia e agenda       | `frontend/src/components/Editorial.jsx`                                             |
| Controles, estados e diálogos | `frontend/src/components/UI.jsx`                                                    |
| Revisão dos títulos padrão    | `frontend/src/config/editorial.js`                                                  |
| Painel e login                | `frontend/src/pages/admin/Admin.jsx`                                                |
| Tokens e estilos              | `frontend/src/styles/{index,tokens,base,public,admin}.css`                          |
| Fontes e entrada              | `frontend/src/main.jsx`                                                             |
| Verificações de navegador     | `tests/e2e/site.spec.js`, `identity.spec.js`                                        |
| Documentação                  | `README.md`, `docs/{ARQUITETURA,IDENTIDADE-VISUAL,VALIDACAO,REDESIGN-EDITORIAL}.md` |

`brand.css` e `BrandEmblem.jsx` foram removidos. Os tokens têm uma única fonte; as folhas se dividem por responsabilidade, sem sobreposição incremental de temas. A Home e a História saíram do módulo monolítico de páginas públicas.

Os títulos padrão conhecidos são revisados somente na apresentação. Valores personalizados continuam prevalecendo. Não houve migração, alteração de schema, API, autenticação, integrações ou escrita no banco local para o redesign. A logomarca e o favicon oficiais permanecem intactos.

## Verificação e limites

Os comandos e resultados finais estão em [VALIDACAO.md](VALIDACAO.md). Foram inspecionadas capturas do site e do painel em desktop e celular. Os testes usam banco isolado; as imagens sólidas de teste são explicitamente identificadas e não integram o acervo local.

O CSS de produção passou de 89,69 KB para aproximadamente 48 KB antes de gzip, sem adicionar dependências. Os espaços de fotografia ainda dependem do cadastro dos registros oficiais pelo responsável pelo acervo. A aplicação continua disponível localmente em `http://127.0.0.1:3000`.
