/**
 * Compatibilidade temporária.
 * O script principal das páginas de guia foi movido para ../../guias/guia.js.
 */

(function loadGuideScript() {
  if (document.querySelector('script[data-guide-script="local"]')) {
    return;
  }

  const script = document.createElement('script');
  script.src = '../../guias/guia.js';
  script.defer = true;
  script.dataset.guideScript = 'local';
  document.head.appendChild(script);
}());
