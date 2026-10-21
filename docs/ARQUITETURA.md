# Plano e arquitetura

Aplicação JavaScript em duas camadas, React/Vite como View e API Express em MVC. Prisma acessa PostgreSQL. O mesmo Express entrega o build React em produção, mantendo cookies e API na mesma origem.

## Rotas

- Públicas: `/`, `/historia`, `/galeria`, `/eventos`, `/eventos/:slug`, `/musicos`, `/contato`, `/privacidade` e página 404.
- Administração: `/admin/login`, `/admin/recuperar`, `/admin/redefinir`, `/admin` e seções internas protegidas.
- API: `/api/public/*`, `/api/auth/*`, `/api/admin/*`, `/api/health`.
- SEO: sitemap e robots gerados pelo servidor a partir da URL configurada e dos eventos publicados.

## Interface

Identidade oficial em azul extraído da logomarca, branco e neutros. Títulos públicos em Playfair Display; textos, controles e títulos administrativos em Manrope. Home assimétrica, figuras com legendas externas, tradições em composição aberta, agenda em linhas e navegação móvel. A logomarca original identifica cabeçalho, rodapé e painel. Nenhuma imagem de terceiros representa a Charanga. Acervo e agenda começam vazios, com espaços fotográficos identificados.

`styles/index.css` importa Tailwind, `tokens.css` e três folhas com responsabilidades distintas: `base.css` (fundamentos e controles), `public.css` (composições públicas) e `admin.css` (área de trabalho). Não existe uma segunda camada de overrides da marca. `components/Editorial.jsx` reúne figuras, itens de agenda, mídia e convite; Home e História têm módulos próprios. Os demais componentes de formulário, confirmação, estados e lightbox continuam compartilhados. `config/editorial.js` revisa apenas títulos padrão conhecidos, respeitando edições no painel. Consulte `IDENTIDADE-VISUAL.md` e `REDESIGN-EDITORIAL.md`.

## Dados

Administrator, Session, PasswordReset, Event, Musician, Category, Photograph, Video, Message, SiteSetting, InstitutionalContent, SocialLink e Upload. Índices para publicação, datas, sessões, expiração e mensagens. Categorias e eventos se relacionam ao acervo; exclusões preservam mídia sem classificação. Sessões e tokens armazenam apenas hashes. Conteúdo inicial deriva exclusivamente do briefing.

## Operação

Modo local usa PGlite (PostgreSQL em WASM) persistente, restrito a loopback, para permitir execução sem Docker. Produção exige PostgreSQL externo, HTTPS, SMTP e armazenamento persistente para uploads. Migração SQL versionada e seed idempotente. Não há administrador ou senha padrão.

## Verificação

Build, validação do schema e testes de integração com Prisma sobre PostgreSQL embutido. Exercitar autenticação, CSRF, recuperação, CRUD, contatos, SMTP simulado localmente, uploads, persistência e exclusão. Verificar páginas, navegação móvel, teclado, overflow e acessibilidade em navegador.
