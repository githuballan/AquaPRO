const STORAGE_KEYS = {
  users: 'aquainfo-users',
  activeUser: 'aquainfo-active-user',
  aquarium: 'aquainfo-aquarium-data',
  history: 'aquainfo-aquarium-history'
};

const navigationItems = [
  { label: 'AquaristaPRO', href: 'index.html', page: 'index' },
  { label: 'Área de membros', href: 'members.html', page: 'members' },
  { label: 'Catálogo', href: 'catalogo.html', page: 'catalogo' }
];

const siteSearchEntries = [
  {
    id: 'page-home',
    type: 'page',
    title: 'AquaristaPRO',
    description: 'Página inicial com visão geral do site e próximos passos para o aquarista.',
    href: 'index.html',
    keywords: 'inicio home aquarismo aquario agua doce'
  },
  {
    id: 'page-members',
    type: 'page',
    title: 'Área de membros',
    description: 'Login, cadastro do aquário, leituras, histórico e gráfico de parâmetros.',
    href: 'members.html',
    keywords: 'membros login cadastro aquario leituras grafico'
  },
  {
    id: 'page-catalog',
    type: 'page',
    title: 'Catálogo de peixes',
    description: 'Pesquisa de peixes com filtros, compatibilidade e card para lojistas.',
    href: 'catalogo.html',
    keywords: 'catalogo peixes compatibilidade filtros lojistas'
  }
];

const state = {
  users: [],
  fishes: [],
  selectedFish: null,
  activeUser: null,
  aquarium: null,
  history: [],
  printSheetCards: [],
  search: {
    isOpen: false,
    activeHost: 'desktop',
    query: '',
    suggestions: [],
    activeIndex: -1,
    hasGlobalListener: false
  },
  ui: {
    isMobileLayout: null
  }
};

const supabaseUrl = document.body?.dataset.supabaseUrl || '';
const supabaseAnonKey = document.body?.dataset.supabaseAnonKey || '';
const supabaseClient = window.supabase?.createClient && supabaseUrl && supabaseAnonKey
  ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
  : null;

const authForm = document.getElementById('authForm');
const registerForm = document.getElementById('registerForm');
const authCard = document.getElementById('authCard');
const authFormContainer = document.getElementById('authFormContainer');
const showLoginButton = document.getElementById('showLoginButton');
const showRegisterButton = document.getElementById('showRegisterButton');
const forgotPasswordButton = document.getElementById('forgotPasswordButton');
const aquariumForm = document.getElementById('aquariumForm');
const aquariumSection = document.getElementById('aquario');
const readingSection = document.getElementById('readingSection');
const readingForm = document.getElementById('readingForm');
const toggleReadingFormButton = document.getElementById('toggleReadingFormButton');
const cancelReadingFormButton = document.getElementById('cancelReadingFormButton');
const latestReadingSummary = document.getElementById('latestReadingSummary');
const readingHistory = document.getElementById('readingHistory');
const fishSelect = document.getElementById('fishSelect');
const fishDetails = document.getElementById('fishDetails');
const compatibilityResult = document.getElementById('compatibilityResult');
const productList = document.getElementById('productList');
const chartCanvas = document.getElementById('chartCanvas');
const chartParam = document.getElementById('chartParam');
const chartSection = document.getElementById('chartSection');
const memberPanel = document.getElementById('memberPanel');
const memberNotice = document.getElementById('memberNotice');
const memberGreeting = document.getElementById('memberGreeting');
const changePasswordForm = document.getElementById('changePasswordForm');
const toggleChangePasswordButton = document.getElementById('toggleChangePasswordButton');
const aquariumSummary = document.getElementById('aquariumSummary');
const deleteAquariumButton = document.getElementById('deleteAquariumButton');
const merchantCard = document.getElementById('merchantCard');
const merchantCardButton = document.getElementById('merchantCardButton');
const merchantPrintButton = document.getElementById('merchantPrintButton');
const printSheetSection = document.getElementById('printSheetSection');
const printSheetPreviewButton = document.getElementById('printSheetPreviewButton');
const printSheetButton = document.getElementById('printSheetButton');
const printSheetCanvas = document.getElementById('printSheetCanvas');
const printSheetCards = document.getElementById('printSheetCards');
const logoutButton = document.getElementById('logoutButton');
const filtersForm = document.getElementById('filtersForm');
const fishCards = document.getElementById('fishCards');
const notice = document.getElementById('notice');
const filtersCard = document.querySelector('.filters-card');
const closeFiltersButton = document.getElementById('closeFiltersButton');
const filtersBackdrop = document.getElementById('filtersBackdrop');
const searchResultsPage = document.getElementById('searchResultsPage');
const searchResultsSummary = document.getElementById('searchResultsSummary');
const searchResultsGrid = document.getElementById('searchResultsGrid');

function isMobileLayout() {
  return window.matchMedia('(max-width: 760px)').matches;
}

function parseNumericValue(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeSearchValue(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getSiteRootPrefix() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  return segments.length <= 1 ? '' : '../'.repeat(segments.length - 1);
}

function resolveSitePath(path) {
  if (!path) {
    return getSiteRootPrefix();
  }

  if (/^(https?:)?\/\//i.test(path) || path.startsWith('#')) {
    return path;
  }

  return `${getSiteRootPrefix()}${path.replace(/^\.\//, '').replace(/^\/+/, '')}`;
}

function mapSupabaseFishRow(row) {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    origin: row.origin || '',
    size: row.size_label || '',
    careLevel: row.care_level || '',
    group: row.fish_group || '',
    temperament: row.temperament || '',
    diet: row.diet || '',
    difficulty: row.difficulty || '',
    URL: row.detail_url || '',
    minAquariumSize: parseNumericValue(row.min_aquarium_size_l),
    photo: row.photo_url || '',
    parameters: {
      temperature: {
        min: parseNumericValue(row.temperature_min),
        max: parseNumericValue(row.temperature_max)
      },
      ph: {
        min: parseNumericValue(row.ph_min),
        max: parseNumericValue(row.ph_max)
      },
      gh: {
        min: parseNumericValue(row.gh_min),
        max: parseNumericValue(row.gh_max)
      },
      kh: {
        min: parseNumericValue(row.kh_min),
        max: parseNumericValue(row.kh_max)
      },
      nitrite: {
        min: parseNumericValue(row.nitrite_min),
        max: parseNumericValue(row.nitrite_max)
      },
      ammonia: {
        min: parseNumericValue(row.ammonia_min),
        max: parseNumericValue(row.ammonia_max)
      }
    }
  };
}

function normalizeFishCatalogData(items) {
  return items.map((item) => (item.parameters ? item : mapSupabaseFishRow(item)));
}

async function fetchFishCatalogFromSupabase() {
  if (!supabaseClient) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from('fishes')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return normalizeFishCatalogData(data || []);
}

async function fetchFishCatalogFallback() {
  const response = await fetch(resolveSitePath('data/fishes.json'));

  if (!response.ok) {
    throw new Error(`Não foi possível carregar ${response.url}`);
  }

  const data = await response.json();
  return normalizeFishCatalogData(data);
}

function getInitialSearchQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('q') || params.get('search') || '';
}

function formatDateTime(value) {
  if (!value) {
    return 'Sem data registrada';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('pt-BR');
}

function getLocalDateTimeValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function getAuthRedirectUrl() {
  return new URL('members.html', window.location.href).href;
}

function getPasswordResetUrl() {
  return new URL('reset-password.html', window.location.href).href;
}

function getUserDisplayName(user) {
  return user?.user_metadata?.name || user?.email?.split('@')[0] || 'Aquarista';
}

function applySessionUser(user) {
  state.activeUser = user
    ? {
        id: user.id,
        name: getUserDisplayName(user),
        email: user.email || ''
      }
    : null;
}

function getScopedStorageKey(key) {
  if ((key === STORAGE_KEYS.aquarium || key === STORAGE_KEYS.history) && state.activeUser?.id) {
    return `${key}-${state.activeUser.id}`;
  }

  return key;
}

function isEmailConfirmationPending(result) {
  return Boolean(result?.data?.user) && !result?.data?.session;
}

function getAuthErrorMessage(error, fallbackMessage) {
  const message = error?.message || '';

  if (/invalid login credentials/i.test(message)) {
    return 'E-mail ou senha inválidos.';
  }

  if (/email not confirmed/i.test(message)) {
    return 'Confirme seu e-mail antes de entrar.';
  }

  if (/user already registered/i.test(message)) {
    return 'Esse e-mail já está cadastrado.';
  }

  if (/redirect|redirect url|redirect_to/i.test(message)) {
    return 'As URLs de retorno não estão autorizadas no Supabase. Adicione http://127.0.0.1:5500/members.html e http://127.0.0.1:5500/reset-password.html em Authentication > URL Configuration.';
  }

  if (/rate limit/i.test(message)) {
    return 'Muitas tentativas em pouco tempo. Aguarde um pouco antes de pedir outro e-mail.';
  }

  if (/password/i.test(message) && /6|weak|length/i.test(message)) {
    return 'A senha precisa ser mais forte. Use pelo menos 6 caracteres.';
  }

  if (/signup.*disabled|signups not allowed/i.test(message)) {
    return 'O cadastro por e-mail está desativado no projeto Supabase.';
  }

  if (/error sending confirmation email/i.test(message)) {
    return 'O Supabase não conseguiu enviar o e-mail de confirmação. Verifique em Authentication > Providers > Email se o provedor está ativo e, se estiver usando SMTP próprio, revise host, porta, usuário e remetente.';
  }

  return message || fallbackMessage;
}

async function syncAuthSession() {
  if (!supabaseClient) {
    return;
  }

  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    showNotice('Não foi possível verificar sua sessão no momento.', 'alert');
    return;
  }

  applySessionUser(data.session?.user || null);
}

