# Frontend Mastery — criação e validação

Criada em 21/10/2026 como skill local do projeto, em `.agents/skills/frontend-mastery`. A tarefa ficou restrita à criação da capacidade reutilizável; nenhum redesign adicional foi executado.

## Entrega

```text
.agents/skills/frontend-mastery/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── design-principles.md
│   ├── visual-identity.md
│   ├── typography.md
│   ├── colors.md
│   ├── layout-spacing.md
│   ├── components.md
│   ├── responsiveness.md
│   ├── motion.md
│   ├── accessibility.md
│   ├── anti-ai-design.md
│   ├── quality-checklist.md
│   └── usage-validation.md
└── scripts/
    ├── validate-skill.mjs
    └── validate-skill.test.mjs
```

São 16 arquivos: instruções centrais, metadados de interface, 12 referências e dois scripts. A skill não depende da aplicação, de bibliotecas npm, da Impeccable ou de ferramentas específicas de navegador. Os validadores incluídos requerem Node.js 18+; a instalação foi verificada com Node.js 22.21.0.

Os 13 modos estão documentados com resultado e limite de escrita: `init`, `audit`, `critique`, `polish`, `redesign`, `distill`, `enrich`, `motion`, `responsive`, `design-system`, `build`, `review` e `anti-ai`. Auditoria, crítica e revisão não autorizam alterações de código. As referências são selecionadas conforme a decisão, sem carregar todo o material em cada tarefa.

## Verificações executadas

| Verificação                                                                        | Resultado                                                                   |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `node .agents/skills/frontend-mastery/scripts/validate-skill.mjs`                  | Aprovado: 13 modos, 12 referências e 12 links locais                        |
| `node --test .agents/skills/frontend-mastery/scripts/validate-skill.test.mjs`      | 10 testes aprovados; zero falhas                                            |
| Prettier em todos os arquivos da skill                                             | Aprovado                                                                    |
| Catálogo nativo do Codex, `skills/list` com `forceReload: true`                    | Encontrou `frontend-mastery`, habilitada, escopo `repo`, sem erros da skill |
| Leitura de `agents/openai.yaml` pelo Codex                                         | Nome, descrição curta e prompt com `$frontend-mastery` reconhecidos         |
| Comparação SHA-256 de 45 arquivos em `frontend/src`, `frontend/public` e `backend` | Nenhum arquivo alterado, adicionado ou removido nessas áreas                |

Os testes cobrem o pacote íntegro e falhas deliberadas em cópias temporárias: nome incorreto, descrição ausente, referência inexistente, caminho que escapa da pasta, modo ausente, prompt sem invocação, tipo de metadado incorreto, YAML ambíguo e scaffold inacabado. O teste também diferencia um exemplo de scaffold dentro de bloco de código. As cópias são removidas somente após conferir o caminho do diretório temporário criado pelo próprio teste.

O carregamento real foi consultado via protocolo do executável instalado `codex-cli 0.162.0-alpha.17.2`, usando apenas `initialize`, `initialized` e `skills/list`. Não foi iniciado um turno de modelo nem alterada a configuração global. O retorno filtrado foi:

```json
{
  "discovered": true,
  "name": "frontend-mastery",
  "scope": "repo",
  "enabled": true,
  "errors": []
}
```

O script da consulta, o schema gerado pelo CLI e o resultado completo filtrado para esta skill ficam em `test-results/frontend-mastery`, área local de evidências. O teste inicial de descoberta dentro do sandbox falhou; a repetição com permissão de execução apropriada retornou o resultado acima. A formatação dos arquivos em `.agents` também exigiu a permissão de escrita apropriada para a pasta protegida.

## Limites verificados e uso

Python, `python3` e o launcher `py` não estão disponíveis no PATH deste ambiente. Por isso o inicializador e `quick_validate.py` da skill oficial `skill-creator` não foram executados. A criação manual segue o formato oficial; o validador Node e o parser nativo do Codex validaram os manifestos efetivamente entregues. Não foi instalado outro runtime nem adicionada dependência à aplicação.

O parser do validador Node aceita o subconjunto de YAML usado nestes arquivos, sem dependências; não é um parser YAML completo. Seus testes e a descoberta nativa comprovam estrutura, metadados e carregamento. Não comprovam a qualidade de todas as futuras decisões visuais nem a execução comportamental dos 13 modos por um modelo. Há cenários de ensaio documentados em `references/usage-validation.md`; nenhum deles foi apresentado como teste de modelo executado.

Para usar no projeto:

```text
$frontend-mastery audit — avalie a Home sem alterar código.
$frontend-mastery polish — refine o cabeçalho mantendo a identidade atual.
$frontend-mastery enrich — melhore a composição sem inventar conteúdo.
```

A descoberta nativa já foi confirmada. A lista de skills injetada nesta conversa pode ainda ser a anterior à criação. Se a skill não aparecer ao mencionar `$` ou em `/skills`, reinicie o Codex neste projeto, conforme a [documentação oficial de skills](https://learn.chatgpt.com/docs/build-skills). Para outro projeto, copie integralmente a pasta para sua `.agents/skills`; não foi realizada instalação global.

## Fontes consultadas

- Skill oficial local `skill-creator`, incluindo `references/openai_yaml.md` e o código do validador oficial.
- [OpenAI — formato, descoberta e metadados de skills](https://learn.chatgpt.com/docs/build-skills).
- [Impeccable — abordagem de design contextual](https://impeccable.style/). Inspiração de filosofia, com instruções redigidas independentemente.
- [W3C — contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) e [tamanho mínimo de alvo](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
