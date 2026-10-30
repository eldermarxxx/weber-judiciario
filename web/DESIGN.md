---
version: alpha
name: Assistente de Minutas
description: Tema escuro monocromático com um único acento amarelo para a ação principal. Denso, direto, sem gradientes.
colors:
  primary: "#EAECEF"
  secondary: "#848E9C"
  tertiary: "#F0B90B"
  neutral: "#0B0E11"
  surface: "#181A20"
  surface-2: "#1E2129"
  line: "#2B3139"
  line-strong: "#3A414B"
  on-primary: "#0B0E11"
typography:
  display:
    fontFamily: Inter
    fontSize: 4.5rem
    fontWeight: 700
    letterSpacing: "-0.025em"
  h1:
    fontFamily: Inter
    fontSize: clamp(1.9rem, 2.6vw + 1rem, 2.6rem)
    fontWeight: 700
  body:
    fontFamily: Inter
    fontSize: 0.95rem
    lineHeight: 1.5
  label:
    fontFamily: IBM Plex Mono
    fontSize: 0.72rem
    letterSpacing: "0.04em"
rounded:
  sm: 4px
  md: 6px
  lg: 10px
spacing:
  sm: 8px
  md: 16px
  lg: 32px
motion:
  fast: 160ms
  base: 240ms
  slow: 600ms
  ease-out: "cubic-bezier(0.2, 0.8, 0.2, 1)"
elevation:
  card: "inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 1px 2px rgba(0, 0, 0, 0.4)"
  lift: "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 32px rgba(0, 0, 0, 0.45)"
  primary: "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 1px 2px rgba(0, 0, 0, 0.4)"
---

## Regras

- Use o amarelo (`tertiary`) em **uma única ação por tela**.
- Deixe o fundo (`neutral`) respirar. Espaço vazio é parte do desenho.
- Sem gradientes. O sistema é chapado de propósito.
- Não misture o amarelo com outros acentos.
- Rótulos, status e metadados em IBM Plex Mono.
- Números e datas com dígitos tabulares, para alinhar em coluna.
- Interação: linhas e cartões clicáveis ganham o fundo `surface-2` ao passar o mouse. O foco é o anel amarelo de 2 px, sempre visível, sem animação.
- Movimento só com `transform` e `opacity`, nas durações e na curva de `motion`. Quando o sistema pede menos movimento (`prefers-reduced-motion`), tudo fica estático, sem perda de informação.
- Elevação só pelas sombras de `elevation`. Nada de brilho colorido nem de vidro.
