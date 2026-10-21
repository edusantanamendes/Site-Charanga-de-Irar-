---
name: frontend-mastery
description: "Skill especializada em criação, auditoria, modernização e refinamento de interfaces front-end, com foco em UI/UX profissional, identidade visual, responsividade, acessibilidade, design systems e eliminação de padrões visuais genéricos de IA."
---

# Frontend Mastery

Projete para o produto, a marca e a tarefa da pessoa. Entregue decisões justificadas e código funcional, com densidade intencional e acabamento consistente. Use esta skill para trabalho em interfaces web; um problema exclusivo de backend não exige seu fluxo visual.

## Selecione o modo e delimite o escopo

`$frontend-mastery <modo> <página, componente ou objetivo>` é uma solicitação em linguagem natural, não um comando de terminal. Não há instalação de slash commands separados.

Respeite o modo explícito. Sem modo, infira pela solicitação: diagnóstico → `audit`; ajustes de acabamento → `polish`; página vazia → `enrich`; excesso visual → `distill`; interface nova → `build`. Uma invocação sem objetivo inicia `init`, sem redesenhar a aplicação. Se o usuário pedir auditoria seguida de correções, conclua o diagnóstico antes da fase de implementação já autorizada.

| Modo            | Trabalho e resultado esperado                                                                                                                                                                                 | Escrita permitida pelo modo                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `init`          | Mapear stack, objetivos, público, identidade, componentes, estilos, rotas e comandos disponíveis. Registrar fatos, fontes e lacunas em `docs/frontend-mastery/context.md`, ou no local equivalente existente. | Documentação de contexto; preservar material existente.                     |
| `audit`         | Diagnosticar UX, identidade, composição, tipografia, responsividade, acessibilidade e componentes. Classificar severidade, alcance e impacto, com evidência e correção proposta.                              | Sem modificar código; relatório no chat, ou arquivo se solicitado.          |
| `critique`      | Explicar o que funciona e o que falha na experiência renderizada; justificar mudanças concretas de direção e composição.                                                                                      | Análise, sem implementar alterações.                                        |
| `polish`        | Corrigir alinhamentos, espaçamentos, quebras, hierarquia e estados, mantendo a composição reconhecível.                                                                                                       | Front-end dentro do escopo.                                                 |
| `redesign`      | Reorganizar significativamente a página ou componente escolhido, preservando marca, conteúdo e funcionalidades.                                                                                               | Somente a superfície solicitada e seus componentes necessários.             |
| `distill`       | Reduzir redundância e decoração; simplificar a hierarquia sem esconder ações, dados ou explicações úteis.                                                                                                     | Front-end dentro do escopo.                                                 |
| `enrich`        | Corrigir pobreza visual com conteúdo real, melhor composição, imagens disponíveis e ritmo.                                                                                                                    | Front-end; não inventar provas sociais, números ou registros.               |
| `motion`        | Implementar microinterações que explicam mudanças de estado, com alternativa de movimento reduzido.                                                                                                           | Interações solicitadas e estilos associados.                                |
| `responsive`    | Identificar e corrigir falhas em telas pequenas, intermediárias e grandes; reorganizar a experiência.                                                                                                         | Layout e comportamento responsivos no escopo.                               |
| `design-system` | Inventariar e evoluir tokens, variantes, componentes, estados e documentação existentes; criar apenas o necessário.                                                                                           | Sistema visual no escopo e consumidores necessários, sem migração de stack. |
| `build`         | Planejar brevemente e implementar uma interface completa conforme os requisitos e dados disponíveis.                                                                                                          | Front-end autorizado; integrar contratos existentes.                        |
| `review`        | Revisar alterações recentes e apontar regressões visuais, funcionais e de acessibilidade por arquivo. Sem diff disponível, explicitar a base da revisão.                                                      | Análise; corrigir somente se isso também tiver sido solicitado.             |
| `anti-ai`       | Identificar e corrigir escolhas genéricas que não servem ao contexto da marca; preservar padrões úteis.                                                                                                       | Front-end dentro do escopo.                                                 |

Modos descrevem a tarefa, não ampliam sua autorização. Uma revisão de componente não autoriza uma reformulação de todas as páginas que o usam. Se houver repercussão compartilhada, avalie esses consumidores e limite a mudança ou descreva o impacto necessário.

## Fluxo de implementação

