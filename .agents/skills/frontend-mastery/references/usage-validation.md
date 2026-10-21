# Uso, descoberta e validação

## Invocação

Abra o Codex no projeto que contém esta pasta. Exemplos de solicitações:

```text
$frontend-mastery init — mapeie a identidade e as convenções deste projeto.
$frontend-mastery audit — avalie a Home e o contato, sem modificar código.
$frontend-mastery critique — analise a composição da tela de cadastro.
$frontend-mastery polish — refine o cabeçalho mantendo a marca atual.
$frontend-mastery redesign — modernize somente a página de eventos.
$frontend-mastery distill — simplifique a navegação sem remover funções.
$frontend-mastery enrich — melhore a galeria vazia usando conteúdo real.
$frontend-mastery motion — dê feedback ao envio, respeitando movimento reduzido.
$frontend-mastery responsive — corrija o formulário no celular e no tablet.
$frontend-mastery design-system — evolua os tokens e variantes existentes.
$frontend-mastery build — implemente a página descrita neste briefing.
$frontend-mastery review — procure regressões no diff recente de front-end.
$frontend-mastery anti-ai — corrija composições genéricas da página de serviços.
```

Os modos são instruções em linguagem natural interpretadas pelo agente, não executáveis ou comandos `/audit` registrados. A seleção automática continua habilitada por padrão; `agents/openai.yaml` define nome, resumo e prompt de interface, sem exigir plugin ou ferramenta externa.

## Onde está instalada

Esta pasta em `.agents/skills/frontend-mastery` é uma skill local ao projeto. O [formato e a descoberta documentados pela OpenAI](https://learn.chatgpt.com/docs/build-skills) usam `SKILL.md` com `name` e `description`. O Codex examina `.agents/skills` no diretório de trabalho e nos níveis aplicáveis do repositório. Mudanças costumam ser detectadas automaticamente; se a skill não aparecer ao mencionar `$` ou em `/skills`, reinicie o Codex nesse projeto. A lista já injetada em uma conversa pode não refletir arquivos recém-criados.

Não é preciso editar `AGENTS.md` ou a configuração global para instalar aqui. A skill pode ser copiada integralmente para `.agents/skills` de outro projeto; não contém caminhos da máquina, cores de uma marca específica nem dependência do site onde foi criada. Instalação global seria uma ação separada.

## Validadores incluídos

Na raiz do projeto, com Node.js 18 ou superior:

```text
node .agents/skills/frontend-mastery/scripts/validate-skill.mjs
node --test .agents/skills/frontend-mastery/scripts/validate-skill.test.mjs
```

Também é possível executar `node <caminho>/scripts/validate-skill.mjs <pasta-da-skill>` de outro diretório. O validador só lê arquivos; o teste cria e remove suas próprias cópias temporárias no diretório temporário do sistema.

O script valida frontmatter, nome, descrição, metadados de interface, modo de invocação padrão, os 13 modos e caminhos locais das referências. Rejeita referências ausentes ou que escapem da pasta e marcadores de scaffold inacabados. Para não depender de pacotes, aceita um subconjunto explícito de YAML: mapas indentados com dois espaços, strings em aspas duplas compatíveis com JSON, identificadores simples e booleanos. Não é um parser YAML geral: se forem adicionados arrays, anchors ou blocos multilinha, use um parser YAML completo e evolua o validador, em vez de declarar esse YAML inválido pela especificação.

Quando houver Python e PyYAML no ambiente, execute também o `quick_validate.py` da skill oficial `skill-creator`, usando o caminho que realmente existir na instalação. Ele não é dependência de uso desta skill. A validação estrutural não mede a qualidade do design nem prova o cumprimento de todos os modos por um modelo.

## Cenários para avaliar comportamento

| Solicitação de ensaio                                           | Resultado observável esperado                                                             |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `audit` de uma página com erro de navegação e marca consistente | Achados fundamentados e priorizados; nenhum arquivo de código alterado                    |
| `enrich` sem fotografias ou dados publicados                    | Composição útil e compacta; nenhum registro ou depoimento inventado                       |
| `polish` de botão compartilhado com identidade existente        | Reuso de tokens e contrato de interação; consumidores afetados avaliados                  |
| `responsive` com títulos longos e tabela em 320 px              | Reorganização legível, sem esconder dados nem mascarar overflow globalmente               |
| `anti-ai` de dashboard onde cards organizam itens independentes | Preservar os cards úteis; corrigir problemas demonstráveis em vez de impor outro template |
| Implementação sem ferramenta de navegador                       | Checks disponíveis executados e limite de validação renderizada declarado                 |

Faça ensaios de escrita em cópia isolada, com dados sintéticos identificados. Compare os artefatos e as mudanças de arquivo; não dê aprovação automática só porque a resposta menciona palavras esperadas.

Inspiração de abordagem: [Impeccable](https://impeccable.style/). As instruções desta skill foram redigidas independentemente para este fluxo; não são uma cópia do produto nem exigem sua instalação.
