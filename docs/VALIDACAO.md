# Relatório de validação — 20/10/2026

> O resultado da revisão visual mais recente está na última seção deste documento, “Redesign com Frontend Mastery — 21/10/2026”. As seções anteriores registram versões anteriores da interface.

Implementação em arquivos reais na pasta do projeto. Nenhum serviço de produção foi publicado ou configurado com credenciais reais.

## Resultados

| Verificação                   | Resultado                                        |
| ----------------------------- | ------------------------------------------------ |
| `npm run build`               | Build de produção aprovado                       |
| `npm run db:check`            | Schema Prisma válido                             |
| `npm test`                    | 17 testes aprovados                              |
| `npm run test:e2e`            | 10 testes aprovados no Chrome instalado          |
| `npm audit --json`            | Zero vulnerabilidades, incluindo desenvolvimento |
| `npm audit --omit=dev --json` | Zero vulnerabilidades de produção                |

Ambiente de execução: Windows, Node.js 22.21.0, npm 10.9.4. Os testes utilizaram bancos PostgreSQL embutidos em memória, isolados do banco local persistente e de qualquer produção. Credenciais de testes são aleatórias, não são credenciais de uso do site.

## Cobertura exercitada

- Migrações SQL reais aplicadas pelo Prisma em banco vazio; segunda execução sem migrações pendentes.
- Seed idempotente, sem integrantes, eventos ou fotografias fictícias.
- Login válido e inválido, bloqueio persistente por conta, cookie HttpOnly, sessão com hash, logout e proteção de rotas.
- Rejeição de origem não autorizada e de CSRF ausente ou inválido.
- Recuperação com resposta genérica, token com hash, expiração, uso único e invalidação de sessões.
- CRUD dos recursos administrativos, publicação e rascunhos, slugs duplicados, validação de datas e paginação.
- Relações da galeria, preservação de fotografias ao excluir categoria, rejeição de URLs de vídeo e redes sociais inválidas.
- Upload de imagem real, rejeição de arquivo falso, conversão em WebP, remoção de metadados e entrega do arquivo.
- Contato persistido, consulta restrita à administração, honeypot, validação, limite de solicitações, falha e reenvio de e-mail.
- Entrega real pelo Nodemailer a um servidor SMTP exclusivamente local, com remetente e Reply-To corretos. Nenhum e-mail foi enviado a terceiros.
- Metadados no HTML, canonical, JSON-LD, robots, sitemap, status 404 e headers de segurança.
- Fluxo no navegador de contato até leitura no painel; criação, edição, publicação e exclusão de evento com cancelamento da confirmação.
- Fluxo no navegador de upload, filtro por categoria, lightbox, setas do teclado, Escape e fotografia de destaque.
- Páginas públicas e painel de mensagens com axe, usando regras WCAG 2 A/AA, 2.1 AA e 2.2 AA, sem violações detectadas nos cenários avaliados.
- Desktop, celular e ausência de rolagem horizontal em larguras de 320, 768 e 1024 pixels. Menu móvel e rotas públicas.
- Inspeção visual das capturas desktop e celular. Imagens de referência e espaços de acervo são identificados como ilustração/placeholder.

As capturas e o relatório HTML dos testes ficam em `test-results/previews` e `playwright-report`. Essas pastas são locais e ignoradas pelo Git. Verificações automáticas de acessibilidade não substituem uma avaliação humana completa com leitores de tela.

## Dependências

Nodemailer e Sharp foram atualizados após auditoria. O override de `deepmerge-ts` para a série 8 corrige a dependência transitiva da configuração do Prisma; geração, validação do schema e execução de migrações foram verificadas com essa combinação. O lockfile fixa as versões resolvidas.

## Configurações pendentes para publicação

1. Criar administrador nominal com `npm run admin:create`; não há senha padrão.
2. Cadastrar logomarca, fotografia de destaque, acervo, integrantes, eventos, contatos e canais oficiais no painel.
3. Provisionar PostgreSQL de produção e executar as migrações e o seed.
4. Configurar SMTP autorizado, remetente e e-mail oficial destinatário; testar a entrega externa no provedor escolhido.
5. Configurar domínio, HTTPS, `SITE_URL`, `SESSION_SECRET`, proxy confiável, volume de uploads e backups.
6. Implantar no host escolhido e verificar conexões, permissões do volume, envio de e-mail e fluxo administrativo nesse ambiente.

