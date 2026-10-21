# Tipografia

Use quando legibilidade, hierarquia ou personalidade dependerem do texto.

- Inspecione famílias, licenças, arquivos e pesos realmente carregados antes de alterar CSS. Um `font-weight` ou itálico declarado não garante a existência da variante. Reutilize fontes adequadas já disponíveis; não escolha uma nova família só por popularidade.
- Defina papéis: título de página, título de seção, subtítulo, corpo, dado e legenda. Não precisa haver um tamanho distinto para cada elemento. Escalas devem sobreviver a títulos longos e textos editáveis.
- Preserve caráter da marca com peso, largura de leitura, ritmo e contraste entre papéis. Uma fonte expressiva em todos os controles pode prejudicar a operação; uma boa família única pode resolver um produto inteiro.
- Use unidades relativas e crescimento limitado, por exemplo `clamp(2rem, 1.4rem + 2vw, 3.5rem)`. O termo em `rem` ajuda a preservar ampliação, mas o comportamento com zoom ainda deve ser testado. Valores são exemplos, não uma escala obrigatória.
- Para leitura, comece testando largura de aproximadamente 45–75 caracteres e entrelinha de 1,5–1,8; ajuste à família, idioma e densidade. Títulos aceitam entrelinha menor enquanto acentos e linhas não colidirem.
- Prefira quebras naturais e `text-wrap: balance` como melhoria progressiva em títulos compatíveis. Evite `<br>` editorial que destrói a leitura no celular. Não aplique `word-break: break-all` no texto corrido para encobrir overflow.
- Use `min-width: 0` em filhos flex/grid e quebra localizada de strings longas. Não reduza toda a interface para acomodar um rótulo.
- Carregue somente variantes usadas, preserve fallback e observe deslocamento de layout. Auto-hospedagem depende dos direitos de uso; não baixe fontes ou adicione serviços sem necessidade.

Valide título longo, acentos, números, conteúdo personalizado, zoom e estado de carregamento das fontes. Medir o tamanho do texto sem avaliar o resultado renderizado não resolve a hierarquia.
