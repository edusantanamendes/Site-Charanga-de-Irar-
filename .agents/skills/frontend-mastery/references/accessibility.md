# Acessibilidade e experiência

Use para inspecionar ou implementar interação acessível. Tenha WCAG 2.2 AA como referência; não declare certificação com base em uma ferramenta automática.

## Fluxo, estrutura e texto

Prefira controles HTML nativos com nomes claros. Use landmarks, títulos em hierarquia coerente e ordem do DOM que preserve a leitura. Elementos clicáveis precisam de operação por teclado. Um botão só com ícone deve ter nome acessível; SVG decorativo deve ficar fora da árvore de acessibilidade. Alt descreve a contribuição da imagem, enquanto imagens decorativas usam alt vazio. Preserve legendas e créditos separados quando existirem.

## Teclado, foco e sobreposições

Percorra o fluxo com Tab, Shift+Tab, Enter, Espaço e Escape conforme o componente. Evite `tabindex` positivo. Mantenha foco visível e não totalmente oculto por headers ou rodapés fixos. Modais devem conter foco; ao fechar, devolva-o à origem ou a um local lógico caso ela não exista mais. Disclosure de navegação não precisa de comportamento de menu de aplicativo.

## Entrada e retorno

Associe labels persistentes a campos. Preserve autocomplete, colagem e gerenciadores de senha quando cabíveis. Relacione erro ao campo (`aria-describedby`, `aria-invalid` quando aplicáveis), mantenha os valores e ofereça correção. Feedback assíncrono pode usar regiões de status; reserve anúncios assertivos para situações que justificam interromper a leitura. Não sinalize erro só com borda vermelha.

Verifique contraste nas superfícies efetivas, zoom, reflow e preferência de movimento reduzido. Prefira áreas de toque de cerca de 44×44 CSS px quando couberem. Isso é uma escolha de usabilidade: o [mínimo WCAG 2.2 AA, 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) é 24×24 CSS px, com exceções como espaçamento, links inline e controles equivalentes. Não apresente 44 px como mínimo universal AA.

## Evidência

Rode axe ou ferramenta já disponível e revise cada achado. Além dela, exercite teclado, foco, nomes, mensagens e zoom. Testes de leitor de tela exigem ferramenta e execução próprias; não os deduza da ausência de violações axe. Separe “não observado”, “não executado” e “verificado”.

Referência primária: [guia de critérios WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/).
