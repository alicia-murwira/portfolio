(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.motion-toggle');
  let paused = preference.matches;
  let observer;
  const running = new Set();

  function updateMotion() {
    document.body.classList.toggle('motion-paused', paused);
    toggle.textContent = paused ? 'Enable motion' : 'Pause motion';
    toggle.setAttribute('aria-pressed', String(paused));
    if (paused) {
      running.forEach(animation => animation.cancel());
      running.clear();
    }
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    updateMotion();
  });
  preference.addEventListener('change', event => {
    paused = event.matches;
    updateMotion();
  });
  updateMotion();

  // Content remains visible without JavaScript or IntersectionObserver.
  if ('IntersectionObserver' in window && 'animate' in Element.prototype) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (paused) return;
        const animation = entry.target.animate(
          [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' }
        );
        running.add(animation);
        animation.onfinish = () => running.delete(animation);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.about-grid, .tool-card, .project, .timeline article, .contact-bottom, .section-title')
      .forEach(element => observer.observe(element));
  }
})();