function bindSupabaseAuthListener() {
  if (!supabaseClient) {
    return;
  }

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    applySessionUser(session?.user || null);
    loadProtectedState();
    refreshProtectedViews();
  });
}

async function requestPasswordReset(email) {
  if (!supabaseClient) {
    showNotice('A recuperação de senha exige a integração com o Supabase.', 'alert');
    return;
  }

  const normalizedEmail = String(email || '').trim();

  if (!normalizedEmail) {
    showNotice('Digite seu e-mail no campo de login para receber o link de redefinição.', 'alert');
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: getPasswordResetUrl()
  });

  if (error) {
    console.error('Erro ao solicitar redefinição de senha', {
      message: error.message,
      status: error.status,
      code: error.code,
      resetUrl: getPasswordResetUrl()
    });
    showNotice(getAuthErrorMessage(error, 'Não foi possível enviar o e-mail de redefinição agora.'), 'alert');
    return;
  }

  showNotice('Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.', 'success');
}

async function changeCurrentUserPassword(newPassword, confirmPassword) {
  if (!supabaseClient) {
    showNotice('A troca de senha exige a integração com o Supabase.', 'alert');
    return;
  }

  if (!state.activeUser) {
    showNotice('Entre na sua conta para alterar a senha.', 'alert');
    return;
  }

  const normalizedPassword = String(newPassword || '');
  const normalizedConfirmPassword = String(confirmPassword || '');

  if (!normalizedPassword || !normalizedConfirmPassword) {
    showNotice('Preencha os dois campos da nova senha.', 'alert');
    return;
  }

  if (normalizedPassword.length < 6) {
    showNotice('A nova senha deve ter pelo menos 6 caracteres.', 'alert');
    return;
  }

  if (normalizedPassword !== normalizedConfirmPassword) {
    showNotice('As senhas não coincidem.', 'alert');
    return;
  }

  const { error } = await supabaseClient.auth.updateUser({ password: normalizedPassword });

  if (error) {
    console.error('Erro ao alterar senha do usuário logado', {
      message: error.message,
      status: error.status,
      code: error.code
    });
    showNotice(getAuthErrorMessage(error, 'Não foi possível alterar sua senha agora.'), 'alert');
    return;
  }

  changePasswordForm?.reset();
  changePasswordForm?.classList.add('hidden');
  if (toggleChangePasswordButton) {
    toggleChangePasswordButton.textContent = 'Alterar senha';
  }
  showNotice('Senha alterada com sucesso.', 'success');
}

function toggleChangePasswordForm(forceOpen) {
  if (!changePasswordForm) {
    return;
  }

  const shouldOpen = typeof forceOpen === 'boolean'
    ? forceOpen
    : changePasswordForm.classList.contains('hidden');

  changePasswordForm.classList.toggle('hidden', !shouldOpen);

  if (toggleChangePasswordButton) {
    toggleChangePasswordButton.textContent = shouldOpen ? 'Cancelar troca de senha' : 'Alterar senha';
  }

  if (!shouldOpen) {
    changePasswordForm.reset();
  }
}

function createReadingId() {
  return `reading-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function parseGhValue(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  const mappings = {
    'muito mole': 2,
    mole: 4,
    'semi-dura': 6,
    dura: 8,
    'muito dura': 10
  };

  return mappings[normalized] ?? null;
}

function formatGhValue(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    const labels = {
      'muito mole': 'Muito mole',
      mole: 'Mole',
      'semi-dura': 'Semi-dura',
      dura: 'Dura',
      'muito dura': 'Muito dura'
    };
    return labels[normalized] || value;
  }

  const numericLabels = {
    2: 'Muito mole',
    4: 'Mole',
    6: 'Semi-dura',
    8: 'Dura',
    10: 'Muito dura'
  };

  return numericLabels[value] || value;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function showConfirmDialog(message, title = 'AquaristaPRO') {
  return new Promise((resolve) => {
    const existingDialog = document.querySelector('.confirm-dialog-backdrop');
    if (existingDialog) {
      existingDialog.remove();
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'confirm-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmDialogTitle" aria-describedby="confirmDialogMessage">
        <div class="confirm-dialog-header">
          <h2 id="confirmDialogTitle">${escapeHtml(title)}</h2>
        </div>
        <div class="confirm-dialog-body">
          <p id="confirmDialogMessage">${escapeHtml(message)}</p>
        </div>
        <div class="confirm-dialog-actions">
          <button type="button" class="confirm-dialog-cancel" data-confirm-cancel>Cancelar</button>
          <button type="button" class="button-secondary confirm-dialog-confirm" data-confirm-accept>Confirmar</button>
        </div>
      </div>
    `;

    const cleanup = (confirmed) => {
      backdrop.remove();
      document.removeEventListener('keydown', handleKeydown);
      resolve(confirmed);
    };

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        cleanup(false);
      }
    };

    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) {
        cleanup(false);
      }
    });

    backdrop.querySelector('[data-confirm-cancel]')?.addEventListener('click', () => {
      cleanup(false);
    });

    backdrop.querySelector('[data-confirm-accept]')?.addEventListener('click', () => {
      cleanup(true);
    });

    document.addEventListener('keydown', handleKeydown);
    document.body.appendChild(backdrop);
    backdrop.querySelector('[data-confirm-cancel]')?.focus();
  });
}

function getFishPhotoMarkup(fish, className = 'merchant-card-photo') {
  const hasPhoto = Boolean(fish.photo);

  return `
    <div class="${className} ${hasPhoto ? `${className}-filled` : ''}">
      ${hasPhoto ? `<img src="${fish.photo}" alt="${fish.name}" loading="lazy" />` : '<span>Espaço para a foto aqui</span>'}
    </div>
  `;
}

function getPasswordToggleIcon(isVisible) {
  if (isVisible) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3 3l18 18"></path>
        <path d="M10.6 10.6a2 2 0 1 0 2.8 2.8"></path>
        <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9.6 4.2 10.9 8-0.5 1.5-1.6 3.2-3.2 4.7"></path>
        <path d="M6.2 6.2C4.2 7.6 2.9 9.8 2 12c1.3 3.8 5.4 8 10 8 1.4 0 2.8-0.3 4-0.8"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M2 12s3.6-8 10-8 10 8 10 8-3.6 8-10 8-10-8-10-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;
}

function updatePasswordToggleButton(button, isVisible) {
  if (!button) {
    return;
  }

  button.innerHTML = getPasswordToggleIcon(isVisible);
  button.setAttribute('aria-label', isVisible ? 'Ocultar senha' : 'Mostrar senha');
  button.setAttribute('title', isVisible ? 'Ocultar senha' : 'Mostrar senha');
  button.classList.toggle('is-visible', isVisible);
}

function getIdealRanges() {
  return {
    temperature: { min: 22, max: 28 },
    ph: { min: 6.2, max: 7.8 },
    gh: { min: 4, max: 8 },
    kh: { min: 3, max: 6 }
  };
}

function getCorrectionTips(aquarium) {
  if (!aquarium) {
    return [];
  }

  const latestReading = getLatestReading();
  if (!latestReading) {
    return [];
  }

  const tips = [];
  const addTip = (key, label, measuredValue, idealValue, link, unit = '', tolerance = 0) => {
    if (measuredValue === null || measuredValue === undefined || measuredValue === '' || idealValue === null || idealValue === undefined || idealValue === '') {
      return;
    }

    if (Math.abs(measuredValue - idealValue) > tolerance) {
      tips.push({
        key,
        label,
        value: measuredValue,
        idealText: `${idealValue}${unit}`,
        link,
        message: `${label} está ${measuredValue}${unit} e o ideal cadastrado é ${idealValue}${unit}.`
      });
    }
  };

  addTip('temperature', 'Temperatura', parseNumericValue(latestReading.temperature), parseNumericValue(aquarium.temperature), 'correcoes.html#temperatura', '°C', 0.6);
  addTip('ph', 'pH', parseNumericValue(latestReading.ph), parseNumericValue(aquarium.ph), 'correcoes.html#ph', '', 0.2);
  addTip('gh', 'GH', parseNumericValue(latestReading.gh), parseNumericValue(aquarium.gh), 'correcoes.html#gh-e-kh', '', 1);
  addTip('kh', 'KH', parseNumericValue(latestReading.kh), parseNumericValue(aquarium.kh), 'correcoes.html#gh-e-kh', '', 1);

  if (parseNumericValue(latestReading.nitrite) > 0) {
    tips.push({
      key: 'nitrite',
      label: 'Nitrito',
      value: latestReading.nitrite,
      idealText: '0',
      link: 'correcoes.html#nitrito',
      message: `Nitrito está ${latestReading.nitrite} e o ideal é 0.`
    });
  }

  if (parseNumericValue(latestReading.ammonia) > 0) {
    tips.push({
      key: 'ammonia',
      label: 'Amônia',
      value: latestReading.ammonia,
      idealText: '0',
      link: 'correcoes.html#amonia',
      message: `Amônia está ${latestReading.ammonia} e o ideal é 0.`
    });
  }

  return tips;
}

function getLatestReading() {
  if (!state.history.length) {
    return null;
  }

  return [...state.history].sort((first, second) => {
    const firstDate = new Date(first.measuredAt || first.savedAt || 0).getTime();
    const secondDate = new Date(second.measuredAt || second.savedAt || 0).getTime();
    return secondDate - firstDate;
  })[0];
}

function toggleReadingForm(forceOpen) {
  if (!readingForm) {
    return;
  }

  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : readingForm.classList.contains('hidden');
  readingForm.classList.toggle('hidden', !shouldOpen);

  if (toggleReadingFormButton) {
    toggleReadingFormButton.textContent = shouldOpen ? 'Fechar formulário' : 'Nova medição';
  }

  if (shouldOpen && readingForm.querySelector('[name="measuredAt"]') && !readingForm.querySelector('[name="measuredAt"]').value) {
    readingForm.querySelector('[name="measuredAt"]').value = getLocalDateTimeValue();
  }
}

