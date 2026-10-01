# SendIt — Arquitetura Completa & Guia Técnico do Repositório

Este documento é um guia detalhado sobre a estrutura do projeto **SendIt**, explicando o papel, a mecânica interna e a justificativa técnica de cada arquivo e pasta do repositório, com ênfase especial na arquitetura e funcionamento do ecossistema **Mobile**.

---

## 1. Visão Macro do Repositório

O projeto segue um padrão monorepo simplificado, separando responsabilidades entre especificação, infraestrutura de banco de dados, API de backend e aplicação mobile:

```
SendIt/
├── spec/                       # 1. Especificações de negócio e arquitetura
├── docs/                       # 2. Documentação técnica e arquitetural
├── docker-compose.yml          # 3. Infraestrutura local do banco de dados
├── backend/                    # 4. API RESTful com Node.js, Express e Prisma
└── mobile/                     # 5. App nativo React Native com Expo
```

---

## 2. A Raiz do Projeto & Infraestrutura

### `docker-compose.yml`
* **O que faz:** Orquestra containers Docker para o ambiente de desenvolvimento local.
* **Mecânica interna:**
  * Define o serviço `postgres` usando a imagem leve `postgres:16-alpine`.
  * Cria o container com nome fixo `sendit_postgres`.
  * Configura credenciais padrão (`POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=postgres`, `POSTGRES_DB=sendit_db`).
  * Mapeia a porta `5432:5432` do host para o container.
  * Monta um volume persistente chamado `sendit_pgdata` apontando para `/var/lib/postgresql/data`. Isso garante que, mesmo reiniciando ou destruindo o container (`docker-compose down`), os dados dos treinos e usuários continuam salvos no disco da sua máquina.

### `.gitignore`
* **O que faz:** Evita que arquivos desnecessários ou sensíveis sejam enviados ao Git.
* **O que bloqueia:**
  * Pastas pesadas de dependências (`node_modules/`).
  * Arquivos de variáveis de ambiente (`.env`, `.env.local`), evitando vazamento de senhas.
  * Artefatos de build e compilação (`dist/`, `.expo/`, `web-build/`).
  * Logs de erro e arquivos temporários do sistema operacional (`.DS_Store`, `Thumbs.db`).

### `PROGRESS.md` & `README.md`
* `PROGRESS.md`: Rastreador de sprints em formato checklist, mapeando cada funcionalidade aos requisitos funcionais da especificação (`RF01` até `RF11`).
* `README.md`: Apresentação geral do projeto, motivação, diagrama visual de fluxo de dados, modelo relacional e comandos de inicialização rápida.

---

## 3. Backend: Arquitetura & Fluxo de Dados

Localizado na pasta `/backend`, trata-se de um servidor REST tradicional, focado em regras de negócio, cálculos matemáticos (1RM, streaks) e consistência relacional.

### Arquivos de Configuração do Backend
* **`package.json`**:
  * `express`: Framework HTTP minimalista e veloz para roteamento.
  * `dotenv`: Carrega variáveis do arquivo `.env` para `process.env`.
  * `cors`: Permite que o app mobile (rodando em portas e origens diferentes) consuma a API sem bloqueios de segurança do navegador.
  * `zod`: Biblioteca de validação de schemas em runtime (será usada para garantir que os payloads de treino e séries cheguem corretos).
  * `prisma` & `@prisma/client`: Camada de abstração e mapeamento objeto-relacional (ORM).
  * `tsx`: Executor TypeScript com hot-reload (`tsx watch src/server.ts`), que recarrega o servidor instantaneamente a cada alteração de código sem precisar compilar manualmente.
* **`tsconfig.json`**:
  * Configura o compilador TypeScript com modo estrito (`"strict": true`), resolução moderna `"NodeNext"` e interoperabilidade de módulos (`"esModuleInterop": true`).
* **`.env` / `.env.example`**:
  * Centraliza a string de conexão: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sendit_db?schema=public"`.

### O Prisma e o Banco de Dados (`/backend/prisma`)
* **`prisma/schema.prisma`**:
  * Define o modelo relacional de ponta a ponta:
    * `User`: Guarda perfil, peso corporal (`bodyweightKg`), streak atual e meta semanal.
    * `ExerciseDict`: Catálogo mestre de exercícios (ex: Supino, Agachamento) e sua tipagem (`reps_weight`, `time`, `distance`).
    * `WorkoutSession`: O registro do dia de treino (data, tipo de atividade, duração, RPE de 1 a 10 e anotações).
    * `WorkoutSet`: Cada série individual associada a uma sessão, registrando reps, peso e a flag booleana `isPr`.
    * `UserRanking`: Relação única de usuário com exercício, guardando o maior 1RM registrado e a patente atual (`currentTier`).
