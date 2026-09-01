# Deploy do POS

## Status técnico

O app é um Next.js App Router com Supabase SSR e pode rodar como servidor Node.js ou container Docker. Para produção neste servidor, o caminho recomendado é Docker por trás do EasyPanel/Traefik, porque as portas 80 e 443 já são controladas pelo Traefik do EasyPanel.

## Variáveis de ambiente

Configure no provedor de deploy:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Essas duas chaves são públicas do projeto Supabase. Não use `service_role`, senha do banco ou connection string PostgreSQL no frontend.

## Build local

```bash
npm ci
npm test
npm run lint
npm run build
```

## Docker

A imagem usa `output: "standalone"` do Next.js.

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -t pos-system:latest .

docker run --env-file .env.local -p 3000:3000 pos-system:latest
```

## EasyPanel/Traefik

Crie um app a partir do repositório GitHub ou da imagem Docker, expondo a porta interna `3000`. No domínio do app, configure o subdomínio final, por exemplo `pos.seudominio.com.br`. O EasyPanel/Traefik deve emitir o HTTPS quando o DNS já apontar para o servidor.

## DNS na Hostinger

Para hospedar neste servidor, crie um registro `A` no DNS da Hostinger:

- Tipo: `A`
- Nome: subdomínio escolhido, por exemplo `pos`
- Valor: IP público do servidor
- TTL: padrão ou 300 durante a propagação

Depois que o DNS propagar, configurar o mesmo hostname no app do EasyPanel e validar `https://subdominio.seudominio.com.br/login`.
