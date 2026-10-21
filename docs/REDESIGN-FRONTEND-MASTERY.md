# Redesign com Frontend Mastery — 21/10/2026

Aplicado nas páginas públicas da aplicação existente, usando a skill `frontend-mastery` em modo `redesign`. A paleta azul/branco, Playfair Display e Manrope, logomarca oficial, conteúdo institucional e integração administrativa foram preservados. Backend, contratos de API, banco, autenticação e componentes do painel não foram alterados.

## Diagnóstico e direção

As capturas anteriores mostravam uma abertura dividida entre texto e um grande selo circular, seguida por outros blocos de slogan e marca. A composição das tradições dependia principalmente de caixas coloridas. A História não tinha um índice para acessar seus capítulos; a galeria sem resultados não oferecia uma ação para restaurar a seleção. No contato móvel, a ordem visual do formulário não correspondia à ordem dos elementos no HTML.

A direção passa a usar uma abertura azul integrada e uma apresentação inspirada na organização de um programa cultural: capítulos claros, números de orientação, linhas discretas e conteúdo aberto. Os números indicam ordem de navegação e capítulos, não datas, estatísticas ou conquistas da instituição. A diferenciação das seções vem da função do conteúdo, preservando a mesma linguagem visual.

## Alterações

- **Home:** abertura azul com título branco e duas ações; composição da marca sem órbitas, sombra ou gradiente. No celular, a marca assume uma apresentação horizontal compacta, sem tomar a altura de um cartaz inteiro.
- **História na Home:** apresentação aberta, com grafismo musical contido. A fotografia histórica continua aparecendo automaticamente quando publicada na categoria correspondente.
- **Tradições:** Alvoradas, Lavagem e Cultura passam a uma sequência de três capítulos em colunas, com separadores discretos. No celular, são capítulos empilhados. Fotografias e textos administrados continuam preservados.
- **Acervo e agenda:** quando a galeria está vazia, as duas áreas aparecem próximas em colunas no desktop; no celular ficam empilhadas. Com mídia publicada, a galeria usa a largura completa, mantendo grid, legendas, créditos e lightbox.
- **Galeria interna:** filtros com contagens reais da categoria selecionada, indicação ativa por sublinhado e botão “Limpar filtros” quando não há resultados.
- **História interna:** índice com links para capítulos reais. Âncoras respeitam a altura do cabeçalho fixo para não esconder os títulos ao navegar.
- **Cabeçalhos internos:** hierarquia mais direta, retorno ao início e numeração de orientação. Os grafismos de fundo repetidos em todos os cabeçalhos foram retirados.
- **Contato:** formulário primeiro na ordem do HTML e na apresentação, tanto no desktop quanto no celular. Informações institucionais aparecem em coluna azul à direita no desktop e depois do formulário no celular. Envio, validações, consentimento, feedback e canais oficiais continuam ligados ao sistema existente.
- **Responsividade:** reorganização das áreas em vez de simples redução de escala; contração dos grids, quebra de ações e preservação da ordem de leitura e do teclado.

Não foram adicionados pacotes, fotografias externas, registros institucionais fictícios, animações de entrada ou novas integrações. O site continua preparado para apresentar imagens reais enviadas pelo administrador.

## Arquivos desta revisão

| Arquivo                                       | Alteração                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| `frontend/src/pages/Home.jsx`                 | Capítulos de tradições e composição conjunta de acervo e agenda        |
| `frontend/src/pages/History.jsx`              | Índice e destinos para capítulos                                       |
| `frontend/src/pages/PublicPages.jsx`          | Contagens e limpeza de filtros; ordem do contato                       |
| `frontend/src/components/MusicalIdentity.jsx` | Composições da marca, memória e ausência de acervo                     |
| `frontend/src/components/UI.jsx`              | Cabeçalhos internos com orientação numérica                            |
| `frontend/src/styles/public.css`              | Direção visual pública e organização responsiva                        |
| `tests/e2e/site.spec.js`                      | Filtros restaurados, contagens, âncoras e largura da galeria com dados |
| `README.md`                                   | Referência à revisão atual                                             |
| `docs/REFINAMENTO-VISUAL.md`                  | Identificação como revisão anterior                                    |
| `docs/VALIDACAO.md`                           | Resultados da validação desta revisão                                  |
| `docs/REDESIGN-FRONTEND-MASTERY.md`           | Diagnóstico, decisões e arquivos                                       |

## Evidência e visualização

As capturas anteriores foram preservadas em `docs/redesign-mastery/before`. As finais ficam em `docs/redesign-mastery/after`; os testes também produzem capturas de páginas públicas e estados com dados em `test-results/identity` e `test-results/populated`.

Os checks efetivamente executados e seus resultados estão na última seção de [VALIDACAO.md](VALIDACAO.md). A inspeção visual usa as capturas Playwright do Chrome instalado; o navegador interativo do chat não apresentou superfícies disponíveis. As imagens sólidas e os dados de teste pertencem somente ao banco isolado da suíte.

A prévia local foi conferida em `http://127.0.0.1:3000/`. A aplicação mantém as mesmas rotas e o painel permanece acessível por `/admin`.
