-- Cria tabela de perfis associada ao usuário do Auth
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilita RLS
alter table public.profiles enable row level security;

-- Política: usuário pode selecionar seu próprio perfil
create policy if not exists "Allow read own profile"
on public.profiles for select
using (auth.uid() = id);

-- Política: usuário pode atualizar seu próprio perfil
create policy if not exists "Allow update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Política: inserir perfil somente para o próprio usuário (se optar por inserir manualmente)
create policy if not exists "Allow insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- (Opcional) Trigger/função para criar um perfil vazio quando um usuário confirma o email
-- Obs.: Requer postgres role com permissões (SECURITY DEFINER).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