function saveReadingData() {
  if (!readingForm || !state.aquarium) {
    return;
  }

  const formData = new FormData(readingForm);
  const data = Object.fromEntries(formData.entries());
  const measuredAt = data.measuredAt || getLocalDateTimeValue();

  const reading = {
    id: createReadingId(),
    measuredAt,
    temperature: parseNumericValue(data.temperature),
    ph: parseNumericValue(data.ph),
    gh: parseGhValue(data.gh),
    ghLabel: data.gh || '',
    kh: parseNumericValue(data.kh),
    nitrite: parseNumericValue(data.nitrite),
    ammonia: parseNumericValue(data.ammonia),
    co2Enabled: data.co2Enabled || '',
    dropCheckerColor: data.dropCheckerColor || '',
    notes: data.notes || ''
  };

  state.history = [...state.history, reading]
    .sort((first, second) => new Date(first.measuredAt || 0).getTime() - new Date(second.measuredAt || 0).getTime())
    .slice(-20);
  saveState();
  readingForm.reset();
  toggleReadingForm(false);
  refreshProtectedViews();
  showNotice('Nova medição salva com sucesso.', 'success');
}

async function deleteReading(readingId) {
  const confirmed = await showConfirmDialog('Deseja realmente excluir esta medição?');
  if (!confirmed) {
    return;
  }

  const nextHistory = state.history.filter((entry) => entry.id !== readingId);

  if (nextHistory.length === state.history.length) {
    showNotice('Não foi possível localizar a medição para excluir.', 'alert');
    return;
  }

  state.history = nextHistory;
  saveState();
  refreshProtectedViews();
  showNotice('Medição excluída com sucesso.', 'success');
}

function renderReadingSummary() {
  if (!latestReadingSummary) {
    return;
  }

  const latestReading = getLatestReading();
  if (!state.aquarium) {
    latestReadingSummary.innerHTML = '<p>Cadastre um aquário para começar a registrar medições.</p>';
    return;
  }

  if (!latestReading) {
    latestReadingSummary.innerHTML = '<p>Use o botão Nova medição para registrar a primeira leitura do aquário.</p>';
    return;
  }

  latestReadingSummary.innerHTML = `
    <div class="summary-grid summary-grid-reading">
      <article>
        <strong>Última leitura</strong>
        <p>${formatDateTime(latestReading.measuredAt)}</p>
      </article>
      <article>
        <strong>Temperatura / pH</strong>
        <p>${latestReading.temperature ?? '--'} °C • ${latestReading.ph ?? '--'}</p>
      </article>
      <article>
        <strong>GH / KH</strong>
        <p>${formatGhValue(latestReading.ghLabel || latestReading.gh) ?? '--'} / ${latestReading.kh ?? '--'}</p>
      </article>
      <article>
        <strong>Nitrito / Amônia</strong>
        <p>${latestReading.nitrite ?? '--'} / ${latestReading.ammonia ?? '--'}</p>
      </article>
    </div>
    <div class="reading-meta">
      <p><strong>CO2:</strong> ${latestReading.co2Enabled || '--'}</p>
      <p><strong>Drop checker:</strong> ${latestReading.dropCheckerColor || '--'}</p>
      <p><strong>Observações:</strong> ${latestReading.notes || 'Sem observações.'}</p>
    </div>
  `;
}

function renderReadingHistory() {
  if (!readingHistory) {
    return;
  }

  if (!state.history.length) {
    readingHistory.innerHTML = '<p>Nenhuma medição registrada ainda.</p>';
    return;
  }

  const items = [...state.history]
    .sort((first, second) => new Date(second.measuredAt || 0).getTime() - new Date(first.measuredAt || 0).getTime())
    .slice(0, 6);

  readingHistory.innerHTML = `
    <h3>Histórico recente</h3>
    <div class="reading-history-list">
      ${items.map((entry) => `
        <article class="reading-card">
          <div class="reading-card-header">
            <strong>${formatDateTime(entry.measuredAt)}</strong>
            <button type="button" class="button-secondary reading-delete-button" data-reading-id="${entry.id}">Excluir</button>
          </div>
          <p>Temp: ${entry.temperature ?? '--'} °C • pH: ${entry.ph ?? '--'} • GH/KH: ${formatGhValue(entry.ghLabel || entry.gh) ?? '--'}/${entry.kh ?? '--'}</p>
          <p>Nitrito: ${entry.nitrite ?? '--'} • Amônia: ${entry.ammonia ?? '--'}</p>
          <p>CO2: ${entry.co2Enabled || '--'} • Drop checker: ${entry.dropCheckerColor || '--'}</p>
        </article>
      `).join('')}
    </div>
  `;

  readingHistory.querySelectorAll('[data-reading-id]').forEach((button) => {
    button.addEventListener('click', () => {
      deleteReading(button.getAttribute('data-reading-id'));
    });
  });
}

function getCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  if (path.includes('members')) {
    return 'members';
  }

  if (path.includes('catalogo')) {
    return 'catalogo';
  }

  return 'index';
}

function renderNavigation() {
  const nav = document.getElementById('site-nav');
  if (!nav) {
    return;
  }

  const currentPage = getCurrentPage();
  const shouldShowFilterToggle = currentPage === 'catalogo' && Boolean(filtersCard);
  const currentQuery = escapeHtml(state.search.query);
  const navLinks = navigationItems
    .filter((item) => item.page !== 'index')
    .map((item) => `
        <a href="${resolveSitePath(item.href)}" class="${item.page === currentPage ? 'active' : ''}">${item.label}</a>
      `)
    .join('');

  nav.innerHTML = `
    <div class="top-nav-mobile-bar">
      ${shouldShowFilterToggle ? `
        
        <button id="mobileFilterToggle" class="nav-utility-btn nav-filter-btn" type="button" aria-expanded="false" aria-controls="catalogFilters" aria-label="Mostrar filtros">
          <span class="nav-filter-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <path d="M3 6h18"></path>
              <path d="M6 12h12"></path>
              <path d="M10 18h4"></path>
              <circle cx="8" cy="6" r="2"></circle>
              <circle cx="15" cy="12" r="2"></circle>
              <circle cx="12" cy="18" r="2"></circle>
            </svg>
          </span>
        </button>
      ` : '<span class="nav-mobile-spacer" aria-hidden="true"></span>'}
      <div class="top-nav-search-host top-nav-search-host-mobile" data-search-host="mobile">
        <a href="${resolveSitePath('index.html')}" class="top-nav-brand">AquaristaPRO</a>
        <button type="button" class="nav-utility-btn nav-search-toggle" data-search-toggle aria-expanded="false" aria-label="Abrir pesquisa">
          <span class="nav-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <circle cx="11" cy="11" r="6"></circle>
              <path d="M20 20l-4.2-4.2"></path>
            </svg>
          </span>
        </button>
        <form class="top-nav-search-form" data-search-form role="search">
          <input type="search" class="top-nav-search-input" data-search-input value="${currentQuery}" placeholder="Pesquisar peixes e páginas" aria-label="Pesquisar peixes e páginas" autocomplete="off" />
          <button type="button" class="nav-search-close" data-search-close aria-label="Fechar pesquisa">&times;</button>
        </form>
        <div class="top-nav-search-suggestions hidden" data-search-suggestions></div>
      </div>
      <button id="mobileNavToggle" class="nav-utility-btn nav-menu-btn" type="button" aria-expanded="false" aria-controls="siteNavLinks" aria-label="Abrir menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <div id="siteNavLinks" class="top-nav-links">
      <div class="top-nav-search-host top-nav-search-host-desktop" data-search-host="desktop">
        <a href="${resolveSitePath('index.html')}" class="top-nav-site-link ${currentPage === 'index' ? 'active' : ''}">AquaristaPRO</a>
        <button type="button" class="nav-search-toggle" data-search-toggle aria-expanded="false" aria-label="Abrir pesquisa">
          <span class="nav-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <circle cx="11" cy="11" r="6"></circle>
              <path d="M20 20l-4.2-4.2"></path>
            </svg>
          </span>
        </button>
        <form class="top-nav-search-form" data-search-form role="search">
          <input type="search" class="top-nav-search-input" data-search-input value="${currentQuery}" placeholder="Pesquisar peixes e páginas" aria-label="Pesquisar peixes e páginas" autocomplete="off" />
          <button type="button" class="nav-search-close" data-search-close aria-label="Fechar pesquisa">&times;</button>
        </form>
        <div class="top-nav-search-suggestions hidden" data-search-suggestions></div>
      </div>
      ${navLinks}
    </div>
  `;

  bindResponsiveNavigation();
  bindNavigationSearch();
  renderNavSearchSuggestions();
}

async function init() {
  state.search.query = getInitialSearchQuery();
  loadState();
  await syncAuthSession();
  bindEvents();
  bindSupabaseAuthListener();
  renderNavigation();
  renderSearchResultsPage();
  setupResponsiveSurface();
  loadFishCatalog();
  renderAuthState();
  renderProducts();
  renderChart();
  renderAquariumSummary();
  refreshProtectedViews();
}

