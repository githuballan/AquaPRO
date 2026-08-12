const fishPageState = {
  fish: null
};

const fishPageSupabaseUrl = document.body?.dataset.supabaseUrl || '';
const fishPageSupabaseAnonKey = document.body?.dataset.supabaseAnonKey || '';
const fishPageSupabaseClient = window.supabase?.createClient && fishPageSupabaseUrl && fishPageSupabaseAnonKey
  ? window.supabase.createClient(fishPageSupabaseUrl, fishPageSupabaseAnonKey)
  : null;

const fishPageElements = {
  body: document.body,
  title: document.getElementById('fishName'),
  breadcrumbCurrent: document.getElementById('fishBreadcrumbCurrent'),
  group: document.getElementById('fishGroup'),
  groupDetail: document.getElementById('fishGroupDetail'),
  description: document.getElementById('fishDescription'),
  temperament: document.getElementById('fishTemperament'),
  diet: document.getElementById('fishDiet'),
  minAquarium: document.getElementById('fishMinAquarium'),
  origin: document.getElementById('fishOrigin'),
  size: document.getElementById('fishSize'),
  careLevel: document.getElementById('fishCareLevel'),
  difficulty: document.getElementById('fishDifficulty'),
  temperature: document.getElementById('fishTemperature'),
  ph: document.getElementById('fishPh'),
  gh: document.getElementById('fishGh'),
  kh: document.getElementById('fishKh'),
  nitrite: document.getElementById('fishNitrite'),
  ammonia: document.getElementById('fishAmmonia'),
  behaviorCopy: document.getElementById('fishBehaviorCopy'),
  dietCopy: document.getElementById('fishDietCopy'),
  visualCard: document.getElementById('fishPhotoCard')
};

function getFishPageSlug() {
  return fishPageElements.body?.dataset.fishSlug || '';
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
    minAquariumSize: row.min_aquarium_size_l,
    photo: row.photo_url || '',
    parameters: {
      temperature: {
        min: row.temperature_min,
        max: row.temperature_max
      },
      ph: {
        min: row.ph_min,
        max: row.ph_max
      },
      gh: {
        min: row.gh_min,
        max: row.gh_max
      },
      kh: {
        min: row.kh_min,
        max: row.kh_max
      },
      nitrite: {
        min: row.nitrite_min,
        max: row.nitrite_max
      },
      ammonia: {
        min: row.ammonia_min,
        max: row.ammonia_max
      }
    }
  };
}

async function fetchFishBySlugFromSupabase(slug) {
  if (!fishPageSupabaseClient) {
    throw new Error('Cliente Supabase indisponível para carregar a ficha do peixe.');
  }

  const { data, error } = await fishPageSupabaseClient
    .from('fishes')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapSupabaseFishRow(data) : null;
}

function buildFishParameterText(parameter) {
  if (!parameter) {
    return 'Não informado';
  }

  if (parameter.min === parameter.max) {
    return String(parameter.max);
  }

  return `${parameter.min} a ${parameter.max}`;
}

function buildFishHeroCopy(fish) {
  return `${fish.name} é um peixe do grupo ${fish.group.toLowerCase()}, com comportamento ${fish.temperament.toLowerCase()} e exigências de manejo de nível ${fish.careLevel.toLowerCase()}.`;
}

function buildFishDietCopy(fish) {
  return `A base alimentar do ${fish.name.toLowerCase()} é ${fish.diet.toLowerCase()}, então vale priorizar alimentos compatíveis com esse perfil e observar a resposta do animal ao longo da rotina.`;
}

function renderFishVisual(fish) {
  if (!fishPageElements.visualCard) {
    return;
  }

  if (fish.photo) {
    fishPageElements.visualCard.innerHTML = `<img src="../${fish.photo}" alt="${fish.name}" loading="lazy" />`;
    return;
  }

  fishPageElements.visualCard.innerHTML = `<span>${fish.name}<br />Foto em breve</span>`;
}

function renderFishPage(fish) {
  fishPageState.fish = fish;
  document.title = `${fish.name} | AquaristaPRO`;

  if (fishPageElements.title) {
    fishPageElements.title.textContent = fish.name;
  }

  if (fishPageElements.breadcrumbCurrent) {
    fishPageElements.breadcrumbCurrent.textContent = fish.name;
  }

  if (fishPageElements.group) {
    fishPageElements.group.textContent = fish.group;
  }

  if (fishPageElements.groupDetail) {
    fishPageElements.groupDetail.textContent = fish.group;
  }

  if (fishPageElements.description) {
    fishPageElements.description.textContent = fish.description;
  }

  if (fishPageElements.temperament) {
    fishPageElements.temperament.textContent = fish.temperament;
  }

  if (fishPageElements.diet) {
    fishPageElements.diet.textContent = fish.diet;
  }

  if (fishPageElements.minAquarium) {
    fishPageElements.minAquarium.textContent = fish.minAquariumSize;
  }

  if (fishPageElements.origin) {
    fishPageElements.origin.textContent = fish.origin;
  }

  if (fishPageElements.size) {
    fishPageElements.size.textContent = fish.size;
  }

  if (fishPageElements.careLevel) {
    fishPageElements.careLevel.textContent = fish.careLevel;
  }

  if (fishPageElements.difficulty) {
    fishPageElements.difficulty.textContent = fish.difficulty;
  }

  if (fishPageElements.temperature) {
    fishPageElements.temperature.textContent = `${buildFishParameterText(fish.parameters.temperature)}°C`;
  }

  if (fishPageElements.ph) {
    fishPageElements.ph.textContent = buildFishParameterText(fish.parameters.ph);
  }

  if (fishPageElements.gh) {
    fishPageElements.gh.textContent = buildFishParameterText(fish.parameters.gh);
  }

  if (fishPageElements.kh) {
    fishPageElements.kh.textContent = buildFishParameterText(fish.parameters.kh);
  }

  if (fishPageElements.nitrite) {
    fishPageElements.nitrite.textContent = buildFishParameterText(fish.parameters.nitrite);
  }

  if (fishPageElements.ammonia) {
    fishPageElements.ammonia.textContent = buildFishParameterText(fish.parameters.ammonia);
  }

  if (fishPageElements.behaviorCopy) {
    fishPageElements.behaviorCopy.textContent = buildFishHeroCopy(fish);
  }

  if (fishPageElements.dietCopy) {
    fishPageElements.dietCopy.textContent = buildFishDietCopy(fish);
  }

  renderFishVisual(fish);
}

function showFishPageError(message) {
  const main = document.querySelector('main');
  if (!main) {
    return;
  }

  const notice = document.createElement('p');
  notice.className = 'fish-page-notice';
  notice.textContent = message;
  main.prepend(notice);
}

async function loadFishPage() {
  const slug = getFishPageSlug();
  if (!slug) {
    showFishPageError('Nenhum peixe foi definido para esta página.');
    return;
  }

  try {
    const fish = await fetchFishBySlugFromSupabase(slug);

    if (!fish) {
      showFishPageError('Não foi possível localizar os dados deste peixe.');
      return;
    }

    renderFishPage(fish);
  } catch (error) {
    console.error('Não foi possível carregar os dados do peixe.', error);
    showFishPageError('Não foi possível carregar os dados do peixe no Supabase no momento.');
  }
}

loadFishPage();
