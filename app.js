const STORAGE_KEYS = {
  users: 'aquainfo-users',
  activeUser: 'aquainfo-active-user',
  aquarium: 'aquainfo-aquarium-data',
  history: 'aquainfo-aquarium-history'
};

const TEXT_LIMITS = {
  email: 120,
  password: 72,
  name: 60,
  aquariumName: 60,
  aquariumType: 40,
  aquariumNotes: 300,
  readingNotes: 300
};

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;
const PASSWORD_INPUT_PATTERN = '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,72}';
const PASSWORD_HELP_TEXT = 'Use de 8 a 72 caracteres com pelo menos uma letra maiúscula, uma minúscula e um número.';

const NUMERIC_LIMITS = {
  volume: { min: 1, max: 50000 },
  temperature: { min: 0, max: 40 },
  ph: { min: 0, max: 14 },
  kh: { min: 0, max: 40 },
  nitrite: { min: 0, max: 10 },
  ammonia: { min: 0, max: 10 }
};

const navigationItems = [
  { label: 'AquaristaPRO', href: 'index.html', page: 'index' },
  { label: 'Área de membros', href: 'members.html', page: 'members' },
  {
    label: 'Catalogos',
    page: 'catalogos',
    children: [
      { label: 'Peixes', href: 'catalogo.html', page: 'catalogo' },
      { label: 'Plantas', href: 'catalogo-plantas.html', page: 'catalogo-plantas' }
    ]
  }
];

const siteSearchEntries = [
  {
    id: 'page-home',
    type: 'page',
    title: 'AquaristaPRO',
    description: 'Página inicial com guias, peixes, listas, produtos e próximos passos para o aquarista.',
    href: 'index.html',
    keywords: 'inicio home aquarismo aquario agua doce guias peixes plantas produtos membros'
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
  },
  {
    id: 'page-catalog-plants',
    type: 'page',
    title: 'Catálogo de plantas',
    description: 'Catálogo de plantas com filtros por dificuldade, CO2, iluminação, substrato e perfil low-tech.',
    href: 'catalogo-plantas.html',
    keywords: 'catalogos catalogo plantas low tech co2 iluminacao substrato dificuldade aquario plantado'
  },
  {
    id: 'page-home-guides',
    type: 'page',
    title: 'Guias de aquarismo',
    description: 'Seção da home com destaques editoriais e links para guias fundamentais.',
    href: 'index.html#guias-home',
    keywords: 'guias aquarismo ciclo do nitrogenio filtragem fundamentos artigos'
  },
  {
    id: 'page-home-fishes',
    type: 'page',
    title: 'Fichas de peixes',
    description: 'Seção da home com espécies populares, parâmetros básicos e acesso ao catálogo.',
    href: 'index.html#peixes-home',
    keywords: 'fichas peixes parametros betta corydoras platy catalogo'
  },
  {
    id: 'page-home-plants',
    type: 'page',
    title: 'Plantas de aquário',
    description: 'Seção da home preparada para conteúdos sobre plantas resistentes e low tech.',
    href: 'index.html#plantas-home',
    keywords: 'plantas aquario low tech plantas resistentes plantado'
  },
  {
    id: 'page-home-lists',
    type: 'page',
    title: 'Listas e ideias para iniciantes',
    description: 'Seção da home dedicada a páginas de atração como top 10 peixes fáceis e melhores plantas low tech.',
    href: 'index.html#listas-home',
    keywords: 'top 10 peixes faceis melhores plantas low tech listas iniciante'
  },
  {
    id: 'page-home-products',
    type: 'page',
    title: 'Produtos recomendados',
    description: 'Seção da home com categorias prontas para comparativos e páginas de afiliados.',
    href: 'index.html#produtos-home',
    keywords: 'produtos recomendados afiliados filtros termostatos low tech compras'
  },
  {
    id: 'guide-nitrogen-cycle',
    type: 'page',
    title: 'Ciclo do nitrogênio no aquário',
    description: 'Guia sobre amônia, nitrito, nitrato e estabilidade biológica no aquário.',
    href: 'guias/ciclo-do-nitrogenio-no-aquario.html',
    keywords: 'ciclo nitrogenio ciclagem amonia nitrito nitrato aquario'
  },
  {
    id: 'guide-filtration-stages',
    type: 'page',
    title: 'Estágios da filtragem',
    description: 'Guia sobre filtragem mecânica, biológica e química em aquários de água doce.',
    href: 'guias/estagios-da-filtragem.html',
    keywords: 'filtragem filtro biologica mecanica quimica aquario'
  }
];

const state = {
  users: [],
  fishes: [],
  plants: [],
  selectedFish: null,
  activeUser: null,
  aquarium: null,
  history: [],
  printSheetCards: [],
  plantCatalog: {
    lowTechOnly: false,
    hasLoaded: false,
    hasError: false
  },
  search: {
    isOpen: false,
    activeHost: 'desktop',
    query: '',
    suggestions: [],
    activeIndex: -1,
    hasGlobalListener: false
  },
  ui: {
    isMobileLayout: null,
    hasNavOutsideListener: false
  }
};

const DEFAULT_SUPABASE_URL = 'https://xktobjguguvvoagyteke.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrdG9iamd1Z3V2dm9hZ3l0ZWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzczMDIsImV4cCI6MjEwMTk1MzMwMn0.TtraDjiNvNra7-aUtbDQUeVSfZAMACFBG4lakZ6dRD4';
const supabaseUrl = document.body?.dataset.supabaseUrl || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = document.body?.dataset.supabaseAnonKey || DEFAULT_SUPABASE_ANON_KEY;
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
const toggleAquariumFormButton = document.getElementById('toggleAquariumFormButton');
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
const plantCards = document.getElementById('plantCards');
const plantCatalogSummary = document.getElementById('plantCatalogSummary');
const lowTechToggleButton = document.getElementById('lowTechToggle');
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

function normalizeBoundedText(value, maxLength) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function validatePasswordStrength(password) {
  const normalizedPassword = String(password || '');

  if (!normalizedPassword) {
    return 'Preencha a senha.';
  }

  if (normalizedPassword.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres.';
  }

  if (normalizedPassword.length > TEXT_LIMITS.password) {
    return `A senha deve ter no máximo ${TEXT_LIMITS.password} caracteres.`;
  }

  if (!PASSWORD_PATTERN.test(normalizedPassword)) {
    return PASSWORD_HELP_TEXT;
  }

  return '';
}

function applyInputAttributes(field, attributes) {
  if (!field) {
    return;
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === null || value === undefined || value === false) {
      field.removeAttribute(key);
      return;
    }

    field.setAttribute(key, String(value));
  });
}

