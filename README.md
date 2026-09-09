# SendIt — Activity & Workout Habit Tracker

SendIt é um aplicativo de rastreamento de treinos e atividades físicas projetado para registro com o mínimo de atrito possível. O foco principal está na consistência do hábito através de streaks, gamificação de progressão de cargas (sistema de rankings por patentes) e um fluxo de uso rápido, pensado para ser operado com uma mão durante a sessão de treino.

---

## Motivação

A maioria dos apps de treino exige muitos toques (e dinheiros) para registrar uma simples série. O SendIt inverte essa lógica: o registro deve ser quase instantâneo, com sugestões automáticas de carga baseadas no histórico e a possibilidade de um "Quick Log" que consolida a sessão inteira em segundos. A visualização aprofundada de dados é uma etapa futura — o foco inicial é **controle e retenção do hábito**.

---

## Funcionalidades Principais

### Gestão de Sessões & Atividades
- Suporte a treinos de força (séries, repetições, peso) e atividades de duração/sessão (escalada, natação, corrida).
- Auto-preenchimento de cargas e repetições com base na última execução do exercício.
- Quick Log para registro consolidado em poucos segundos (duração + RPE).
- Criação de exercícios customizados vinculados a grupos musculares.

### Sistema de Rankings (Gamificação)
- Patentes progressivas por exercício composto: Cobre, Bronze, Prata, Ouro, Platina, Diamante, Esmeralda, Mestre/Lenda.
- Promoção baseada em 1RM estimado ou coeficiente de força relativa (carga / peso corporal).
- Alertas de "Level Up" ao atingir a faixa da próxima patente.

### Streaks & Consistência
- Streak diário com rastreamento de dias consecutivos de atividade.
- Metas semanais flexíveis (ex: 4 dias/semana) que protegem a sequência visual.
- Registro de dias de descanso programados para preservar o streak.

### Histórico
- Timeline cronológica de todos os treinos registrados, com edição e exclusão de logs passados.

---

## Arquitetura & Stack

```
┌──────────────────────────────────────────────────────────┐
│                     FRONTEND MOBILE                      │
│  React Native (Expo Managed) + NativeWind + TypeScript   │
│  TanStack Query + Expo SQLite (cache offline)            │
│  expo-haptics (feedback tátil)                           │
└────────────────────────┬─────────────────────────────────┘
                         │  REST API (JSON)
┌────────────────────────▼─────────────────────────────────┐
│                        BACKEND                           │
│  Node.js + Express + TypeScript                          │
│  Rotas modularizadas: /workouts, /users, /rankings       │
│  Prisma ORM (ou Drizzle)                                 │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│                    BANCO DE DADOS                         │
│  PostgreSQL (Docker)                                     │
│  Tabelas: User, Workout_Session, Exercise_Dict,          │
│           Workout_Set, User_Rankings                      │
└──────────────────────────────────────────────────────────┘
```

### Decisões Técnicas Relevantes

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Mobile | React Native + Expo | Desenvolvimento cross-platform (iOS/Android) com TypeScript. Teste via QR Code no dispositivo real. |
| Estilização | NativeWind (TailwindCSS) | Componentes grandes e de fácil toque; código limpo com classes utilitárias. |
| Estado & Offline | TanStack Query + Expo SQLite | Cache inteligente + persistência local. Sincroniza com o backend ao recuperar conexão. |
| Backend | Node.js + Express + TypeScript | API RESTful ágil, tipagem compartilhada com o frontend. |
| ORM | Prisma | Client TypeScript auto-gerado a partir do schema, com autocompletar e validação em tempo de compilação. |
| Banco | PostgreSQL | Integridade relacional forte, ideal para queries analíticas futuras. |
| Infra local | Docker + Docker Compose | Setup de desenvolvimento instantâneo com `docker-compose up`. |

---

## Modelo de Dados

```
User
├── id, name, bodyweight_kg, current_streak, weekly_goal

Workout_Session
├── id, user_id (FK → User), date, activity_type, duration_min, notes

Exercise_Dict
├── id, name, category, tracking_type (reps_weight | time | distance)

Workout_Set
├── id, session_id (FK → Workout_Session), exercise_id (FK → Exercise_Dict)
├── reps, weight_kg, is_pr

User_Rankings
├── user_id (FK → User), exercise_id (FK → Exercise_Dict)
├── current_1rm, current_tier, date_achieved
```

---

## Fluxo de Dados (Quick Log)

1. Usuário registra a carga e toca em "Salvar Série" no app React Native.
2. TanStack Query persiste no Expo SQLite local e aciona feedback háptico.
3. App envia POST para a API Express.
4. Backend valida os dados com TypeScript e persiste no PostgreSQL via Prisma.
5. API calcula o novo 1RM. Se atingir a faixa da próxima patente, retorna `level_up: true`.
6. Frontend recebe a resposta e dispara animação de promoção.

---

## Pré-requisitos

- Node.js (>= 18)
- Docker e Docker Compose
- Expo CLI (`npx expo`)
- Dispositivo móvel com Expo Go (para testes) ou emulador Android/iOS

## Instalação e Execução

```bash
# Clonar o repositório
git clone https://github.com/elPedr0n/SendIt.git
cd SendIt

# Subir o banco de dados e backend
docker-compose up -d

# Instalar dependências do backend
cd backend && npm install

# Instalar dependências do frontend
cd ../mobile && npm install

# Iniciar o app mobile
npx expo start
```

> Os comandos acima assumem a estrutura de diretórios que será criada durante a implementação. Consulte a documentação de cada módulo conforme o projeto avança.

---

## Licença

A definir.
