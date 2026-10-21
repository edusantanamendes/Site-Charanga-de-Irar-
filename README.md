# Charanga de Irará

Site institucional completo em React/Vite, com API Express, PostgreSQL/Prisma e painel administrativo. O conteúdo inicial vem do briefing fornecido; não foram criados músicos, eventos, contatos, fotografias ou credenciais fictícias para o site.

## Executar neste computador

Requer **Node.js 22.12 ou superior** e npm.

```powershell
npm.cmd ci
npm.cmd run db:generate
npm.cmd run dev
```

Abra **http://127.0.0.1:3000**. A API fica em `http://127.0.0.1:3001/api`.

Sem `DATABASE_URL`, o comando `dev` inicia PGlite, uma implementação de PostgreSQL em WASM, com dados persistidos na pasta ignorada `.local-db`. O socket aceita conexões apenas de loopback. Esse modo serve exclusivamente ao desenvolvimento. Os mesmos modelos Prisma e as mesmas migrações SQL são usados nos testes. Não use esse banco em produção ou exponha sua porta. A primeira inicialização pode levar alguns segundos.

Com PostgreSQL externo, copie `.env.example` para `.env`, preencha `DATABASE_URL` e execute:

```powershell
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

O seed é idempotente: não sobrescreve textos já editados, não cria administradores e não cria apresentações ou integrantes. **1954 é a fundação da Filarmônica 25 de Dezembro; não é apresentada como fundação da Charanga.**

## Criar o primeiro administrador

Não existe login ou senha padrão. Em um terminal interativo:

```powershell
npm.cmd run admin:create
```

Informe nome, e-mail e uma senha de 12 a 72 caracteres (até 72 bytes UTF-8). A entrada da senha fica oculta; o banco recebe somente o hash bcrypt com custo 12. Nenhuma senha é aceita como argumento de linha de comando.

**No modo PGlite, pare `npm run dev` antes de executar `admin:create` e reinicie depois.** Isso evita abrir dois processos no mesmo diretório de dados. Com PostgreSQL externo, configure a mesma `DATABASE_URL` do servidor e execute normalmente. Acesse `/admin/login`.

O comando também permite criar outro administrador. Para uma recuperação sem SMTP, um responsável com acesso ao servidor pode criar uma nova conta nominal e, via administração do banco, revogar as sessões e remover a conta antiga. Não há endpoint público para criar contas.

## O que está implementado

- Início, história e linha do tempo documentada, galeria, agenda, evento individual, músicos, contato, privacidade e 404.
- Menu móvel, navegação por teclado, indicadores de foco, movimento reduzido e fontes Google Fonts hospedadas no próprio site.
- Galeria de fotos e vídeos com filtros, categorias, lightbox, setas do teclado e reprodução de YouTube/Vimeo sob demanda.
- Agenda com eventos futuros e realizados, situações confirmado/cancelado/adiado e horário de Brasília.
- Painel protegido, dashboard e CRUD de eventos, músicos, fotografias, vídeos, categorias, conteúdo, mensagens e redes sociais.
- Publicação/rascunho, paginação, feedback e confirmação de exclusão.
- Configuração da identidade, logomarca, localidade, e-mail e WhatsApp. Canais não cadastrados ficam ocultos.
- Upload autenticado de JPEG/PNG/WebP, até 8 MB e 40 megapixels, validação pelo decodificador, remoção de metadados, redimensionamento e conversão para WebP.
- Contatos persistidos antes do encaminhamento por e-mail. Falhas de SMTP não descartam a mensagem; o painel mostra a pendência e permite reenviar.
- Sessões de 8 horas em cookie HttpOnly/SameSite=Strict, tokens de sessão com hash/HMAC, CSRF, validação de origem, rate limiting e bloqueio por conta após 10 tentativas inválidas.
- Recuperação por e-mail com token de uso único, hash no banco, expiração em 30 minutos e revogação das sessões após trocar a senha.
- Validação com Zod, acesso parametrizado pelo Prisma, headers Helmet e política CSP em produção.
- Metadados por rota no HTML de produção, Open Graph, canonical, MusicGroup/MusicEvent em JSON-LD, sitemap dinâmico e robots. Admin recebe `noindex`.

## Conteúdo e acervo

Cadastre somente dados e contatos confirmados. A logomarca oficial fornecida está preservada integralmente em `frontend/public/brand/logo-charanga-original.jpeg` e aplicada ao site e ao painel. Sem fotografias, a abertura apresenta diretamente a marca. Nos estados sem registros, Galeria, Agenda e Músicos combinam avisos de preparação com textos institucionais existentes sobre patrimônio, tradições e gerações. Nenhuma fotografia de outra banda é usada como se fosse da Charanga. A paleta azul/branco, a tipografia e os tokens estão documentados no [guia de identidade visual](docs/IDENTIDADE-VISUAL.md).

Em **Conteúdo institucional**, preserve os identificadores dos textos iniciais. `hero`, `history-intro`, `history-connection`, `tradition-heading`, `gallery-heading` e `events-heading` alimentam o início; `alvoradas`, `lavagem` e `cultura` alimentam a composição de tradições; `page-history`, `page-gallery`, `page-events`, `page-musicians`, `page-contact`, `contact-aside` e `invitation` alimentam as apresentações das páginas e o convite de contato da Home. As seções `historia` e `timeline` aceitam novos blocos. A ordem é numérica; números menores vêm primeiro. A data de um marco deve ser cadastrada somente quando confirmada. Textos são tratados como texto simples, sem interpretação de HTML. Os títulos padrão conhecidos recebem uma revisão editorial na apresentação, em `config/editorial.js`; títulos personalizados no painel prevalecem, sem alterações dos dados salvos.

Em **Configurações**, envie a fotografia oficial de destaque e descreva a imagem para acessibilidade. Ela ocupa a área visual da abertura; sem fotografia cadastrada, aparece uma composição azul com a logomarca oficial. A logomarca original permanece no cabeçalho e no rodapé. Fotografias publicadas nas categorias de história, Alvoradas e Lavagem também alimentam as seções correspondentes, quando disponíveis.

A composição atual das páginas com pouco conteúdo está em [ENRICH-FRONTEND.md](docs/ENRICH-FRONTEND.md). O [refinamento anti-ai](docs/ANTI-AI-FRONTEND.md), o [redesign com Frontend Mastery](docs/REDESIGN-FRONTEND-MASTERY.md), o [refinamento visual anterior](docs/REFINAMENTO-VISUAL.md) e o [redesign editorial](docs/REDESIGN-EDITORIAL.md) ficam preservados como histórico. A aplicação mantém React, Express, API, banco e autenticação existentes.

Fotos e vídeos podem ser relacionados a uma categoria e a um evento. Ao excluir uma categoria ou evento, os registros do acervo são preservados e a relação é removida. A exclusão de um registro da galeria não remove automaticamente o arquivo físico, pois ele pode estar em uso em outro cadastro. Faça limpeza de arquivos órfãos em manutenção, após verificar referências e backups.

Datas são armazenadas em UTC e exibidas no fuso `America/Sao_Paulo`. O editor de eventos informa explicitamente o horário de Brasília (UTC−03:00). Não há cobrança, contratação automática ou informações de disponibilidade inventadas.

## Configurar e-mail

Defina no ambiente do servidor:

```dotenv
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

