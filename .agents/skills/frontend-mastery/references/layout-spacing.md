# Layout, densidade e ritmo

Use para resolver vazio, repetição, desalinhamento ou excesso de contêineres.

## Corrija a causa

Examine os limites reais das caixas e o conteúdo. Um `min-height: 100vh`, margens somadas ou coluna esticada podem causar vazio mesmo com bons tokens. Remova alturas mínimas sem função antes de adicionar elementos. Não use `overflow-x: hidden` na página para esconder uma largura incorreta.

Agrupe pelo significado: rótulo e valor próximos; título e explicação relacionados; distância maior entre seções do que entre seus parágrafos. Evolua a escala existente. Quando não houver escala, crie poucos passos proporcionais à aplicação; não normalize cada medida diferente sem avaliar sua razão.

## Escolha a ferramenta

- **Grid:** relações entre linhas e colunas, áreas editoriais e comparação. Use `minmax(0, 1fr)` para permitir contração de conteúdo; teste filhos com nomes longos.
- **Flexbox:** alinhamento em um eixo, grupos de ações e controles com quebra natural. Evite `nowrap` sem uma razão.
- **`clamp()` e larguras máximas:** espaçamento fluido limitado e margens laterais consistentes. Não imponha a mesma altura vertical a seções com conteúdos muito distintos.
- **`aspect-ratio`:** reservar espaço de mídia e estabilizar carregamento. Defina `object-fit` conforme a intenção; não recorte logos e informações essenciais.
- **Container queries:** componentes que se reorganizam conforme o espaço onde aparecem. Use quando isso resolver algo que viewport queries não representam; confirme o suporte exigido pelo projeto.
- **Posicionamento absoluto:** overlays e decoração sem valor estrutural. Não use para manter textos e botões de conteúdo em lugares fixos.

Uma galeria pode variar proporções com alinhamento consistente; uma tabela precisa de campos previsíveis. Layout editorial não é solução universal. Ao variar seções, altere a relação entre conteúdo e função, sem multiplicar wrappers ou estilos de card.

Valide com pouco conteúdo, texto longo, imagem ausente e viewport intermediário. Compare alturas por seção; redução de comprimento só é melhoria se a leitura e o acesso às informações forem preservados.
