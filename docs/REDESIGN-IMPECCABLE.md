# Reformulação com Impeccable — 09/11/2026

Reformulação implementada diretamente na aplicação React/Vite existente, abrangendo todas as páginas públicas e a área administrativa. A direção é **Editorial Cultural + Modern Heritage**, organizada como um programa de concerto: nome e identidade na abertura, leitura cultural em capítulos e informação prática com hierarquia própria.

## Diagnóstico e decisões

A inspeção percorreu a estrutura, rotas, componentes, estilos, seed, marca e testes. Duas avaliações independentes confrontaram o código com as capturas históricas; estas não representavam integralmente o estado inicial, por isso foi produzido um novo lote anterior às alterações.

Os principais problemas eram a composição repetida entre páginas, pouco contraste de hierarquia, fotografias recortadas pela posição na grade e estados sem acervo tratados como outra apresentação institucional. A auditoria técnica identificou links administrativos invisíveis ainda acessíveis por Tab, falta de tratamento de foco no menu, salvamento durante upload e erros de contato sem associação aos controles.

- **Identidade:** mantido o azul oficial `#04006C`, o branco e a imagem original. Os fundos secundários usam neutros frios discretos. A logomarca não recebeu filtros, recoloração, recorte ou alteração de bytes.
- **Tipografia:** Manrope identifica a navegação, os controles e o nome na abertura; Playfair Display dá continuidade aos títulos institucionais e à leitura cultural. Foram removidas as importações de duas variantes não utilizadas. As fontes continuam locais.
- **Composição:** a abertura ganhou uma faixa tipográfica própria e uma área para fotografia oficial ou marca. História tem capa azul e índice; Tradições usa um percurso vertical ao lado da apresentação; Galeria privilegia proporções naturais; Agenda usa linhas com datas estáveis; Contato reúne formulário e canais num campo azul.
- **Sistema:** tamanhos de títulos, espaçamentos, cores, larguras, foco e estados ficam nos tokens e estilos compartilhados. A folha pública foi reestruturada com base móvel e breakpoints de conteúdo, sem uma camada adicional de overrides.
- **Movimento:** não foram adicionadas animações de entrada ou bibliotecas. Transições existentes são sutis, e a preferência por movimento reduzido continua respeitada.

## Escopo por página

| Superfície | Resultado |
| --- | --- |
| Início | Masthead, hierarquia entre apresentação e ações, área de fotografia/marca, índice de seções e ritmos distintos para História, Tradições, Acervo e Agenda. |
| História | Capa azul, índice compacto no celular e persistente no desktop, texto com largura de leitura limitada e marco de 1954 com explicação preservada. |
| Galeria | Filtros legíveis, imagens na proporção original, legendas e créditos, estado de preparação e seleção sem resultados distintos; lightbox e vídeos sob demanda preservados. |
| Agenda e evento | Abas, datas, local, horário de Brasília e situação com posições consistentes. Página individual com informações práticas agrupadas. |
| Músicos | Diretório responsivo com retrato ou monograma e biografia. Estado sem perfis usa somente o conteúdo institucional existente. |
| Contato | Campos com fonte de 16px, erros vinculados por `aria-invalid`/`aria-describedby`, resumo com links aos campos e feedback de envio. |
| Privacidade e 404 | Aplicação do sistema de títulos, leitura, controles e navegação. Conteúdo legal existente preservado. |
| Administração | Sidebar clara, seleção azul, formulários e tabelas coerentes com o site. No celular, drawer com foco contido, Escape, retorno ao botão, fundo inerte e links fechados fora da navegação por teclado. Cabeçalhos de tabela continuam na árvore acessível. |
| Login e recuperação | Marca em campo azul no desktop e formulário claro, proporcional e acessível no celular. |

O editor também bloqueia o salvamento enquanto uma imagem está sendo enviada, inclusive a submissão por Enter. Isso evita salvar o valor anterior antes de receber a URL do upload.

## Integridade

API, autenticação, banco, migrações, seed, contratos, integrações e conteúdo histórico não foram modificados. Os títulos personalizados do painel continuam prevalecendo. Nenhuma dependência foi adicionada. Não existe uma página de notícias na estrutura original; não foi criada uma seção fictícia.

O original da marca continua com SHA-256 `8d37e0316e8aa4b60de585ee871065edb79fff95e2e2b4721ce5c413597feba3`, correspondente ao manifesto de origem já existente em `frontend/public/brand/manifest.json`. Esse manifesto foi preservado como proveniência; nenhum metadado foi inserido no JPEG para não alterar o arquivo oficial.

## Validação executada

| Verificação | Resultado |
| --- | --- |
| `npm.cmd run build` | Build de produção aprovado. |
| `npm.cmd test` | 17 testes aprovados, incluindo integração, migrações e SMTP local. |
| `npm.cmd run db:check` | Schema Prisma válido. |
| `npm.cmd run test:e2e` | 20 testes aprovados em Chrome desktop e Pixel 7 emulado; inclui scans axe WCAG A/AA, galeria, conteúdo personalizado, contato e CRUD. |
| Fluxo de evento com captura adicional | 2 testes aprovados, desktop e celular. |
| Fluxo de acervo e músicos após revisão | 2 testes aprovados, com upload, filtros, lightbox, perfis e axe; quatro capturas dos ajustes de hierarquia regeneradas. |
| `node scripts/capture-design.mjs .impeccable/review` | 20 páginas capturadas e 2 imagens de viewport; nenhum erro JavaScript ou overflow nos percursos de 320, 375, 768, 1024 e 1440px. |
| Detector Impeccable | Uma execução final em `frontend/src`, retorno `[]`. |
| Formatação e diff | Arquivos de implementação formatados com Prettier; `git diff --check` sem problemas de whitespace. |

