# Identidade visual oficial — Charanga de Irará

Reformulação aplicada em 21/10/2026 sobre a aplicação existente.

## Referência e preservação

A imagem fornecida apresenta composição circular, monograma CH, instrumentos de sopro, clave de sol e notas musicais, com tipografia tradicional em azul sobre branco. O contraste azul/branco e o caráter tipográfico orientam a interface. O redesign editorial removeu arcos e pautas decorativas fora da marca, abrindo espaço para conteúdo e fotografia.

O arquivo original foi copiado sem qualquer alteração para `frontend/public/brand/logo-charanga-original.jpeg`. Mantém os 640 × 640 pixels, o fundo branco, as proporções e todos os elementos gráficos. Não foram aplicados filtros, recoloração, vetorização, remoção de fundo ou redesenho.

SHA-256 da cópia, conferido com o arquivo fornecido:

```text
8d37e0316e8aa4b60de585ee871065edb79fff95e2e2b4721ce5c413597feba3
```

O favicon usa apenas o monograma CH: um SVG delimita e incorpora os pixels do JPEG original. As letras não foram reconstruídas com outra fonte. A imagem completa permanece intacta no projeto. Execute `npm run brand:assets` para reproduzir o favicon e o manifesto de origem a partir da cópia preservada.

## Cores e tokens

A amostragem agrupa os pixels azuis em intervalos de quatro níveis por canal RGB, filtrando branco e bordas neutras. O grupo predominante foi `#04006C`, adotado como azul principal. As variações presentes no JPEG refletem também antialiasing e compressão; o valor é uma referência prática extraída da imagem, não uma especificação de impressão da marca.

| Papel                 | Token                     | Cor       |
| --------------------- | ------------------------- | --------- |
| Azul institucional    | `--color-primary`         | `#04006C` |
| Azul profundo         | `--color-primary-dark`    | `#05054F` |
| Interação             | `--color-primary-hover`   | `#17138F` |
| Azul claro            | `--color-primary-light`   | `#EEEDF7` |
| Fundo secundário azul | `--color-primary-soft`    | `#F5F4FA` |
| Fundo principal       | `--color-background`      | `#FFFFFF` |
| Fundo neutro          | `--color-background-soft` | `#F5F5F2` |
| Texto                 | `--color-text`            | `#252B3A` |
| Texto secundário      | `--color-text-muted`      | `#5C6069` |

Todas as cores da interface estão centralizadas em `frontend/src/styles/tokens.css`, incluindo estados de sucesso e erro, bordas, foco, overlays e cores sobre fundo azul. Esse arquivo também define tipografia, pesos, tamanhos, espaçamentos, raios, sombras e transições. A integração `@theme inline` expõe os mesmos tokens ao Tailwind CSS 4.

`index.css` é o ponto único de importação de estilos. `base.css`, `public.css` e `admin.css` dividem responsabilidades sem uma camada posterior de overrides. O antigo `brand.css` e as regras sobrepostas foram removidos. Bordas de controles têm raio de 2 px; fotografias não recebem caixas arredondadas nem sombras. Sombra é reservada aos diálogos.

## Tipografia e aplicação

- **Playfair Display** nos títulos públicos, sem itálico obrigatório: personalidade institucional e proximidade com a tradição tipográfica da marca.
- **Manrope** nos textos, menus, formulários, tabelas e títulos administrativos: leitura confortável e operação clara.

As duas famílias são servidas localmente. Nenhuma fonte é usada para redesenhar as inscrições da logomarca.

`OfficialLogo.jsx` centraliza a apresentação da imagem no cabeçalho, rodapé, login e sidebar. A imagem possui uma superfície branca própria nos fundos azuis, sem inversão de cores. O cadastro existente de logomarca no painel continua funcionando e pode substituir a imagem padrão.

O destaque usa base branca, título em composição assimétrica e uma área ampla para a fotografia oficial cadastrada. Sem fotografia, o espaço é claramente identificado. O azul funciona como tinta nos títulos, linhas de organização, controles e rodapé. Não há imagens geradas ou fotografias genéricas apresentadas como documentação da Charanga.

Os textos padrão recebem revisão de apresentação em `config/brand.js` e `config/editorial.js`. Edições feitas no painel continuam sendo respeitadas. Nenhum dado existente foi sobrescrito para implementar a identidade. A direção e o diagnóstico do redesign estão em [REDESIGN-EDITORIAL.md](REDESIGN-EDITORIAL.md).

## Escopo e validação

Arquivos de interface alterados: layouts público e administrativo, páginas públicas, ponto de entrada de fontes, tema, estilos e metadados do navegador. Novos arquivos: tokens, aplicação do tema, componente de logo, composição institucional, configuração da marca, ativos originais e gerador de favicon. Rotas, contratos da API, autenticação, regras de negócio e schema do banco permanecem os mesmos.

A validação inclui build de produção, os 17 testes de integração existentes e testes de navegador em desktop e celular. O teste de identidade verifica integridade do arquivo, favicon, proporção da marca, presença no site e no painel, cabeçalho durante rolagem, acessibilidade no login e ausência de overflow nas seções administrativas. As capturas ficam em `test-results/identity`; estados com conteúdo exclusivamente de teste ficam em `test-results/populated`. Resultados em `VALIDACAO.md`.

O projeto não possui comando de lint configurado. A formatação dos arquivos modificados é verificada com Prettier.
