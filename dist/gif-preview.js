document.querySelectorAll('.animated-preview').forEach(preview => {
  const image = preview.querySelector('img');
  const canvas = preview.querySelector('canvas');
  const button = preview.querySelector('.gif-toggle');
  const context = canvas.getContext('2d');
  if (!context) return;
  let manuallyPaused = false;

  function update() {
    if (!image.complete || !image.naturalWidth) return;
    const paused = manuallyPaused || document.body.classList.contains('motion-paused');
    if (paused && !image.hidden) context.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.hidden = paused;
    canvas.hidden = !paused;
    button.textContent = paused ? 'Play preview' : 'Pause preview';
    button.setAttribute('aria-pressed', String(paused));
    button.hidden = false;
  }
  button.addEventListener('click', () => {
    if (document.body.classList.contains('motion-paused')) {
      manuallyPaused = false;
      document.querySelector('.motion-toggle:not(.gif-toggle)').click();
    } else {
      manuallyPaused = !manuallyPaused;
    }
    update();
  });
  image.addEventListener('load', update);
  new MutationObserver(update).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  update();
});
