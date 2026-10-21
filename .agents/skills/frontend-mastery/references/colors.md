# Cores e superfícies

Use para definir papéis cromáticos ou corrigir contraste. Preserve a paleta institucional antes de ampliar a quantidade de cores.

Mapeie a paleta em papéis semânticos: fundo, superfície, texto principal, texto secundário, ação, foco, borda e estados. Reutilize tokens ou tema existentes, inclusive tokens de Tailwind/Bootstrap; não crie uma segunda fonte de verdade em CSS paralelo. Adicione uma variável somente se ela representar um papel útil ou repetido.

Distribua contraste pela tarefa: branco ou neutro em leitura; cor de marca em navegação, ações e destaques; tons secundários para relações discretas. Uma seção importante não precisa de fundo colorido se tipografia e composição já comunicam sua hierarquia. Evite alternar cores como única diferença entre seções idênticas.

Calcule contraste sobre a superfície efetiva, considerando transparência, overlays e imagens. [WCAG 2.2, contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) estabelece 4,5:1 para texto comum e 3:1 para texto grande: pelo menos 18 pt, ou 14 pt em negrito. Há exceções, como logotipos e componentes inativos. Isso não torna textos secundários claros automaticamente adequados. Para identificação visual de componentes e gráficos necessários, consulte [contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), em geral 3:1 contra cores adjacentes.

Cheque foco em superfícies claras e escuras, links inline, hover, selecionado, erro e sucesso. Não use cor como único indicador de situação: mantenha texto, forma ou ícone com nome acessível. Não use o mesmo destaque de marca para confirmar sucesso e sinalizar erro sem outra diferenciação.

Gradientes podem representar profundidade, marca ou leitura sobre imagem; exija essa função. Não adicione gradiente apenas como substituto de uma composição fraca. Introduza tema escuro somente se estiver no escopo, não para demonstrar sofisticação.
