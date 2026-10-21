# Responsividade

Use para investigar ou corrigir adaptação entre tamanhos e modos de entrada.

Comece pelo fluxo pequeno quando for compatível com a arquitetura existente. Um site desktop-first funcional não precisa ter todas as media queries reescritas para receber uma correção. Escolha breakpoints onde o conteúdo falha, usando os tokens existentes quando adequados.

Valide uma largura pequena de referência de 320 CSS px, um celular representativo, uma largura intermediária e o desktop do público. São amostras, não garantia de cobertura. Inspecione também entre os breakpoints e com texto ampliado; veja o [critério de reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) e suas exceções para conteúdo que requer duas dimensões.

## Reorganize, não miniaturize

- Navegação precisa continuar fácil de encontrar. Desktop comporta links visíveis quando cabem; celular pode usar disclosure com botão e estado acessíveis. Não duplique menus abertos ao redimensionar.
- Reordenação visual não deve contradizer a sequência do DOM ou do teclado. Se a tarefa principal muda de posição, ajuste a estrutura com cuidado.
- Botões podem quebrar para uma segunda linha; não comprima texto até ficar ilegível. Mantenha ação principal e secundária distinguíveis.
- Imagens preservam proporção e foco relevante. Retire recortes rígidos em retratos, logos ou documentos quando necessário.
- Formulários precisam funcionar com teclado virtual e orientação diferente. Evite rodapés fixos ou headers que ocultam campos e foco.
- Tabelas podem usar rolagem **dentro de uma região identificável**, mantendo cabeçalhos e dados. Não transforme cada célula em card nem esconda colunas importantes só para caber.

## Investigue overflow

Compare `document.documentElement.scrollWidth` com `window.innerWidth`; localize a caixa que excede a área. Procure larguras fixas, gaps somados, `100vw` com padding, imagens sem limite, filhos grid/flex sem contração e strings sem quebra. Corrija a origem. Regiões intencionalmente roláveis devem continuar operáveis por teclado.

Na validação, registre larguras, páginas, estados e interações realmente avaliados. Em ambiente sem navegador, entregue a inspeção de código e diga que a responsividade renderizada ainda não foi verificada.
