# SendIt — Design

Referência visual do app mobile. Direção atual: **Dark atlético** (veja [`style-directions.md`](style-directions.md) para as outras vibes e o brief usado na geração).

- Canvas com todas as telas (editável, com Play): https://claude.ai/artifact/FmccCcKtjD2NguMKqeKxro
- Projeto original no Sleek: https://sleek.design/project/cZEBWIIXh7e

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `sleek/` | PNGs das 4 telas geradas no Sleek (`00-todas.png` = lado a lado) |
| `mockups/` | Fontes `.dc.html` das telas desenhadas no canvas + `canvas.json` (layout). Dependem do runtime do canvas — para visualizar, abra o link acima |
| `tokens.json` | Cores, paleta de patentes, fontes e raios — fonte única replicada em `mobile/tailwind.config.js` e `mobile/src/constants/theme.ts` |
| `style-directions.md` | As 3 direções de estilo + brief de telas |

## Telas

| Tela | Fonte | Arquivo | Sprint |
|---|---|---|---|
| Onboarding | canvas | `mockups/Onboarding.dc.html` | 1 |
| Exercícios | canvas | `mockups/Exercicios.dc.html` | 1 |
| Novo exercício | canvas | `mockups/NovoExercicio.dc.html` | 1 |
| Perfil (com tab bar) | canvas | `mockups/Perfil.dc.html` | 1 |
| Nova sessão | canvas | `mockups/NovaSessao.dc.html` | 2 |
| Registro de série | Sleek | `sleek/02-registro-serie.png` | 2 |
| Quick Log (bottom sheet) | canvas | `mockups/QuickLog.dc.html` | 2 |
| Histórico | Sleek | `sleek/03-historico.png` | 3 |
| Hoje (home) | Sleek | `sleek/01-hoje.png` | 4 |
| Patentes | Sleek | `sleek/04-patentes.png` | 5 |
| Level Up | canvas | `mockups/LevelUp.dc.html` | 5 |
| Sistema (tiers, cores, tipografia, tab bar) | canvas | `mockups/Sistema.dc.html` | — |

## Correções sobre as telas do Sleek

Ao implementar as telas do Sleek, aplique:

- **Tab bar** inferior (Hoje · Histórico · Patentes · Perfil) — o Sleek não gerou; o padrão está em `Perfil` e `Sistema`.
- **Cores das patentes** de `tokens.json` — no Sleek, Cobre/Bronze e Prata/Platina eram indistinguíveis e Mestre sumia no fundo.
- **Dados consistentes**: na tela Patentes do Sleek o Supino aparece como "Ouro" com subtítulo "Prata → Ouro"; o correto é um tier por card. "3de 4" na Home precisa de espaço. Corrida não tem "séries" no Histórico.

## Princípios

- Uma informação dominante por tela; acento verde só em ação primária e progresso.
- Alvos de toque ≥ 44 pt (steppers 64 pt, CTA 60 pt), ações principais na parte de baixo, sem teclado quando possível.
- Metal (gradiente) só em patentes — significa conquista.