Docker e o deploy externo não foram executados: Docker não está disponível neste ambiente e não foram fornecidas credenciais de hospedagem, banco de produção ou SMTP. Os arquivos de contêiner e as instruções de publicação estão entregues para essa etapa.

## Atualização da identidade oficial — 21/10/2026

A logomarca enviada foi preservada byte a byte e aplicada no site e no painel. O tema usa azul amostrado `#04006C`, branco e variações claras, com Playfair Display e Manrope. O favicon incorpora os pixels originais do monograma CH. Detalhes e arquivos modificados estão no [guia de identidade visual](IDENTIDADE-VISUAL.md).

Após a reformulação, foram aprovados o build de produção, os 17 testes de integração e os 12 testes de navegador em desktop e celular. A verificação adicional cobre a integridade do arquivo de marca, favicon, proporção das imagens, cabeçalho durante a rolagem, login acessível e todas as seções administrativas sem rolagem horizontal. As verificações axe das páginas públicas, login e mensagens não detectaram violações nos cenários avaliados. A formatação dos arquivos modificados passou no Prettier; não há comando de lint configurado no projeto.

Foram inspecionadas capturas do início, login, dashboard, favicon e versão móvel. A pasta `test-results/identity` também contém capturas das demais páginas públicas e seções do painel. O servidor local existente continua atendendo em `http://127.0.0.1:3000`.

## Redesign editorial — 21/10/2026

Redesign aplicado sobre o mesmo React/Express/PostgreSQL, sem alterações de API, autenticação, schema ou dados locais. Diagnóstico, decisões e arquivos em [REDESIGN-EDITORIAL.md](REDESIGN-EDITORIAL.md).

| Verificação                       | Resultado final                                  |
| --------------------------------- | ------------------------------------------------ |
| `npm run build`                   | Aprovado; CSS 47,94 KB / 9,89 KB com gzip        |
| `npm test`                        | 17 testes aprovados                              |
| `npm run test:e2e`                | 14 testes aprovados no Chrome, desktop e celular |
| Prettier nos arquivos modificados | Aprovado                                         |
| Páginas locais e `/api/health`    | HTTP 200; servidor mantido em execução           |

Uma execução inicial do teste de SEO coincidiu com a limpeza do diretório de build pelo Vite. A suíte de integração foi repetida após a conclusão do build e passou integralmente. As verificações finais de navegador usaram o build concluído.

Além dos fluxos existentes, os testes verificam o novo item de agenda com data/horário e acesso ao detalhe, a utilização da fotografia publicada na seção Alvoradas e a prevalência de título e texto personalizados no painel sobre a revisão editorial padrão. A personalização também foi exercitada em 320 px.

As verificações axe das páginas públicas, login e mensagens não detectaram violações WCAG nos cenários avaliados. Foram verificadas navegação móvel, ausência de rolagem horizontal em 320/768/1024 px, upload, galeria, filtros, teclado, formulário, sessão e CRUD de eventos com confirmação de exclusão.

Capturas finais em `test-results/identity` (páginas públicas e painel), `test-results/populated` (estados com dados exclusivamente de teste) e `test-results/previews`. Foram inspecionados Home, História, Galeria, Agenda, Músicos, Contato, login, dashboard, tabelas, formulários administrativos e lightbox, nas composições desktop e mobile pertinentes. No contato móvel, o formulário vem antes da coluna institucional.

As imagens sólidas de teste e os eventos de 2099 pertencem somente ao banco isolado da suíte. A consulta final ao ambiente local confirmou acervo, eventos e músicos vazios e fotografia de destaque ainda não cadastrada. Os placeholders identificados permanecem até a inclusão de fotografias oficiais. A integridade da logomarca e do favicon foi verificada pelos testes de identidade.

Nenhuma dependência foi adicionada. O CSS de produção foi reduzido de 89,69 KB para 47,94 KB, aproximadamente 47%. Não há comando de lint configurado; a verificação de formatação utiliza Prettier.

## Refinamento visual — 21/10/2026

