# Refinamento anti-ai — 21/10/2026

Revisão das páginas públicas com a skill `frontend-mastery`, modo `anti-ai`. O diagnóstico considera escolhas visuais observáveis, sem atribuir autoria à interface. Azul institucional, logomarca original, Playfair Display e Manrope foram mantidos.

## Diagnóstico e correções

| Local                            | Problema observado                                                                                                                                                           | Correção aplicada                                                                                                                                                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Abertura da Home                 | A marca estava dentro de um segundo cartaz, com legendas, slogan e pentagrama adicionais. No celular, esse conjunto vinha depois das ações e aumentava a altura da abertura. | Apresentação direta da logomarca. No celular sem foto de destaque, marca e nome compartilham uma linha; os textos e as ações seguem abaixo. Fotografias de destaque cadastradas continuam ocupando a área visual. |
| História na Home                 | Um slogan grande e um grafismo competiam com o título e os parágrafos institucionais.                                                                                        | Título e conteúdo administrado passam a duas colunas, empilhadas no celular. Fotografias históricas publicadas continuam aparecendo com legenda e crédito.                                                        |
| Cabeçalhos e tradições           | Números decorativos sugeriam uma sequência entre páginas independentes e aumentavam a hierarquia sem ajudar a leitura.                                                       | Retirada dos números decorativos e prioridade aos nomes das seções. A numeração do índice da História permanece porque orienta capítulos reais.                                                                   |
| Tradições com fotografia         | Uma fotografia na primeira coluna alongava as demais, deixando grandes vazios.                                                                                               | Com fotografia de Alvoradas, o texto das outras tradições fica empilhado ao lado, com a primeira linha dimensionada pelo próprio conteúdo. No celular, todos os artigos seguem em uma coluna.                     |
| Estados sem acervo e sem músicos | Pentagramas e frases repetidas preenchiam áreas que deveriam informar o estado do conteúdo.                                                                                  | Avisos compactos e honestos, com seus links preservados. Removida a repetição do título dos músicos em um segundo bloco ornamental.                                                                               |
| Tipografia e links               | Rótulos pequenos, caixa alta e setas repetidas em todos os links competiam com o conteúdo.                                                                                   | Rótulos públicos mais legíveis, legendas e metadados ajustados, títulos com escala limitada e links textuais sublinhados. Setas permanecem em ações e itens de mídia onde ajudam a indicar interação.             |

O pentagrama decorativo permanece apenas no tratamento de vídeos cadastrados sem miniatura. Não foram adicionadas imagens externas ou registros fictícios. Os slogans decorativos retirados eram texto fixo da apresentação; nenhum conteúdo administrado foi apagado ou substituído no banco.

## Escopo

As alterações de código se concentram em `pages/Home.jsx`, `pages/History.jsx`, `pages/PublicPages.jsx`, `components/UI.jsx`, `components/Editorial.jsx`, `components/MusicalIdentity.jsx` e `styles/public.css`, todos dentro de `frontend/src`.

Conteúdo personalizado, uploads, categorias, contagens, filtros, lightbox, eventos, músicos, formulário de contato, menu móvel e índice da História continuam integrados ao sistema existente. Backend, autenticação, schema, painel e dependências foram preservados. Os 19 arquivos do backend foram comparados por SHA-256 com o início desta revisão, sem diferenças.

## Evidências

Capturas anteriores em [anti-ai/before](anti-ai/before) e finais em [anti-ai/after](anti-ai/after). As capturas com imagens sólidas são cenários automatizados do banco isolado de testes; não representam fotografias da Charanga e não foram publicadas no ambiente local.

Os comandos executados, resultados e limites da verificação estão na seção desta revisão em [VALIDACAO.md](VALIDACAO.md). A prévia local permanece em [127.0.0.1:3000](http://127.0.0.1:3000/).
