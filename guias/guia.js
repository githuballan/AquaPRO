/**
 * guia.js
 * Comportamento client-side das páginas de guia do AquaristaPRO.
 * JavaScript puro (Vanilla JS), sem dependências externas.
 */

const GUIDE_READING_WORDS_PER_MINUTE = 220;

document.addEventListener('DOMContentLoaded', () => {
	initReadingTime();
	initSummaryAccordion();
	initAutoToc();
	initTocSmoothScroll();
	initTocHighlight();
	initGuideTocDrawer();
	initFaqAccordion();
	initAffiliateTracking();
});

function initReadingTime() {
	const readingTimeElements = document.querySelectorAll('[data-reading-time]');
	if (!readingTimeElements.length) {
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

	readingTimeElements.forEach((element) => {
		element.textContent = `⏱ ${readingTime} min de leitura`;
	});
}

function initSummaryAccordion() {
	const summaryBoxes = document.querySelectorAll('.summary-box');
	if (!summaryBoxes.length) {
		return;
	}

	summaryBoxes.forEach((summaryBox) => {
		const toggleButton = summaryBox.querySelector('.summary-box-toggle');
		const content = summaryBox.querySelector('.summary-box-content');
		if (!toggleButton || !content) {
			return;
		}

		const closeSummary = () => {
			summaryBox.classList.remove('is-open');
			toggleButton.setAttribute('aria-expanded', 'false');
			content.style.maxHeight = '';
		};

		const openSummary = () => {
			summaryBox.classList.add('is-open');
			toggleButton.setAttribute('aria-expanded', 'true');
			content.style.maxHeight = `${content.scrollHeight}px`;
		};

		closeSummary();

		toggleButton.addEventListener('click', () => {
			if (summaryBox.classList.contains('is-open')) {
				closeSummary();
				return;
			}

			openSummary();
		});
	});
}

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

function initTocHighlight() {
	const tocLinks = document.querySelectorAll('.guide-toc-link');
	if (!tocLinks.length) {
		return;
	}

	const sectionOffset = 120;
	const sectionLinks = [];

	tocLinks.forEach((link) => {
		const sectionId = link.getAttribute('href')?.replace('#', '');
		const section = sectionId ? document.getElementById(sectionId) : null;
		if (section) {
			sectionLinks.push({ section, link });
		}
	});

	if (!sectionLinks.length) {
		return;
	}

	const setActiveLink = (activeLink) => {
		tocLinks.forEach((link) => link.classList.toggle('is-active', link === activeLink));
	};

	const updateActiveLink = () => {
		const passedSections = sectionLinks.filter(({ section }) => section.getBoundingClientRect().top <= sectionOffset);

		if (passedSections.length) {
			setActiveLink(passedSections[passedSections.length - 1].link);
			return;
		}

		const nextSection = sectionLinks.find(({ section }) => section.getBoundingClientRect().top > sectionOffset);
		if (nextSection) {
			setActiveLink(nextSection.link);
		}
	};

	updateActiveLink();
	window.addEventListener('scroll', updateActiveLink, { passive: true });
	window.addEventListener('resize', updateActiveLink);
}

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
