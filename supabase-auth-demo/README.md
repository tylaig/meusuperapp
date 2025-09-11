Supabase Auth Demo (HTML + JS)

Exemplo simples de autenticação com Supabase Auth, incluindo:
- Cadastro e login com email/senha
- Magic link (email)
- Login com Google (OAuth)
- Listener de sessão e exibição de usuário
- Consulta opcional a `profiles` (com RLS)

1) Pré-requisitos
- Conta e projeto no Supabase
- URL do projeto e `anon key` (Dashboard → Settings → API)
- Para Google OAuth: credenciais na Dashboard (Settings → Authentication → Providers → Google)

2) Configuração
Edite `app.js` e substitua:

```js
const SUPABASE_URL = 'https://YOUR-PROJECT-ref.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';
```

No Supabase Dashboard (Settings → Authentication → General):
- Habilite Email/Password e (opcional) Magic Link
- Configure `Redirect URLs`: `http://localhost:5173/`
- Em Providers → Google: habilite e informe Client ID/Secret

3) Rodando localmente

```bash
python3 -m http.server 5173 --directory /workspace/supabase-auth-demo
```

Abra `http://localhost:5173/`.

4) Tabela `profiles` (opcional)
Execute `sql/profiles.sql` no SQL Editor do Supabase para criar a tabela, ativar RLS e políticas.

5) Fluxos
- Cadastro (email/senha) com confirmação de email (se habilitada)
- Login (email/senha)
- Magic link (email)
- Google OAuth
- Logout

6) Problemas comuns
- Redirect URLs faltando → erro no retorno do OAuth/magic link
- Chaves inválidas → 401/403
- RLS sem políticas → `permission denied` na `profiles`

7) Próximos passos
- Upsert de perfil, edição e avatar
- Integração com frameworks (Next.js, React)
- SSR com `@supabase/ssr`