function bindEvents() {
  if (authForm) {
    authForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(authForm);
      await loginUser(formData.get('email'), formData.get('password'));
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      if (!name || !email || !password || !confirmPassword) {
        showNotice('Preencha todos os campos para criar a conta.', 'alert');
        return;
      }

      if (password !== confirmPassword) {
        showNotice('As senhas não coincidem.', 'alert');
        return;
      }

      await createUser(name, email, password);
    });
  }

  if (showLoginButton && showRegisterButton) {
    showLoginButton.addEventListener('click', () => {
      authForm?.classList.remove('hidden');
      registerForm?.classList.add('hidden');
      showLoginButton.classList.add('hidden');
      showRegisterButton.classList.remove('hidden');
      showLoginButton.classList.remove('active');
      showRegisterButton.classList.remove('active');
    });

    showRegisterButton.addEventListener('click', () => {
      authForm?.classList.add('hidden');
      registerForm?.classList.remove('hidden');
      showRegisterButton.classList.add('hidden');
      showLoginButton.classList.remove('hidden');
      showRegisterButton.classList.remove('active');
      showLoginButton.classList.remove('active');
    });
  }

  if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener('click', async () => {
      const emailInput = authForm?.querySelector('[name="email"]');
      await requestPasswordReset(emailInput?.value || '');
    });
  }

  document.querySelectorAll('.password-toggle-btn').forEach((button) => {
    updatePasswordToggleButton(button, false);

    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) {
        return;
      }

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      updatePasswordToggleButton(button, isPassword);
    });
  });

  if (aquariumForm) {
    aquariumForm.addEventListener('submit', (event) => {
      event.preventDefault();
      saveAquariumData();
    });
  }

  if (readingForm) {
    readingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      saveReadingData();
    });
  }

  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(changePasswordForm);
      await changeCurrentUserPassword(
        formData.get('newPassword'),
        formData.get('confirmNewPassword')
      );
    });
  }

  if (toggleChangePasswordButton) {
    toggleChangePasswordButton.addEventListener('click', () => {
      toggleChangePasswordForm();
    });
  }

  if (toggleReadingFormButton) {
    toggleReadingFormButton.addEventListener('click', () => {
      toggleReadingForm();
    });
  }

  if (cancelReadingFormButton) {
    cancelReadingFormButton.addEventListener('click', () => {
      readingForm?.reset();
      toggleReadingForm(false);
    });
  }

  if (fishSelect) {
    fishSelect.addEventListener('change', (event) => {
      const fish = state.fishes.find((item) => item.slug === event.target.value);
      state.selectedFish = fish || null;
      renderFishCard();
      renderCompatibility();
    });
  }

  if (chartParam) {
    chartParam.addEventListener('change', renderChart);
  }

  if (merchantCardButton) {
    merchantCardButton.addEventListener('click', renderMerchantCard);
  }

  if (merchantPrintButton) {
    merchantPrintButton.addEventListener('click', () => window.print());
  }

  if (printSheetPreviewButton) {
    printSheetPreviewButton.addEventListener('click', () => {
      printSheetCanvas?.classList.toggle('hidden');
    });
  }

  if (printSheetButton) {
    printSheetButton.addEventListener('click', printPrintSheet);
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await logoutUser();
    });
  }

  if (deleteAquariumButton) {
    deleteAquariumButton.addEventListener('click', deleteAquariumData);
  }

  if (filtersForm) {
    filtersForm.addEventListener('submit', (event) => {
      event.preventDefault();
      renderFishCards();

      if (isMobileLayout()) {
        setMobileFilterState(false);
      }
    });
  }

  if (closeFiltersButton) {
    closeFiltersButton.addEventListener('click', () => {
      setMobileFilterState(false);
    });
  }

  if (filtersBackdrop) {
    filtersBackdrop.addEventListener('click', () => {
      setMobileFilterState(false);
    });
  }

  window.addEventListener('resize', setupResponsiveSurface);
}

function setMobileNavState(isOpen) {
  const nav = document.getElementById('site-nav');
  const toggleButton = document.getElementById('mobileNavToggle');
  if (!nav || !toggleButton) {
    return;
  }

  nav.classList.toggle('menu-open', isOpen);
  toggleButton.setAttribute('aria-expanded', String(isOpen));
}

function setMobileFilterState(isOpen) {
  const toggleButton = document.getElementById('mobileFilterToggle');
  if (!filtersCard || !toggleButton) {
    return;
  }

  filtersCard.classList.toggle('mobile-open', isOpen);
  toggleButton.setAttribute('aria-expanded', String(isOpen));
  filtersBackdrop?.classList.toggle('hidden', !isOpen);
  document.body.classList.toggle('filters-drawer-open', isOpen);
}

function bindResponsiveNavigation() {
  const navToggle = document.getElementById('mobileNavToggle');
  const filterToggle = document.getElementById('mobileFilterToggle');
  const navLinks = document.querySelectorAll('#siteNavLinks a');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const nav = document.getElementById('site-nav');
      const isOpen = !nav?.classList.contains('menu-open');
      setMobileNavState(isOpen);
    });
  }

  if (filterToggle) {
    filterToggle.addEventListener('click', () => {
      const isOpen = !filtersCard?.classList.contains('mobile-open');
      setMobileFilterState(isOpen);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (isMobileLayout()) {
        setMobileNavState(false);
      }
    });
  });
}

function getSearchEntries() {
  return [
    ...siteSearchEntries.map((entry) => ({
      ...entry,
      href: resolveSitePath(entry.href)
    })),
    ...state.fishes.map((fish) => ({
      id: `fish-${fish.slug}`,
      type: 'fish',
      slug: fish.slug,
      title: fish.name,
      description: fish.description,
      href: buildCatalogSearchUrl(fish.slug, fish.name),
      keywords: `${fish.origin} ${fish.temperament} ${fish.diet} ${fish.group} ${fish.careLevel} ${fish.difficulty}`
    }))
  ];
}

function buildCatalogSearchUrl(fishSlug, searchText = '') {
  const params = new URLSearchParams();

  if (searchText) {
    params.set('search', searchText);
  }

  if (fishSlug) {
    params.set('fish', fishSlug);
  }

  return `${resolveSitePath('catalogo.html')}?${params.toString()}`;
}

function buildSearchResultsUrl(query) {
  const params = new URLSearchParams();
  params.set('q', query.trim());
  return `${resolveSitePath('busca.html')}?${params.toString()}`;
}

function searchSite(query, limit = 6) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) {
    return [];
  }

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return getSearchEntries()
    .map((entry) => {
      const normalizedTitle = normalizeSearchValue(entry.title);
      const normalizedSearchable = normalizeSearchValue(`${entry.title} ${entry.description} ${entry.keywords}`);

      if (!tokens.every((token) => normalizedSearchable.includes(token))) {
        return null;
      }

      let score = 0;

      if (normalizedTitle === normalizedQuery) {
        score += 120;
      } else if (normalizedTitle.startsWith(normalizedQuery)) {
        score += 90;
      } else if (normalizedSearchable.includes(normalizedQuery)) {
        score += 60;
      }

      score += Math.max(0, 18 - normalizedTitle.length);
      score += entry.type === 'page' ? 6 : 0;

      return {
        ...entry,
        score
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, 'pt-BR'))
    .slice(0, limit);
}

function getActiveSearchHost() {
  return document.querySelector(`[data-search-host="${state.search.activeHost}"]`);
}

function syncSearchInputs() {
  document.querySelectorAll('[data-search-input]').forEach((input) => {
    input.value = state.search.query;
  });
}

function setNavSearchState(isOpen, host = state.search.activeHost) {
  const nav = document.getElementById('site-nav');
  state.search.isOpen = isOpen;
  state.search.activeHost = host;
  nav?.classList.toggle('search-open', isOpen);

  document.querySelectorAll('[data-search-host]').forEach((searchHost) => {
    const isActiveHost = searchHost.getAttribute('data-search-host') === host;
    searchHost.classList.toggle('search-active', isOpen && isActiveHost);
    searchHost.querySelector('[data-search-toggle]')?.setAttribute('aria-expanded', String(isOpen && isActiveHost));
  });

  syncSearchInputs();
  renderNavSearchSuggestions();

  if (isOpen) {
    const activeInput = getActiveSearchHost()?.querySelector('[data-search-input]');
    window.requestAnimationFrame(() => {
      activeInput?.focus();
      activeInput?.select();
    });
  }
}

function closeNavSearch() {
  state.search.suggestions = [];
  state.search.activeIndex = -1;
  setNavSearchState(false, state.search.activeHost);
}

function updateNavSearch(query) {
  state.search.query = query;
  state.search.suggestions = searchSite(query, 6);
  state.search.activeIndex = -1;
  syncSearchInputs();
  renderNavSearchSuggestions();
}

function getSearchResultTypeLabel(entry) {
  return entry.type === 'fish' ? 'Peixe' : 'Página';
}