Revisão descrita em [REFINAMENTO-VISUAL.md](REFINAMENTO-VISUAL.md), aplicada após o redesign editorial. O tratamento público de fotografias ausentes foi substituído por composições institucionais e avisos compactos. As referências a placeholders nas seções anteriores descrevem a versão antiga.

| Verificação executada                                   | Resultado desta revisão                                                                |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `npm.cmd run build`                                     | Aprovado; CSS 57,00 KB / 11,69 KB gzip; JavaScript público 307,41 KB / 96,93 KB gzip   |
| `npm.cmd test`                                          | 17 testes aprovados, zero falhas                                                       |
| `npm.cmd run db:check`                                  | Schema Prisma válido                                                                   |
| `npm.cmd run test:e2e`                                  | Rodada final com 14 testes aprovados, zero falhas, Chrome desktop e mobile             |
| Prettier nos 12 arquivos de código e testes modificados | Aprovado                                                                               |
| Execução de desenvolvimento                             | Vite e API iniciados; Home HTTP 200 e `/api/health` com `status: ok`                   |
| Consulta pública final do banco local                   | 0 eventos, 0 fotos, 0 vídeos e 0 músicos; dados fictícios restritos ao banco de testes |

Os testes de backend incluem integração com banco PostgreSQL em memória, migrações, autenticação, CSRF, CRUDs, uploads, contato e SMTP local. Não foi necessário modificar o backend para esta revisão.

Os testes de navegador exercitaram:

- Todas as páginas públicas, login e seções administrativas, identidade oficial e favicon.
- Home sem fotografia de destaque, marca oficial, dois botões e faixa institucional.
- Home com fotografia enviada pelo upload administrativo e sua utilização na seção Alvoradas.
- Galeria com dados, filtros, lightbox por teclado e abertura do lightbox também na Home.
- Músicos cadastrados com e sem retrato, usando upload e dados reais da API no banco isolado, além do estado sem integrantes.
- Agenda sem eventos e com evento de teste, data, local, horário de Brasília, página individual, publicação, edição e exclusão com confirmação.
- Título e texto personalizados no painel, inclusive na largura de 320 px.
- Formulário de contato até a leitura da mensagem na administração e saída da sessão.
- Menu móvel, navegação, fechamento por Escape e retorno do foco ao botão.
- Ausência de rolagem horizontal em 320, 768, 1024 e 1280 px nas páginas públicas principais e no login. Os projetos padrão também exercitaram desktop de 1440 px e Pixel 7.
- Axe com regras WCAG 2 A/AA, 2.1 AA e 2.2 AA nas páginas públicas, músicos com dados, login e mensagens: nenhuma violação detectada nos cenários avaliados.

Foram inspecionadas as capturas de Home desktop/mobile, História, Galeria, Agenda, Contato e Músicos, incluindo agenda e músicos com dados exclusivamente de teste. A comparação desktop preserva a mesma largura de 1440 px. A Home anterior tinha 4336 px de altura; a nova tem 3515 px, cerca de 19% menor, com todas as seções mantidas.

As capturas anteriores foram reaproveitadas do projeto, pois o anexo desta solicitação continha somente texto. Cópias preservadas em `docs/redesign-before`; resultado final em `docs/redesign-after`. Capturas adicionais e relatório Playwright em `test-results` e `playwright-report`.

O navegador interativo do chat não apresentou sessões disponíveis. A validação visual utilizou as capturas dos testes Playwright no Chrome instalado. A primeira inicialização do Vite encontrou uma restrição de leitura do sandbox e foi repetida com a permissão de execução já autorizada; o servidor então respondeu normalmente. A prévia iniciada para a verificação foi encerrada ao final, com as portas 3000 e 3001 liberadas; para abrir novamente, execute `npm.cmd run dev`. Não houve publicação externa nem alteração da arquitetura. Nenhuma dependência foi adicionada, e não há comando de lint configurado.

## Redesign com Frontend Mastery — 21/10/2026

Revisão solicitada com `$frontend-mastery redesign`. Diagnóstico, decisões e arquivos em [REDESIGN-FRONTEND-MASTERY.md](REDESIGN-FRONTEND-MASTERY.md). A aplicação pública foi reorganizada mantendo marca, cores, fontes, textos, integração com imagens e funcionalidades. Não houve alteração de backend, painel, schema ou dependências.