* **`prisma/migrations/`**:
  * Contém o histórico versionado de SQL aplicado no banco. A migration `20260909114752_init` gerou as tabelas com chaves estrangeiras (`FOREIGN KEY`), regras de deleção em cascata (`ON DELETE CASCADE`) e restrições únicas (`UNIQUE`).

### O Código-Fonte da API (`/backend/src`)
* **`src/lib/prisma.ts`**:
  * Cria e exporta uma única instância do `PrismaClient` (Singleton). Isso previne que múltiplas conexões paralelas sobrecarreguem o pool de conexões do PostgreSQL durante o desenvolvimento com hot-reload.
* **`src/server.ts`**:
  * Inicializa o Express, ativa os middlewares de JSON e CORS, e expõe a rota `GET /health`. Essa rota executa um `prisma.$queryRaw\`SELECT 1\`` para testar em tempo real se o banco está respondendo antes de devolver `status: "ok"`.

---

## 4. Mobile: Arquitetura Aprofundada

Localizado na pasta `/mobile`, o app foi construído com **React Native + Expo (Managed Workflow)**. Ele foi concebido para resolver o maior problema de aplicativos de treino tradicionais: **atrito na academia**.

### Por que Expo Managed Workflow?
O Expo permite desenvolver um aplicativo nativo para iOS e Android sem precisar mexer diretamente em código Java/Kotlin (Android) ou Objective-C/Swift (iOS). Com o **Expo Go**, o código TypeScript é compilado e servido via Metro Bundler, permitindo que você teste o app no celular físico via Wi-Fi instantaneamente, com hot-reload (Fast Refresh).

### Estrutura de Arquivos e Hierarquia do Mobile (`/mobile`)

A estrutura do projeto mobile foi limpa de arquivos descartáveis de scaffolding e modularizada seguindo as melhores práticas da comunidade React Native:

```
mobile/
├── assets/                     # Recursos visuais (ícones adaptativos, splash screens, imagens)
├── src/                        # 📂 Código-fonte modular da aplicação
│   ├── screens/                # Telas completas do app (fluxos e visualização de página)
│   │   └── HomeScreen.tsx      # Tela inicial (SENDIT, slogan e botão com Haptics)
│   ├── components/             # Componentes de interface reutilizáveis (botões grandes, cards, badges de patente)
│   ├── services/               # Clientes de comunicação com a API backend (endpoints REST)
│   ├── hooks/                  # Custom hooks para encapsular lógicas (TanStack Query, SQLite, Haptics)
│   ├── types/                  # Definições de tipagem TypeScript do app móvel
│   └── constants/              # Constantes globais (temas, patentes/tiers, cores e storage keys)
├── App.tsx                     # Entrypoint enxuto: configura Providers (QueryClientProvider) e StatusBar
├── index.ts                    # Registro oficial do aplicativo no runtime do Expo
├── app.json                    # Manifesto do Expo (nome, ícone, plugins nativos como expo-sqlite)
├── babel.config.js             # Configuração do transpilador Babel + NativeWind
├── tailwind.config.js          # Configuração de temas e mapeamento de classes para NativeWind
├── tsconfig.json               # Configurações do TypeScript (estrito + include de tipagens)
└── nativewind-env.d.ts         # Extensão de tipos TypeScript para suporte à prop className
```

#### Descrição dos Módulos Principais

* **`index.ts`**:
  * É o **ponto de entrada real** do aplicativo registrado pelo runtime do Expo.
  * Ele invoca `registerRootComponent(App)` da biblioteca `expo`. Esse método garante que a raiz do React seja montada corretamente tanto no ambiente do Expo Go quanto em compilações nativas de produção (APK/AAB para Android e IPA para iOS).

* **`app.json`**:
  * O arquivo de manifesto do Expo.
  * Define nome do app, versão, orientação da tela (`portrait` para travar o app em pé na academia), ícones adaptativos do Android e plugins nativos.
  * A seção `"plugins": ["expo-sqlite"]` instrui o Expo a configurar automaticamente os manifestos nativos sem intervenção manual em código Java/Kotlin/Swift.

* **`babel.config.js`**:
  * O Babel é o transpilador que transforma o código JavaScript moderno e JSX (`<View>`, `<Text>`) em código que o motor JavaScript do celular (Hermes) entende.
  * Configurado com `babel-preset-expo` (com `jsxImportSource: 'nativewind'`) e o plugin `'nativewind/babel'` para transformar classes CSS em objetos de estilo nativo (`StyleSheet.create`) em tempo de compilação.

* **`tailwind.config.js` & `nativewind-env.d.ts`**:
  * `tailwind.config.js`: Especifica onde o motor de estilos deve procurar classes: `./App.{js,jsx,ts,tsx}` e `./src/**/*.{js,jsx,ts,tsx}`.
  * `nativewind-env.d.ts`: Contém a diretiva `/// <reference types="nativewind/types" />`, permitindo que o TypeScript do editor reconheça a propriedade `className="..."` sem acusar erros de lint.

