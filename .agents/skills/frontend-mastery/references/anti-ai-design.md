# Diagnóstico de aparência genérica

Use em `anti-ai` e quando houver sinais concretos de composição sem relação com o produto. Isto é uma rubrica de design, não um detector da autoria de uma interface.

Antes de alterar, relacione objetivo, público e identidade. Um padrão conhecido não é uma falha por si. Julgue a combinação, o impacto e a ausência de justificativa contextual.

| Sinal a investigar           | Evidência útil                                                                            | Intervenção candidata                                                             | Quando preservar                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Hero centralizado previsível | O título poderia ser trocado pelo de qualquer marca; imagem e ação pouco ligadas à tarefa | Reorganizar conteúdo real e destacar o atributo ou ação específica                | Uma ação única e simples realmente pede centralização             |
| Cards em todas as seções     | Narrativa, lista e formulário têm o mesmo invólucro; bordas competem com conteúdo         | Usar capítulos, lista, tabela, figura ou agrupamento aberto conforme a informação | Itens são independentes, comparáveis e precisam de limites claros |
| Seções repetidas             | Mesma grade, título e CTA sucessivos, só muda o fundo                                     | Diferenciar relações editoriais e juntar conteúdo redundante                      | Padrão repetido melhora escaneabilidade de tarefas equivalentes   |
| Hierarquia uniforme          | Todos os títulos, badges e botões parecem igualmente importantes                          | Separar ação principal, contexto e metadados; reduzir destaques                   | Densidade operacional exige equivalência entre itens              |
| Tipografia sem intenção      | Família escolhida por hábito; pesos inexistentes; títulos enormes e controles minúsculos  | Ajustar papéis e variantes existentes antes de trocar a fonte                     | Uma família só sustenta com clareza a identidade do produto       |
| Vazio artificial             | Alturas fixas, mídia inexistente, margem repetida e grandes caixas de preparo             | Compactar, redistribuir conteúdo real e projetar ausência de dados                | Espaço delimita leitura, contemplação ou prioridade comprovável   |
| Decoração superficial        | Gradientes, sombras, arcos ou ícones sem relação com conteúdo/estado                      | Remover ou derivar grafismos dos ativos reais da marca                            | Recurso comunica marca, profundidade ou interação necessária      |
| Inconsistência entre páginas | Fontes, raios e rótulos diferentes para a mesma função                                    | Evoluir tokens e componentes compartilhados                                       | Diferença representa um papel real, como operação e apresentação  |
| Conteúdo versus ornamento    | Grafismos dominam enquanto dados e próximos passos ficam escondidos                       | Recuperar prioridade do conteúdo e função do destaque                             | Imagem ou composição visual é o próprio conteúdo do projeto       |

Para cada problema, descreva: localização → observação → efeito na tarefa → correção específica → como verificar. Não use “parece IA” como diagnóstico suficiente. Priorize uma causa que se repete em vez de trocar cada card por um efeito diferente.

Não substitua automaticamente gradiente por bege editorial, sans por serif itálica, simetria por assimetria ou muitos cards por enormes áreas vazias. Essas escolhas também podem se tornar fórmulas. Verifique se a solução depende da marca e do conteúdo desta tela.

Em modo de análise, proponha sem modificar código. Em `anti-ai` com implementação, aplique no escopo pedido, preserve funcionalidades e confira o resultado renderizado quando houver ferramenta.
