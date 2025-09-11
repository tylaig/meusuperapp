// Importa o cliente Supabase (CDN ESM)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 1) Configure suas credenciais do Supabase
//    Substitua pelos valores do seu projeto (Dashboard > Settings > API)
const SUPABASE_URL = 'https://YOUR-PROJECT-ref.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';

// 2) Inicializa o cliente
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3) Seletores de elementos da UI
const elSignedOut = document.querySelector('#signed-out');
const elSignedIn = document.querySelector('#signed-in');
const elAuthError = document.querySelector('#auth-error');
const elAuthInfo = document.querySelector('#auth-info');
const elUserJson = document.querySelector('#user-json');
const elProfileJson = document.querySelector('#profile-json');

const elSignupForm = document.querySelector('#signup-form');
const elSigninForm = document.querySelector('#signin-form');
const elMagicForm = document.querySelector('#magic-form');
const elGoogleButton = document.querySelector('#google-button');
const elSignoutButton = document.querySelector('#signout-button');
const elRefreshProfile = document.querySelector('#refresh-profile');

// 4) Helpers de UI
function setViewSignedIn(isSignedIn) {
  if (isSignedIn) {
    elSignedIn.classList.remove('hidden');
    elSignedOut.classList.add('hidden');
  } else {
    elSignedIn.classList.add('hidden');
    elSignedOut.classList.remove('hidden');
  }
}

function showError(message) {
  if (!elAuthError) return;
  elAuthError.textContent = message || '';
  elAuthError.style.display = message ? 'block' : 'none';
}

function showInfo(message) {
  if (!elAuthInfo) return;
  elAuthInfo.textContent = message || '';
  elAuthInfo.style.display = message ? 'block' : 'none';
}

function renderUser(user) {
  if (!elUserJson) return;
  elUserJson.textContent = user ? JSON.stringify(user, null, 2) : '';
}

function renderProfile(profile) {
  if (!elProfileJson) return;
  elProfileJson.textContent = profile ? JSON.stringify(profile, null, 2) : '';
}

// 5) Fluxos de autenticação
elSignupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  showError('');
  showInfo('');
  const email = document.querySelector('#signup-email').value;
  const password = document.querySelector('#signup-password').value;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) {
    showError(error.message);
  } else {
    showInfo('Cadastro iniciado. Verifique seu email para confirmar a conta.');
    (e.target).reset();
  }
});

elSigninForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  showError('');
  showInfo('');
  const email = document.querySelector('#signin-email').value;
  const password = document.querySelector('#signin-password').value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    showError(error.message);
  } else {
    showInfo('Login realizado com sucesso.');
    (e.target).reset();
    await loadProfile();
  }
});

elMagicForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  showError('');
  showInfo('');
  const email = document.querySelector('#magic-email').value;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) {
    showError(error.message);
  } else {
    showInfo('Magic link enviado. Verifique seu email.');
    (e.target).reset();
  }
});

elGoogleButton?.addEventListener('click', async () => {
  showError('');
  showInfo('Redirecionando para Google...');
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) showError(error.message);
});

elSignoutButton?.addEventListener('click', async () => {
  showError('');
  showInfo('');
  const { error } = await supabase.auth.signOut();
  if (error) {
    showError(error.message);
  } else {
    showInfo('Sessão encerrada.');
  }
});

elRefreshProfile?.addEventListener('click', async () => {
  await loadProfile();
});

// 6) Listener de sessão
supabase.auth.onAuthStateChange(async (event, session) => {
  const user = session?.user ?? null;
  setViewSignedIn(Boolean(user));
  renderUser(user);
  showError('');
  showInfo('');
  if (user) {
    await loadProfile();
  } else {
    renderProfile(null);
  }
});

// 7) Carrega sessão inicial
(async function init() {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user ?? null;
  setViewSignedIn(Boolean(user));
  renderUser(user);
  if (user) await loadProfile();
})();

// 8) Perfil (tabela opcional `profiles`)
async function loadProfile() {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) return renderProfile(null);

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    renderProfile(data || null);
  } catch (err) {
    renderProfile({ info: 'Crie a tabela `profiles` e políticas RLS para ver dados.', error: String(err?.message || err) });
  }
}