Os três novos casos de navegador verificam isolamento/foco do menu administrativo móvel, bloqueio de salvamento durante upload e identificação/retorno ao campo com erro de contato. A primeira execução deste último identificou um rótulo contaminado pelo texto de erro; a correção separou o label da descrição e passou na suíte final.

As capturas aguardam a API de conteúdo institucional, o texto gerenciado, as fontes e as imagens. Uma captura inicial da Agenda foi substituída por estar incompleta. A inspeção visual cobriu desktop e celular e foi submetida a um revisor independente do Impeccable. O veredito final fica registrado no arquivo de revisão da skill em `.impeccable/finish-review.md`.

A revisão independente pediu duas correções de hierarquia nos estados preenchidos: instrumento abaixo do nome do músico e categoria abaixo do título da mídia. Ambas foram implementadas, preservando os dados e as funções. O passe final pontuou os dois itens como `resolved` e retornou `disposition: ship` nesse escopo, sem reabrir uma avaliação de toda a superfície.

## Capturas

As imagens finais estão em [impeccable-after](impeccable-after/README.md).

- [Home desktop, viewport](impeccable-after/desktop.png) e [celular, viewport](impeccable-after/mobile.png).
- [Home completa desktop](impeccable-after/home-desktop.png) e [celular](impeccable-after/home-mobile.png).
- [História desktop](impeccable-after/historia-desktop.png) e [celular](impeccable-after/historia-mobile.png).
- [Galeria desktop](impeccable-after/galeria-desktop.png) e [celular](impeccable-after/galeria-mobile.png).
- [Agenda desktop](impeccable-after/agenda-desktop.png) e [celular](impeccable-after/agenda-mobile.png).
- [Músicos desktop](impeccable-after/musicos-desktop.png) e [celular](impeccable-after/musicos-mobile.png).
- [Contato desktop](impeccable-after/contato-desktop.png) e [celular](impeccable-after/contato-mobile.png).
- [Painel desktop](impeccable-after/dashboard-desktop.png) e [celular](impeccable-after/dashboard-mobile.png), com conta exclusiva dos testes.
- [Evento individual desktop](impeccable-after/event-detail-desktop.png) e [celular](impeccable-after/event-detail-mobile.png), exclusivamente no banco isolado de testes.

## Arquivos alterados e adicionados

Implementação:

- `frontend/src/components/Editorial.jsx`
- `frontend/src/components/MusicalIdentity.jsx`
- `frontend/src/components/UI.jsx`
- `frontend/src/layouts/PublicLayout.jsx`
- `frontend/src/main.jsx`
- `frontend/src/pages/Home.jsx`
- `frontend/src/pages/PublicPages.jsx`
- `frontend/src/pages/admin/Admin.jsx`
- `frontend/src/styles/admin.css`
- `frontend/src/styles/base.css`
- `frontend/src/styles/public.css`
- `frontend/src/styles/tokens.css`

Verificação e documentação:

- `tests/e2e/interaction.spec.js` — novo.
- `tests/e2e/site.spec.js` — captura adicional do detalhe de evento.
- `scripts/capture-design.mjs` — novo helper de evidência visual, somente leitura da aplicação.
- `.gitignore` — capturas temporárias excluídas do versionamento.
- `README.md` — referência ao redesign atual.
- `PRODUCT.md` — contexto e restrições do produto.
- `DESIGN.md` e `.impeccable/design.json` — sistema visual documentado a partir do código concluído.
- `.impeccable/surfaces/frontend-src-pages-home-jsx.md` — contrato de direção.
- `.impeccable/direction-evidence.md` — evidência da atribuição de direção.
- `.impeccable/finish-review.md` — resultado da revisão independente.
- `docs/REDESIGN-IMPECCABLE.md` e `docs/impeccable-after/` — este relatório e as capturas finais.

`History.jsx`, contextos, serviços e demais rotas mantiveram sua estrutura e comportamento; recebem o sistema visual pelos estilos compartilhados.

## Limites e operação

O repositório e o banco local inicial não têm fotografias oficiais, perfis de músicos ou apresentações publicadas. Esses registros continuam sendo cadastrados pelo painel; o desenho não preenche as ausências com conteúdo inventado. Os screenshots com “E2E” e a conta administrativa de testes são exclusivamente evidência técnica, sem dados inseridos no banco local.

A validação foi feita no Chrome e em emulação de dispositivos. Não houve teste em aparelhos físicos ou Safari, medição de Core Web Vitals em produção ou publicação. A prévia integrada da aplicação estava indisponível; o Chrome automatizado do projeto forneceu as capturas.

Para executar localmente: `npm.cmd run dev` e abrir `http://127.0.0.1:3000`. Para reproduzir as imagens, manter o servidor ativo e executar `node scripts/capture-design.mjs .impeccable/review`.