function applyFormFieldConstraints() {
  applyInputAttributes(authForm?.querySelector('[name="email"]'), {
    maxlength: TEXT_LIMITS.email,
    autocomplete: 'email',
    inputmode: 'email'
  });
  applyInputAttributes(authForm?.querySelector('[name="password"]'), {
    maxlength: TEXT_LIMITS.password,
    minlength: 8,
    autocomplete: 'current-password'
  });

  applyInputAttributes(registerForm?.querySelector('[name="name"]'), {
    minlength: 2,
    maxlength: TEXT_LIMITS.name,
    autocomplete: 'name'
  });
  applyInputAttributes(registerForm?.querySelector('[name="email"]'), {
    maxlength: TEXT_LIMITS.email,
    autocomplete: 'email',
    inputmode: 'email'
  });
  applyInputAttributes(registerForm?.querySelector('[name="password"]'), {
    minlength: 8,
    maxlength: TEXT_LIMITS.password,
    pattern: PASSWORD_INPUT_PATTERN,
    title: PASSWORD_HELP_TEXT,
    autocomplete: 'new-password'
  });
  applyInputAttributes(registerForm?.querySelector('[name="confirmPassword"]'), {
    minlength: 8,
    maxlength: TEXT_LIMITS.password,
    autocomplete: 'new-password'
  });

  applyInputAttributes(changePasswordForm?.querySelector('[name="newPassword"]'), {
    minlength: 8,
    maxlength: TEXT_LIMITS.password,
    pattern: PASSWORD_INPUT_PATTERN,
    title: PASSWORD_HELP_TEXT,
    autocomplete: 'new-password'
  });
  applyInputAttributes(changePasswordForm?.querySelector('[name="confirmNewPassword"]'), {
    minlength: 8,
    maxlength: TEXT_LIMITS.password,
    autocomplete: 'new-password'
  });

  applyInputAttributes(aquariumForm?.querySelector('[name="aquariumName"]'), {
    minlength: 2,
    maxlength: TEXT_LIMITS.aquariumName
  });
  applyInputAttributes(aquariumForm?.querySelector('[name="volume"]'), {
    min: NUMERIC_LIMITS.volume.min,
    max: NUMERIC_LIMITS.volume.max
  });
  applyInputAttributes(aquariumForm?.querySelector('[name="type"]'), {
    maxlength: TEXT_LIMITS.aquariumType
  });
  applyInputAttributes(aquariumForm?.querySelector('[name="temperature"]'), {
    min: NUMERIC_LIMITS.temperature.min,
    max: NUMERIC_LIMITS.temperature.max
  });
  applyInputAttributes(aquariumForm?.querySelector('[name="ph"]'), {
    min: NUMERIC_LIMITS.ph.min,
    max: NUMERIC_LIMITS.ph.max
  });
  applyInputAttributes(aquariumForm?.querySelector('[name="kh"]'), {
    min: NUMERIC_LIMITS.kh.min,
    max: NUMERIC_LIMITS.kh.max
  });
  applyInputAttributes(aquariumForm?.querySelector('[name="notes"]'), {
    maxlength: TEXT_LIMITS.aquariumNotes
  });

  applyInputAttributes(readingForm?.querySelector('[name="temperature"]'), {
    min: NUMERIC_LIMITS.temperature.min,
    max: NUMERIC_LIMITS.temperature.max
  });
  applyInputAttributes(readingForm?.querySelector('[name="ph"]'), {
    min: NUMERIC_LIMITS.ph.min,
    max: NUMERIC_LIMITS.ph.max
  });
  applyInputAttributes(readingForm?.querySelector('[name="kh"]'), {
    min: NUMERIC_LIMITS.kh.min,
    max: NUMERIC_LIMITS.kh.max
  });
  applyInputAttributes(readingForm?.querySelector('[name="nitrite"]'), {
    min: NUMERIC_LIMITS.nitrite.min,
    max: NUMERIC_LIMITS.nitrite.max
  });
  applyInputAttributes(readingForm?.querySelector('[name="ammonia"]'), {
    min: NUMERIC_LIMITS.ammonia.min,
    max: NUMERIC_LIMITS.ammonia.max
  });
  applyInputAttributes(readingForm?.querySelector('[name="notes"]'), {
    maxlength: TEXT_LIMITS.readingNotes
  });
}

function updateCharacterCounter(field, counter) {
  if (!field || !counter) {
    return;
  }

  const maxLength = Number(field.getAttribute('maxlength'));
  if (!Number.isFinite(maxLength) || maxLength <= 0) {
    return;
  }

  const currentLength = field.value.length;
  const remaining = maxLength - currentLength;
  counter.textContent = `${currentLength}/${maxLength}`;
  counter.classList.toggle('is-near-limit', remaining <= Math.max(10, Math.floor(maxLength * 0.1)));
}

function initCharacterCounters() {
  document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach((field) => {
    if (field.dataset.counterReady === 'true') {
      return;
    }

    const maxLength = Number(field.getAttribute('maxlength'));
    if (!Number.isFinite(maxLength) || maxLength <= 0) {
      return;
    }

    const counter = document.createElement('div');
    counter.className = 'field-counter';
    counter.setAttribute('aria-live', 'polite');

    const anchor = field.closest('.password-input-wrapper') || field;
    anchor.insertAdjacentElement('afterend', counter);

    field.addEventListener('input', () => {
      field.setCustomValidity('');
      updateCharacterCounter(field, counter);
    });

    field.addEventListener('change', () => {
      field.setCustomValidity('');
      updateCharacterCounter(field, counter);
    });

    updateCharacterCounter(field, counter);
    field.dataset.counterReady = 'true';
  });
}

function refreshFormCounters(form) {
  if (!form) {
    return;
  }

  form.querySelectorAll('input[maxlength], textarea[maxlength]').forEach((field) => {
    const anchor = field.closest('.password-input-wrapper') || field;
    const counter = anchor.nextElementSibling;
    if (counter?.classList.contains('field-counter')) {
      updateCharacterCounter(field, counter);
    }
  });
}

function getSiteRootPrefix() {
  const normalizedPath = window.location.pathname.replace(/\\/g, '/');

  if (window.location.protocol === 'file:') {
    const sectionMatch = normalizedPath.match(/\/(plantas|peixes|guias|src|images|font)\//i);
    if (sectionMatch) {
      return '../';
    }

    return '';
  }

  const segments = normalizedPath.split('/').filter(Boolean);
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

function canRegisterServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  if (window.location.protocol === 'file:') {
    return false;
  }

  if (window.location.protocol === 'https:') {
    return true;
  }

  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

async function registerSiteServiceWorker() {
  if (!canRegisterServiceWorker()) {
    return;
  }

  try {
    await navigator.serviceWorker.register(resolveSitePath('sw.js'), { scope: resolveSitePath('') || './' });
  } catch (error) {
    console.error('Erro ao registrar o service worker', error);
  }
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

function mapSupabasePlantRow(row) {
  return {
    slug: row.slug,
    name: row.nome_comum || '',
    scientificName: row.nome_cientifico || '',
    description: row.seo_description || row.hero_summary || row.description || '',
    heroSummary: row.hero_summary || '',
    photo: row.photo_url || '',
    photoAlt: row.photo_alt || '',
    familyOrigin: row.familia_e_origem || '',
    difficulty: row.dificuldade || '',
    placement: row.posicao || '',
    growthRate: row.crescimento || '',
    maxHeight: row.altura_max || '',
    co2: row.co2 || '',
    light: row.iluminacao || '',
    substrate: row.substrato_fertil || '',
    fertilization: row.fertilizacao_recomendada || '',
    phMin: parseNumericValue(row.ph_min),
    phMax: parseNumericValue(row.ph_max),
    tempMin: parseNumericValue(row.temp_min),
    tempMax: parseNumericValue(row.temp_max),
    waterHardness: row.dureza_agua || '',
    khRange: row.kh_faixa || '',
    waterNotes: row.parametros_complementares || '',
    usageType: row.tipo_de_uso || '',
    setupProfile: row.perfil_de_montagem || '',
    URL: row.detail_url || ''
  };
}

function normalizeBooleanField(value) {
  const normalized = String(value ?? '').trim().toLowerCase();

  if (value === true || normalized === 'true' || normalized === 'sim' || normalized === '1') {
    return true;
  }

  if (value === false || normalized === 'false' || normalized === 'nao' || normalized === 'não' || normalized === '0') {
    return false;
  }

  return null;
}

function normalizeBooleanFieldForForm(value) {
  const normalized = normalizeBooleanField(value);
  if (normalized === true) {
    return 'sim';
  }

  if (normalized === false) {
    return 'nao';
  }

  return '';
}

function normalizeLightValue(value) {
  const normalized = String(value ?? '').trim().toLowerCase();

  if (normalized === 'forte') {
    return 'forte';
  }

  if (normalized === 'media' || normalized === 'média') {
    return 'media';
  }

  if (normalized === 'baixa') {
    return 'baixa';
  }

  return '';
}

function mapSupabaseAquariumRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    aquariumName: row.name || 'Aquário principal',
    volume: parseNumericValue(row.volume_l),
    type: row.type || row.type_label || '',
    temperature: parseNumericValue(row.target_temperature),
    ph: parseNumericValue(row.target_ph),
    gh: parseNumericValue(row.target_gh),
    ghLabel: formatGhValue(row.target_gh_label || row.gh_label || row.target_gh) || '',
    kh: parseNumericValue(row.target_kh),
    substratoFertil: normalizeBooleanFieldForForm(row.substrato_fertil),
    co2: normalizeBooleanFieldForForm(row.co2),
    iluminacao: normalizeLightValue(row.iluminacao),
    notes: row.notes || ''
  };
}

function normalizeCo2State(value) {
  if (value === true || value === 'true') {
    return 'ligado';
  }

  if (value === false || value === 'false') {
    return 'desligado';
  }

  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'ligado') {
    return 'ligado';
  }

  if (normalized === 'desligado') {
    return 'desligado';
  }

  return '';
}

