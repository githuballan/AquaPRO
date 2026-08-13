const fishPageState = {
  fish: null
};

const fishPageSupplementalPath = document.body?.dataset.fishContentPath || '../data/fish_pages.json';
const fishPageSupabaseUrl = document.body?.dataset.supabaseUrl || '';
const fishPageSupabaseAnonKey = document.body?.dataset.supabaseAnonKey || '';
const fishPageSupabaseClient = window.supabase?.createClient && fishPageSupabaseUrl && fishPageSupabaseAnonKey
  ? window.supabase.createClient(fishPageSupabaseUrl, fishPageSupabaseAnonKey)
  : null;

const fishPageElements = {
  body: document.body,
  metaDescription: document.querySelector('meta[name="description"]'),
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
  visualCard: document.getElementById('fishPhotoCard'),
  popularName: document.getElementById('fishPopularName'),
  popularNameDetail: document.getElementById('fishPopularNameDetail'),
  popularNames: document.getElementById('fishPopularNames'),
  popularNamesSummary: document.getElementById('fishPopularNamesSummary'),
  scientificName: document.getElementById('fishScientificName'),
  scientificNameHero: document.getElementById('fishScientificNameHero'),
  familyBiome: document.getElementById('fishFamilyBiome'),
  difficultyHero: document.getElementById('fishDifficultyHero'),
  hardness: document.getElementById('fishHardness'),
  tankLength: document.getElementById('fishTankLength'),
  waterFlow: document.getElementById('fishWaterFlow'),
  behaviorList: document.getElementById('fishBehaviorList'),
  feedingText: document.getElementById('fishFeedingText'),
  reproductionText: document.getElementById('fishReproductionText'),
  plantText: document.getElementById('fishPlantText'),
  adultSize: document.getElementById('fishAdultSize'),
  lifespan: document.getElementById('fishLifespan'),
  section7Notes: document.getElementById('fishSection7Notes'),
  faqList: document.getElementById('fishFaqList')
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

function mapSupplementalFishRow(row) {
  if (!row || typeof row !== 'object') {
    return null;
  }

  return {
    slug: row.slug,
    scientificName: row.scientific_name || '',
    popularNames: Array.isArray(row.popular_names) ? row.popular_names : [],
    familyName: row.family_name || '',
    biomeOrigin: row.biome_origin || '',
    tankLengthMinCm: row.tank_length_min_cm,
    waterFlowLabel: row.water_flow_label || '',
    socialBehavior: row.social_behavior || '',
    schoolMinCount: row.school_min_count,
    aquariumZone: row.aquarium_zone || '',
    compatibleSpecies: Array.isArray(row.compatible_species) ? row.compatible_species : [],
    incompatibleSpecies: Array.isArray(row.incompatible_species) ? row.incompatible_species : [],
    feedingAcceptance: row.feeding_acceptance || '',
    feedingFrequencyText: row.feeding_frequency_text || '',
    sexualDimorphism: row.sexual_dimorphism || '',
    reproductionType: row.reproduction_type || '',
    reproductionDifficulty: row.reproduction_difficulty || '',
    plantCompatibility: row.plant_compatibility || '',
    substrateRecommendation: row.substrate_recommendation || '',
    hidingNeed: row.hiding_need || '',
    adultSizeCmMin: row.adult_size_cm_min,
    adultSizeCmMax: row.adult_size_cm_max,
    lifespanYearsMin: row.lifespan_years_min,
    lifespanYearsMax: row.lifespan_years_max,
    heroSummary: row.hero_summary || '',
    section3Notes: row.section_3_notes || '',
    section4Text: row.section_4_text || '',
    section5Text: row.section_5_text || '',
    section6Text: row.section_6_text || '',
    section7Notes: row.section_7_notes || '',
    faqItems: Array.isArray(row.faq_items) ? row.faq_items : [],
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || ''
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

async function fetchSupplementalFishContent(slug) {
  try {
    const response = await fetch(fishPageSupplementalPath, { cache: 'no-cache' });
    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const records = Array.isArray(payload)
      ? payload
      : payload && typeof payload === 'object'
        ? Object.values(payload)
        : [];

    const match = records.find((entry) => entry?.slug === slug);
    return mapSupplementalFishRow(match);
  } catch (error) {
    console.warn('Não foi possível carregar o JSON complementar da ficha.', error);
    return null;
  }
}

function mergeFishData(baseFish, supplementalFish) {
  if (!supplementalFish) {
    return baseFish;
  }

  return {
    ...baseFish,
    supplemental: supplementalFish
  };
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

function setText(element, value) {
  if (!element || value === null || value === undefined || value === '') {
    return;
  }

  element.textContent = String(value);
}

function buildDelimitedRange(minValue, maxValue, suffix = '') {
  if (minValue === null || minValue === undefined || minValue === '') {
    return maxValue || '';
  }

  if (maxValue === null || maxValue === undefined || maxValue === '') {
    return `${minValue}${suffix}`;
  }

  if (minValue === maxValue) {
    return `${minValue}${suffix}`;
  }

  return `${minValue} a ${maxValue}${suffix}`;
}

function renderTextList(element, items) {
  if (!element || !Array.isArray(items) || !items.length) {
    return;
  }

  element.innerHTML = items
    .map((item) => `<li>${item}</li>`)
    .join('');
}

function renderFaqList(element, items) {
  if (!element || !Array.isArray(items) || !items.length) {
    return;
  }

  element.innerHTML = items
    .filter((item) => item?.question && item?.answer)
    .map((item) => `
      <li>
        <strong>${item.question}</strong>
        <p>${item.answer}</p>
      </li>
    `)
    .join('');
}

function buildFamilyBiomeText(supplementalFish, fish) {
  if (!supplementalFish) {
    return fish.origin || '';
  }

  const familyName = supplementalFish.familyName || '';
  const biomeOrigin = supplementalFish.biomeOrigin || '';
  return [familyName, biomeOrigin].filter(Boolean).join(' / ');
}

function buildHardnessText(fish) {
  const ghText = buildFishParameterText(fish.parameters.gh);
  const khText = buildFishParameterText(fish.parameters.kh);
  return `GH ${ghText} / KH ${khText}`;
}

function buildBehaviorItems(fish, supplementalFish) {
  if (!supplementalFish) {
    return [];
  }

  const items = [];
  if (fish.temperament) {
    items.push(`Temperamento geral: ${fish.temperament}.`);
  }
  if (supplementalFish.socialBehavior) {
    items.push(`Hábito social: ${supplementalFish.socialBehavior}.`);
  }
  if (supplementalFish.schoolMinCount) {
    items.push(`Grupo mínimo sugerido: ${supplementalFish.schoolMinCount} indivíduos.`);
  }
  if (supplementalFish.aquariumZone) {
    items.push(`Zona do aquário ocupada: ${supplementalFish.aquariumZone}.`);
  }
  if (supplementalFish.compatibleSpecies.length) {
    items.push(`Compatíveis com cautela: ${supplementalFish.compatibleSpecies.join(', ')}.`);
  }
  if (supplementalFish.incompatibleSpecies.length) {
    items.push(`Incompatíveis e riscos: ${supplementalFish.incompatibleSpecies.join(', ')}.`);
  }
  if (supplementalFish.section3Notes) {
    items.push(supplementalFish.section3Notes);
  }

  return items;
}

function buildFeedingText(fish, supplementalFish) {
  if (!supplementalFish) {
    return buildFishDietCopy(fish);
  }

  return [
    fish.diet ? `${fish.name} tem hábito alimentar ${fish.diet.toLowerCase()}.` : '',
    supplementalFish.feedingAcceptance,
    supplementalFish.feedingFrequencyText,
    supplementalFish.section4Text
  ].filter(Boolean).join(' ');
}

function buildReproductionText(supplementalFish) {
  if (!supplementalFish) {
    return '';
  }

  return [
    supplementalFish.sexualDimorphism,
    supplementalFish.reproductionType ? `Tipo de reprodução: ${supplementalFish.reproductionType}.` : '',
    supplementalFish.reproductionDifficulty ? `Dificuldade de reprodução: ${supplementalFish.reproductionDifficulty}.` : '',
    supplementalFish.section5Text
  ].filter(Boolean).join(' ');
}

function buildPlantText(supplementalFish) {
  if (!supplementalFish) {
    return '';
  }

  return [
    supplementalFish.plantCompatibility,
    supplementalFish.substrateRecommendation ? `Substrato recomendado: ${supplementalFish.substrateRecommendation}.` : '',
    supplementalFish.hidingNeed ? `Necessidade de esconderijos: ${supplementalFish.hidingNeed}.` : '',
    supplementalFish.section6Text
  ].filter(Boolean).join(' ');
}

function buildAdultSizeText(fish, supplementalFish) {
  if (supplementalFish && (supplementalFish.adultSizeCmMin || supplementalFish.adultSizeCmMax)) {
    return `${buildDelimitedRange(supplementalFish.adultSizeCmMin, supplementalFish.adultSizeCmMax, ' cm')}`;
  }

  return fish.size;
}

function buildLifespanText(supplementalFish) {
  if (!supplementalFish) {
    return '';
  }

  return buildDelimitedRange(supplementalFish.lifespanYearsMin, supplementalFish.lifespanYearsMax, ' anos');
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
  const supplementalFish = fish.supplemental || null;
  document.title = `${supplementalFish?.seoTitle || fish.name} | AquaristaPRO`.replace(' | AquaristaPRO | AquaristaPRO', ' | AquaristaPRO');

  if (fishPageElements.metaDescription && supplementalFish?.seoDescription) {
    fishPageElements.metaDescription.setAttribute('content', supplementalFish.seoDescription);
  }

  setText(fishPageElements.title, fish.name);
  setText(fishPageElements.breadcrumbCurrent, fish.name);
  setText(fishPageElements.group, fish.group);
  setText(fishPageElements.groupDetail, fish.group);
  setText(fishPageElements.description, supplementalFish?.heroSummary || fish.description);
  setText(fishPageElements.temperament, fish.temperament);
  setText(fishPageElements.diet, fish.diet);
  setText(fishPageElements.minAquarium, fish.minAquariumSize);
  setText(fishPageElements.origin, fish.origin);
  setText(fishPageElements.size, fish.size);
  setText(fishPageElements.careLevel, fish.careLevel);
  setText(fishPageElements.difficulty, fish.difficulty);
  setText(fishPageElements.popularName, fish.name);
  setText(fishPageElements.popularNameDetail, fish.name);
  setText(fishPageElements.popularNames, supplementalFish?.popularNames?.join(', '));
  setText(fishPageElements.popularNamesSummary, supplementalFish?.popularNames?.join(', '));
  setText(fishPageElements.scientificName, supplementalFish?.scientificName || fish.name);
  setText(fishPageElements.scientificNameHero, supplementalFish?.scientificName || fish.name);
  setText(fishPageElements.familyBiome, buildFamilyBiomeText(supplementalFish, fish));
  setText(fishPageElements.difficultyHero, fish.difficulty || fish.careLevel);

  setText(fishPageElements.temperature, `${buildFishParameterText(fish.parameters.temperature)}°C`);
  setText(fishPageElements.ph, buildFishParameterText(fish.parameters.ph));
  setText(fishPageElements.gh, buildFishParameterText(fish.parameters.gh));
  setText(fishPageElements.kh, buildFishParameterText(fish.parameters.kh));
  setText(fishPageElements.nitrite, buildFishParameterText(fish.parameters.nitrite));
  setText(fishPageElements.ammonia, buildFishParameterText(fish.parameters.ammonia));
  setText(fishPageElements.hardness, buildHardnessText(fish));
  setText(fishPageElements.tankLength, supplementalFish?.tankLengthMinCm ? `Frente mínima de ${supplementalFish.tankLengthMinCm} cm` : '');
  setText(fishPageElements.waterFlow, supplementalFish?.waterFlowLabel);

  setText(fishPageElements.behaviorCopy, buildFishHeroCopy(fish));
  setText(fishPageElements.dietCopy, buildFishDietCopy(fish));
  setText(fishPageElements.feedingText, buildFeedingText(fish, supplementalFish));
  setText(fishPageElements.reproductionText, buildReproductionText(supplementalFish));
  setText(fishPageElements.plantText, buildPlantText(supplementalFish));
  setText(fishPageElements.adultSize, buildAdultSizeText(fish, supplementalFish));
  setText(fishPageElements.lifespan, buildLifespanText(supplementalFish));
  setText(fishPageElements.section7Notes, supplementalFish?.section7Notes);

  renderTextList(fishPageElements.behaviorList, buildBehaviorItems(fish, supplementalFish));
  renderFaqList(fishPageElements.faqList, supplementalFish?.faqItems);

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
    const [fish, supplementalFish] = await Promise.all([
      fetchFishBySlugFromSupabase(slug),
      fetchSupplementalFishContent(slug)
    ]);

    if (!fish) {
      showFishPageError('Não foi possível localizar os dados deste peixe.');
      return;
    }

    renderFishPage(mergeFishData(fish, supplementalFish));
  } catch (error) {
    console.error('Não foi possível carregar os dados do peixe.', error);
    showFishPageError('Não foi possível carregar os dados do peixe no Supabase no momento.');
  }
}

loadFishPage();
