/*
  # Schema para Autenticação e Workspaces

  1. Tabelas Criadas
    - `profiles` - Perfis dos usuários (extensão do auth.users)
    - `workspaces` - Espaços de trabalho/organizações
    - `workspace_members` - Membros dos workspaces com roles
    - `workspace_invites` - Convites pendentes para workspaces

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para acesso baseado em workspace
    - Políticas para gerenciamento de membros

  3. Funcionalidades
    - Múltiplos workspaces por usuário
    - Sistema de roles (owner, admin, member)
    - Convites por email
    - Configurações personalizadas por workspace
*/

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis dos usuários (extensão do auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  bio text,
  timezone text DEFAULT 'America/Sao_Paulo',
  language text DEFAULT 'pt-BR',
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  marketing_emails boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de workspaces/organizações
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo_url text,
  website text,
  industry text,
  company_size text,
  plan text DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  
  -- Configurações do workspace
  settings jsonb DEFAULT '{
    "timezone": "America/Sao_Paulo",
    "language": "pt-BR",
    "currency": "BRL",
    "date_format": "DD/MM/YYYY",
    "business_hours": {
      "enabled": true,
      "timezone": "America/Sao_Paulo",
      "monday": {"start": "09:00", "end": "18:00", "enabled": true},
      "tuesday": {"start": "09:00", "end": "18:00", "enabled": true},
      "wednesday": {"start": "09:00", "end": "18:00", "enabled": true},
      "thursday": {"start": "09:00", "end": "18:00", "enabled": true},
      "friday": {"start": "09:00", "end": "18:00", "enabled": true},
      "saturday": {"start": "09:00", "end": "12:00", "enabled": false},
      "sunday": {"start": "09:00", "end": "12:00", "enabled": false}
    },
    "auto_backup": true,
    "backup_frequency": "daily",
    "retention_days": 30
  }'::jsonb,
  
  -- Limites do plano
  limits jsonb DEFAULT '{
    "max_connections": 100,
    "max_messages_per_month": 10000,
    "max_users": 5,
    "max_integrations": 10,
    "max_automations": 20,
    "max_storage_gb": 10
  }'::jsonb,
  
  -- Métricas de uso
  usage jsonb DEFAULT '{
    "connections": 0,
    "messages_this_month": 0,
    "users": 1,
    "integrations": 0,
    "automations": 0,
    "storage_used_gb": 0
  }'::jsonb,
  
  -- Configurações de billing
  billing jsonb DEFAULT '{
    "customer_id": null,
    "subscription_id": null,
    "payment_method": null,
    "next_billing_date": null,
    "trial_ends_at": null,
    "is_trial": true
  }'::jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Índices para performance
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$' AND length(slug) >= 3)
);

-- Tabela de membros dos workspaces
CREATE TABLE IF NOT EXISTS workspace_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  
  -- Permissões específicas
  permissions jsonb DEFAULT '{
    "workspace": {
      "read": true,
      "update": false,
      "delete": false,
      "manage_members": false,
      "manage_billing": false
    },
    "connections": {
      "read": true,
      "create": false,
      "update": false,
      "delete": false
    },
    "conversations": {
      "read": true,
      "create": true,
      "update": true,
      "delete": false
    },
    "automations": {
      "read": true,
      "create": false,
      "update": false,
      "delete": false
    },
    "analytics": {
      "read": true,
      "export": false
    },
    "integrations": {
      "read": true,
      "create": false,
      "update": false,
      "delete": false
    }
  }'::jsonb,
  
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  joined_at timestamptz DEFAULT now(),
  last_activity timestamptz DEFAULT now(),
  
  -- Constraint para evitar duplicatas
  UNIQUE(workspace_id, user_id)
);

-- Tabela de convites para workspaces
CREATE TABLE IF NOT EXISTS workspace_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  permissions jsonb DEFAULT '{}'::jsonb,
  
  invited_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraint para evitar convites duplicados
  UNIQUE(workspace_id, email)
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_invites_updated_at
  BEFORE UPDATE ON workspace_invites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para criar perfil automaticamente
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Função para criar workspace padrão para novos usuários
CREATE OR REPLACE FUNCTION create_default_workspace()
RETURNS TRIGGER AS $$
DECLARE
  workspace_id uuid;