function renderNavSearchSuggestions() {
  document.querySelectorAll('[data-search-suggestions]').forEach((container) => {
    const host = container.closest('[data-search-host]');
    const isActiveHost = host?.getAttribute('data-search-host') === state.search.activeHost;

    if (!state.search.isOpen || !isActiveHost || !state.search.query.trim()) {
      container.classList.add('hidden');
      container.innerHTML = '';
      return;
    }

    if (!state.search.suggestions.length) {
      container.classList.remove('hidden');
      container.innerHTML = `
        <div class="nav-search-empty">
          <p>Nenhum resultado encontrado.</p>
          <a href="${buildSearchResultsUrl(state.search.query)}" class="nav-search-all-results">Ver página de resultados</a>
        </div>
      `;
      return;
    }

    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="nav-search-suggestion-list">
        ${state.search.suggestions.map((entry, index) => `
          <a href="${entry.href}" class="nav-search-suggestion ${index === state.search.activeIndex ? 'is-active' : ''}" data-search-suggestion-index="${index}">
            <span class="nav-search-suggestion-type">${getSearchResultTypeLabel(entry)}</span>
            <strong>${escapeHtml(entry.title)}</strong>
            <span>${escapeHtml(entry.description)}</span>
          </a>
        `).join('')}
        <a href="${buildSearchResultsUrl(state.search.query)}" class="nav-search-all-results">Ver todos os resultados</a>
      </div>
    `;

    container.querySelector('.nav-search-suggestion-list')?.addEventListener('mouseleave', () => {
      state.search.activeIndex = -1;
      renderNavSearchSuggestions();
    });

    container.querySelectorAll('[data-search-suggestion-index]').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        state.search.activeIndex = Number(link.getAttribute('data-search-suggestion-index'));
        renderNavSearchSuggestions();
      });
    });
  });
}

function openHighlightedSuggestion() {
  if (state.search.activeIndex < 0) {
    return false;
  }

  const selected = state.search.suggestions[state.search.activeIndex];
  if (!selected) {
    return false;
  }

  window.location.href = selected.href;
  return true;
}

function submitSearch(query = state.search.query) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return;
  }

  window.location.href = buildSearchResultsUrl(normalizedQuery);
}

function bindNavigationSearch() {
  document.querySelectorAll('[data-search-host]').forEach((host) => {
    const hostName = host.getAttribute('data-search-host');
    const toggle = host.querySelector('[data-search-toggle]');
    const close = host.querySelector('[data-search-close]');
    const form = host.querySelector('[data-search-form]');
    const input = host.querySelector('[data-search-input]');

    toggle?.addEventListener('click', () => {
      setNavSearchState(true, hostName);
    });

    close?.addEventListener('click', () => {
      closeNavSearch();
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();

      if (openHighlightedSuggestion()) {
        return;
      }

      submitSearch(input?.value || '');
    });

    input?.addEventListener('input', (event) => {
      updateNavSearch(event.target.value);
    });

    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeNavSearch();
        return;
      }

      if (!state.search.suggestions.length) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        state.search.activeIndex = Math.min(state.search.activeIndex + 1, state.search.suggestions.length - 1);
        renderNavSearchSuggestions();
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        state.search.activeIndex = Math.max(state.search.activeIndex - 1, 0);
        renderNavSearchSuggestions();
      }
    });
  });

  if (!state.search.hasGlobalListener) {
    document.addEventListener('click', (event) => {
      const nav = document.getElementById('site-nav');
      if (!state.search.isOpen || !nav || nav.contains(event.target)) {
        return;
      }

      closeNavSearch();
    });

    state.search.hasGlobalListener = true;
  }
}

function setupResponsiveSurface() {
  const mobileLayout = isMobileLayout();

  if (filtersCard) {
    filtersCard.id = 'catalogFilters';
  }

  if (state.ui.isMobileLayout !== mobileLayout && state.search.isOpen) {
    setNavSearchState(true, mobileLayout ? 'mobile' : 'desktop');
  }

  state.ui.isMobileLayout = mobileLayout;

  if (!mobileLayout) {
    setMobileNavState(false);
    if (filtersCard) {
      filtersCard.classList.remove('mobile-open');
    }
    filtersBackdrop?.classList.add('hidden');
    document.body.classList.remove('filters-drawer-open');
    return;
  }

  setMobileNavState(false);
  if (filtersCard && !filtersCard.classList.contains('mobile-open')) {
    setMobileFilterState(false);
  }
}

function loadState() {
  try {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');

    if (!supabaseClient) {
      const activeUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.activeUser) || 'null');
      state.activeUser = activeUser;
    }
    state.users = users;
    loadProtectedState();
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage', error);
  }
}

function loadProtectedState() {
  const aquarium = JSON.parse(localStorage.getItem(getScopedStorageKey(STORAGE_KEYS.aquarium)) || 'null');
  const history = JSON.parse(localStorage.getItem(getScopedStorageKey(STORAGE_KEYS.history)) || '[]').map((entry) => ({
    ...entry,
    id: entry.id || createReadingId()
  }));

  state.aquarium = aquarium;
  state.history = history;
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(state.users || []));
  if (!supabaseClient) {
    localStorage.setItem(STORAGE_KEYS.activeUser, JSON.stringify(state.activeUser));
  }
  localStorage.setItem(getScopedStorageKey(STORAGE_KEYS.aquarium), JSON.stringify(state.aquarium));
  localStorage.setItem(getScopedStorageKey(STORAGE_KEYS.history), JSON.stringify(state.history));
}

function refreshProtectedViews() {
  renderAuthState();
  renderAquariumSummary();
  renderReadingSummary();
  renderReadingHistory();
  renderCompatibility();
  renderFishCards();
  renderChart();
  renderProducts();
}

async function createUser(name, email, password) {
  if (supabaseClient) {
    const normalizedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const result = await supabaseClient.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { name: normalizedName },
        emailRedirectTo: getAuthRedirectUrl()
      }
    });

    if (result.error) {
      console.error('Erro ao criar conta', {
        message: result.error.message,
        status: result.error.status,
        code: result.error.code,
        redirectUrl: getAuthRedirectUrl(),
        email: normalizedEmail
      });
      showNotice(getAuthErrorMessage(result.error, 'Não foi possível criar sua conta agora.'), 'alert');
      return;
    }

    showNotice(
      isEmailConfirmationPending(result)
        ? 'Conta criada. Verifique seu e-mail para confirmar o cadastro antes de entrar.'
        : 'Cadastro realizado com sucesso. Você já pode entrar.',
      'success'
    );
    if (registerForm) {
      registerForm.reset();
    }
    if (authForm) {
      authForm.classList.remove('hidden');
    }
    if (registerForm) {
      registerForm.classList.add('hidden');
    }
    if (showLoginButton && showRegisterButton) {
      showLoginButton.classList.add('hidden');
      showRegisterButton.classList.remove('hidden');
      showLoginButton.classList.remove('active');
      showRegisterButton.classList.remove('active');
    }
    return;
  }

  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
  const exists = users.some((item) => item.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    showNotice('Esse e-mail já está cadastrado.', 'alert');
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  state.users = users;
  showNotice('Cadastro realizado com sucesso. Faça login para continuar.', 'success');
  if (registerForm) {
    registerForm.reset();
  }
  if (changePasswordForm) {
    changePasswordForm.reset();
    changePasswordForm.classList.add('hidden');
  }
  if (toggleChangePasswordButton) {
    toggleChangePasswordButton.textContent = 'Alterar senha';
  }
  if (authForm) {
    authForm.classList.remove('hidden');
  }
  if (registerForm) {
    registerForm.classList.add('hidden');
  }
  if (showLoginButton && showRegisterButton) {
    showLoginButton.classList.add('hidden');
    showRegisterButton.classList.remove('hidden');
    showLoginButton.classList.remove('active');
    showRegisterButton.classList.remove('active');
  }
}

async function loginUser(email, password) {
  if (supabaseClient) {
    const result = await supabaseClient.auth.signInWithPassword({ email, password });

    if (result.error) {
      showNotice(getAuthErrorMessage(result.error, 'Não foi possível entrar agora.'), 'alert');
      return;
    }

    applySessionUser(result.data.user);
    loadProtectedState();
    refreshProtectedViews();
    showNotice(`Bem-vindo, ${getUserDisplayName(result.data.user)}!`, 'success');
    if (authForm) {
      authForm.reset();
    }
    return;
  }

  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
  const found = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);

  if (!found) {
    showNotice('E-mail ou senha inválidos.', 'alert');
    return;
  }

  state.activeUser = { name: found.name, email: found.email };
  localStorage.setItem(STORAGE_KEYS.activeUser, JSON.stringify(state.activeUser));
  loadState();
  refreshProtectedViews();
  showNotice(`Bem-vindo, ${found.name}!`, 'success');
  if (authForm) {
    authForm.reset();
  }
}

async function logoutUser() {
  const aquariumStorageKey = getScopedStorageKey(STORAGE_KEYS.aquarium);
  const historyStorageKey = getScopedStorageKey(STORAGE_KEYS.history);

  if (supabaseClient) {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      showNotice('Não foi possível sair da conta agora.', 'alert');
      return;
    }
  }

  state.activeUser = null;
  state.aquarium = null;
  state.history = [];
  if (!supabaseClient) {
    localStorage.removeItem(STORAGE_KEYS.activeUser);
  }
  localStorage.removeItem(aquariumStorageKey);
  localStorage.removeItem(historyStorageKey);
  if (aquariumForm) {
    aquariumForm.reset();
  }
  if (authForm) {
    authForm.reset();
  }
  if (registerForm) {
    registerForm.reset();
  }
  if (authForm) {
    authForm.classList.remove('hidden');
  }
  if (registerForm) {
    registerForm.classList.add('hidden');
  }
  if (showLoginButton && showRegisterButton) {
    showLoginButton.classList.remove('hidden');
    showRegisterButton.classList.remove('hidden');
    showLoginButton.classList.remove('active');
    showRegisterButton.classList.remove('active');
  }
  refreshProtectedViews();
  showNotice('Você saiu da sua conta.', 'success');
}

async function deleteAquariumData() {
  const confirmed = await showConfirmDialog('Deseja realmente excluir este aquário e todo o histórico de medições?');
  if (!confirmed) {
    return;
  }

  state.aquarium = null;
  state.history = [];
  localStorage.removeItem(getScopedStorageKey(STORAGE_KEYS.aquarium));
  localStorage.removeItem(getScopedStorageKey(STORAGE_KEYS.history));
  renderAuthState();
  renderChart();
  renderFishCards();
  renderCompatibility();
  showNotice('Aquário excluído com sucesso.', 'success');
}

function renderAuthState() {
  const isLogged = Boolean(state.activeUser);

  if (authCard) {
    authCard.classList.toggle('hidden', isLogged);
  }

  if (memberPanel) {
    memberPanel.classList.toggle('hidden', !isLogged);
  }

  if (aquariumSection) {
    aquariumSection.classList.toggle('hidden', !isLogged);
  }

  if (readingSection) {
    readingSection.classList.toggle('hidden', !isLogged);
  }

  if (chartSection) {
    chartSection.classList.toggle('hidden', !isLogged);
  }

  if (memberGreeting) {
    memberGreeting.textContent = isLogged
      ? `Olá, ${state.activeUser.name}! Seu painel está pronto para salvar o aquário e acompanhar os parâmetros.`
      : 'Crie sua conta para salvar seu aquário, acompanhar parâmetros e receber compatibilidade em tempo real.';
  }

  if (isLogged) {
    fillAquariumForm();
    renderAquariumSummary();
    renderReadingSummary();
    renderReadingHistory();
    renderCompatibility();
  } else if (aquariumSummary) {
    aquariumSummary.innerHTML = '<p>Entre na área de membros para salvar seu aquário.</p>';
    if (latestReadingSummary) {
      latestReadingSummary.innerHTML = '';
    }
    if (readingHistory) {
      readingHistory.innerHTML = '';
    }
  }
}

function fillAquariumForm() {
  if (!state.aquarium || !aquariumForm) {
    return;
  }

  const fields = ['aquariumName', 'volume', 'type', 'temperature', 'ph', 'gh', 'kh'];
  fields.forEach((field) => {
    const input = aquariumForm.querySelector(`[name="${field}"]`);
    if (input) {
      if (field === 'gh') {
        input.value = state.aquarium.ghLabel || formatGhValue(state.aquarium.gh) || '';
      } else {
        input.value = state.aquarium[field] ?? '';
      }
    }
  });
}

function saveAquariumData() {
  if (!aquariumForm) {
    return;
  }

  const formData = new FormData(aquariumForm);
  const data = Object.fromEntries(formData.entries());

  const normalized = {
    aquariumName: data.aquariumName || 'Aquário principal',
    volume: parseNumericValue(data.volume),
    type: data.type,
    temperature: parseNumericValue(data.temperature),
    ph: parseNumericValue(data.ph),
    gh: parseGhValue(data.gh),
    ghLabel: data.gh || '',
    kh: parseNumericValue(data.kh),
    notes: data.notes || ''
  };

  state.aquarium = normalized;
  saveState();
  refreshProtectedViews();
  showNotice('Aquário salvo com sucesso.', 'success');
}

function renderAquariumSummary() {
  if (!aquariumSummary) {
    return;
  }

  if (!state.aquarium) {
    aquariumSummary.innerHTML = '<p>Cadastre seu aquário para acompanhar os parâmetros principais.</p>';
    return;
  }

  const correctionTips = getCorrectionTips(state.aquarium);
  const tipsMarkup = correctionTips.length ? `
    <div class="correction-tip-box">
      <h4>Ajuda para ajustar o ambiente</h4>
      <ul>
        ${correctionTips.map((tip) => `
          <li>
            <strong>${tip.label}:</strong> ${tip.message}
            <a href="${tip.link}">Ver dica</a>
          </li>
        `).join('')}
      </ul>
    </div>
  ` : '';

  aquariumSummary.innerHTML = `
    <div class="summary-grid">
      <article>
        <strong>${state.aquarium.aquariumName}</strong>
        <p>${state.aquarium.type || 'Aquário'} • ${state.aquarium.volume || 'sem volume'} L</p>
      </article>
      <article>
        <strong>Temperatura</strong>
        <p>${state.aquarium.temperature ?? '--'} °C</p>
      </article>
      <article>
        <strong>pH</strong>
        <p>${state.aquarium.ph ?? '--'}</p>
      </article>
      <article>
        <strong>GH / KH</strong>
        <p>${formatGhValue(state.aquarium.ghLabel || state.aquarium.gh) ?? '--'} / ${state.aquarium.kh ?? '--'}</p>
      </article>
    </div>
    <p class="summary-caption">Os valores acima representam a referência ideal cadastrada para este aquário.</p>
    ${tipsMarkup}
  `;
}

async function loadFishCatalog() {
  try {
    let data;

    if (supabaseClient) {
      try {
        data = await fetchFishCatalogFromSupabase();
      } catch (error) {
        console.error('Erro ao carregar fichas de peixe do Supabase, usando fallback local.', error);
        data = await fetchFishCatalogFallback();
      }
    } else {
      data = await fetchFishCatalogFallback();
    }

    state.fishes = data;
    if (fishSelect) {
      fishSelect.innerHTML = '<option value="">Selecione um peixe</option>' + data
        .map((fish) => `<option value="${fish.slug}">${fish.name}</option>`)
        .join('');
    }

    if (filtersForm) {
      populateFilterOptions();
    }

    const queryFish = applyCatalogSearchParams();
    state.selectedFish = queryFish || data[0] || null;
    if (fishSelect && state.selectedFish) {
      fishSelect.value = state.selectedFish.slug;
    }

    renderFishCard();
    renderCompatibility();
    renderFishCards();
    renderSearchResultsPage();
    renderNavSearchSuggestions();
    refreshProtectedViews();
  } catch (error) {
    console.error('Erro ao carregar fichas de peixe', error);
    if (fishDetails) {
      fishDetails.innerHTML = '<p>Não foi possível carregar o catálogo no momento.</p>';
    }
    if (fishCards) {
      fishCards.innerHTML = '<p>Não foi possível carregar o catálogo no momento.</p>';
    }

    renderSearchResultsPage();
    renderNavSearchSuggestions();
  }
}

function applyCatalogSearchParams() {
  if (!filtersForm) {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const searchValue = params.get('search') || params.get('q') || '';
  const searchInput = filtersForm.querySelector('[name="search"]');

  if (searchInput && searchValue) {
    searchInput.value = searchValue;
  }

  const fishSlug = params.get('fish');
  if (!fishSlug) {
    return null;
  }

  return state.fishes.find((fish) => fish.slug === fishSlug) || null;
}

function populateFilterOptions() {
  if (!filtersForm) {
    return;
  }

  const originSelect = filtersForm.querySelector('[name="origin"]');
  const temperamentSelect = filtersForm.querySelector('[name="temperament"]');
  const dietSelect = filtersForm.querySelector('[name="diet"]');
  const difficultySelect = filtersForm.querySelector('[name="difficulty"]');

  const origins = [...new Set(state.fishes.map((fish) => fish.origin))];
  const temperaments = [...new Set(state.fishes.map((fish) => fish.temperament))];
  const diets = [...new Set(state.fishes.map((fish) => fish.diet))];
  const difficulties = [...new Set(state.fishes.map((fish) => fish.difficulty))];

  if (originSelect) {
    originSelect.innerHTML = '<option value="">Todos</option>' + origins.map((value) => `<option value="${value}">${value}</option>`).join('');
  }

  if (temperamentSelect) {
    temperamentSelect.innerHTML = '<option value="">Todos</option>' + temperaments.map((value) => `<option value="${value}">${value}</option>`).join('');
  }

  if (dietSelect) {
    dietSelect.innerHTML = '<option value="">Todos</option>' + diets.map((value) => `<option value="${value}">${value}</option>`).join('');
  }

  if (difficultySelect) {
    difficultySelect.innerHTML = '<option value="">Todos</option>' + difficulties.map((value) => `<option value="${value}">${value}</option>`).join('');
  }
}

function getFilters() {
  if (!filtersForm) {
    return {};
  }

  const formData = new FormData(filtersForm);
  return {
    search: (formData.get('search') || '').toString().trim().toLowerCase(),
    origin: formData.get('origin') || '',
    temperament: formData.get('temperament') || '',
    diet: formData.get('diet') || '',
    difficulty: formData.get('difficulty') || '',
    tempMin: formData.get('tempMin') ? Number(formData.get('tempMin')) : null,
    tempMax: formData.get('tempMax') ? Number(formData.get('tempMax')) : null,
    phMin: formData.get('phMin') ? Number(formData.get('phMin')) : null,
    phMax: formData.get('phMax') ? Number(formData.get('phMax')) : null,
    ghMin: formData.get('ghMin') ? Number(formData.get('ghMin')) : null,
    ghMax: formData.get('ghMax') ? Number(formData.get('ghMax')) : null,
    khMin: formData.get('khMin') ? Number(formData.get('khMin')) : null,
    khMax: formData.get('khMax') ? Number(formData.get('khMax')) : null,
    aquariumMin: formData.get('aquariumMin') ? Number(formData.get('aquariumMin')) : null
  };
}

function matchesFilters(fish, filters) {
  const searchable = `${fish.name} ${fish.description} ${fish.origin}`.toLowerCase();
  if (filters.search && !searchable.includes(filters.search)) {
    return false;
  }

  if (filters.origin && fish.origin !== filters.origin) {
    return false;
  }

  if (filters.temperament && fish.temperament !== filters.temperament) {
    return false;
  }

  if (filters.diet && fish.diet !== filters.diet) {
    return false;
  }

  if (filters.difficulty && fish.difficulty !== filters.difficulty) {
    return false;
  }

  if (filters.tempMin !== null && fish.parameters.temperature.min < filters.tempMin) {
    return false;
  }

  if (filters.tempMax !== null && fish.parameters.temperature.max > filters.tempMax) {
    return false;
  }

  if (filters.phMin !== null && fish.parameters.ph.min < filters.phMin) {
    return false;
  }

  if (filters.phMax !== null && fish.parameters.ph.max > filters.phMax) {
    return false;
  }

  if (filters.ghMin !== null && fish.parameters.gh.min < filters.ghMin) {
    return false;
  }

  if (filters.ghMax !== null && fish.parameters.gh.max > filters.ghMax) {
    return false;
  }

  if (filters.khMin !== null && fish.parameters.kh.min < filters.khMin) {
    return false;
  }

  if (filters.khMax !== null && fish.parameters.kh.max > filters.khMax) {
    return false;
  }

  if (filters.aquariumMin !== null && fish.minAquariumSize > filters.aquariumMin) {
    return false;
  }

  return true;
}

function getCompatibilityState(fish, aquarium = state.aquarium) {
  if (!aquarium) {
    return {
      statusClass: 'status-warning',
      statusText: 'Aguardando aquário',
      checks: []
    };
  }

  const checks = [];
  const compareRange = (label, aquariumValue, range) => {
    const numericValue = typeof aquariumValue === 'number' ? aquariumValue : Number(aquariumValue);

    if (aquariumValue === undefined || aquariumValue === null || aquariumValue === '' || !Number.isFinite(numericValue)) {
      return { label, status: 'warning', message: `Faltam dados de ${label}.` };
    }

    const min = range.min;
    const max = range.max;
    if (numericValue >= min && numericValue <= max) {
      return { label, status: 'ok', message: `${label} compatível.` };
    }

    const tolerance = (max - min) * 0.1;
    if (numericValue >= min - tolerance && numericValue <= max + tolerance) {
      return { label, status: 'warning', message: `${label} próximo do ideal.` };
    }

    return { label, status: 'error', message: `${label} fora da faixa recomendada.` };
  };

  checks.push(compareRange('Temperatura', aquarium.temperature, fish.parameters.temperature));
  checks.push(compareRange('pH', aquarium.ph, fish.parameters.ph));
  checks.push(compareRange('GH', aquarium.gh, fish.parameters.gh));

  const aquariumVolume = typeof aquarium.volume === 'number' ? aquarium.volume : Number(aquarium.volume);
  if (aquariumVolume === undefined || aquariumVolume === null || aquariumVolume === '' || !Number.isFinite(aquariumVolume)) {
    checks.push({ label: 'Tamanho do aquário', status: 'warning', message: 'Faltam dados de tamanho do aquário.' });
  } else if (aquariumVolume >= fish.minAquariumSize) {
    checks.push({ label: 'Tamanho do aquário', status: 'ok', message: 'Tamanho do aquário compatível.' });
  } else {
    checks.push({ label: 'Tamanho do aquário', status: 'error', message: 'O aquário é menor que o recomendado para este peixe.' });
  }

  const hasError = checks.some((check) => check.status === 'error');
  const hasWarning = checks.some((check) => check.status === 'warning');
  const statusText = hasError ? 'Incompatível' : hasWarning ? 'Compatível com ajustes' : 'Compatível';
  const statusClass = hasError ? 'status-error' : hasWarning ? 'status-warning' : 'status-ok';

  return { statusClass, statusText, checks };
}

function renderFishPhoto(fish) {
  const hasPhoto = Boolean(fish?.photo);

  return `
    <div class="fish-photo ${hasPhoto ? 'fish-photo-filled' : ''}">
      ${hasPhoto ? `<img src="${fish.photo}" alt="${fish.name}" loading="lazy" />` : '<span>Foto em breve</span>'}
    </div>
  `;
}

function renderFishCard() {
  if (!fishDetails) {
    return;
  }

  if (!state.selectedFish) {
    fishDetails.innerHTML = '<p>Selecione um peixe para ver a ficha técnica e a compatibilidade.</p>';
    return;
  }

  const fish = state.selectedFish;
  fishDetails.innerHTML = `
    <div class="fish-card">
      ${renderFishPhoto(fish)}
      <div>
        <h3>${fish.name}</h3>
        <p>${fish.description}</p>
        <p><strong>Origem:</strong> ${fish.origin}</p>
        <p><strong>Tamanho:</strong> ${fish.size}</p>
        <p><strong>Temperatura:</strong> ${fish.parameters.temperature.min}°C a ${fish.parameters.temperature.max}°C</p>
        <p><strong>pH:</strong> ${fish.parameters.ph.min} a ${fish.parameters.ph.max}</p>
        <p><strong>GH:</strong> ${fish.parameters.gh.min} a ${fish.parameters.gh.max}</p>
        <p><strong>Aquário mínimo:</strong> ${fish.minAquariumSize} L</p>
      </div>
      <div class="fish-card-actions">
        <span>${fish.careLevel}</span>
        <span>${fish.group}</span>
      </div>
    </div>
  `;
}

function renderCompatibilityChecks(checks) {
  return `
    <ul class="compatibility-check-list">
      ${checks.map((check) => {
        const marker = check.status === 'error' ? '<span class="compatibility-dot" title="Parâmetro incompatível"></span>' : '';
        return `<li class="${check.status}">${marker}<span>${check.message}</span></li>`;
      }).join('')}
    </ul>
  `;
}

function renderCompatibility() {
  if (!compatibilityResult || !state.selectedFish) {
    return;
  }

  const fish = state.selectedFish;
  const compatibility = getCompatibilityState(fish);

  if (!state.aquarium) {
    compatibilityResult.innerHTML = '<p>Cadastre o aquário e selecione um peixe para verificar a compatibilidade.</p>';
    return;
  }

  compatibilityResult.innerHTML = `
    <div class="${compatibility.statusClass}">
      <h3>${compatibility.statusText}</h3>
      <p>${fish.name} tende a se dar bem com este aquário quando os parâmetros forem ajustados com cuidado.</p>
      ${renderCompatibilityChecks(compatibility.checks)}
    </div>
  `;

  renderProducts(compatibility.checks);
}

function renderFishCards() {
  if (!fishCards || !state.fishes.length) {
    return;
  }

  const filters = getFilters();
  const filtered = state.fishes.filter((fish) => matchesFilters(fish, filters));

  if (!filtered.length) {
    fishCards.innerHTML = '<p>Nenhum peixe corresponde aos filtros aplicados.</p>';
    return;
  }

  fishCards.innerHTML = filtered.map((fish) => {
    const compatibility = getCompatibilityState(fish);

    return `
      <article class="fish-card">
        ${renderFishPhoto(fish)}
        <h3>${fish.name}</h3>
        <p>${fish.description}</p>
        <p><strong>Origem:</strong> ${fish.origin}</p>
        <p><strong>Temperamento:</strong> ${fish.temperament}</p>
        <p><strong>Alimentação:</strong> ${fish.diet}</p>
        <p><strong>Aquário mínimo:</strong> ${fish.minAquariumSize} L</p>
        <p class="${compatibility.statusClass}"><strong>${compatibility.statusText}</strong></p>
        <div class="compatibility-inline">
          <p class="compatibility-inline-title">Parâmetros</p>
          ${state.aquarium ? renderCompatibilityChecks(compatibility.checks) : '<p>Cadastre seu aquário para ver os parâmetros.</p>'}
        </div>
        <div class="fish-card-actions">
          <button type="button" data-fish-slug="${fish.slug}">Ver ficha</button>
          <button type="button" data-merchant-slug="${fish.slug}">Card Lojistas</button>
        </div>
      </article>
    `;
  }).join('');

  fishCards.querySelectorAll('[data-fish-slug]').forEach((button) => {
    button.addEventListener('click', () => {
      const fish = state.fishes.find((item) => item.slug === button.getAttribute('data-fish-slug'));
      if (fish) {
        if (fish.URL) {
          window.location.href = resolveSitePath(fish.URL);
          return;
        }

        state.selectedFish = fish;
        renderFishCard();
        renderCompatibility();
        if (fishSelect) {
          fishSelect.value = fish.slug;
        }
      }
    });
  });

  fishCards.querySelectorAll('[data-merchant-slug]').forEach((button) => {
    button.addEventListener('click', () => {
      const fish = state.fishes.find((item) => item.slug === button.getAttribute('data-merchant-slug'));
      if (fish) {
        state.selectedFish = fish;
        renderMerchantCard();
      }
    });
  });
}

function renderSearchResultsPage() {
  if (!searchResultsPage || !searchResultsSummary || !searchResultsGrid) {
    return;
  }

  const query = getInitialSearchQuery().trim();
  state.search.query = query;

  if (!query) {
    searchResultsSummary.textContent = 'Digite um termo na busca para ver resultados.';
    searchResultsGrid.innerHTML = '<article class="search-result-card"><h3>Comece sua pesquisa</h3><p>Procure por peixes, áreas do site e conteúdos principais do AquaristaPRO.</p></article>';
    return;
  }

  const results = searchSite(query, 24);
  const resultLabel = results.length === 1 ? 'resultado encontrado' : 'resultados encontrados';
  searchResultsSummary.textContent = `${results.length} ${resultLabel} para "${query}".`;

  if (!results.length) {
    searchResultsGrid.innerHTML = '<article class="search-result-card"><h3>Nenhum resultado encontrado</h3><p>Tente termos mais curtos, o nome de um peixe ou uma área do site.</p></article>';
    return;
  }

  searchResultsGrid.innerHTML = results.map((entry) => `
    <article class="search-result-card">
      <p class="search-result-type">${getSearchResultTypeLabel(entry)}</p>
      <h3>${escapeHtml(entry.title)}</h3>
      <p>${escapeHtml(entry.description)}</p>
      <a href="${entry.href}" class="search-result-link">Abrir resultado</a>
    </article>
  `).join('');
}

function renderProducts(checks = []) {
  if (!productList) {
    return;
  }

  const correctionTips = getCorrectionTips(state.aquarium);
  const recommendationBase = [
    {
      title: 'Teste de pH',
      link: 'https://www.amazon.com.br/s?k=teste+de+ph+aquario',
      category: 'pH',
      description: 'Ideal para confirmar a estabilidade do ambiente.'
    },
    {
      title: 'Filtro biológico',
      link: 'https://www.amazon.com.br/s?k=filtro+biologico+aquario',
      category: 'filtração',
      description: 'Ajuda a manter nitrito e amônia sob controle.'
    },
    {
      title: 'Aquecedor com termostato',
      link: 'https://www.amazon.com.br/s?k=aquecedor+aquario+termostato',
      category: 'temperatura',
      description: 'Mantém a temperatura estável para peixes tropicais.'
    },
    {
      title: 'Substrato para plantas',
      link: 'https://www.amazon.com.br/s?k=substrato+plantas+aquaticas',
      category: 'plantas',
      description: 'Ótimo para criar um ambiente mais natural e estável.'
    }
  ];

  const filtered = recommendationBase.filter((item) => {
    const hasIssue = correctionTips.some((tip) => tip.key === 'temperature' && item.category === 'temperatura');
    const hasPhIssue = correctionTips.some((tip) => tip.key === 'ph' && item.category === 'pH');
    const hasHardnessIssue = correctionTips.some((tip) => ['gh', 'kh'].includes(tip.key) && item.category === 'plantas');
    const hasPlants = item.category === 'plantas';
    return hasIssue || hasPhIssue || hasHardnessIssue || hasPlants;
  });

  const view = filtered.length ? filtered : recommendationBase;

  productList.innerHTML = `
    ${view.map((product) => `
      <article class="product-card">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <a href="${product.link}" target="_blank" rel="noopener noreferrer">Ver produto</a>
      </article>
    `).join('')}
    <p class="correction-link">
      <a href="correcoes.html">Abrir página de correções e dicas práticas</a>
    </p>
  `;
}

function renderChart() {
  if (!chartCanvas) {
    return;
  }

  const ctx = chartCanvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const width = chartCanvas.width;
  const height = chartCanvas.height;
  const padding = 48;
  const topPadding = 24;
  const bottomPadding = 56;
  ctx.clearRect(0, 0, width, height);
  ctx.font = '12px aqua, Arial, sans-serif';
  ctx.fillStyle = '#56717d';
  ctx.strokeStyle = '#1f4f6f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, topPadding);
  ctx.lineTo(padding, height - bottomPadding);
  ctx.lineTo(width - padding, height - bottomPadding);
  ctx.stroke();

  const param = chartParam ? chartParam.value : 'temperature';
  const history = state.history.length ? state.history : [{ [param]: state.aquarium?.[param] ?? 0, measuredAt: new Date().toISOString() }];
  const chartPoints = history
    .map((entry) => ({
      value: Number(entry[param]),
      measuredAt: entry.measuredAt || entry.savedAt || new Date().toISOString()
    }))
    .filter((entry) => Number.isFinite(entry.value));

  if (!chartPoints.length) {
    ctx.fillText('Sem dados suficientes para este parâmetro.', padding, height / 2);
    return;
  }

  const values = chartPoints.map((entry) => entry.value);

  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;
  const plotWidth = width - padding * 2;
  const plotHeight = height - topPadding - bottomPadding;
  const valueSteps = 4;

  const formatPointDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '--';
    }

    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const formatPointValue = (value) => {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  };

  ctx.strokeStyle = '#d7ebf2';
  ctx.lineWidth = 1;
  for (let step = 0; step <= valueSteps; step += 1) {
    const ratio = step / valueSteps;
    const y = height - bottomPadding - ratio * plotHeight;
    const axisValue = minValue + ratio * range;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
    ctx.fillStyle = '#56717d';
    ctx.fillText(formatPointValue(axisValue), 8, y + 4);
  }

  ctx.strokeStyle = '#0b7a8a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  chartPoints.forEach((entry, index) => {
    const x = padding + (index / Math.max(chartPoints.length - 1, 1)) * plotWidth;
    const y = height - bottomPadding - ((entry.value - minValue) / range) * plotHeight;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  ctx.fillStyle = '#0b7a8a';
  chartPoints.forEach((entry, index) => {
    const x = padding + (index / Math.max(chartPoints.length - 1, 1)) * plotWidth;
    const y = height - bottomPadding - ((entry.value - minValue) / range) * plotHeight;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#12313f';
    ctx.textAlign = 'center';
    ctx.fillText(formatPointValue(entry.value), x, y - 10);
    ctx.fillStyle = '#56717d';
    ctx.fillText(formatPointDate(entry.measuredAt), x, height - bottomPadding + 18);
    ctx.fillStyle = '#0b7a8a';
  });

  ctx.textAlign = 'left';
}

function renderMerchantCard() {
  if (!state.selectedFish) {
    showNotice('Selecione um peixe antes de gerar o card.', 'alert');
    return;
  }

  if (!merchantCard) {
    return;
  }

  merchantCard.innerHTML = `
    <div class="merchant-card-builder">
      <div class="merchant-card-printable">
        ${getFishPhotoMarkup(state.selectedFish, 'merchant-card-photo')}
        <div class="merchant-card-content">
          <div class="merchant-card-header">
            <h3>${state.selectedFish.name}</h3>
          </div>
          <div class="merchant-card-meta">
            <p><strong>pH:</strong> ${state.selectedFish.parameters.ph.min} a ${state.selectedFish.parameters.ph.max}</p>
            <p><strong>Temperatura:</strong> ${state.selectedFish.parameters.temperature.min} a ${state.selectedFish.parameters.temperature.max} °C</p>
            <p><strong>Tamanho máximo:</strong> ${state.selectedFish.size}</p>
          </div>
          <label class="merchant-price">
            <span>Valor</span>
            <input id="merchantPriceInput" type="text" value="R$ " />
          </label>
        </div>
        <div class="merchant-card-qr-column">
          <p class="merchant-qr-caption">Saiba mais...</p>
          <div class="qr-code-box">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`https://aquaristapro.com/?fish=${state.selectedFish.slug}`)}" alt="QR code do peixe" />
          </div>
          <p class="merchant-brand">AquaristaPRO</p>
        </div>
      </div>
      <div class="merchant-card-builder-actions">
        <button id="addToPrintSheetButton" type="button">Adicionar a folha de impressão A4</button>
      </div>
    </div>
  `;

  merchantCard.classList.remove('hidden');

  const addToPrintSheetButton = document.getElementById('addToPrintSheetButton');
  if (addToPrintSheetButton) {
    addToPrintSheetButton.addEventListener('click', addCurrentMerchantCardToPrintSheet);
  }
}

function addCurrentMerchantCardToPrintSheet() {
  if (!state.selectedFish) {
    showNotice('Selecione um peixe antes de adicionar à folha A4.', 'alert');
    return;
  }

  const priceInput = document.getElementById('merchantPriceInput');
  const price = priceInput ? priceInput.value.trim() || 'R$ ' : 'R$ ';

  state.printSheetCards.push({
    id: `sheet-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    fish: { ...state.selectedFish },
    price
  });

  renderPrintSheet();
  showNotice('Card adicionado à folha de impressão A4.', 'success');
}