| Verificação executada                                 | Resultado final                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `npm.cmd run build`                                   | Aprovado; CSS 59,28 KB / 11,80 KB gzip; JavaScript público 308,29 KB / 97,15 KB gzip |
| `npm.cmd test`                                        | 17 testes aprovados, zero falhas                                                     |
| `npm.cmd run test:e2e`                                | Rodada final com 14 testes aprovados, zero falhas, Chrome desktop e mobile           |
| Prettier nos sete arquivos de código/testes alterados | Aprovado                                                                             |
| Integridade do backend                                | 19 arquivos conferidos por SHA-256, sem alterações                                   |
| Prévia de desenvolvimento                             | Home HTTP 200; API com `status: ok` em localhost                                     |

Os cenários de navegador abrangem rotas públicas, identidade oficial, favicon, login, painel, contato até leitura administrativa, uploads, músicos com e sem retrato, galeria, lightbox, agenda, evento individual e CRUD com confirmação de exclusão. As imagens sólidas e os registros de teste ficam somente no banco isolado da suíte.

Foram acrescentadas verificações da contagem real dos filtros, restauração da seleção pelo botão “Limpar filtros”, largura completa da galeria da Home com mídia e navegação pelo índice da História sem ocultar o título atrás do cabeçalho fixo. O índice usa capítulos reais do conteúdo institucional, sem datas inventadas. Textos personalizados no painel continuam prevalecendo, inclusive em tela de 320 px.

Os testes de responsividade exercitaram 320, 768, 1024 e 1280 CSS px, além dos projetos padrão de desktop (1440 px) e Pixel 7. As verificações axe das páginas públicas, login, mensagens e músicos com dados não detectaram violações nos cenários avaliados. Foram exercitados o menu móvel, Escape, retorno do foco, filtros e lightbox por teclado. Não foram executados testes manuais de leitor de tela ou de todos os níveis de zoom, nem validação em outros motores de navegador.

Foram inspecionadas capturas desktop e mobile da Home, História e Contato, da Galeria desktop e dos estados com mídia. A revisão visual identificou um desalinhamento de acervo/agenda e uma regra de largura da galeria com dados; ambos foram corrigidos, seguidos de novo build e rodada completa de E2E. As capturas finais refletem a versão corrigida.

Comparação na mesma largura e estado sem registros: Home desktop passou de 1440×3515 para 1440×3172 px (cerca de 9,8% menor); no projeto mobile, de 1082×12521 para 1082×11610 pixels de imagem (DPR do dispositivo de teste). Esses tamanhos de imagem mobile não representam largura em CSS px. Capturas anteriores em `docs/redesign-mastery/before`, finais em `docs/redesign-mastery/after` e evidências adicionais em `test-results`.

O navegador interativo do chat continuou sem superfícies disponíveis; a inspeção renderizada foi realizada nas capturas Playwright do Chrome instalado. A prévia local existente foi reutilizada após confirmar as portas de Vite e API. Ela permanece disponível em `http://127.0.0.1:3000/` para avaliação do usuário. Não houve publicação externa.

## Refinamento anti-ai — 21/10/2026

Revisão solicitada com `$frontend-mastery anti-ai`. Diagnóstico e correções em [ANTI-AI-FRONTEND.md](ANTI-AI-FRONTEND.md). Foram retirados slogans duplicados, numeração decorativa e grafismos repetidos; os textos administrados, a marca e as integrações existentes foram preservados.

| Verificação executada | Resultado final |
| --- | --- |
| `npm.cmd run build` | Aprovado; CSS 55,76 KB / 11,30 KB gzip; JavaScript público 306,64 KB / 96,78 KB gzip |
| `npm.cmd test` | 17 testes aprovados, zero falhas |
| `npm.cmd run test:e2e` | Rodada final com 14 testes aprovados, zero falhas, Chrome desktop e mobile |
| Prettier nos sete arquivos de código alterados | Aprovado |
| Integridade do backend | 19 arquivos comparados por SHA-256, sem alterações |
| Ambiente local | Home HTTP 200 e API com `status: ok`; 0 fotos, 0 vídeos, 0 eventos, 0 músicos e nenhuma foto de destaque cadastrada |