Use `SMTP_SECURE=true` para SMTP com TLS direto (normalmente porta 465). Para porta 587, o transporte exige STARTTLS em produção. O remetente deve estar autorizado pelo provedor; mantenha as credenciais somente no servidor. Em **Configurações**, cadastre o e-mail oficial destinatário. O remetente do visitante é usado como `Reply-To`, não como `From`.

Sem SMTP, o contato continua sendo salvo e consultável no painel; a recuperação de senha não entrega e-mails. A resposta pública de recuperação não revela se uma conta existe. Em produção, um processo periódico tenta encaminhar até 10 mensagens pendentes por minuto. Também é possível usar o botão de reenvio no painel ou `npm run messages:retry` com a `DATABASE_URL` configurada. Execute apenas uma instância desse trabalho para evitar encaminhamentos duplicados; a entrega SMTP é do tipo “pelo menos uma vez”.

## Build, migrações e publicação

```powershell
npm.cmd run db:check
npm.cmd run build
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd start
```

Em produção são obrigatórios:

- `NODE_ENV=production`.
- `DATABASE_URL` de um PostgreSQL real. Use TLS e as opções exigidas pelo provedor.
- `SITE_URL` pública começando com `https://`, sem barra final.
- `SESSION_SECRET` aleatória de pelo menos 32 caracteres, estável entre reinicializações.
- `TRUST_PROXY` com a quantidade exata de proxies confiáveis (por exemplo, `1` atrás de um proxy). Não exponha diretamente o backend se confiar em headers de proxy.
- HTTPS no proxy/host e volume persistente para `UPLOAD_DIR`. Faça backups coordenados do banco e dos uploads.
- SMTP, e-mail oficial, administrador e conteúdo oficial para operação institucional.

