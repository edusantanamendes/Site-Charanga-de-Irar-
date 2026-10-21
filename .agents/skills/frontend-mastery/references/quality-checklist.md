# Qualidade, severidade e evidência

Use para estruturar diagnóstico e concluir uma entrega. Aplique os itens pertinentes ao fluxo alterado, sem transformar uma correção pequena em uma auditoria completa.

## Classifique achados pelo efeito

| Severidade | Critério                                          | Exemplo                                                              |
| ---------- | ------------------------------------------------- | -------------------------------------------------------------------- |
| Crítica    | Impede tarefa essencial ou causa perda de dados   | Formulário perde valores e não permite enviar                        |
| Alta       | Impede parte relevante do público de usar o fluxo | Menu inacessível por teclado; ação fora da tela no celular           |
| Média      | Prejudica compreensão, leitura ou eficiência      | Data e local dispersos; hierarquia confusa; repetição de contêineres |
| Baixa      | Acabamento local sem bloquear entendimento        | Intervalo ou alinhamento ligeiramente inconsistente                  |

Severidade não equivale ao tamanho da mudança. Informe alcance, confiança e evidência. Uma observação só do CSS pode sustentar uma hipótese; confirme a manifestação visual quando possível.

Formato de achado: **[severidade] rota/componente e arquivo → evidência → impacto → correção → validação**. Registre o que funciona quando isso ajuda a preservar decisões. Não preencha relatório com problemas hipotéticos ou recomendações sem alvo.

## Antes de encerrar implementação

- A tarefa principal e as ações estão claras, com destinos e feedback reais?
- A marca, textos personalizados e integração com dados foram preservados?
- Densidade e composição correspondem ao conteúdo, inclusive sem imagem ou registros?
- Tipografia, alinhamentos, tokens e estados se mantêm coerentes entre os consumidores afetados?
- Teclado, foco, labels, erros e estados de carregamento/vazio funcionam nos fluxos alterados?
- Telas pequenas, intermediárias e grandes foram verificadas quando havia navegador? Conteúdo longo e ampliação revelam alguma perda?
- Mídia tem dimensões apropriadas; fontes e efeitos não acrescentam custo desproporcional?
- Os comandos aplicáveis do projeto passaram? Se não, a falha é nova, preexistente ou do ambiente, e qual evidência sustenta isso?

## Relato curto, verificável

Informe resultado, arquivos principais, comandos com sucesso/falha, páginas/viewports/estados exercitados e limitações reais. Não marque como testado algo apenas inspecionado no código. Build aprovado não prova navegação; screenshot não prova envio; axe sem violações não prova conformidade integral.

Em `review`, use a comparação realmente disponível e dê prioridade a regressões introduzidas. Em `audit`, não execute correções no código. Se não houver achados sustentados por evidência, diga isso e registre a cobertura, sem inventar defeitos para preencher a resposta.
