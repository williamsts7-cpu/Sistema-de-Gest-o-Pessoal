# POS - Personal Operating System

Sistema pessoal de gestao com Next.js App Router, Supabase SSR, React, TypeScript e Tailwind.

## Ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Desenvolvimento

```bash
npm ci
npm run dev
```

Acesse `http://localhost:3000`.

## Validacao

```bash
npm test
npm run lint
npm run build
```

## Deploy

O projeto esta preparado para Node.js server e Docker com `output: "standalone"` do Next.js.

Veja `docs/DEPLOYMENT.md` para Docker, EasyPanel/Traefik e apontamento de DNS pela Hostinger.

## Status de implementacao

Veja `docs/IMPLEMENTATION_STATUS.md`.
