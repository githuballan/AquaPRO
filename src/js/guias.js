/**
 * guias.js
 * Comportamento client-side da seção de Guias/Artigos do AquaristaPRO.
 * JavaScript puro (Vanilla JS), sem dependências externas.
 */

const GUIDE_READING_WORDS_PER_MINUTE = 220;

document.addEventListener('DOMContentLoaded', () => {
  initReadingTime();
  initAutoToc();
  initTocSmoothScroll();
  initTocHighlight();
  initGuideTocDrawer();
  initFaqAccordion();
  initAffiliateTracking();
});

/**
 * Calcula o tempo de leitura do guia com base apenas nos blocos principais
 * de conteúdo, ignorando navegação e outras superfícies do site.
 */
function initReadingTime() {
  const readingTimeElement = document.querySelector('[data-reading-time]');
  if (!readingTimeElement) {
    return;
  }

  const contentSelectors = [
    '.guide-intro-summary',
    '.summary-box',
    '.guide-content',
    '.faq-section',
    '.guide-cta'
  ];

  const textContent = contentSelectors
    .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
    .map((element) => element.textContent?.trim() || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = textContent ? textContent.split(' ').filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / GUIDE_READING_WORDS_PER_MINUTE));

  readingTimeElement.textContent = `⏱ ${readingTime} min de leitura`;
}

/**
 * Gera o sumário automaticamente a partir dos H2 das seções do guia.
 * Isso evita drift entre o conteúdo real e os links do TOC.
 */
function initAutoToc() {
  const tocList = document.querySelector('.guide-toc-list');
  if (!tocList) {
    return;
  }

  const sections = Array.from(document.querySelectorAll('.guide-content > section[id], .faq-section[id]'));
  if (!sections.length) {
    return;
  }

  const tocItems = sections
    .map((section) => {
      const heading = section.querySelector('h2');
      const sectionId = section.id;
      const title = heading?.textContent?.trim();

      if (!heading || !sectionId || !title) {
        return '';
      }

      return `
        <li><a class="guide-toc-link" href="#${sectionId}">${escapeHtml(title)}</a></li>
      `;
    })
    .filter(Boolean)
    .join('');

  if (!tocItems) {
    return;
  }

  tocList.innerHTML = tocItems;
}

/**
 * Rola suavemente até a seção correspondente ao clicar em um link do sumário,
 * respeitando o cabeçalho fixo (scroll-margin-top já é aplicado via CSS).
 */
function initTocSmoothScroll() {
  const tocLinks = document.querySelectorAll('.guide-toc-link');
  if (!tocLinks.length) {
    return;
  }

  tocLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) {
        return;
      }

      const targetSection = document.querySelector(targetId);
      if (!targetSection) {
        return;
      }

      event.preventDefault();
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (history.pushState) {
        history.pushState(null, '', targetId);
      }
    });
  });
}

/**
 * Usa IntersectionObserver para destacar no sumário a seção
 * que está atualmente visível na tela enquanto o usuário rola a página.
 */
function initTocHighlight() {
  const tocLinks = document.querySelectorAll('.guide-toc-link');
  if (!tocLinks.length || !('IntersectionObserver' in window)) {
    return;
  }

  const linkBySectionId = new Map();
  tocLinks.forEach((link) => {
    const sectionId = link.getAttribute('href')?.replace('#', '');
    const section = sectionId ? document.getElementById(sectionId) : null;
    if (section) {
      linkBySectionId.set(section, link);
    }
  });

  if (!linkBySectionId.size) {
    return;
  }

  const setActiveLink = (activeLink) => {
    tocLinks.forEach((link) => link.classList.toggle('is-active', link === activeLink));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveLink(linkBySectionId.get(visibleEntry.target));
      }
    },
    {
      root: null,
      rootMargin: '-96px 0px -60% 0px',
      threshold: [0.1, 0.25, 0.5, 0.75]
    }
  );

  linkBySectionId.forEach((_link, section) => observer.observe(section));
}

/**
 * Controla o sumário como drawer lateral acionado pelo botão fixo.
 */
function initGuideTocDrawer() {
  const toggleButton = document.getElementById('guideTocToggle');
  const toc = document.getElementById('guideToc');
  const backdrop = document.getElementById('guideTocBackdrop');
  const closeButton = document.getElementById('guideTocClose');
  if (!toggleButton || !toc || !backdrop || !closeButton) {
    return;
  }

  const closeToc = () => {
    toc.classList.remove('is-open');
    backdrop.hidden = true;
    toggleButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('guide-toc-open');
  };

  const openToc = () => {
    toc.classList.add('is-open');
    backdrop.hidden = false;
    toggleButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('guide-toc-open');
  };

  toggleButton.addEventListener('click', () => {
    const isOpen = toc.classList.contains('is-open');
    if (isOpen) {
      closeToc();
    } else {
      openToc();
    }
  });

  backdrop.addEventListener('click', closeToc);
  closeButton.addEventListener('click', closeToc);

  toc.querySelectorAll('.guide-toc-link').forEach((link) => {
    link.addEventListener('click', closeToc);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeToc();
    }
  });
}

/**
 * Habilita o comportamento de abrir/fechar (toggle) das respostas do FAQ,
 * fechando as demais perguntas ao abrir uma nova para manter o layout limpo.
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) {
    return;
  }

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) {
      return;
    }

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove('is-open');
        otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) {
          otherAnswer.style.maxHeight = '';
        }
      });

      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

/**
 * Captura cliques nos botões de afiliados e dispara um evento no Google Analytics
 * (gtag) para permitir medir a conversão gerada por cada guia.
 */
function initAffiliateTracking() {
  const affiliateButtons = document.querySelectorAll('.btn-afiliado');
  if (!affiliateButtons.length) {
    return;
  }

  affiliateButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.getAttribute('data-produto') || button.textContent.trim();
      const destination = button.getAttribute('href') || '';

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'clique_afiliado', {
          event_category: 'afiliados',
          event_label: productName,
          page_location: window.location.href,
          link_url: destination
        });
      }
    });
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