Os testes de navegador existentes cobriram identidade oficial e favicon, rotas públicas, painel, uploads, fotografias de destaque, tradições com foto, galeria e filtros, contagens, lightbox por teclado, músicos com e sem retrato, títulos personalizados, formulário de contato até a leitura no painel, agenda, evento individual e CRUD. Nenhum teste foi alterado para acomodar a revisão visual. Os testes de largura exercitaram 320, 768, 1024 e 1280 CSS px, além dos projetos desktop de 1440 px e Pixel 7. Menu, Escape, retorno do foco e índice da História continuam cobertos.

As verificações axe não detectaram violações nos cenários avaliados. Isso não substitui testes com leitor de tela, todos os níveis de zoom ou outros motores de navegador, que não foram executados nesta revisão.

A inspeção das capturas confirmou a apresentação compacta da marca no celular, a prioridade do texto institucional e os avisos sem grafismos repetidos. O estado com fotografia revelou um intervalo excessivo entre os textos das tradições; a distribuição das linhas do grid foi corrigida, seguida de novo build e rodada completa de E2E. Foram inspecionadas as capturas finais da Home desktop/mobile, História desktop, Galeria desktop e Músicos desktop, além da Home com mídia de teste. Os resultados anteriores foram preservados em `docs/anti-ai/before` e os finais em `docs/anti-ai/after`.

As imagens sólidas e os registros artificiais pertencem somente ao banco isolado dos testes. A prévia local existente foi reutilizada e permanece em `http://127.0.0.1:3000/`. Não houve alterações de schema, API, autenticação, painel ou dependências.

## Composição com conteúdo existente — 21/10/2026

Aplicação de `$frontend-mastery enrich` em Galeria, Agenda e Músicos, descrita em [ENRICH-FRONTEND.md](ENRICH-FRONTEND.md). Foram aproveitados os textos institucionais já publicados sobre patrimônio, tradições e gerações, além da logomarca oficial. A inspeção confirmou ausência de fotos e vídeos no ambiente local; nenhuma mídia artificial foi acrescentada.

| Verificação executada | Resultado final |
| --- | --- |
| `npm.cmd run build` | Aprovado; CSS 58,00 KB / 11,58 KB gzip; JavaScript público 308,22 KB / 97,09 KB gzip |
| `npm.cmd run test:e2e` | 14 testes aprovados, zero falhas; Chrome desktop e mobile |
| Prettier nos três arquivos de código alterados | Aprovado |
| Integridade do backend | 19 arquivos comparados por SHA-256 com o início da revisão, sem diferenças |
| Prévia local | Home HTTP 200, API com `status: ok`; acervo, eventos e músicos continuam sem registros |

Os testes existentes verificaram identidade e favicon, rotas públicas, uploads, galeria com e sem mídia, filtros, contagens, lightbox, perfis com e sem retrato, conteúdo personalizado, navegação, formulário de contato até a leitura no painel e CRUD de eventos. Nenhum teste foi modificado. A suíte de backend não foi repetida nesta revisão restrita à apresentação; os resultados anteriores estão registrados acima.

Os testes de largura passaram em 320, 768, 1024 e 1280 CSS px, além dos projetos desktop de 1440 px e Pixel 7. As verificações axe das páginas públicas e cenários administrativos avaliados não detectaram violações. Não foram realizados testes manuais de leitor de tela, zoom ou outros motores de navegador.

Foram inspecionadas as seis capturas de Galeria, Agenda e Músicos em desktop e celular. A conferência identificou um link duplicado para História na Galeria; ele foi retirado, seguido de novo build e rodada completa dos 14 testes. As capturas finais refletem esse ajuste e ficam em `docs/enrich/after`; as anteriores, em `docs/enrich/before`.

Os componentes de apoio usam o contexto institucional já carregado, sem novas chamadas de API. Os estados com registros continuam usando os componentes existentes. As imagens e cadastros artificiais usados pela suíte ficaram restritos ao banco isolado de testes. O servidor local permanece disponível em `http://127.0.0.1:3000/`.
