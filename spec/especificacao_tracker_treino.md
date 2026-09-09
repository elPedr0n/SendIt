# Especificação de Requisitos: Activity & Workout Habit Tracker

## 1. Visão Geral do Produto
Um aplicativo focado no registro de treinos e atividades físicas com o mínimo de atrito (menos toques possíveis). O objetivo central é manter a consistência através do rastreamento de sessões, cálculo automático de streaks e um sistema de gamificação de cargas (rankings), sem abrir mão de uma arquitetura limpa. A visualização aprofundada de dados será uma etapa futura, mantendo o foco inicial no controle e retenção do hábito.

---

## 2. Requisitos Funcionais (RF)

### 2.1. Gestão de Sessões & Atividades (O Core)
* **RF01 - Tipagem Flexível de Atividade:** Suportar treinos de força (musculação) e atividades baseadas em duração/sessão (como escalada indoor, natação ou corrida).
  * *Treino de Força:* Registro de exercício, séries, repetições e peso (kg).
  * *Treino de Resistência/Técnico:* Duração, intensidade percebida (RPE) ou métricas específicas da sessão (ex: grau de dificuldade).
* **RF02 - Cópia e Auto-preenchimento:** Ao adicionar um exercício a uma sessão atual, o sistema deve sugerir automaticamente as cargas e repetições da última execução (ex: "Última vez: 3x10 com 60kg").
* **RF03 - Registro Rápido (Quick Log):** Possibilidade de criar um registro consolidado da sessão em poucos segundos (ex: "Treino concluído, 45 min, RPE 7"), para dias em que o usuário não quiser detalhar série por série.
* **RF04 - Gestão de Exercícios Customizados:** Permitir a criação de exercícios próprios, vinculando-os a grupos musculares ou categorias.

### 2.2. Gamificação de Cargas (Sistema de Ranking)
* **RF05 - Níveis de Progressão de Força:** Implementar um sistema de patentes (rankings) para acompanhar a progressão de carga em exercícios compostos principais (ex: Supino, Agachamento, Terra, Barra Fixa).
* **RF06 - Estrutura de Tiers:** A classificação do usuário por exercício deve seguir a escala progressiva:
  1. Cobre
  2. Bronze
  3. Prata
  4. Ouro
  5. Platina
  6. Diamante
  7. Esmeralda
  8. Mestre / Lenda
* **RF07 - Gatilhos de Promoção (Level Up):** A subida de ranking pode ser baseada no cálculo de 1RM (Repetição Máxima Estimada) ou no coeficiente de força relativa (Carga Levantada ÷ Peso Corporal do Usuário). Ao bater a meta da próxima patente, o sistema emite um alerta de "Level Up".

### 2.3. Consistência & Streaks
* **RF08 - Cálculo de Streaks Dinâmico:** Monitoramento de dias consecutivos de atividade (Daily Streak).
* **RF09 - Metas Semanais Flexíveis:** Permite definir um alvo (ex: 4 dias/semana). Se a meta semanal for atingida, a sequência visual não é quebrada.
* **RF10 - Trava de Consistência (Rest Days):** Opção de registrar "Dias de Descanso" programados para proteger o streak e recompensar a recuperação.

### 2.4. Histórico e Retenção
* **RF11 - Log de Atividades (Timeline):** Uma visão cronológica simples de todos os treinos registrados, permitindo edição e exclusão de logs passados.

---

## 3. Requisitos Não Funcionais (RNF)

* **RNF01 - Stack e Arquitetura API:** A camada de backend deve ser estruturada como uma API RESTful utilizando Node.js com Express e TypeScript, facilitando os testes de rotas locais (via Postman) e futuras expansões.
* **RNF02 - Containerização:** O ambiente de banco de dados e a aplicação devem ser orquestrados via Docker e Docker Compose, garantindo que o setup local de desenvolvimento seja instantâneo.
* **RNF03 - Baixa Latência (Mobile-first):** O design da interface do usuário (mesmo que inicialmente web) deve ter componentes grandes e fáceis de tocar durante o treino, minimizando o uso do teclado do celular.
* **RNF04 - Banco de Dados Relacional:** Utilização de PostgreSQL ou SQLite para garantir integridade estrutural e relacional entre `Usuários`, `Sessões` e `Séries`.

---

## 4. Estrutura Base de Dados (Visão Lógica)

1. **User:**
   * id, name, bodyweight_kg, current_streak, weekly_goal
2. **Workout_Session:**
   * id, user_id, date, activity_type (ex: Musculação, Escalada), duration_min, notes
3. **Exercise_Dict:**
   * id, name, category, tracking_type (reps_weight, time, distance)
4. **Workout_Set:**
   * id, session_id, exercise_id, reps, weight_kg, is_pr (Personal Record)
5. **User_Rankings:**
   * user_id, exercise_id, current_1rm, current_tier (ex: "Ouro"), date_achieved