function mapCo2StateToDatabase(value) {
  const normalized = normalizeCo2State(value);
  if (normalized === 'ligado') {
    return true;
  }

  if (normalized === 'desligado') {
    return false;
  }

  return null;
}

function mapSupabaseReadingRow(row) {
  return {
    id: row.id,
    measuredAt: row.measured_at,
    temperature: parseNumericValue(row.temperature),
    ph: parseNumericValue(row.ph),
    gh: parseNumericValue(row.gh),
    ghLabel: formatGhValue(row.gh_label || row.target_gh_label || row.gh) || '',
    kh: parseNumericValue(row.kh),
    nitrite: parseNumericValue(row.nitrite),
    ammonia: parseNumericValue(row.ammonia),
    co2Enabled: normalizeCo2State(row.co2_enabled),
    dropCheckerColor: row.drop_checker_color || '',
    notes: row.notes || ''
  };
}

function buildAquariumPayload(data) {
  return {
    user_id: state.activeUser.id,
    name: normalizeBoundedText(data.aquariumName || 'Aquário principal', TEXT_LIMITS.aquariumName) || 'Aquário principal',
    volume_l: parseNumericValue(data.volume),
    type: normalizeBoundedText(data.type, TEXT_LIMITS.aquariumType),
    target_temperature: parseNumericValue(data.temperature),
    target_ph: parseNumericValue(data.ph),
    target_gh: parseGhValue(data.gh),
    target_kh: parseNumericValue(data.kh),
    substrato_fertil: normalizeBooleanField(data.substratoFertil),
    co2: normalizeBooleanField(data.co2),
    iluminacao: normalizeLightValue(data.iluminacao),
    notes: normalizeBoundedText(data.notes, TEXT_LIMITS.aquariumNotes)
  };
}

function buildReadingPayload(data) {
  return {
    aquarium_id: state.aquarium.id,
    measured_at: data.measuredAt || getLocalDateTimeValue(),
    temperature: parseNumericValue(data.temperature),
    ph: parseNumericValue(data.ph),
    gh: parseGhValue(data.gh),
    kh: parseNumericValue(data.kh),
    nitrite: parseNumericValue(data.nitrite),
    ammonia: parseNumericValue(data.ammonia),
    co2_enabled: mapCo2StateToDatabase(data.co2Enabled),
    drop_checker_color: data.dropCheckerColor || null,
    notes: normalizeBoundedText(data.notes, TEXT_LIMITS.readingNotes)
  };
}

async function loadPrivateAquariumFromSupabase() {
  if (!supabaseClient || !state.activeUser?.id) {
    state.aquarium = null;
    state.history = [];
    return;
  }

  const { data: aquariums, error: aquariumError } = await supabaseClient
    .from('aquariums')
    .select('*')
    .eq('user_id', state.activeUser.id)
    .order('created_at', { ascending: true })
    .limit(1);

  if (aquariumError) {
    console.error('Erro ao carregar aquário no Supabase', aquariumError);
    state.aquarium = null;
    state.history = [];
    return;
  }

  const aquarium = mapSupabaseAquariumRow(aquariums?.[0] || null);
  state.aquarium = aquarium;

  if (!aquarium?.id) {
    state.history = [];
    return;
  }

  const { data: readings, error: readingsError } = await supabaseClient
    .from('aquarium_readings')
    .select('*')
    .eq('aquarium_id', aquarium.id)
    .order('measured_at', { ascending: false })
    .limit(20);

  if (readingsError) {
    console.error('Erro ao carregar leituras no Supabase', readingsError);
    state.history = [];
    return;
  }

  state.history = (readings || [])
    .map(mapSupabaseReadingRow)
    .sort((first, second) => new Date(first.measuredAt || 0).getTime() - new Date(second.measuredAt || 0).getTime());
}

function normalizeFishCatalogData(items) {
  return items.map((item) => (item.parameters ? item : mapSupabaseFishRow(item)));
}

function normalizePlantSearchData(items) {
  return items.map((item) => (item.name ? item : mapSupabasePlantRow(item)));
}

