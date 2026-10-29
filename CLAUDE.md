# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

SendIt é um habit tracker de treinos com gamificação (patentes de força por exercício + streaks). Monorepo com dois projetos npm independentes, sem workspace na raiz:

- `backend/` — API REST em Node.js + Express + TypeScript, Prisma ORM, PostgreSQL (Docker).
- `mobile/` — app React Native com Expo (managed workflow), NativeWind, TanStack Query, expo-sqlite, expo-haptics.

Toda a documentação do projeto e as mensagens de commit são em português.

## Comandos

Banco (na raiz): `docker compose up -d` (nesta máquina, Compose v1: `docker-compose up -d`) sobe o PostgreSQL 16 em `localhost:5432` (usuário/senha `postgres`, banco `sendit_db`). `docker compose stop` para.

Backend (`cd backend`, requer `backend/.env` — copiar de `.env.example`):
- `npm run dev` — API com hot-reload via `tsx watch` em `http://localhost:3001`
- `GET /health` — confirma a conexão com o banco (`database: "connected"`)
- `npm run build` / `npm start` — compila para `dist/` e roda o build
- `npm run prisma:migrate` — cria/aplica migrations após mudar `prisma/schema.prisma`
- `npm run db:seed` — catálogo padrão de exercícios (`prisma/seed.ts`, upsert por nome — idempotente)
- `npm run prisma:generate` / `npm run prisma:studio`
- Typecheck: `npx tsc --noEmit`

Mobile (`cd mobile`, requer `mobile/.env` com `EXPO_PUBLIC_API_URL=http://<IP-do-PC>:3001` — no celular `localhost` não alcança a API):
- `npm start` — Metro + QR code para o Expo Go (celular e PC na mesma rede Wi-Fi)
- `npm run android` / `npm run ios` / `npm run web`
- Typecheck: `npx tsc --noEmit`
- Checar se o bundle compila sem device: `npx expo export --platform android`
- Instalar dependências nativas sempre com `npx expo install <pkg>` (casa a versão com o SDK)

Ainda não há testes nem lint configurados em nenhum dos projetos (planejados para a Sprint 6).

## Arquitetura

### Backend
- `src/app.ts` monta o Express (CORS, JSON, rotas, 404 e error handler) e exporta `app`; `src/server.ts` só carrega o `.env` e chama `listen`. `src/lib/prisma.ts` exporta um `PrismaClient` singleton — sempre importe dele em vez de instanciar outro.
- Uma rota por domínio em `src/routes/` (`/users`, `/exercises`; planejadas `/workouts`, `/rest-days`, `/rankings`), com schemas Zod em `src/schemas/`. Handlers async passam por `asyncHandler` (`src/lib/http.ts`), porque o Express 4 não encaminha rejeições; erros de negócio lançam `HttpError`.
- `src/middleware/error-handler.ts` centraliza as respostas de erro no formato `{ error: { code, message, fields? } }`: `ZodError` → 400, `HttpError` → status próprio, Prisma `P2025` → 404, `P2002` (unique) → 409.
- Listas válidas (categorias de exercício, `trackingType`) vivem em `src/schemas/exercise.ts` e são espelhadas em `mobile/src/constants/exercise.ts` — mude as duas juntas.
- `tsconfig` usa `module: NodeNext`: imports relativos precisam da extensão `.js` (ex.: `'./lib/prisma.js'`).
- Só existem fontes `.ts` em `src/`; `.js` ali são ignorados pelo git (saída de `tsc` vai para `dist/`).

### Modelo de dados (`backend/prisma/schema.prisma`)
- Campos em camelCase no Prisma, mapeados para snake_case no banco via `@map`; tabelas em snake_case plural via `@@map` (`users`, `workout_sessions`, `workout_sets`, `exercise_dict`, `user_rankings`).
- IDs são UUID string.
- `WorkoutSession` → `WorkoutSet` (cascade); `WorkoutSet`/`UserRanking` → `ExerciseDict` com `onDelete: Restrict` (exercício em uso não pode ser apagado).
- `UserRanking` é único por `(userId, exerciseId)` — uma patente por exercício por usuário.
- `ExerciseDict.isCustom` distingue exercícios criados pelo usuário (`POST /exercises`) dos do seed. `name` é único globalmente (ainda não há exercício por usuário).
- Campos "enum" são strings livres, não enums do Prisma (a validação fica no Zod): `ExerciseDict.trackingType` (`reps_weight | time | distance`), `WorkoutSession.activityType` (Musculacao, Escalada, Natacao, Corrida…), `UserRanking.currentTier` (Cobre → Bronze → Prata → Ouro → Platina → Diamante → Esmeralda → Mestre).
- `WorkoutSession.rpe` (1–10) sustenta o Quick Log, que registra uma sessão sem séries.

