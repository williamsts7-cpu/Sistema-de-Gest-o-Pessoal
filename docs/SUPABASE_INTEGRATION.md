# Integracao Supabase

## Arquitetura

O App Router acessa o Supabase por uma camada de services. Client Components usam o singleton de `lib/supabase/client.ts`; Server Components, Server Actions e Route Handlers usam `lib/supabase/server.ts`. O `proxy.ts` renova os cookies de autenticacao e direciona visitantes sem sessao para `/login`.

Fluxo: UI -> Server Action/Service -> Supabase Client -> Auth/PostgreSQL/RLS.

## Ambiente

Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Nunca use `service_role`, senha do banco ou conexao PostgreSQL direta no frontend.

## Auth e Profile

`/login` oferece email/senha e cadastro manual. O servidor usa `auth.getUser()` para validar a sessao. O profile e lido em `services/profile.service.ts` pela correspondencia `auth.users.id = profiles.id` e aparece em `/settings`. Logout tambem e server-side.

## Services e RLS

Queries ficam em `services/`. Cada mutacao obtem o usuario autenticado e inclui `user_id` quando necessario. As policies RLS continuam sendo a autoridade final; nenhuma chave administrativa e usada. Erros tecnicos sao normalizados antes de chegar a UI.

## Modulos conectados

- Profile: leitura.
- Areas: listagem, criacao, edicao e arquivamento logico.
- Tasks: listagem e criacao rapida via Quick Capture.
- Goals: listagem e criacao rapida via Quick Capture.
- Projects: listagem e criacao rapida via Quick Capture.
- Habits: listagem e criacao rapida via Quick Capture.
- Inbox: Quick Capture persiste um item manual nao processado.

## Como testar

1. Execute `npm install` e `npm run dev`.
2. Abra `http://localhost:3000`, crie ou acesse uma conta.
3. Confira o profile em Settings.
4. Em Areas, crie e edite uma area; recarregue a pagina para validar persistencia.
5. Arquive a area e confirme que ela deixa a listagem ativa.
6. Use Quick Capture e confira que cada tipo escolhido persiste na tabela correta: `tasks`, `goals`, `projects`, `habits` ou `inbox_items`, sempre respeitando o usuario autenticado.

Erros 401 normalmente indicam sessao expirada. Erros RLS indicam policy ausente/incompativel ou `user_id` incorreto. Profile ausente indica que o trigger de criacao precisa ser verificado no projeto Supabase.