---

### As Tecnologias Centrais do Mobile

#### 1. NativeWind (Tailwind CSS no Celular)
* **Como funciona:** O React Native não usa CSS nem DOM web. Ele renderiza componentes de interface nativos do Android e iOS através de um mecanismo flexbox interno.
* **O que o NativeWind faz:** Ele traduz as classes utilitárias do Tailwind (ex: `items-center justify-center rounded-xl font-bold`) diretamente para as propriedades de layout do React Native (`alignItems: 'center'`, `borderRadius: 12`, `fontWeight: 'bold'`).
* **Vantagem para o SendIt:** Permite criar rapidamente botões enormes, com espaçamentos confortáveis para toque com o polegar, mantendo o código limpo e sem a necessidade de arquivos gigantescos de `StyleSheet`.

#### 2. TanStack Query (React Query)
* **O que é:** Gerenciador de estado assíncrono e cache de rede.
* **Por que é essencial no SendIt:**
  * Em vez de usar `useEffect` e controlar manualmente variáveis de `loading`, `error` e `data`, o TanStack Query gerencia o ciclo de vida das requisições com hooks como `useQuery` e `useMutation`.
  * **Cache inteligente:** Quando o usuário abre uma tela que lista seus treinos ou histórico de cargas, o dado já é exibido instantaneamente do cache, enquanto uma checagem em segundo plano verifica se houve novidades na API.
  * **Mutação otimista (Optimistic Updates):** Ao tocar em "Salvar Série", a interface atualiza na mesma fração de segundo como se a requisição já tivesse dado certo. Se a internet falhar, a mutação pode ser revertida ou colocada em fila.

#### 3. Expo SQLite (Persistência Offline-First)
* **O que faz:** Um banco de dados relacional SQLite embutido que roda dentro da memória flash do próprio smartphone do usuário.
* **O papel no SendIt:** Academias frequentemente ficam em subsolos ou áreas com péssimo sinal de celular (4G/Wi-Fi instável). Com o SQLite local, o usuário nunca fica travado esperando a tela carregar: a série é salva no banco interno do celular e sincronizada com a API Express/PostgreSQL assim que o aparelho reconectar à internet.

#### 4. `expo-haptics` (UX Tátil & Reforço de Hábito)
* **O que faz:** Aciona o motor tátil do aparelho (Taptic Engine no iPhone e actuadores de vibração no Android).
* **O papel no SendIt:**
  * Feedback imediato ao salvar uma série: o celular emite um pulso suave (`Haptics.ImpactFeedbackStyle.Medium`), confirmando o registro sem que o atleta precise olhar fixamente para a tela.
  * Reforço neurológico na gamificação: vibrações especiais e ritmadas ao subir de patente (ex: Bronze -> Prata) ou bater um Recorde Pessoal (PR).

---

### Anatomia do `App.tsx` & `HomeScreen.tsx`

#### `mobile/App.tsx` (Entrypoint Limpo)
```tsx
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeScreen } from './src/screens/HomeScreen';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeScreen />
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
```

#### `mobile/src/screens/HomeScreen.tsx` (Tela Inicial Modular)
```tsx
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HomeScreen() {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View className="flex-1 items-center justify-center bg-slate-900 px-6">
      <Text className="text-3xl font-extrabold text-emerald-400 mb-2 tracking-wider">
        SENDIT
      </Text>
      <Text className="text-slate-400 text-center mb-8 text-base">
        Activity & Workout Habit Tracker
      </Text>

      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        className="bg-emerald-500 px-6 py-4 rounded-xl shadow-lg active:bg-emerald-600 w-full max-w-xs items-center"
      >
        <Text className="text-slate-950 font-bold text-lg">
          Test Haptic & Ready
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 5. Como as Peças se Conectam (Ciclo Completo de Dados)

```
[ Usuário digita carga: 80kg ]
           │
           ▼
[ Toca no botão 'Salvar Série' no React Native ]
           │
           ├───▶ 1. Haptics: Celular vibra (feedback físico instantâneo)
           ├───▶ 2. SQLite: Salva no banco local do celular (garantia offline)
           │
           ▼
[ TanStack Query dispara POST /workouts/:id/sets ]
           │
           ▼
[ API Express / Node.js ]
           │
           ├───▶ Valida os dados com Zod
           ├───▶ Prisma ORM executa INSERT no PostgreSQL
           ├───▶ Backend calcula se a carga gerou um novo 1RM
           │
           ▼
[ Resposta da API ] ──▶ { level_up: true, new_tier: "Bronze" }
           │
           ▼
[ Frontend recebe a resposta e dispara animação de patente na tela ]
```