async function fetchFishCatalogFromSupabase() {
  if (!supabaseClient) {
    throw new Error('Cliente Supabase indisponível para carregar o catálogo.');
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

async function fetchPlantSearchIndexFromSupabase() {
  if (!supabaseClient) {
    throw new Error('Cliente Supabase indisponível para carregar o índice de plantas.');
  }

  const { data, error } = await supabaseClient
    .from('plantas')
    .select('slug, nome_comum, nome_cientifico, seo_description, hero_summary, description, photo_url, photo_alt, detail_url, familia_e_origem, dificuldade, posicao, crescimento, altura_max, co2, iluminacao, substrato_fertil, fertilizacao_recomendada, ph_min, ph_max, temp_min, temp_max, dureza_agua, kh_faixa, parametros_complementares, tipo_de_uso, perfil_de_montagem')
    .order('nome_comum', { ascending: true });

  if (error) {
    throw error;
  }

  return normalizePlantSearchData(data || []);
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

  if (/password/i.test(message) && /6|8|weak|length/i.test(message)) {
    return `A senha precisa ser mais forte. ${PASSWORD_HELP_TEXT}`;
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
  await loadProtectedState();
}

function bindSupabaseAuthListener() {
  if (!supabaseClient) {
    return;
  }

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    applySessionUser(session?.user || null);
    await loadProtectedState();
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

  const passwordValidationMessage = validatePasswordStrength(normalizedPassword);
  if (passwordValidationMessage) {
    showNotice(passwordValidationMessage, 'alert');
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

function getGhDisplayValue(ghValue, ghLabel = '') {
  const normalizedLabel = String(ghLabel || '').trim();
  if (normalizedLabel) {
    const numericFromLabel = parseNumericValue(normalizedLabel);
    if (numericFromLabel !== null) {
      return formatGhValue(numericFromLabel) || normalizedLabel;
    }

    return formatGhValue(normalizedLabel) || normalizedLabel;
  }

  const numericValue = parseNumericValue(ghValue);
  if (numericValue !== null) {
    return formatGhValue(numericValue) || String(numericValue);
  }

  return '--';
}

function getGhFormValue(ghValue, ghLabel = '') {
  const displayValue = getGhDisplayValue(ghValue, ghLabel);
  return displayValue === '--' ? '' : displayValue.toLowerCase();
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

  addTip('temperature', 'Temperatura', parseNumericValue(latestReading.temperature), parseNumericValue(aquarium.temperature), 'correcoes.html#temperatura', '°C', 2);
  addTip('ph', 'pH', parseNumericValue(latestReading.ph), parseNumericValue(aquarium.ph), 'correcoes.html#ph', '', 0.5);
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

function syncAquariumFormVisibility(forceOpen) {
  if (!aquariumForm) {
    return;
  }

  const hasAquarium = Boolean(state.aquarium);
  const shouldOpen = hasAquarium ? Boolean(forceOpen) : true;

  if (!hasAquarium) {
    aquariumForm.reset();
    refreshFormCounters(aquariumForm);
  }

  aquariumForm.classList.toggle('hidden', !shouldOpen);

  if (toggleAquariumFormButton) {
    toggleAquariumFormButton.classList.toggle('hidden', !hasAquarium);
    toggleAquariumFormButton.textContent = shouldOpen && hasAquarium ? 'Fechar atualização' : 'Atualizar aquário';
  }

  if (deleteAquariumButton) {
    deleteAquariumButton.classList.toggle('hidden', !hasAquarium);
  }
}

async function saveReadingData() {
  if (!readingForm || !state.aquarium) {
    return;
  }

  if (!supabaseClient || !state.aquarium.id) {
    showNotice('Salve um aquário no Supabase antes de registrar medições.', 'alert');
    return;
  }

  const formData = new FormData(readingForm);
  const data = Object.fromEntries(formData.entries());
  const payload = buildReadingPayload(data);

  const { data: insertedReading, error } = await supabaseClient
    .from('aquarium_readings')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    console.error('Erro ao salvar leitura no Supabase', error);
    showNotice('Não foi possível salvar a medição no Supabase agora.', 'alert');
    return;
  }

  const reading = mapSupabaseReadingRow(insertedReading);

  state.history = [...state.history, reading]
    .sort((first, second) => new Date(first.measuredAt || 0).getTime() - new Date(second.measuredAt || 0).getTime())
    .slice(-20);
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

  if (!supabaseClient || !state.aquarium?.id) {
    showNotice('Não foi possível excluir a medição no momento.', 'alert');
    return;
  }

  const { error } = await supabaseClient
    .from('aquarium_readings')
    .delete()
    .eq('id', readingId)
    .eq('aquarium_id', state.aquarium.id);

  if (error) {
    console.error('Erro ao excluir leitura no Supabase', error);
    showNotice('Não foi possível excluir a medição agora.', 'alert');
    return;
  }

  const nextHistory = state.history.filter((entry) => entry.id !== readingId);

  if (nextHistory.length === state.history.length) {
    showNotice('Não foi possível localizar a medição para excluir.', 'alert');
    return;
  }

  state.history = nextHistory;
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
        <p>${getGhDisplayValue(latestReading.gh, latestReading.ghLabel)} / ${latestReading.kh ?? '--'}</p>
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
          <p>Temp: ${entry.temperature ?? '--'} °C • pH: ${entry.ph ?? '--'} • GH/KH: ${getGhDisplayValue(entry.gh, entry.ghLabel)}/${entry.kh ?? '--'}</p>
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

  if (path.includes('catalogo-plantas')) {
    return 'catalogo-plantas';
  }

  if (path.includes('catalogo')) {
    return 'catalogo';
  }

  return 'index';
}

function isCatalogPage(currentPage = getCurrentPage()) {
  return currentPage === 'catalogo' || currentPage === 'catalogo-plantas';
}

function isNavigationItemActive(item, currentPage) {
  if (Array.isArray(item.children) && item.children.length) {
    return item.children.some((child) => child.page === currentPage);
  }

  return item.page === currentPage;
}

function renderNavigationItem(item, currentPage) {
  if (Array.isArray(item.children) && item.children.length) {
    const isActive = isNavigationItemActive(item, currentPage);
    const submenuId = `nav-submenu-${item.page}`;

    return `
      <div class="top-nav-item top-nav-item-parent ${isActive ? 'active' : ''}" data-nav-parent>
        <button type="button" class="top-nav-parent-button ${isActive ? 'active' : ''}" aria-expanded="false" aria-controls="${submenuId}">
          <span>${item.label}</span>
          <span class="top-nav-parent-caret" aria-hidden="true"></span>
        </button>
        <div id="${submenuId}" class="top-nav-submenu" role="menu">
          ${item.children.map((child) => `
            <a href="${resolveSitePath(child.href)}" role="menuitem" class="${child.page === currentPage ? 'active' : ''}">${child.label}</a>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <a href="${resolveSitePath(item.href)}" class="${item.page === currentPage ? 'active' : ''}">${item.label}</a>
  `;
}

function closeAllNavSubmenus(exceptElement = null) {
  document.querySelectorAll('[data-nav-parent]').forEach((wrapper) => {
    if (exceptElement && wrapper === exceptElement) {
      return;
    }

    wrapper.classList.remove('submenu-open');
    wrapper.querySelector('.top-nav-parent-button')?.setAttribute('aria-expanded', 'false');
  });
}

function renderNavigation() {
  const nav = document.getElementById('site-nav');
  if (!nav) {
    return;
  }

  const currentPage = getCurrentPage();
  const shouldShowFilterToggle = isCatalogPage(currentPage) && Boolean(filtersCard);
  const currentQuery = escapeHtml(state.search.query);
  const navLinks = navigationItems
    .filter((item) => item.page !== 'index')
    .map((item) => renderNavigationItem(item, currentPage))
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
          <input type="search" class="top-nav-search-input" data-search-input value="${currentQuery}" placeholder="Pesquisar peixes, plantas e páginas" aria-label="Pesquisar peixes, plantas e páginas" autocomplete="off" />
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
          <input type="search" class="top-nav-search-input" data-search-input value="${currentQuery}" placeholder="Pesquisar peixes, plantas e páginas" aria-label="Pesquisar peixes, plantas e páginas" autocomplete="off" />
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
  renderPlantCatalogPage();
  setupResponsiveSurface();
  registerSiteServiceWorker();
  loadFishCatalog();
  loadPlantSearchIndex();
  renderAuthState();
  renderProducts();
  renderChart();
  renderAquariumSummary();
  refreshProtectedViews();
}

function bindEvents() {
  applyFormFieldConstraints();
  initCharacterCounters();

  if (authForm) {
    authForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!authForm.reportValidity()) {
        return;
      }

      const formData = new FormData(authForm);
      await loginUser(
        normalizeBoundedText(formData.get('email'), TEXT_LIMITS.email).toLowerCase(),
        String(formData.get('password') || '')
      );
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

      if (!registerForm.reportValidity()) {
        return;
      }

      if (!name || !email || !password || !confirmPassword) {
        showNotice('Preencha todos os campos para criar a conta.', 'alert');
        return;
      }

      const passwordValidationMessage = validatePasswordStrength(password);
      if (passwordValidationMessage) {
        registerForm.querySelector('[name="password"]')?.setCustomValidity(passwordValidationMessage);
        registerForm.reportValidity();
        return;
      }

      if (password !== confirmPassword) {
        registerForm.querySelector('[name="confirmPassword"]')?.setCustomValidity('As senhas não coincidem.');
        registerForm.reportValidity();
        showNotice('As senhas não coincidem.', 'alert');
        return;
      }

      await createUser(
        normalizeBoundedText(name, TEXT_LIMITS.name),
        normalizeBoundedText(email, TEXT_LIMITS.email).toLowerCase(),
        String(password || '')
      );
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
    aquariumForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!aquariumForm.reportValidity()) {
        return;
      }

      await saveAquariumData();
    });
  }

  if (readingForm) {
    readingForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!readingForm.reportValidity()) {
        return;
      }

      await saveReadingData();
    });
  }

  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!changePasswordForm.reportValidity()) {
        return;
      }

      const formData = new FormData(changePasswordForm);
      const passwordValidationMessage = validatePasswordStrength(formData.get('newPassword'));
      if (passwordValidationMessage) {
        changePasswordForm.querySelector('[name="newPassword"]')?.setCustomValidity(passwordValidationMessage);
        changePasswordForm.reportValidity();
        return;
      }

      if (String(formData.get('newPassword') || '') !== String(formData.get('confirmNewPassword') || '')) {
        changePasswordForm.querySelector('[name="confirmNewPassword"]')?.setCustomValidity('As senhas não coincidem.');
        changePasswordForm.reportValidity();
        return;
      }

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

  if (toggleAquariumFormButton) {
    toggleAquariumFormButton.addEventListener('click', () => {
      const shouldOpen = aquariumForm?.classList.contains('hidden');
      syncAquariumFormVisibility(shouldOpen);
      if (shouldOpen) {
        fillAquariumForm();
      }
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

      if (plantCards) {
        renderPlantCatalogPage();
      } else {
        renderFishCards();
      }

      if (isMobileLayout()) {
        setMobileFilterState(false);
      }
    });

    filtersForm.addEventListener('reset', () => {
      clearPlantCatalogFilters(false);

      if (plantCards) {
        renderPlantCatalogPage();
      } else {
        renderFishCards();
      }
    });
  }

  if (lowTechToggleButton) {
    lowTechToggleButton.addEventListener('click', () => {
      applyLowTechPreset(!state.plantCatalog.lowTechOnly);
      renderPlantCatalogPage();
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
  const navParentButtons = document.querySelectorAll('.top-nav-parent-button');

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
      closeAllNavSubmenus();

      const nav = document.getElementById('site-nav');
      nav?.classList.remove('menu-open');
      document.getElementById('mobileNavToggle')?.setAttribute('aria-expanded', 'false');

      if (isMobileLayout()) {
        setMobileNavState(false);
      }
    });
  });

  navParentButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const wrapper = button.closest('[data-nav-parent]');
      if (!wrapper) {
        return;
      }

      const shouldOpen = !wrapper.classList.contains('submenu-open');
      closeAllNavSubmenus(wrapper);
      wrapper.classList.toggle('submenu-open', shouldOpen);
      button.setAttribute('aria-expanded', String(shouldOpen));
    });
  });

  if (!state.ui.hasNavOutsideListener) {
    document.addEventListener('click', (event) => {
      closeAllNavSubmenus();

      if (!isMobileLayout()) {
        return;
      }

      const nav = document.getElementById('site-nav');
      if (!nav?.classList.contains('menu-open') || nav.contains(event.target)) {
        return;
      }

      setMobileNavState(false);
    });

    state.ui.hasNavOutsideListener = true;
  }
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
      href: fish.URL ? resolveSitePath(fish.URL) : buildCatalogSearchUrl(fish.slug, fish.name),
      keywords: `${fish.origin} ${fish.temperament} ${fish.diet} ${fish.group} ${fish.careLevel} ${fish.difficulty}`
    })),
    ...state.plants.map((plant) => ({
      id: `plant-${plant.slug}`,
      type: 'plant',
      slug: plant.slug,
      title: plant.name,
      description: plant.description,
      href: resolveSitePath(plant.URL),
      keywords: `${plant.scientificName} ${plant.difficulty} ${plant.placement} ${plant.growthRate} ${plant.maxHeight} ${plant.co2} ${plant.light} ${plant.substrate} ${plant.usageType} ${plant.setupProfile} ${plant.waterHardness} ${plant.khRange} ${plant.heroSummary}`
    }))
  ];
}

function normalizePlantDifficulty(value) {
  const normalized = normalizeSearchValue(value);
  if (normalized.includes('facil')) {
    return 'facil';
  }

  if (normalized.includes('moder')) {
    return 'moderada';
  }

  if (normalized.includes('dific')) {
    return 'dificil';
  }

  return normalized;
}

function normalizePlantCo2(value) {
  const normalized = normalizeSearchValue(value);
  if (!normalized) {
    return '';
  }

  if (normalized.includes('desnecess') || normalized.includes('nao necess') || normalized.includes('opcional')) {
    return 'opcional';
  }

  if (normalized.includes('recomend') || normalized.includes('necess')) {
    return 'recomendado';
  }

  return normalized;
}

function normalizePlantSubstrate(value) {
  const normalized = normalizeSearchValue(value);
  if (!normalized) {
    return '';
  }

  if (normalized.includes('nao') || normalized.includes('desnecess') || normalized.includes('opcional')) {
    return 'opcional';
  }

  if (normalized.includes('recomend')) {
    return 'recomendado';
  }

  if (normalized.includes('obrig')) {
    return 'recomendado';
  }

  return normalized;
}

function normalizePlantLight(value) {
  const normalized = normalizeSearchValue(value);
  if (!normalized) {
    return '';
  }

  if (normalized.includes('baixa')) {
    return 'baixa';
  }

  if (normalized.includes('media')) {
    return 'media';
  }

  if (normalized.includes('alta')) {
    return 'alta';
  }

  return normalized;
}

function normalizeAquariumCompatibilityProfile(aquarium) {
  if (!aquarium) {
    return {
      hasAquarium: false,
      co2: '',
      light: '',
      substrate: '',
      isComplete: false
    };
  }

  const normalizedCo2 = normalizeBooleanField(aquarium.co2);
  const normalizedSubstrate = normalizeBooleanField(aquarium.substratoFertil);
  const light = normalizeLightValue(aquarium.iluminacao);

  return {
    hasAquarium: true,
    co2: normalizedCo2 === true ? 'sim' : normalizedCo2 === false ? 'nao' : '',
    light,
    substrate: normalizedSubstrate === true ? 'sim' : normalizedSubstrate === false ? 'nao' : '',
    isComplete: Boolean((normalizedCo2 === true || normalizedCo2 === false) && (normalizedSubstrate === true || normalizedSubstrate === false) && light)
  };
}

function getLightRank(value) {
  const normalized = normalizePlantLight(value);
  const ranks = {
    baixa: 1,
    media: 2,
    alta: 3,
    forte: 3
  };

  return ranks[normalized] || 0;
}

function buildPlantCompatibilityItem(label, isCompatible, expected, actual) {
  return {
    label,
    isCompatible,
    expected,
    actual
  };
}

function isPlantCo2Compatible(plantCo2Requirement, aquariumCo2) {
  if (!plantCo2Requirement || plantCo2Requirement === 'opcional') {
    return true;
  }

  if (plantCo2Requirement === 'recomendado') {
    return aquariumCo2 === 'sim';
  }

  return true;
}

function isPlantSubstrateCompatible(plantSubstrateRequirement, aquariumSubstrate) {
  if (!plantSubstrateRequirement || plantSubstrateRequirement === 'opcional') {
    return true;
  }

  if (plantSubstrateRequirement === 'recomendado') {
    return aquariumSubstrate === 'sim';
  }

  return true;
}

function isPlantLightCompatible(plantLightRequirement, aquariumLight) {
  if (!plantLightRequirement) {
    return true;
  }

  return getLightRank(aquariumLight) >= getLightRank(plantLightRequirement);
}

function getPlantCompatibilityResult(plant, aquarium = state.aquarium, activeUser = state.activeUser) {
  if (!activeUser) {
    return {
      status: 'guest',
      label: 'Entre para comparar',
      summary: 'Faça login e cadastre seu aquário para verificar a compatibilidade.',
      items: []
    };
  }

  const profile = normalizeAquariumCompatibilityProfile(aquarium);
  if (!profile.hasAquarium) {
    return {
      status: 'no-aquarium',
      label: 'Cadastre seu aquário',
      summary: 'Salve CO2, iluminação e substrato fértil para comparar as plantas.',
      items: []
    };
  }

  const normalizedPlantCo2 = normalizePlantCo2(plant?.co2);
  const normalizedPlantLight = normalizePlantLight(plant?.light);
  const normalizedPlantSubstrate = normalizePlantSubstrate(plant?.substrate);

  const items = [
    buildPlantCompatibilityItem(
      'CO2',
      profile.isComplete ? isPlantCo2Compatible(normalizedPlantCo2, profile.co2) : false,
      normalizedPlantCo2 === 'recomendado' ? 'Recomendado' : 'Opcional',
      profile.co2 === 'sim' ? 'Seu aquário tem CO2' : profile.co2 === 'nao' ? 'Seu aquário não tem CO2' : 'Não informado'
    ),
    buildPlantCompatibilityItem(
      'Iluminação',
      profile.isComplete ? isPlantLightCompatible(normalizedPlantLight, profile.light) : false,
      normalizedPlantLight ? `Exige ${normalizedPlantLight}` : 'Não informada',
      profile.light ? `Seu aquário usa ${profile.light}` : 'Não informada'
    ),
    buildPlantCompatibilityItem(
      'Substrato',
      profile.isComplete ? isPlantSubstrateCompatible(normalizedPlantSubstrate, profile.substrate) : false,
      normalizedPlantSubstrate === 'recomendado' ? 'Recomendado' : 'Opcional',
      profile.substrate === 'sim' ? 'Seu aquário tem substrato fértil' : profile.substrate === 'nao' ? 'Seu aquário não tem substrato fértil' : 'Não informado'
    )
  ];

  if (!profile.isComplete) {
    return {
      status: 'incompatible',
      label: 'Incompatível',
      summary: 'Faltam dados de CO2, iluminação ou substrato fértil no seu aquário.',
      items
    };
  }

  const isCompatible = items.every((item) => item.isCompatible);

  return {
    status: isCompatible ? 'compatible' : 'incompatible',
    label: isCompatible ? 'Compatível' : 'Incompatível',
    summary: isCompatible
      ? 'Os requisitos principais da planta combinam com o perfil salvo do seu aquário.'
      : 'Pelo menos um requisito principal da planta não bate com o seu aquário.',
    items
  };
}

function renderPlantCompatibility(plant) {
  const compatibility = getPlantCompatibilityResult(plant);

  if (compatibility.status === 'compatible') {
    return `
      <section class="plant-compatibility plant-compatibility-${compatibility.status}" aria-label="Compatibilidade da planta com o aquário do usuário">
        <div class="plant-compatibility-header">
          <span class="plant-compatibility-badge">${escapeHtml(compatibility.label)}</span>
        </div>
      </section>
    `;
  }

  if (!compatibility.items.length) {
    return `
      <section class="plant-compatibility plant-compatibility-${compatibility.status}" aria-label="Compatibilidade da planta com o aquário do usuário">
        <div class="plant-compatibility-header">
          <span class="plant-compatibility-badge">${escapeHtml(compatibility.label)}</span>
        </div>
        <p class="plant-compatibility-summary">${escapeHtml(compatibility.summary)}</p>
      </section>
    `;
  }

  const incompatibleItems = compatibility.items.filter((item) => !item.isCompatible);

  return `
    <section class="plant-compatibility plant-compatibility-${compatibility.status}" aria-label="Compatibilidade da planta com o aquário do usuário">
      <div class="plant-compatibility-header">
        <span class="plant-compatibility-badge">${escapeHtml(compatibility.label)}</span>
      </div>
      <ul class="plant-compatibility-list">
        ${incompatibleItems.map((item) => `
          <li class="plant-compatibility-item ${item.isCompatible ? 'is-compatible' : 'is-incompatible'}">
            <strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.expected)}. ${escapeHtml(item.actual)}.
          </li>
        `).join('')}
      </ul>
    </section>
  `;
}

function normalizePlantWaterHardness(value) {
  const normalized = normalizeSearchValue(value);
  if (!normalized) {
    return '';
  }

  if (normalized.includes('muito mole')) {
    return 'muito mole';
  }

  if (normalized.includes('semi-dura') || normalized.includes('semi dura')) {
    return 'semi-dura';
  }

  if (normalized.includes('muito dura')) {
    return 'muito dura';
  }

  if (normalized.includes('baixa a media')) {
    return 'mole';
  }

  if (normalized.includes('media a alta')) {
    return 'dura';
  }

  if (normalized.includes('baixa a alta')) {
    return 'semi-dura';
  }

  if (normalized.includes('mole') || normalized.includes('baixa')) {
    return 'mole';
  }

  if (normalized.includes('dura') || normalized.includes('alta')) {
    return 'dura';
  }

  return normalized;
}

function normalizePlantValue(value) {
  return normalizeSearchValue(value);
}

function createSelectOptions(values, labelAll = 'Todos') {
  const uniqueValues = [...new Set(values.filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, 'pt-BR'));

  return `<option value="">${labelAll}</option>${uniqueValues.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('')}`;
}

function populatePlantFilterOptions() {
  if (!filtersForm || !plantCards) {
    return;
  }

  const difficultySelect = filtersForm.querySelector('[name="difficulty"]');
  const placementSelect = filtersForm.querySelector('[name="placement"]');
  const growthSelect = filtersForm.querySelector('[name="growthRate"]');
  const lightSelect = filtersForm.querySelector('[name="light"]');
  const waterHardnessSelect = filtersForm.querySelector('[name="waterHardness"]');

  if (difficultySelect) {
    difficultySelect.innerHTML = [
      '<option value="">Todas</option>',
      '<option value="facil">Fácil</option>',
      '<option value="moderada">Moderada</option>',
      '<option value="dificil">Difícil</option>'
    ].join('');
  }

  if (placementSelect) {
    placementSelect.innerHTML = createSelectOptions(state.plants.map((plant) => plant.placement), 'Todas');
  }

  if (growthSelect) {
    growthSelect.innerHTML = createSelectOptions(state.plants.map((plant) => plant.growthRate), 'Todas');
  }

  if (lightSelect) {
    lightSelect.innerHTML = [
      '<option value="">Todas</option>',
      '<option value="baixa">Baixa</option>',
      '<option value="media">Média</option>',
      '<option value="alta">Alta</option>'
    ].join('');
  }

  const co2Select = filtersForm.querySelector('[name="co2"]');
  if (co2Select) {
    co2Select.innerHTML = [
      '<option value="">Todos</option>',
      '<option value="opcional">Opcional</option>',
      '<option value="recomendado">Recomendado</option>'
    ].join('');
  }

  const substrateSelect = filtersForm.querySelector('[name="substrate"]');
  if (substrateSelect) {
    substrateSelect.innerHTML = [
      '<option value="">Todos</option>',
      '<option value="opcional">Opcional</option>',
      '<option value="recomendado">Recomendado</option>'
    ].join('');
  }

  if (waterHardnessSelect) {
    waterHardnessSelect.innerHTML = [
      '<option value="">Todas</option>',
      '<option value="muito mole">Muito mole</option>',
      '<option value="mole">Mole</option>',
      '<option value="semi-dura">Semi-dura</option>',
      '<option value="dura">Dura</option>',
      '<option value="muito dura">Muito dura</option>'
    ].join('');
  }
}

function syncLowTechToggleUi() {
  if (!lowTechToggleButton) {
    return;
  }

  lowTechToggleButton.classList.toggle('is-active', state.plantCatalog.lowTechOnly);
  lowTechToggleButton.setAttribute('aria-pressed', String(state.plantCatalog.lowTechOnly));
}

function clearPlantCatalogFilters(shouldResetForm = true) {
  if (!filtersForm) {
    return;
  }

  if (shouldResetForm) {
    filtersForm.reset();
  }

  applyLowTechPreset(false);
}

function applyLowTechPreset(shouldEnable) {
  state.plantCatalog.lowTechOnly = shouldEnable;

  if (!filtersForm) {
    syncLowTechToggleUi();
    return;
  }

  const co2Field = filtersForm.querySelector('[name="co2"]');
  const substrateField = filtersForm.querySelector('[name="substrate"]');
  const difficultyField = filtersForm.querySelector('[name="difficulty"]');
  const lightField = filtersForm.querySelector('[name="light"]');

  if (shouldEnable) {
    if (co2Field) {
      co2Field.value = 'opcional';
    }
    if (substrateField) {
      substrateField.value = 'opcional';
    }
    if (difficultyField) {
      difficultyField.value = 'facil';
    }
    if (lightField) {
      lightField.value = 'baixa';
    }
  } else {
    if (co2Field?.value === 'opcional') {
      co2Field.value = '';
    }
    if (substrateField?.value === 'opcional') {
      substrateField.value = '';
    }
    if (difficultyField?.value === 'facil') {
      difficultyField.value = '';
    }
    if (lightField?.value === 'baixa') {
      lightField.value = '';
    }
  }

  syncLowTechToggleUi();
}

function applyPlantCatalogSearchParams() {
  if (!filtersForm || !plantCards) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const fieldNames = ['search', 'difficulty', 'placement', 'growthRate', 'light', 'co2', 'substrate', 'waterHardness', 'phMin', 'phMax', 'tempMin', 'tempMax'];

  fieldNames.forEach((fieldName) => {
    const field = filtersForm.querySelector(`[name="${fieldName}"]`);
    const value = params.get(fieldName);
    if (field && value !== null) {
      field.value = value;
    }
  });

  const lowTechParam = params.get('lowTech');
  state.plantCatalog.lowTechOnly = lowTechParam === '1';
  if (state.plantCatalog.lowTechOnly) {
    applyLowTechPreset(true);
  } else {
    syncLowTechToggleUi();
  }
}

function getPlantFilters() {
  if (!filtersForm) {
    return {};
  }

  const formData = new FormData(filtersForm);
  return {
    search: (formData.get('search') || '').toString().trim().toLowerCase(),
    difficulty: (formData.get('difficulty') || '').toString(),
    placement: (formData.get('placement') || '').toString(),
    growthRate: (formData.get('growthRate') || '').toString(),
    light: (formData.get('light') || '').toString(),
    co2: (formData.get('co2') || '').toString(),
    substrate: (formData.get('substrate') || '').toString(),
    waterHardness: (formData.get('waterHardness') || '').toString(),
    phMin: formData.get('phMin') ? Number(formData.get('phMin')) : null,
    phMax: formData.get('phMax') ? Number(formData.get('phMax')) : null,
    tempMin: formData.get('tempMin') ? Number(formData.get('tempMin')) : null,
    tempMax: formData.get('tempMax') ? Number(formData.get('tempMax')) : null
  };
}

function matchesPlantFilters(plant, filters) {
  const searchable = normalizePlantValue(`${plant.name} ${plant.scientificName} ${plant.description} ${plant.heroSummary} ${plant.familyOrigin} ${plant.usageType} ${plant.setupProfile}`);
  if (filters.search && !searchable.includes(normalizePlantValue(filters.search))) {
    return false;
  }

  if (filters.difficulty && normalizePlantDifficulty(plant.difficulty) !== filters.difficulty) {
    return false;
  }

  if (filters.placement && plant.placement !== filters.placement) {
    return false;
  }

  if (filters.growthRate && plant.growthRate !== filters.growthRate) {
    return false;
  }

  if (filters.light && normalizePlantLight(plant.light) !== filters.light) {
    return false;
  }

  if (filters.co2 && normalizePlantCo2(plant.co2) !== filters.co2) {
    return false;
  }

  if (filters.substrate && normalizePlantSubstrate(plant.substrate) !== filters.substrate) {
    return false;
  }

  if (filters.waterHardness && normalizePlantWaterHardness(plant.waterHardness) !== filters.waterHardness) {
    return false;
  }

  if (filters.phMin !== null && (plant.phMin === null || plant.phMin > filters.phMin)) {
    return false;
  }

  if (filters.phMax !== null && (plant.phMax === null || plant.phMax < filters.phMax)) {
    return false;
  }

  if (filters.tempMin !== null && (plant.tempMin === null || plant.tempMin > filters.tempMin)) {
    return false;
  }

  if (filters.tempMax !== null && (plant.tempMax === null || plant.tempMax < filters.tempMax)) {
    return false;
  }

  return true;
}

function updatePlantCatalogUrl(filters) {
  if (!plantCards) {
    return;
  }

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) {
      return;
    }

    params.set(key, String(value));
  });

  if (state.plantCatalog.lowTechOnly) {
    params.set('lowTech', '1');
  }

  const nextUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.replaceState({}, '', nextUrl);
}

function formatPlantRange(minimum, maximum, suffix = '') {
  if (minimum === null && maximum === null) {
    return 'Não informado';
  }

  if (minimum !== null && maximum !== null) {
    return `${minimum}${suffix} a ${maximum}${suffix}`;
  }

  if (minimum !== null) {
    return `A partir de ${minimum}${suffix}`;
  }

  return `Até ${maximum}${suffix}`;
}

function renderPlantPhoto(plant) {
  const hasPhoto = Boolean(plant?.photo);
  const photoAlt = escapeHtml(plant?.photoAlt || `Foto da planta ${plant?.name || ''}`.trim());

  return `
    <div class="fish-photo plant-photo ${hasPhoto ? 'fish-photo-filled' : ''}">
      ${hasPhoto ? `<img src="${escapeHtml(plant.photo)}" alt="${photoAlt}" loading="lazy" />` : '<span>Foto em breve</span>'}
    </div>
  `;
}

function renderPlantCatalogPage() {
  if (!plantCards) {
    return;
  }

  syncLowTechToggleUi();

  if (!state.plantCatalog.hasLoaded) {
    if (plantCatalogSummary) {
      plantCatalogSummary.textContent = 'Carregando catálogo de plantas...';
    }
    plantCards.innerHTML = '<article class="plant-catalog-empty card"><h3>Preparando as plantas</h3><p>Estamos carregando as fichas com base nas seções técnicas e de parâmetros de água.</p></article>';
    return;
  }

  if (state.plantCatalog.hasError) {
    if (plantCatalogSummary) {
      plantCatalogSummary.textContent = 'Não foi possível carregar o catálogo de plantas agora.';
    }
    plantCards.innerHTML = '<article class="plant-catalog-empty card"><h3>Catálogo indisponível</h3><p>A conexão com a base de plantas falhou. Tente novamente em instantes.</p></article>';
    return;
  }

  const filters = getPlantFilters();
  updatePlantCatalogUrl(filters);
  const filtered = state.plants.filter((plant) => matchesPlantFilters(plant, filters));

  if (plantCatalogSummary) {
    const label = filtered.length === 1 ? 'planta encontrada' : 'plantas encontradas';
    const lowTechLabel = state.plantCatalog.lowTechOnly ? ' com o filtro Apenas Low-Tech ativo' : '';
    plantCatalogSummary.textContent = `${filtered.length} ${label}${lowTechLabel}.`;
  }

  if (!filtered.length) {
    plantCards.innerHTML = '<article class="plant-catalog-empty card"><h3>Nenhuma planta encontrada</h3><p>Ajuste os filtros de CO2, substrato, dificuldade ou parâmetros de água para ampliar os resultados.</p></article>';
    return;
  }

  plantCards.innerHTML = filtered.map((plant) => {
    const plantHref = resolveSitePath(plant.URL);

    return `
    <article class="fish-card plant-card" data-plant-url="${plantHref}" tabindex="0">
      ${renderPlantPhoto(plant)}
      <div class="fish-card-header-row plant-card-header-row">
        <div>
          <h3>${escapeHtml(plant.name)}</h3>
          <p class="plant-card-scientific-name">${escapeHtml(plant.scientificName || 'Nome científico não informado')}</p>
        </div>
        <span class="plant-difficulty-badge">${escapeHtml(plant.difficulty || 'Sem nível')}</span>
      </div>
      <div class="plant-card-meta-grid">
        <p><strong>Posição:</strong> ${escapeHtml(plant.placement || 'Não informado')}</p>
        <p><strong>Porte:</strong> ${escapeHtml(plant.maxHeight || 'Não informado')}</p>
        <p><strong>Crescimento:</strong> ${escapeHtml(plant.growthRate || 'Não informado')}</p>
        <p><strong>CO2:</strong> ${escapeHtml(plant.co2 || 'Não informado')}</p>
        <p><strong>Iluminação:</strong> ${escapeHtml(plant.light || 'Não informado')}</p>
        <p><strong>Substrato:</strong> ${escapeHtml(plant.substrate || 'Não informado')}</p>
      </div>
      ${renderPlantCompatibility(plant)}
      <div class="fish-card-actions plant-card-actions">
        <a href="${plantHref}" class="plant-card-link">Abrir ficha da planta</a>
      </div>
    </article>
  `;
  }).join('');

  plantCards.querySelectorAll('[data-plant-url]').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) {
        return;
      }

      const targetUrl = card.getAttribute('data-plant-url');
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      if (event.target.closest('a, button')) {
        return;
      }

      event.preventDefault();
      const targetUrl = card.getAttribute('data-plant-url');
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    });
  });
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

function getPublicSiteOrigin() {
  return 'https://aquaristapro.com';
}

function buildFishPublicUrl(fish) {
  if (!fish) {
    return getPublicSiteOrigin();
  }

  if (fish.URL) {
    return new URL(resolveSitePath(fish.URL), getPublicSiteOrigin()).toString();
  }

  return new URL(buildCatalogSearchUrl(fish.slug, fish.name), getPublicSiteOrigin()).toString();
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
  if (entry.type === 'fish') {
    return 'Peixe';
  }

  if (entry.type === 'plant') {
    return 'Planta';
  }

  return 'Página';
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
    localStorage.removeItem(STORAGE_KEYS.users);
    localStorage.removeItem(STORAGE_KEYS.activeUser);

    if (!supabaseClient) {
      state.activeUser = null;
      state.users = [];
      state.aquarium = null;
      state.history = [];
      return;
    }

    state.users = [];
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage', error);
  }
}

async function loadProtectedState() {
  await loadPrivateAquariumFromSupabase();
}

function saveState() {
  return;
}

function refreshProtectedViews() {
  renderAuthState();
  renderAquariumSummary();
  renderReadingSummary();
  renderReadingHistory();
  renderCompatibility();
  renderPlantCatalogPage();
  renderFishCards();
  renderChart();
  renderProducts();
}

async function createUser(name, email, password) {
  if (!supabaseClient) {
    showNotice('Não foi possível conectar ao Supabase para criar a conta.', 'alert');
    return;
  }

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
}

async function loginUser(email, password) {
  if (!supabaseClient) {
    showNotice('Não foi possível conectar ao Supabase para entrar na conta.', 'alert');
    return;
  }

  const result = await supabaseClient.auth.signInWithPassword({ email, password });

  if (result.error) {
    showNotice(getAuthErrorMessage(result.error, 'Não foi possível entrar agora.'), 'alert');
    return;
  }

  applySessionUser(result.data.user);
  await loadProtectedState();
  refreshProtectedViews();
  showNotice(`Bem-vindo, ${getUserDisplayName(result.data.user)}!`, 'success');
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

  if (!supabaseClient || !state.activeUser?.id || !state.aquarium?.id) {
    showNotice('Não foi possível localizar um aquário salvo no Supabase para excluir.', 'alert');
    return;
  }

  const { error } = await supabaseClient
    .from('aquariums')
    .delete()
    .eq('id', state.aquarium.id)
    .eq('user_id', state.activeUser.id);

  if (error) {
    console.error('Erro ao excluir aquário no Supabase', error);
    showNotice('Não foi possível excluir o aquário agora.', 'alert');
    return;
  }

  state.aquarium = null;
  state.history = [];
  localStorage.removeItem(getScopedStorageKey(STORAGE_KEYS.aquarium));
  localStorage.removeItem(getScopedStorageKey(STORAGE_KEYS.history));
  refreshProtectedViews();
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
    syncAquariumFormVisibility(false);
    renderAquariumSummary();
    renderReadingSummary();
    renderReadingHistory();
    renderCompatibility();
  } else if (aquariumSummary) {
    aquariumSummary.innerHTML = '<p>Entre na área de membros para salvar seu aquário.</p>';
    syncAquariumFormVisibility(true);
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

  const fields = ['aquariumName', 'volume', 'type', 'temperature', 'ph', 'gh', 'kh', 'substratoFertil', 'co2', 'iluminacao'];
  fields.forEach((field) => {
    const input = aquariumForm.querySelector(`[name="${field}"]`);
    if (input) {
      if (field === 'gh') {
        input.value = getGhFormValue(state.aquarium.gh, state.aquarium.ghLabel);
      } else {
        input.value = state.aquarium[field] ?? '';
      }
    }
  });

  const notesInput = aquariumForm.querySelector('[name="notes"]');
  if (notesInput) {
    notesInput.value = state.aquarium.notes || '';
  }

  refreshFormCounters(aquariumForm);
}

async function saveAquariumData() {
  if (!aquariumForm) {
    return;
  }

  if (!supabaseClient || !state.activeUser?.id) {
    showNotice('Entre na sua conta para salvar o aquário no Supabase.', 'alert');
    return;
  }

  const formData = new FormData(aquariumForm);
  const data = Object.fromEntries(formData.entries());
  const payload = buildAquariumPayload(data);

  let result;
  if (state.aquarium?.id) {
    result = await supabaseClient
      .from('aquariums')
      .update(payload)
      .eq('id', state.aquarium.id)
      .eq('user_id', state.activeUser.id)
      .select('*')
      .single();
  } else {
    result = await supabaseClient
      .from('aquariums')
      .insert(payload)
      .select('*')
      .single();
  }

  if (result.error) {
    console.error('Erro ao salvar aquário no Supabase', result.error);
    showNotice('Não foi possível salvar o aquário no Supabase agora.', 'alert');
    return;
  }

  state.aquarium = mapSupabaseAquariumRow(result.data);
  refreshProtectedViews();
  syncAquariumFormVisibility(false);
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
        <p>${getGhDisplayValue(state.aquarium.gh, state.aquarium.ghLabel)} / ${state.aquarium.kh ?? '--'}</p>
      </article>
    </div>
    <p class="summary-caption">Os valores acima representam a referência ideal cadastrada para este aquário.</p>
    ${tipsMarkup}
  `;
}

async function loadFishCatalog() {
  try {
    const data = await fetchFishCatalogFromSupabase();

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
      fishDetails.innerHTML = '<p>Não foi possível carregar o catálogo do Supabase no momento.</p>';
    }
    if (fishCards) {
      fishCards.innerHTML = '<p>Não foi possível carregar o catálogo do Supabase no momento.</p>';
    }

    renderSearchResultsPage();
    renderNavSearchSuggestions();
  }
}

async function loadPlantSearchIndex() {
  try {
    const data = await fetchPlantSearchIndexFromSupabase();
    state.plants = data;
    state.plantCatalog.hasLoaded = true;
    state.plantCatalog.hasError = false;

    if (plantCards && filtersForm) {
      populatePlantFilterOptions();
      applyPlantCatalogSearchParams();
    }
  } catch (error) {
    state.plants = [];
    state.plantCatalog.hasLoaded = true;
    state.plantCatalog.hasError = true;
    console.error('Erro ao carregar índice de plantas', error);
  }

  renderPlantCatalogPage();
  renderSearchResultsPage();
  renderNavSearchSuggestions();
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

  if (filters.tempMin !== null && fish.parameters.temperature.min > filters.tempMin) {
    return false;
  }

  if (filters.tempMax !== null && fish.parameters.temperature.max < filters.tempMax) {
    return false;
  }

  if (filters.phMin !== null && fish.parameters.ph.min > filters.phMin) {
    return false;
  }

  if (filters.phMax !== null && fish.parameters.ph.max < filters.phMax) {
    return false;
  }

  if (filters.ghMin !== null && fish.parameters.gh.min > filters.ghMin) {
    return false;
  }

  if (filters.ghMax !== null && fish.parameters.gh.max < filters.ghMax) {
    return false;
  }

  if (filters.khMin !== null && fish.parameters.kh.min > filters.khMin) {
    return false;
  }

  if (filters.khMax !== null && fish.parameters.kh.max < filters.khMax) {
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
      status: 'no-aquarium',
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
  const status = hasError || hasWarning ? 'incompatible' : 'compatible';
  const statusText = hasError || hasWarning ? 'Incompatível' : 'Compatível';
  const statusClass = hasError ? 'status-error' : hasWarning ? 'status-warning' : 'status-ok';

  return { status, statusClass, statusText, checks };
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
  const incompatibleChecks = checks.filter((check) => check.status !== 'ok');

  if (!incompatibleChecks.length) {
    return '';
  }

  return `
    <ul class="plant-compatibility-list fish-compatibility-list">
      ${incompatibleChecks.map((check) => `<li class="plant-compatibility-item is-incompatible">${escapeHtml(check.label)}</li>`).join('')}
    </ul>
  `;
}

function renderFishCompatibilityInline(compatibility) {
  if (!compatibility) {
    return '';
  }

  return `
    <section class="plant-compatibility plant-compatibility-${compatibility.status} fish-compatibility-inline" aria-label="Compatibilidade do peixe com o aquário do usuário">
      <div class="plant-compatibility-header">
        <span class="plant-compatibility-badge">${escapeHtml(compatibility.statusText)}</span>
      </div>
      ${renderCompatibilityChecks(compatibility.checks)}
    </section>
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
    ${renderFishCompatibilityInline(compatibility)}
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
        <div class="fish-card-header-row">
          <h3>${fish.name}</h3>
          <button type="button" class="fish-card-inline-button" data-fish-slug="${fish.slug}">Ver ficha</button>
        </div>
        <p><strong>Origem:</strong> ${fish.origin}</p>
        <p><strong>Temperamento:</strong> ${fish.temperament}</p>
        <p><strong>Alimentação:</strong> ${fish.diet}</p>
        <p><strong>Aquário mínimo:</strong> ${fish.minAquariumSize} L</p>
        ${state.aquarium ? renderFishCompatibilityInline(compatibility) : '<p>Cadastre seu aquário para ver os parâmetros.</p>'}
        <div class="fish-card-actions">
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
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(buildFishPublicUrl(state.selectedFish))}" alt="QR code do peixe" />
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
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(buildFishPublicUrl(item.fish))}" alt="QR code do peixe" />
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
