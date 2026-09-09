# Arquitetura e Tech Stack: Habit & Rank Tracker

Este documento detalha a stack tecnológica escolhida para o desenvolvimento do aplicativo de treinos, com foco em uma experiência nativa fluida, gamificação rápida e um backend robusto e tipado de ponta a ponta.

---

## 1. Frontend Mobile (Onde a Mágica Acontece)

A interface precisa ser extremamente responsiva, operável com uma mão só e capaz de funcionar em ambientes com péssima conexão de internet (como o fundo de uma academia).

*   **Framework Core:** React Native com Expo (Managed Workflow)
    *   *Por que:* Permite desenvolver para iOS e Android simultaneamente usando TypeScript. O Expo Go permite testar o app direto no seu celular lendo um QR Code, sem precisar lidar com builds pesados no Android Studio logo de cara.
*   **Estilização:** NativeWind
    *   *Por que:* Traz o motor do TailwindCSS para o React Native. Permite construir componentes grandes, de fácil toque e interfaces bonitas usando apenas classes utilitárias, mantendo o código limpo.
*   **Gerenciamento de Estado Síncrono e Offline:** TanStack Query (React Query) + Expo SQLite
    *   *Por que:* O TanStack Query gerencia o cache e as requisições da API de forma inteligente. Com o Expo SQLite, é possível salvar os dados da sessão de treino localmente no aparelho. Quando o usuário sai da academia e recupera o 4G/Wi-Fi, o app sincroniza o cache com o banco de dados principal.
*   **UX Tátil:** `expo-haptics`
    *   *Por que:* Feedback físico. O celular vibra ao completar um set, finalizar um treino ou subir de ranking (Cobre -> Bronze), gerando o reforço positivo essencial para a retenção do hábito.

---

## 2. Backend (A Lógica e Regras de Negócio)

O servidor será responsável por processar os cálculos de volume, validar os streaks, calcular as Repetições Máximas Estimadas (1RM) e gerenciar o "Level Up" do usuário. A arquitetura será baseada em microsserviços simples ou um monólito bem estruturado.

*   **Ambiente e Framework:** Node.js com Express
    *   *Por que:* Uma escolha ágil e direta para construir APIs RESTful. Facilita muito a validação dos endpoints e o envio de requisições de teste estruturadas via Postman antes de plugar o aplicativo móvel.
*   **Linguagem:** TypeScript
    *   *Por que:* Compartilhar tipagens entre o Frontend e o Backend. Se um campo `weight_kg` mudar para `peso_kg` na API, o app móvel avisa do erro em tempo de compilação, evitando bugs silenciosos em produção.
*   **Estrutura da API:** Rotas modularizadas focadas em domínios (`/workouts`, `/users`, `/rankings`).

---

## 3. Banco de Dados e ORM (Persistência Principal)

A estrutura de treinos exige forte relacionamento entre Usuário, Sessão, Exercício e Série.

*   **Banco de Dados Relacional:** PostgreSQL
    *   *Por que:* Consistência de dados inquestionável, excelente para queries analíticas futuras (como somar todo o volume levantado no ano) e modelagem de chaves estrangeiras.
*   **ORM (Object-Relational Mapper):** Prisma (ou Drizzle)
    *   *Por que:* O Prisma lê o seu esquema relacional e gera um client TypeScript 100% tipado. Fazer uma query no banco vira algo como `prisma.workout_Set.create({...})`, com autocompletar e validação imediata no editor de código.

---

## 4. Infraestrutura e Desenvolvimento (DevOps Local)

Para não perder tempo instalando dependências isoladas e configurando portas na máquina.

*   **Containerização:** Docker e Docker Compose
    *   *Por que:* Com um arquivo `docker-compose.yml`, você sobe o banco PostgreSQL e o ambiente da API em contêineres isolados. Basta rodar um `docker-compose up` e todo o backend está pronto para receber conexões no ambiente de desenvolvimento.

---

## Resumo do Fluxo de Dados (Exemplo de "Quick Log")

1.  Usuário digita a carga (ex: 80kg) e toca no botão grande de "Salvar Série" no **React Native**.
2.  O **TanStack Query** salva isso imediatamente no **Expo SQLite** e aciona o **Haptics** (vibração).
3.  O app faz um POST para a API **Express / Node.js**.
4.  O backend valida os dados com **TypeScript** e usa o **Prisma** para inserir no **PostgreSQL**.
5.  A API verifica o novo 1RM. Se a carga configurou um novo recorde que atinge a faixa "Ouro", retorna um *trigger* de `level_up: true`.
6.  O frontend recebe a resposta e dispara uma animação na tela.
