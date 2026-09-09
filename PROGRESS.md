# SendIt — Tracker de Progresso

Documento de acompanhamento do desenvolvimento. Cada sprint agrupa funcionalidades relacionadas e segue uma ordem de dependência lógica: infraestrutura primeiro, depois o core do domínio, e por fim as camadas de gamificação e UX avançada.

Legenda: `[ ]` pendente · `[/]` em andamento · `[x]` concluído

---

## Sprint 0 — Infraestrutura & Setup Inicial

Objetivo: ter o ambiente de desenvolvimento funcional e a base do projeto estruturada.

- [ ] Inicializar repositório com estrutura de pastas (`/backend`, `/mobile`, `/spec`, `/docs`)
- [ ] Configurar `docker-compose.yml` com container PostgreSQL
- [ ] Criar projeto Node.js + Express + TypeScript no `/backend`
- [ ] Configurar Prisma ORM e conectar ao PostgreSQL
- [ ] Definir o schema Prisma com as tabelas: `User`, `Workout_Session`, `Exercise_Dict`, `Workout_Set`, `User_Rankings`
- [ ] Executar migrations iniciais e validar o banco
- [ ] Criar projeto Expo (React Native + TypeScript) no `/mobile`
- [ ] Configurar NativeWind (TailwindCSS) no projeto mobile
- [ ] Configurar TanStack Query no projeto mobile
- [ ] Documentar o processo de setup local no README

---

## Sprint 1 — CRUD de Usuário & Exercícios

Objetivo: endpoints e telas básicas para gestão de usuários e catálogo de exercícios.

### Backend
- [ ] **RF04** — Endpoint `POST /users` (criação de usuário com `name`, `bodyweight_kg`, `weekly_goal`)
- [ ] **RF04** — Endpoint `GET /users/:id` (consulta de perfil)
- [ ] **RF04** — Endpoint `PATCH /users/:id` (atualização de peso corporal e meta semanal)
- [ ] **RF04** — Endpoint `POST /exercises` (criar exercício customizado com `name`, `category`, `tracking_type`)
- [ ] **RF04** — Endpoint `GET /exercises` (listar catálogo de exercícios)
- [ ] Seed inicial com exercícios compostos padrão (Supino, Agachamento, Terra, Barra Fixa)

### Mobile
- [ ] Tela de onboarding / criação de perfil
- [ ] Tela de listagem e criação de exercícios customizados

---

## Sprint 2 — Registro de Sessões & Séries (Core)

Objetivo: implementar o fluxo principal de uso — registrar um treino com séries detalhadas ou via Quick Log.

### Backend
- [ ] **RF01** — Endpoint `POST /workouts` (criar sessão com `activity_type`, `duration_min`, `notes`)
- [ ] **RF01** — Endpoint `POST /workouts/:id/sets` (adicionar série com `exercise_id`, `reps`, `weight_kg`)
- [ ] **RF02** — Endpoint `GET /exercises/:id/last-set` (retornar última execução para auto-preenchimento)
- [ ] **RF03** — Endpoint `POST /workouts/quick-log` (registro consolidado: duração + RPE)
- [ ] **RF01** — Endpoint `GET /workouts/:id` (detalhe de uma sessão com séries)
- [ ] Lógica de cálculo de 1RM estimado (fórmula de Epley ou Brzycki)
- [ ] Detecção automática de PR (`is_pr`) ao inserir nova série

### Mobile
- [ ] Tela de nova sessão de treino (seleção de tipo de atividade)
- [ ] Componente de registro de série (campos grandes, toque fácil)
- [ ] **RF02** — Exibir sugestão de carga/reps da última execução ao selecionar exercício
- [ ] **RF03** — Tela/modal de Quick Log
- [ ] Integração com `expo-haptics` para feedback ao salvar série
- [ ] Persistência local com Expo SQLite (cache offline)
- [ ] Sincronização via TanStack Query ao recuperar conexão

---

## Sprint 3 — Histórico & Timeline

Objetivo: permitir que o usuário visualize, edite e exclua treinos passados.

