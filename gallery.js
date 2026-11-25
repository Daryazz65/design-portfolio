const projects = {
  srez: {
    title: 'Срез',
    category: 'Обложка журнала',
    description: 'Обложка первого выпуска журнала об архитектуре. Линия тени от бетонной стены задаёт композицию, а контрастная типографика выделяет название и тему номера.',
    slides: [['srez', 'Обложка журнала «Срез»']],
  },
  luma: {
    title: 'Luma Dome',
    category: 'Карточка Wildberries',
    description: 'Главный слайд показывает лампу целиком. Следующие три раскрывают свет, способ зарядки и то, как лампа выглядит на прикроватной тумбе.',
    slides: [
      ['luma-main', 'Главная карточка'],
      ['luma-light', 'Свет и яркость'],
      ['luma-charge', 'Зарядка USB-C'],
      ['luma-interior', 'Лампа в интерьере'],
    ],
  },
  obzhig: {
    title: 'Обжиг',
    category: 'Логотип',
    description: 'В знаке керамической мастерской соединены форма чаши и силуэт печи. Терракотовый цвет напоминает обожжённую глину.',
    slides: [['obzhig', 'Логотип, отдельный знак и версия для тёмного фона']],
    action: ['assets/obzhig.svg', 'Открыть логотип в SVG'],
  },
  bereg: {
    title: 'Тихий берег',
    category: 'Макет сайта',
    description: 'Лендинг домика в Карелии. Первый экран знакомит с местом, а ниже собрана информация о вместимости и оснащении.',
    slides: [['bereg', 'Макет лендинга «Тихий берег»']],
    action: ['tihiy-bereg.html', 'Открыть макет в браузере'],
  },
};

const dialog = document.querySelector('.case');
const image = dialog.querySelector('.case-image');
const caption = dialog.querySelector('.caption');
const controls = dialog.querySelector('.gallery-controls');
const position = dialog.querySelector('.slide-position');
const thumbnails = dialog.querySelector('.thumbnails');
const action = dialog.querySelector('.case-action');
const imageUrl = (name) => 'assets/' + name + '.webp';
let activeProject;
let activeIndex = 0;

function showSlide(index) {
  const count = activeProject.slides.length;
  activeIndex = (index + count) % count;
  const [name, label] = activeProject.slides[activeIndex];
  image.src = imageUrl(name);
  image.alt = label;
  caption.textContent = label;
  position.textContent = (activeIndex + 1) + ' / ' + count;
  for (const [slideIndex, button] of Array.from(thumbnails.children).entries()) {
    button.setAttribute('aria-pressed', String(slideIndex === activeIndex));
  }
}

function openProject(project) {
  activeProject = project;
  dialog.querySelector('#case-title').textContent = project.title;
  dialog.querySelector('.case-category').textContent = project.category;
  dialog.querySelector('.case-description').textContent = project.description;
  controls.hidden = thumbnails.hidden = project.slides.length < 2;
  thumbnails.replaceChildren();
  if (!thumbnails.hidden) {
    project.slides.forEach(([name, label], index) => {
      const button = document.createElement('button');
      const thumbnail = document.createElement('img');
      button.type = 'button';
      button.setAttribute('aria-label', label);
      thumbnail.alt = '';
      thumbnail.src = imageUrl(name);
      button.append(thumbnail);
      button.addEventListener('click', () => showSlide(index));
      thumbnails.append(button);
    });
  }
  action.hidden = !project.action;
  if (project.action) {
    [action.href, action.textContent] = project.action;
  }
  showSlide(0);
  dialog.showModal();
  dialog.scrollTop = 0;
}

for (const link of document.querySelectorAll('[data-project]')) {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    openProject(projects[link.dataset.project]);
  });
}

dialog.querySelector('.prev').addEventListener('click', () => showSlide(activeIndex - 1));
dialog.querySelector('.next').addEventListener('click', () => showSlide(activeIndex + 1));
dialog.addEventListener('keydown', (event) => {
  if (controls.hidden || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  showSlide(activeIndex + (event.key === 'ArrowLeft' ? -1 : 1));
});
