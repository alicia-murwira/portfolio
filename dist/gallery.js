document.querySelectorAll('.project-gallery').forEach(gallery => {
  const preview = gallery.querySelector('.gallery-preview');
  const image = preview.querySelector('img');
  const choices = gallery.querySelectorAll('.gallery-choice');
  choices.forEach(choice => {
    choice.addEventListener('click', event => {
      // Modified clicks retain the link's normal open-in-new-tab behaviour.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      preview.href = choice.href;
      preview.setAttribute('aria-label', `Open ${choice.dataset.caption} screenshot at full size in a new tab`);
      image.src = choice.href;
      image.alt = choice.dataset.alt;
      image.width = Number(choice.dataset.width);
      image.height = Number(choice.dataset.height);
      choices.forEach(item => {
        item.classList.toggle('is-selected', item === choice);
        if (item === choice) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
    });
  });
});