### Mobile
- Navegação com **Expo Router** (entry `expo-router/entry`). `app/` só tem rotas (nomes em kebab-case, em português); componentes, hooks e lógica ficam em `src/` e são importados pelo alias `@/` (→ `src/`).
- `app/_layout.tsx` carrega fontes, `QueryClientProvider` e `SessionProvider`, e usa `Stack.Protected`: sem `userId` só existe `onboarding`; com `userId`, `(tabs)` (NativeTabs: Hoje, Histórico, Patentes, Perfil) e `exercicios/`. Trocar a sessão já redireciona — não navegue manualmente após `signIn`/`signOut`. Um 404 em `GET /users/:id` faz `signOut` (banco resetado).
- Sem auth no MVP: o `userId` criado no onboarding fica em `expo-sqlite/kv-store` (`src/storage/session.ts`) e é exposto por `useSession()`.
- Dados do servidor só via TanStack Query em `src/hooks/` (`use-user`, `use-exercises`) sobre `src/services/` (`request()` em `api.ts` lança `ApiError` com `status`/`code`/`fields` do backend). O catálogo de exercícios é baixado inteiro e filtrado no aparelho.
- Ícones via `src/components/icon.tsx`: SF Symbol no iOS + Material Icon no Android (sempre passe os dois). Nada de emoji/Ionicons/FontAwesome.
- Estilização exclusivamente via `className` do NativeWind v4 (Tailwind v3). A cadeia que faz isso funcionar: `metro.config.js` (`withNativeWind`, input `global.css`) + `import '../global.css'` em `app/_layout.tsx` + preset `nativewind/preset` no `tailwind.config.js` + `jsxImportSource: 'nativewind'` no Babel; `nativewind-env.d.ts` também declara `*.css` para o TypeScript.
- O tema vem de `design/tokens.json`: `tailwind.config.js` o lê direto (classes `bg-bg`, `bg-surface`, `bg-surface-2`, `text-ink`, `text-muted`, `bg-accent`, `text-accent-ink`, `tier-*`, `rounded-card`…; fontes `font-display` = Barlow Condensed 700, `font-body[-medium|-semibold|-bold]` = Outfit). Valores usados fora de `className` (props de navegação, `placeholderTextColor`, gradientes das patentes) estão espelhados em `src/constants/theme.ts`. Use os tokens, não hex/cores do Tailwind padrão.
- Telas seguem os mockups em `design/` (índice em `design/README.md`). O app é travado em retrato e em tema escuro. Os princípios de UX vêm da spec (RNF03): alvos de toque grandes, mínimo de digitação, uso com uma mão durante o treino.

### Fluxo central (registro de série)
1. O app salva a série localmente (SQLite, offline-first) e dispara haptic.
2. Faz `POST` para a API, que persiste via Prisma.
3. A API recalcula o 1RM estimado (Epley ou Brzycki), marca `isPr` e compara com as faixas de tier. Ao subir de patente, atualiza `UserRanking` e responde com `level_up: true` (+ novo tier).
4. O app mostra a animação de Level Up com haptic diferenciado.

Regras de streak: dias consecutivos com atividade; uma meta semanal atingida (`User.weeklyGoal`, padrão 4) não quebra o streak visual; dias de descanso registrados protegem o streak.

## Documentação de referência
- `spec/especificacao_tracker_treino.md` — requisitos RF01–RF11 e RNF. Os itens do `PROGRESS.md` referenciam esses códigos.
- `PROGRESS.md` — checklist por sprint (`[ ]` / `[/]` / `[x]`). Atualize ao concluir funcionalidades.
- `docs/ARQUITETURA_DETALHADA.md` — explicação detalhada da stack e do fluxo de dados.
- `design/` — mockups de todas as telas, tokens visuais e direções de estilo.