### Backend
- [ ] **RF11** — Endpoint `GET /workouts` (listagem cronológica paginada, filtros por data e tipo)
- [ ] **RF11** — Endpoint `PATCH /workouts/:id` (editar sessão)
- [ ] **RF11** — Endpoint `DELETE /workouts/:id` (excluir sessão e séries associadas)
- [ ] **RF11** — Endpoint `PATCH /workouts/:id/sets/:setId` (editar série)
- [ ] **RF11** — Endpoint `DELETE /workouts/:id/sets/:setId` (excluir série)

### Mobile
- [ ] **RF11** — Tela de timeline / log de atividades
- [ ] Componente de card de sessão (resumo visual)
- [ ] Funcionalidade de edição inline de sessões e séries
- [ ] Confirmação de exclusão com feedback visual

---

## Sprint 4 — Streaks & Metas Semanais

Objetivo: implementar o sistema de consistência que mantém o usuário engajado.

### Backend
- [ ] **RF08** — Lógica de cálculo de streak diário (dias consecutivos com atividade registrada)
- [ ] **RF09** — Lógica de meta semanal flexível (ex: 4 dias/semana sem quebrar streak visual)
- [ ] **RF10** — Endpoint `POST /rest-days` (registrar dia de descanso programado)
- [ ] **RF10** — Lógica de proteção de streak em dias de descanso
- [ ] Endpoint `GET /users/:id/streak` (retornar streak atual, meta semanal e status)

### Mobile
- [ ] Componente visual de streak (contador + indicador de sequência)
- [ ] Indicador de progresso da meta semanal
- [ ] **RF10** — Botão de registro de dia de descanso
- [ ] Feedback háptico ao completar meta semanal ou manter streak

---

## Sprint 5 — Sistema de Rankings (Gamificação)

Objetivo: implementar as patentes de progressão de força e os alertas de Level Up.

### Backend
- [ ] **RF05/RF06** — Definir tabela de faixas de 1RM (ou coeficiente relativo) para cada tier por exercício
- [ ] **RF07** — Lógica de avaliação de tier após cada nova série (comparar 1RM atual com faixas)
- [ ] **RF07** — Trigger de promoção: atualizar `User_Rankings` e retornar `level_up: true`
- [ ] Endpoint `GET /users/:id/rankings` (listar patentes atuais por exercício)
- [ ] Endpoint `GET /rankings/tiers` (consultar tabela de faixas e requisitos)

### Mobile
- [ ] Tela de perfil com patentes por exercício (badges visuais)
- [ ] Animação de "Level Up" ao subir de tier
- [ ] Feedback háptico diferenciado para promoção de ranking
- [ ] Componente de progresso até o próximo tier (barra de progresso)

---

## Sprint 6 — Polimento, Testes & Preparação para Deploy

Objetivo: estabilizar o produto, cobrir cenários de erro e preparar a entrega.

- [ ] Testes unitários para lógicas de negócio (1RM, streaks, rankings)
- [ ] Testes de integração nos endpoints da API
- [ ] Tratamento de erros e validação de entrada em todas as rotas (ex: Zod)
- [ ] Loading states e tratamento de erros no mobile
- [ ] Revisão de acessibilidade e responsividade dos componentes
- [ ] Testes manuais do fluxo offline → online (sincronização)
- [ ] Documentação da API (Swagger / OpenAPI)
- [ ] Configuração de variáveis de ambiente e build de produção
- [ ] Deploy do backend (Railway, Render ou similar)
- [ ] Build do app mobile (EAS Build)

---

## Backlog Futuro (Pós-MVP)

Funcionalidades planejadas para versões futuras, fora do escopo inicial:

- [ ] Dashboard com visualização de dados (gráficos de volume, progressão de carga ao longo do tempo)
- [ ] Comparação de desempenho entre períodos
- [ ] Notificações push para lembrete de treino
- [ ] Templates de treino (montar e reutilizar rotinas pré-definidas)
- [ ] Compartilhamento social de conquistas e rankings
- [ ] Autenticação com OAuth (Google, Apple)
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] Modo escuro / temas customizáveis

