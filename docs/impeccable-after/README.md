# Evidência visual — 09/11/2026

Capturas reais do aplicativo, com movimento reduzido, conteúdo carregado, imagens decodificadas e fontes locais prontas.

- `desktop.png` e `mobile.png`: primeiro viewport da Home, 1440×1000 e 375×900 CSS px, DPR 1.
- `{home,historia,galeria,agenda,musicos,contato,privacidade,404,login,recuperar}-{desktop,mobile}.png`: páginas completas nos mesmos viewports.
- `dashboard-*`, `admin-settings-*` e `event-detail-*`: aplicação com conta e evento exclusivos do banco isolado E2E. Desktop 1440×1000, DPR 1; Pixel 7 emulado em 412×839 CSS px, DPR 2,625. A resolução do PNG móvel é maior por causa do DPR.
- `test-content/`: Galeria e Músicos com dados exclusivos do banco de testes. As imagens azuis são arquivos de verificação de upload, identificados como teste, e não fotografias institucionais. Este lote comprova os dois ajustes de hierarquia da revisão final.

As fotografias oficiais não existem no acervo inicial. A marca mostrada nas capturas é o arquivo original do projeto, cuja origem e hash constam em `frontend/public/brand/manifest.json`. Não há imagens geradas por IA.

O conteúdo com “E2E”, inclusive a data 2099 no detalhe do evento, pertence apenas ao cenário de teste e não representa uma apresentação da Charanga.

Procedência das capturas públicas: `scripts/capture-design.mjs`, contra `http://127.0.0.1:3000`. Procedência do painel e evento: `tests/e2e/identity.spec.js` e `tests/e2e/site.spec.js`, contra o servidor isolado na porta 3100.

Decisões, lista de arquivos e resultados em [REDESIGN-IMPECCABLE.md](../REDESIGN-IMPECCABLE.md).
