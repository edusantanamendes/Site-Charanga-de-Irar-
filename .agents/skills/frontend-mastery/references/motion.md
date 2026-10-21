# Movimento e feedback

Use quando uma transição melhorar a compreensão ou a resposta da interface.

Defina a função antes da animação: mostrar abertura, indicar pressão, conectar estados ou confirmar resultado. Se não conseguir nomear a função, mantenha o elemento estático. Não transforme toda a página em uma sequência de aparições.

CSS costuma resolver hover, foco, disclosure e pequenas mudanças de estado. Reuse as durações/easings existentes; aproximadamente 120–240 ms pode ser um ponto de partida para feedback curto, não uma obrigação. Não use `transition: all`; especifique propriedades e evite animar layout continuamente. Transform e opacity também exigem avaliação de custo quando há muitos elementos.

Mantenha controles disponíveis durante animações. Conteúdo não deve depender de scroll, hover ou IntersectionObserver para existir e ser acessível. Não bloqueie navegação até acabar uma entrada visual, nem deixe o usuário esperando um mínimo artificial de carregamento.

Em `prefers-reduced-motion: reduce`, retire movimentos amplos, parallax e animações não essenciais dos componentes alterados. Preserve o feedback por texto, cor e alteração imediata de estado. Verifique se código JS, timers e listeners também respeitam a preferência; desativar só o CSS pode ser insuficiente.

Menus e diálogos precisam de foco e estado sincronizados com o que está visível. Ao usar `transitionend`, forneça um caminho correto para duração zero e interrupção; sempre remova listeners/timers ao desmontar componentes.

Movimento contínuo, autoplay e efeitos grandes só cabem quando a tarefa os exige e os controles de pausa/redução apropriados estão presentes. Não instale uma biblioteca de animação se a stack atual já resolve a interação. Uma biblioteca existente pode ser usada proporcionalmente ao pedido, sem a substituir automaticamente.
