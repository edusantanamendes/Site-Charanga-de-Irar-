# Refinamento visual — 21/10/2026

> Registro da revisão anterior. O redesign posterior solicitado com a skill `frontend-mastery` está em [REDESIGN-FRONTEND-MASTERY.md](REDESIGN-FRONTEND-MASTERY.md).

Implementado diretamente na aplicação React existente. Esta revisão substitui a apresentação descrita no redesign editorial anterior e mantém o backend, banco, autenticação, uploads, formulários e painel.

## Diagnóstico e direção

O anexo recebido continha somente o briefing em texto. Foram analisados os arquivos da aplicação, a logomarca oficial e as capturas anteriores já existentes no projeto. Essas capturas foram preservadas em `docs/redesign-before` antes de executar novamente os testes.

O problema mais evidente era a repetição de grandes retângulos cinzas com mensagens de fotografia ausente. Eles dominavam a abertura, a história, as tradições e a galeria. Somavam-se a isso espaçamentos de até 112 px, grandes intervalos entre colunas, estados vazios altos e poucas superfícies azuis. A navegação horizontal já existia no código: foi refinada e seus rótulos foram alinhados ao briefing.

A direção usa o azul oficial `#04006C`, branco, cinza claro e tons claros de azul. A marca e as curvas do seu pentagrama dão identidade à ausência de fotografias. Os grafismos são SVG decorativos, sem animação automática e sem representar uma partitura ou documento histórico.

## O que mudou

- **Abertura:** título, subtítulo e texto institucional com proporções equilibradas; dois botões; fotografia de destaque administrável ou composição com a logomarca oficial. A altura acompanha o conteúdo e a largura disponível.
- **Faixa institucional:** Tradição, Música, Cultura e Irará, Bahia, em azul, sem movimento infinito.
- **História:** duas colunas, imagem histórica quando publicada e composição musical quando não houver fotografia; espaçamento menor e leitura preservada.
- **Tradições:** Alvoradas em destaque azul, Lavagem em bloco claro e Cultura e tradição em azul claro. Fotografias publicadas continuam alimentando os blocos correspondentes.
- **Galeria:** grade de proporções variadas, legendas, créditos, hover discreto e lightbox existente, inclusive na Home. Sem registros, um aviso institucional compacto substitui a fotografia fictícia.
- **Agenda:** listagem compacta com dia, mês, ano, situação, nome, local, horário de Brasília e acesso ao detalhe. Sem eventos, mensagem curta com acesso ao contato.
- **Encerramento:** convite de apresentações em azul com botão branco e contraste alto.
- **Navegação:** marca à esquerda, links desktop visíveis e contato em destaque. Menu móvel fecha por Escape, devolve o foco ao botão, fecha na navegação e ao voltar à largura desktop.
- **Páginas internas:** cabeçalhos mais compactos com retorno ao início, variações de superfície e hierarquia própria. História usa fundo azul no cabeçalho; Galeria usa cinza; Contato usa leitura branca com coluna institucional clara.
- **Músicos:** perfis e retratos continuam ligados à API. Na ausência de retrato, iniciais substituem avisos de fotografia pendente. O estado sem integrantes recebe uma composição musical de altura proporcional ao texto.
- **Tipografia:** Playfair Display e Manrope preservadas, incluindo o itálico real da fonte já instalada. Sem novas dependências ou fontes externas.
- **Acessibilidade:** SVGs decorativos ocultos para leitores de tela, foco contrastante em superfícies azuis, controles de pelo menos 44 px e respeito a movimento reduzido.

Títulos e textos personalizados no painel continuam prevalecendo. Não foram cadastrados registros, imagens ou canais oficiais fictícios no banco local.

## Arquivos modificados nesta revisão

| Arquivo                                       | Alteração                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| `frontend/src/pages/Home.jsx`                 | Composição da abertura, faixa, história, tradições e estados sem dados |
| `frontend/src/pages/History.jsx`              | Tratamento da ausência de imagem e contexto do acervo                  |
| `frontend/src/pages/PublicPages.jsx`          | Estados de galeria, agenda e músicos; perfis sem retrato               |
| `frontend/src/layouts/PublicLayout.jsx`       | Rótulos, contato ativo, foco e comportamento do menu                   |
| `frontend/src/components/MusicalIdentity.jsx` | Novo: pentagrama, composição da marca, memória e aviso de acervo       |
| `frontend/src/components/Editorial.jsx`       | Figuras reais, convite azul e alternativa de miniatura para vídeos     |
| `frontend/src/components/UI.jsx`              | Cabeçalhos internos com retorno ao início e grafismo discreto          |
| `frontend/src/styles/public.css`              | Composições, cores, proporções e responsividade públicas               |
| `frontend/src/styles/tokens.css`              | Espaçamento vertical responsivo de 44 a 68 px                          |
| `frontend/src/main.jsx`                       | Importação do itálico local da Playfair Display                        |
| `tests/e2e/site.spec.js`                      | Lightbox na Home, músicos com e sem retrato, teclado e mais larguras   |
| `tests/e2e/identity.spec.js`                  | Abertura institucional, ações, faixa e navegação desktop               |
| `README.md`                                   | Orientações atuais para fotografias e composições alternativas         |
| `docs/REDESIGN-EDITORIAL.md`                  | Indicação de revisão posterior                                         |
| `docs/VALIDACAO.md`                           | Registro dos comandos executados e resultados desta revisão            |
| `docs/REFINAMENTO-VISUAL.md`                  | Diagnóstico, decisões e relação de arquivos                            |

As capturas anteriores e finais ficam em `docs/redesign-before` e `docs/redesign-after`. As capturas completas dos testes também ficam em `test-results/identity`, `test-results/populated` e `test-results/previews`.

## Verificação

Resultados dos comandos e limites de validação em [VALIDACAO.md](VALIDACAO.md). Os dados dos testes pertencem a um PostgreSQL em memória isolado. Imagens sólidas geradas para testar uploads e perfis não integram o acervo local.

O navegador interativo do chat não disponibilizou uma sessão. A inspeção visual foi feita nas capturas produzidas pelos testes Playwright no Chrome instalado. Não houve publicação externa.