Gere a chave em um terminal local e copie a saída para o gerenciador de segredos da hospedagem:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

O Express serve o build em `frontend/dist` e a API na mesma origem. Configure o proxy para encaminhar todas as rotas para o Node, preservar HTTPS e limitar uploads (por exemplo, 10 MB). Os metadados e o status HTTP 404 são gerados pelo Express; o servidor Vite é apenas para desenvolvimento. Não publique somente a pasta `dist`, pois a aplicação depende da API.

As migrações em `backend/prisma/migrations` são a fonte de verdade. Em produção, execute `db:migrate`, nunca `db push` ou reset. Faça backup antes de migrações futuras. O modo local registra migrações em uma tabela própria; não aponte `prisma migrate deploy` para o socket do banco embutido.

## Docker

Há `Dockerfile` e `compose.yaml` para Node e PostgreSQL com volumes persistentes. Configure no `.env` `POSTGRES_PASSWORD`, `DATABASE_URL=postgresql://charanga:SENHA_CODIFICADA@db:5432/charanga`, `SITE_URL`, `SESSION_SECRET` e SMTP. O password na URL precisa ser codificado como componente de URL. Não há senha padrão.

```powershell
docker compose up --build -d
docker compose exec app npm run admin:create
```

O serviço publica a porta 3001 apenas no loopback do host. Coloque um proxy HTTPS à frente e ajuste `TRUST_PROXY`. PostgreSQL não publica porta no host. Docker/Compose precisam estar instalados; esse fluxo exige validação na hospedagem escolhida.

## Verificações

```powershell
npm.cmd test
npm.cmd run test:e2e
npm.cmd run db:check
npm.cmd run build
```

Os testes de integração criam um PostgreSQL embutido em memória, executam as migrações reais e acessam a API com Prisma. As credenciais de teste são geradas aleatoriamente e não existem no banco local da aplicação. O E2E usa um servidor isolado na porta 3100 e Chrome instalado (`channel: chrome`), incluindo desktop, celular e verificações axe WCAG. Screenshots e relatório ficam em `test-results` e `playwright-report`, ignorados pelo Git. Não execute testes contra banco de produção.

O [relatório de validação](docs/VALIDACAO.md) registra os resultados, os limites de verificação e o que precisa ser configurado para publicar.

## Estrutura

```text
frontend/src/
  components/      Elementos compartilhados, ilustração, lightbox
  contexts/        Conteúdo público e autenticação
  hooks/           Metadados
  layouts/         Cabeçalho e rodapé
  pages/           Páginas públicas e administração
  services/        Cliente HTTP e CSRF
  styles/          Identidade e responsividade
backend/
  prisma/          Schema, migrações e seed institucional
  scripts/         Criação segura do administrador e reenvio de mensagens
  src/
    config/        Ambiente
    controllers/   Requisições e respostas
    middlewares/   Sessão, CSRF, limites e erros
    models/        Acesso Prisma
    routes/        API REST
    services/      E-mail e encaminhamento
    utils/         Tokens, hashing e erros
    validators/    Validação de entrada
scripts/           Desenvolvimento e PostgreSQL local
tests/             Integração e navegador
docs/              Arquitetura e relatório de validação
```

## Referências técnicas

[Vite](https://vite.dev/guide/), [Prisma/PostgreSQL](https://www.prisma.io/docs/orm/v6/overview/databases/postgresql), [PGlite](https://pglite.dev/docs/) e [Express](https://expressjs.com/). A escolha de Prisma 6.19.3 mantém a geração de cliente JavaScript e as migrações explícitas desta implementação.
