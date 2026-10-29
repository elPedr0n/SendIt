# SendIt — Direções de estilo & brief de telas

Este arquivo guarda as "vibes" visuais do app e o brief usado para gerar as telas no [Sleek](https://sleek.design). Para trocar a vibe, copie outra direção para o lugar marcado no brief abaixo e gere de novo.

**Direção atual: Dark atlético**

---

## Direções de estilo

### 1. Dark atlético (atual)
Focado, enérgico e confiante, como um app de academia sério que ainda assim recompensa. A base é escura em tons de slate quase preto, com superfícies em camadas levemente mais claras para dar profundidade sem bordas. Um único acento verde emerald vivo marca toda ação primária e todo progresso (CTA, check, streak ativo). As patentes ganham uma paleta metálica própria (cobre, bronze, prata, ouro, platina, diamante azul-gelo, esmeralda e mestre em roxo/ônix), usada só nos badges e barras de tier, para que o metal signifique conquista. Tipografia sans-serif geométrica: números bold e condensados em tamanho grande (peso, reps, streak) e rótulos pequenos em caixa alta com tracking aberto. Layout em coluna única, com hierarquia forte: uma informação dominante por tela. Cards com cantos bem arredondados (~20px), sem sombras pesadas e separados por tom. Alvos de toque com no mínimo 56pt, steppers grandes de +/− no lugar do teclado e ações principais ao alcance do polegar, na parte de baixo da tela. Tab bar inferior simples com ícones de linha. Detalhes marcantes: uma chama no contador de streak que ganha intensidade com os dias, e um brilho metálico sutil (gradiente diagonal) nos badges de patente.

### 2. Game vibrante
Divertido, celebratório e motivador, no estilo dos apps de hábito gamificados. A base é clara e quente, com cores primárias saturadas por função: verde para concluir, laranja/vermelho para o streak, azul para progresso, e cada patente com uma cor forte e chapada. Tipografia arredondada e pesada (estilo Nunito/Baloo), com números enormes e microcopy brincalhão. Botões "3D" com sombra sólida embaixo, que afundam no toque; cards grandes com contorno grosso e cantos muito arredondados. Ilustrações chapadas e um mascote opcional em momentos de conquista. Barras de XP e progresso grossas e animadas. Detalhes marcantes: confete e um badge que "pula" no Level Up, e um calendário de streak com bolinhas que acendem.

### 3. Minimal claro
Calmo, preciso e premium, na linha do Apple Fitness/Health em modo claro. Fundo branco ou cinza muito claro, com cor reservada a acentos mínimos: um verde para progresso e os metais das patentes como único ornamento. Tipografia de sistema (SF/Inter) com contraste forte entre números grandes e leves e rótulos secundários em cinza. Muito espaço em branco e listas agrupadas no estilo dos Ajustes do iOS. Cards sem borda, sobre um fundo levemente diferente. Ícones finos de linha. Detalhes marcantes: anéis de progresso finos para a meta semanal, e patentes como medalhas discretas em relevo.

---

## Brief de telas (enviado ao Sleek)

> SendIt é um app mobile (iOS/Android, Expo + React Native) de rastreamento de treinos com gamificação. Foco: registrar um treino com o mínimo de toques, usando uma mão, no meio da academia. Idioma da interface: português do Brasil. Navegação por tab bar inferior com 4 abas: Hoje, Histórico, Patentes, Perfil.
>
> Telas:
> 1. **Onboarding**: criar perfil com nome, peso corporal (kg) e meta semanal de treinos (stepper de 1 a 7 dias, padrão 4).
> 2. **Hoje (home)**: contador de streak de dias consecutivos (ex.: 12 dias) em destaque; progresso da meta semanal (ex.: 3 de 4 treinos) com os 7 dias da semana marcados (treinou / descanso / vazio); CTA grande "Iniciar treino"; ações secundárias "Quick Log" e "Dia de descanso" (descanso programado protege o streak); preview da patente mais próxima de subir.
> 3. **Nova sessão**: escolher o tipo de atividade em um grid de botões grandes (Musculação, Escalada, Natação, Corrida, Outro).
> 4. **Registro de série** (tela mais importante): exercício atual (ex.: Supino reto); chip de sugestão "Última vez: 3×10 · 60 kg" que auto-preenche; steppers grandes de peso (±2,5 kg) e repetições (±1), sem teclado; botão "Salvar série" grande no rodapé; lista das séries já feitas na sessão, com badge "PR" quando bate recorde; trocar e adicionar exercício; cronômetro da sessão e botão "Finalizar".
> 5. **Quick Log** (bottom sheet): registrar a sessão inteira em segundos com tipo de atividade, duração (chips 30/45/60/90 min + ajuste) e intensidade RPE de 1 a 10 numa escala tocável; botão "Salvar".
> 6. **Exercícios**: catálogo agrupado por categoria (Peito, Costas, Pernas, Ombros, Braços, Escalada, Cardio) com busca; criar exercício customizado com nome, categoria e tipo de registro (Reps + peso / Tempo / Distância).
> 7. **Histórico**: timeline cronológica agrupada por dia com cards de sessão (tipo, duração, nº de séries, volume total, PRs); swipe para editar ou excluir, com confirmação de exclusão.
> 8. **Patentes**: patente por exercício composto (Supino, Agachamento, Levantamento Terra, Barra Fixa); cada card mostra o badge do tier atual, o 1RM estimado e uma barra de progresso até o próximo tier ("faltam 7,5 kg para Ouro"). Escala de tiers: Cobre → Bronze → Prata → Ouro → Platina → Diamante → Esmeralda → Mestre. Ao tocar, ver a tabela de faixas.
> 9. **Level Up**: overlay de celebração em tela cheia quando o usuário sobe de patente (ex.: "Prata → Ouro · Supino reto · 1RM 92 kg"), com o badge novo em destaque e botão "Continuar".
> 10. **Perfil**: nome, peso corporal, meta semanal editáveis; atalho para Exercícios.
>
> Restrições: componentes implementáveis em React Native (bottom sheets nativos, switches, sliders, listas); orientação retrato; alvos de toque grandes.
>
> **Estilo:** _[colar aqui uma das direções acima]_
