# Componentes e design system

Use para evoluir tokens, componentes, formulários e estados. Reuse primeiro o vocabulário do projeto.

## Evolução proporcional

Inventarie padrões recorrentes e suas diferenças. Reúna decisões compartilhadas em tokens semânticos e variantes úteis, sem criar uma API de dezenas de props para uma única tela. Um design system pequeno pode ser CSS variables mais alguns componentes; um produto com biblioteca estabelecida deve evoluí-la, não substituí-la por outra.

Documente o propósito de cada variante e seus estados. Evite um token por valor isolado ou componentes que só embrulham uma `div` sem regra reutilizável. Ao alterar um componente compartilhado, veja seus consumidores; uma mudança local pode exigir variante em vez de mudança global.

## Contrato de interação

| Componente   | O que preservar ou verificar                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Link/botão   | Link navega; botão executa ação. Nome, destino, foco, hover e estado indisponível compreensíveis.                                               |
| Menu         | Estado aberto informado, operação por teclado, Escape pertinente e ordem de foco. Uma lista de links de navegação não precisa de `role="menu"`. |
| Formulário   | Labels persistentes, autocomplete adequado, validação existente, dados preservados no erro e feedback de envio verdadeiro.                      |
| Diálogo      | Nome acessível, foco inicial útil, contenção de foco modal, Escape quando apropriado e retorno do foco ao controle de origem.                   |
| Galeria      | Alt, legenda/crédito, abertura por botão, fechar e navegar por teclado; preservar dados do CMS.                                                 |
| Lista/tabela | Cabeçalhos e relações semânticas, estados de filtro, seleção e paginação; preservar todos os campos necessários.                                |

Para conteúdo assíncrono, diferencie carregando, vazio, falhou e concluído. Um erro de rede não é acervo vazio. Reserve espaço de mídia quando conhecido; não exiba retângulos enormes de fotografia pendente. Sem resultado de filtro, ofereça caminho para mudar ou limpar a seleção.

Integre com o gerenciamento de estado e os contratos existentes. Não implemente validações paralelas que conflitam com o servidor. Em React/Angular/Next.js, mantenha as fronteiras e convenções já usadas; em HTML simples, não adicione framework para obter um botão acessível.