function renderPrintSheet() {
  if (!printSheetSection || !printSheetCards) {
    return;
  }

  const hasCards = state.printSheetCards.length > 0;
  printSheetSection.classList.toggle('hidden', !hasCards);

  if (!hasCards) {
    if (printSheetCanvas) {
      printSheetCanvas.classList.add('hidden');
    }
    printSheetCards.innerHTML = '';
    return;
  }

  printSheetCards.innerHTML = state.printSheetCards.map((item) => `
    <article class="merchant-card-printable merchant-card-sheet-item" data-sheet-card-id="${item.id}">
      ${getFishPhotoMarkup(item.fish, 'merchant-card-photo')}
      <div class="merchant-card-content">
        <div class="merchant-card-header">
          <h3>${escapeHtml(item.fish.name)}</h3>
        </div>
        <div class="merchant-card-meta">
          <p><strong>pH:</strong> ${escapeHtml(item.fish.parameters.ph.min)} a ${escapeHtml(item.fish.parameters.ph.max)}</p>
          <p><strong>Temperatura:</strong> ${escapeHtml(item.fish.parameters.temperature.min)} a ${escapeHtml(item.fish.parameters.temperature.max)} °C</p>
          <p><strong>Tamanho máximo:</strong> ${escapeHtml(item.fish.size)}</p>
        </div>
        <label class="merchant-price merchant-price-readonly">
          <span>Valor</span>
          <input type="text" value="${escapeHtml(item.price)}" readonly />
        </label>
      </div>
      <div class="merchant-card-qr-column">
        <p class="merchant-qr-caption">Saiba mais...</p>
        <div class="qr-code-box">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('https://aquaristapro.com/?fish=')}${encodeURIComponent(item.fish.slug)}" alt="QR code do peixe" />
        </div>
        <p class="merchant-brand">AquaristaPRO</p>
      </div>
    </article>
  `).join('');

  if (printSheetPreviewButton) {
    printSheetPreviewButton.innerHTML = `
      <span class="print-sheet-preview-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img" focusable="false">
          <rect x="14" y="8" width="28" height="38" rx="3"></rect>
          <line x1="20" y1="18" x2="36" y2="18"></line>
          <line x1="20" y1="25" x2="36" y2="25"></line>
          <circle cx="42" cy="42" r="9"></circle>
          <line x1="48" y1="48" x2="57" y2="57"></line>
        </svg>
      </span>
      Visualizar folha A4 (${state.printSheetCards.length})
    `;
  }
}

function printPrintSheet() {
  if (!state.printSheetCards.length) {
    showNotice('Adicione ao menos um card na folha A4 antes de imprimir.', 'alert');
    return;
  }

  if (printSheetCanvas) {
    printSheetCanvas.classList.remove('hidden');
  }

  document.body.classList.add('print-sheet-mode');
  window.print();
  document.body.classList.remove('print-sheet-mode');
}

function showNotice(message, type) {
  const targetNotice = state.activeUser && memberNotice ? memberNotice : notice;

  if (!targetNotice) {
    return;
  }

  targetNotice.textContent = message;
  targetNotice.className = `notice ${type}`;
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('storage', () => {
  loadState();
  refreshProtectedViews();
});
