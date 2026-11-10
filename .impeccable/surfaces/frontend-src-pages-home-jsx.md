---
version: 1
slug: "frontend-src-pages-home-jsx"
primary_target: "frontend/src/pages/Home.jsx"
related_targets: ["frontend/src/pages/History.jsx","frontend/src/pages/PublicPages.jsx","frontend/src/layouts/PublicLayout.jsx","frontend/src/pages/admin/Admin.jsx"]
---

# Reformulação institucional — briefing de superfície

Escopo: todas as rotas públicas e o painel existente. Modos: Read para história e privacidade; Experience para o acervo; Operate para agenda, contato e administração. A abertura apresenta a instituição e conduz à história. Implementação direta no código, conforme a autonomia concedida no briefing; não foi criado um padrão de workflow permanente.

## Direções consideradas

1. Caderno de cultura: leitura em capítulos e amplo espaço para relatos.
2. Cartaz de rua: nome e chamadas muito condensados, circulação rápida.
3. Catálogo fotográfico: imagens integrais e legendas, dependente do acervo.
4. Arquivo municipal: índices e documentos com navegação muito explícita.
5. Programa de concerto: marca como selo, abertura tipográfica, repertório de seções e informações práticas.
6. Identidade associativa: emblema e textos institucionais em composição central.
7. Percurso de cortejo: fluxo contínuo conectado aos textos de tradições.

A direção 5 foi atribuída pelo seed 412c4c27 e coincide com o briefing Editorial Cultural + Modern Heritage. Os seis challengers foram avaliados como declined nos eixos identificação cultural e clareza: densidade japonesa reduz a leitura; broadside calavera desloca o contexto cultural; painel de destinos e bancada de filme impõem controles sem tarefa correspondente; folha Miura depende de geometria decorativa; fita de proveniência pressupõe uma cadeia documental inexistente.

Disciplina incorporada de cada alternativa, sem seus motivos: densidade funcional nos filtros (japanese-high-density); autoridade do nome na abertura (broadside); estados sempre legíveis por texto (depot-blind); imagens sem corte na ampliação e créditos juntos (cutting-bench); reorganização real das colunas em telas pequenas (Miura); separação explícita de fatos e ausências documentais (provenance-ribbon).

## Direction contract

THESIS: Um programa cultural da Charanga, com nome expressivo e marca autêntica, conduz à história e às informações práticas. Evita uma sucessão de cartões iguais.

OWN-WORLD: Azul original e branco, superfícies frias discretas, Manrope para orientação e masthead, Playfair local para os títulos de leitura. A continuidade da fonte institucional existente evita uma nova dependência e preserva seu desenho já adotado no projeto; a mudança de composição e escala estabelece a nova hierarquia. Bordas precisas, controles retos e imagens sem efeitos.

STORY: Reconhecer a Charanga e sua ligação com Irará; ler a história; explorar registros e apresentações ou iniciar contato. Nenhuma fotografia, perfil ou data é criada.

FIRST VIEWPORT: Cabeçalho compacto; nome em uma faixa tipográfica ampla; localização e vínculo institucional visíveis; abaixo, texto e ação de história à esquerda e fotografia real ou marca original em campo azul à direita. No celular, leitura e ações precedem a área visual.

FORM: Programa de concerto, posição 5, seed 412c4c27. Interação característica: índice direto dos capítulos da Home e História, filtros de acervo e ampliação sem recortar o original. A mesma gramática atende formulários e tabelas com expressão reduzida.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Risco: a ausência de fotografias limita a dimensão documental; a marca e o conteúdo existente sustentam o desenho até o cadastro de imagens reais. Nenhuma decisão factual fica a cargo da composição.