1. **Analisar.** Leia as instruções aplicáveis do repositório. Identifique stack, convenções, dependências, componentes, sistema de estilos, ativos e dados reais. HTML/CSS/JS, TypeScript, React, Angular, Next.js, Tailwind, Bootstrap e outras stacks devem manter suas convenções. Reutilize contexto existente, verificando se continua verdadeiro.
2. **Diagnosticar.** Inspecione a interface renderizada quando possível. Diferencie problema observado, inferência do código e informação indisponível. Identifique o fluxo principal e a razão do desconforto visual; não trate pouco conteúdo como convite automático a adicionar cards.
3. **Planejar.** Declare em poucas frases a direção visual, o conteúdo/ação em destaque e os arquivos ou superfícies abrangidos. Para uma mudança pequena, uma frase basta. Escolha referências abaixo conforme a decisão real; não carregue todas por padrão.
4. **Implementar.** Edite os arquivos reais, usando tokens e componentes existentes. Preserve contratos, eventos, validações, rotas, estado e semântica. Corrija a causa no layout antes de acumular exceções de CSS. Construa estados de carregamento, ausência de dados, erro e sucesso pertinentes ao fluxo.
5. **Validar.** Leia os scripts e instruções do projeto; execute os checks aplicáveis já disponíveis, como lint, typecheck, testes e build. Não invente comandos nem instale ferramentas só para alegar cobertura. Use dados de teste isolados. Em navegador disponível, verifique conteúdo, teclado, foco, menus, formulários e viewports relevantes.
6. **Refinar.** Corrija falhas observadas. Reexecute os checks afetados quando houver mudança; não repita suites sem uma razão. Compare capturas na mesma largura e estado de dados quando isso ajudar a verificar a proposta.
7. **Relatar.** Informe mudanças, arquivos, comandos e resultados reais, limites restantes e o caminho para ver a interface. Diferencie análise estática de teste renderizado; ausência de erros automáticos não certifica acessibilidade completa.

Nos modos somente de análise, execute as etapas de leitura e diagnóstico e entregue o relatório; não aplique a etapa de implementação. Com informação essencial ausente, faça primeiro o trabalho independente e pergunte apenas o que bloqueia a decisão.

## Leia a referência ligada à decisão

| Quando precisar decidir                                           | Referência                                              |
| ----------------------------------------------------------------- | ------------------------------------------------------- |
| Objetivo, prioridade, conteúdo e composição geral                 | [design-principles.md](references/design-principles.md) |
| O que preservar da marca e como registrar a direção               | [visual-identity.md](references/visual-identity.md)     |
| Fontes, pesos, tamanhos e quebras                                 | [typography.md](references/typography.md)               |
| Papéis de cor, superfícies e contraste                            | [colors.md](references/colors.md)                       |
| Grid, densidade, alinhamento e ritmo                              | [layout-spacing.md](references/layout-spacing.md)       |
| Tokens, componentes, formulários e estados                        | [components.md](references/components.md)               |
| Reorganização entre tamanhos de tela                              | [responsiveness.md](references/responsiveness.md)       |
| Transições e feedback de estado                                   | [motion.md](references/motion.md)                       |
| Teclado, semântica, foco e critérios de acessibilidade            | [accessibility.md](references/accessibility.md)         |
| Diagnóstico contextual de padrões genéricos                       | [anti-ai-design.md](references/anti-ai-design.md)       |
| Evidência de conclusão e severidade de achados                    | [quality-checklist.md](references/quality-checklist.md) |
| Invocação, descoberta, portabilidade e validação da própria skill | [usage-validation.md](references/usage-validation.md)   |

Para `audit` e `review`, comece por qualidade e consulte os domínios dos achados. Para `critique`, comece por princípios e identidade. Para `anti-ai`, leia a referência específica antes de propor substituições. Não transforme todas as tarefas em uma auditoria extensa.

## Preserve o projeto

- Mantenha identidade, logotipo, conteúdo confirmado e funcionalidades. Não substitua a marca sem pedido explícito; evolua um design system existente.
- Em tarefas visuais, preserve backend, APIs, autenticação e banco. Uma dependência de backend deve ser descrita, não resolvida por mudança de contrato ou por dados fictícios.
- Não migre stack nem instale bibliotecas sem necessidade justificada e autorização. CSS costuma bastar para microinterações. Não acrescente frameworks para reproduzir componentes já disponíveis.
- Não altere páginas fora do escopo nem reescreva componentes funcionais sem motivo demonstrável. Proteja personalizações, uploads e relações entre dados e interface.
- Use imagens oficiais, fornecidas ou de procedência adequada ao pedido. Não apresente imagens aleatórias como registros reais; projete a ausência de acervo com conteúdo honesto e tamanho proporcional.
- Não invente números, depoimentos, conquistas, contatos, integrantes ou eventos. Registre lacunas sem expor mensagens de implementação como conteúdo principal do produto.
- Não faça commits, publique, altere credenciais ou configurações de produção automaticamente. A invocação da skill não autoriza essas ações.

## Critério de acabamento

Cada destaque deve ajudar a compreender conteúdo, navegar ou reconhecer a marca. Não use uma lista estética como proibição universal: cards, fontes sem serifa, gradientes e simetria podem ser a escolha correta. Exija uma razão contextual e verifique a experiência funcionando.

Esta é uma implementação independente, inspirada na abordagem contextual da [Impeccable](https://impeccable.style/). Não requer esse produto nem contém seus comandos ou um detector de autoria por IA.