BEGIN
  -- Criar workspace padrão
  INSERT INTO workspaces (name, slug, description)
  VALUES (
    COALESCE(NEW.full_name, 'Meu Workspace') || '''s Workspace',
    'workspace-' || substr(replace(NEW.id::text, '-', ''), 1, 8),
    'Workspace padrão criado automaticamente'
  )
  RETURNING id INTO workspace_id;
  
  -- Adicionar usuário como owner do workspace
  INSERT INTO workspace_members (workspace_id, user_id, role, permissions)
  VALUES (
    workspace_id,
    NEW.id,
    'owner',
    '{
      "workspace": {
        "read": true,
        "update": true,
        "delete": true,
        "manage_members": true,
        "manage_billing": true
      },
      "connections": {
        "read": true,
        "create": true,
        "update": true,
        "delete": true
      },
      "conversations": {
        "read": true,
        "create": true,
        "update": true,
        "delete": true
      },
      "automations": {
        "read": true,
        "create": true,
        "update": true,
        "delete": true
      },
      "analytics": {
        "read": true,
        "export": true
      },
      "integrations": {
        "read": true,
        "create": true,
        "update": true,
        "delete": true
      }
    }'::jsonb
  );
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para criar workspace padrão
CREATE TRIGGER create_default_workspace_on_profile_creation
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_workspace();

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_invites ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Políticas para workspaces
CREATE POLICY "Users can read workspaces they belong to"
  ON workspaces
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Workspace owners and admins can update workspace"
  ON workspaces
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
        AND status = 'active'
    )
  );

CREATE POLICY "Workspace owners can delete workspace"
  ON workspaces
  FOR DELETE
  TO authenticated
  USING (
    id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
        AND role = 'owner'
        AND status = 'active'
    )
  );

-- Políticas para workspace_members
CREATE POLICY "Users can read workspace members of their workspaces"
  ON workspace_members
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Workspace owners and admins can manage members"
  ON workspace_members
  FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
        AND status = 'active'
    )
  );

-- Políticas para workspace_invites
CREATE POLICY "Users can read invites for their workspaces"
  ON workspace_invites
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
        AND status = 'active'
    )
  );

CREATE POLICY "Workspace owners and admins can manage invites"
  ON workspace_invites
  FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
        AND status = 'active'
    )
  );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invites_workspace_id ON workspace_invites(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invites_email ON workspace_invites(email);
CREATE INDEX IF NOT EXISTS idx_workspace_invites_token ON workspace_invites(token);

-- Função para verificar se usuário é membro do workspace
CREATE OR REPLACE FUNCTION is_workspace_member(workspace_uuid uuid, user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_id = workspace_uuid 
      AND user_id = user_uuid 
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar role do usuário no workspace
CREATE OR REPLACE FUNCTION get_user_workspace_role(workspace_uuid uuid, user_uuid uuid DEFAULT auth.uid())
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM workspace_members 
  WHERE workspace_id = workspace_uuid 
    AND user_id = user_uuid 
    AND status = 'active';
  
  RETURN COALESCE(user_role, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para aceitar convite
CREATE OR REPLACE FUNCTION accept_workspace_invite(invite_token text)
RETURNS jsonb AS $$
DECLARE
  invite_record workspace_invites%ROWTYPE;
  new_member_id uuid;
BEGIN
  -- Buscar convite válido
  SELECT * INTO invite_record
  FROM workspace_invites
  WHERE token = invite_token
    AND status = 'pending'
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Convite inválido ou expirado');
  END IF;
  
  -- Verificar se o usuário logado tem o mesmo email do convite
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND email = invite_record.email
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email não corresponde ao usuário logado');
  END IF;
  
  -- Verificar se já é membro
  IF EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE workspace_id = invite_record.workspace_id AND user_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Usuário já é membro deste workspace');
  END IF;
  
  -- Adicionar como membro
  INSERT INTO workspace_members (workspace_id, user_id, role, permissions)
  VALUES (
    invite_record.workspace_id,
    auth.uid(),
    invite_record.role,
    invite_record.permissions
  )
  RETURNING id INTO new_member_id;
  
  -- Marcar convite como aceito
  UPDATE workspace_invites
  SET status = 'accepted', accepted_at = now()
  WHERE id = invite_record.id;
  
  RETURN jsonb_build_object(
    'success', true, 
    'workspace_id', invite_record.workspace_id,
    'member_id', new_member_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION generate_unique_slug(base_name text)
RETURNS text AS $$
DECLARE
  slug_candidate text;
  counter integer := 0;
BEGIN
  -- Normalizar nome para slug
  slug_candidate := lower(
    regexp_replace(
      regexp_replace(
        unaccent(base_name), 
        '[^a-zA-Z0-9\s-]', '', 'g'
      ), 
      '\s+', '-', 'g'
    )
  );
  
  -- Garantir que não existe
  WHILE EXISTS (SELECT 1 FROM workspaces WHERE slug = slug_candidate) LOOP
    counter := counter + 1;
    slug_candidate := lower(
      regexp_replace(
        regexp_replace(
          unaccent(base_name), 
          '[^a-zA-Z0-9\s-]', '', 'g'
        ), 
        '\s+', '-', 'g'
      )
    ) || '-' || counter;
  END LOOP;
  
  RETURN slug_candidate;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo (apenas para desenvolvimento)
DO $$
BEGIN
  -- Verificar se já existem dados
  IF NOT EXISTS (SELECT 1 FROM workspaces LIMIT 1) THEN
    -- Workspace de exemplo
    INSERT INTO workspaces (
      id,
      name, 
      slug, 
      description,
      plan,
      settings,
      limits
    ) VALUES (
      '00000000-0000-0000-0000-000000000001',
      'MeuSuper Tecnologia',
      'meusuper-tech',
      'Workspace principal da MeuSuper Tecnologia',
      'pro',
      '{
        "timezone": "America/Sao_Paulo",
        "language": "pt-BR",
        "currency": "BRL",
        "business_hours": {
          "enabled": true,
          "timezone": "America/Sao_Paulo",
          "monday": {"start": "08:00", "end": "18:00", "enabled": true},
          "tuesday": {"start": "08:00", "end": "18:00", "enabled": true},
          "wednesday": {"start": "08:00", "end": "18:00", "enabled": true},
          "thursday": {"start": "08:00", "end": "18:00", "enabled": true},
          "friday": {"start": "08:00", "end": "18:00", "enabled": true},
          "saturday": {"start": "09:00", "end": "12:00", "enabled": false},
          "sunday": {"start": "09:00", "end": "12:00", "enabled": false}
        }
      }'::jsonb,
      '{
        "max_connections": 1000,
        "max_messages_per_month": 100000,
        "max_users": 50,
        "max_integrations": 100,
        "max_automations": 200,
        "max_storage_gb": 100
      }'::jsonb
    );
  END IF;
END $$;