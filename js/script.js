/*
  Salão de festas infantis — Solodev Studio
  Menu, WhatsApp, orçamento, galeria, efeitos e animações de entrada.
  Efeitos usam apenas transform e opacity e respeitam prefers-reduced-motion.
*/

/* INÍCIO - Configuração do cliente */
const sdConfig = {
  // PENDENTE: número com DDI e DDD, só dígitos. Ex.: '5511999999999'
  whatsappNumber: '',
  whatsappMessage: 'Olá, Bala e Balão! Vi o site e gostaria de consultar datas e valores para uma festa.',
  // PENDENTE: link completo do Instagram. Vazio = item oculto.
  instagramUrl: '',
};
/* FIM - Configuração do cliente */

const sdReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sdFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const sdWhatsappUrl = (message) => `https://wa.me/${sdConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
const sdHasWhatsapp = () => /^\d{10,15}$/.test(sdConfig.whatsappNumber);

/* INÍCIO - Confete nos cliques de conversão */
const sdConfettiColors = ['#f07b1a', '#e2457a', '#1f6fd6', '#ffc531', '#4b2a9a'];

const sdBurst = (x, y) => {
  if (sdReducedMotion.matches || typeof document.body.animate !== 'function') return;
  for (let index = 0; index < 22; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'sd-confetti';
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.background = sdConfettiColors[index % sdConfettiColors.length];
    document.body.append(piece);
    const angle = (Math.PI * 2 * index) / 22 + Math.random() * .4;
    const distance = 70 + Math.random() * 90;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 60;
    piece.animate([
      { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 1, offset: .6 },
      { transform: `translate(${dx * 1.1}px, ${dy + 120}px) rotate(${540 + Math.random() * 360}deg)`, opacity: 0 },
    ], { duration: 1100 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)' }).finished.then(() => piece.remove(), () => piece.remove());
  }
};

const initializeConfetti = () => {
  document.querySelectorAll('[data-confetti]').forEach((element) => {
    element.addEventListener('click', (event) => {
      const box = element.getBoundingClientRect();
      sdBurst(event.clientX || box.left + box.width / 2, event.clientY || box.top + box.height / 2);
    });
  });
};
/* FIM - Confete */

/* INÍCIO - Menu do celular e cabeçalho */
const initializeMenu = () => {
  const toggle = document.querySelector('.sd-menu-toggle');
  const menu = document.getElementById('sd-mobile-menu');
  const header = document.querySelector('.sd-header');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
};
/* FIM - Menu do celular e cabeçalho */

/* INÍCIO - Links de contato */
const initializeContactLinks = () => {
  // Sem número configurado, os botões levam ao formulário em vez de abrir um link inválido.
  document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
    if (sdHasWhatsapp()) {
      link.href = sdWhatsappUrl(sdConfig.whatsappMessage);
      link.target = '_blank';
    } else {
      link.href = '#orcamento';
      link.removeAttribute('target');
    }
  });

  if (sdConfig.instagramUrl) {
    document.querySelectorAll('[data-instagram-link]').forEach((link) => { link.href = sdConfig.instagramUrl; });
    document.querySelectorAll('[data-instagram-block]').forEach((block) => { block.hidden = false; });
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
};
/* FIM - Links de contato */

/* INÍCIO - Pedido de orçamento pelo WhatsApp */
const initializeQuoteForm = () => {
  const form = document.querySelector('[data-quote-form]');
  if (!form) return;

  const status = form.querySelector('[data-form-status]');
  const ageField = form.querySelector('[data-age-field]');
  const fields = {
    event: form.elements.namedItem('event'),
    name: form.elements.namedItem('name'),
    date: form.elements.namedItem('date'),
    guests: form.elements.namedItem('guests'),
    age: form.elements.namedItem('age'),
    notes: form.elements.namedItem('notes'),
  };
  const today = new Date();
  fields.date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const clean = (value) => value.replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim();
  const isBirthday = () => fields.event.value === 'Aniversário infantil';

  // A idade só faz sentido em aniversários.
  const updateAgeField = () => {
    ageField.hidden = !isBirthday();
    if (ageField.hidden) fields.age.value = '';
  };
  fields.event.addEventListener('change', updateAgeField);

  const rules = {
    event: () => (fields.event.value ? '' : 'Escolha o tipo de evento.'),
    name: () => (clean(fields.name.value).length >= 2 ? '' : 'Informe seu nome.'),
    date: () => {
      if (!fields.date.value) return 'Escolha a data da festa.';
      return fields.date.value >= fields.date.min ? '' : 'Escolha uma data a partir de hoje.';
    },
    guests: () => {
      const value = Number(fields.guests.value);
      return Number.isInteger(value) && value >= 1 && value <= 1000 ? '' : 'Informe o número de convidados.';
    },
    age: () => {
      if (!fields.age.value) return '';
      const value = Number(fields.age.value);
      return Number.isInteger(value) && value >= 0 && value <= 120 ? '' : 'Informe uma idade válida.';
    },
  };

  const showError = (name) => {
    const message = rules[name]();
    form.querySelector(`[data-error-for="${name}"]`).textContent = message;
    fields[name].setAttribute('aria-invalid', String(Boolean(message)));
    return message;
  };

  Object.keys(rules).forEach((name) => {
    fields[name].addEventListener('blur', () => showError(name));
    fields[name].addEventListener('input', () => {
      if (fields[name].getAttribute('aria-invalid') === 'true') showError(name);
    });
  });

  // Os cartões de eventos preenchem o tipo e levam ao formulário.
  document.querySelectorAll('[data-event-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      fields.event.value = button.dataset.eventChoice;
      updateAgeField();
      showError('event');
      document.getElementById('orcamento').scrollIntoView({ behavior: sdReducedMotion.matches ? 'auto' : 'smooth' });
      form.classList.remove('is-highlighted');
      void form.offsetWidth;
      form.classList.add('is-highlighted');
      window.setTimeout(() => fields.name.focus({ preventScroll: true }), sdReducedMotion.matches ? 0 : 700);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.className = 'sd-form__status';
    status.textContent = '';

    const invalid = Object.keys(rules).filter((name) => showError(name));
    if (invalid.length) {
      fields[invalid[0]].focus();
      status.classList.add('is-error');
      status.textContent = 'Confira os campos destacados.';
      return;
    }

    if (!sdHasWhatsapp()) {
      status.classList.add('is-error');
      status.textContent = 'O WhatsApp da Bala e Balão ainda não foi configurado. Tente novamente mais tarde.';
      return;
    }

    const date = new Date(`${fields.date.value}T12:00:00`).toLocaleDateString('pt-BR');
    const lines = [
      'Olá, Bala e Balão! Gostaria de um orçamento.',
      '',
      `Evento: ${fields.event.value}`,
      `Nome: ${clean(fields.name.value)}`,
      `Data desejada: ${date}`,
      `Convidados: ${fields.guests.value}`,
    ];
    if (isBirthday() && fields.age.value) lines.push(`Idade do aniversariante: ${fields.age.value}`);
    const notes = clean(fields.notes.value);
    if (notes) lines.push(`Tema/observações: ${notes}`);

    const opened = window.open(sdWhatsappUrl(lines.join('\n')), '_blank');
    if (opened) opened.opener = null;
    const button = form.querySelector('[type="submit"]').getBoundingClientRect();
    sdBurst(button.left + button.width / 2, button.top + button.height / 2);
    status.classList.add('is-success');
    status.textContent = opened
      ? 'Abrimos o WhatsApp com a sua mensagem. É só revisar e enviar.'
      : 'Não foi possível abrir uma nova aba. Toque no botão de WhatsApp para continuar.';
  });
};
/* FIM - Pedido de orçamento */

/* INÍCIO - Galeria ampliada com navegação */
const initializeGallery = () => {
  const viewer = document.querySelector('.sd-viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;

  const buttons = [...document.querySelectorAll('[data-gallery-src]')];
  const image = viewer.querySelector('.sd-viewer__image');
  const caption = viewer.querySelector('[data-viewer-caption]');
  const count = viewer.querySelector('[data-viewer-count]');
  let current = 0;
  let trigger = null;
  let startX = null;

  const show = (index) => {
    current = (index + buttons.length) % buttons.length;
    const button = buttons[current];
    image.src = button.dataset.gallerySrc;
    image.width = Number(button.dataset.galleryWidth);
    image.height = Number(button.dataset.galleryHeight);
    image.alt = button.querySelector('img').alt;
    caption.textContent = button.querySelector('span').textContent;
    count.textContent = `${current + 1} de ${buttons.length}`;
    if (!sdReducedMotion.matches && image.animate) {
      image.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });
    }
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      trigger = button;
      show(index);
      viewer.showModal();
    });
  });

  viewer.querySelector('.sd-viewer__close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.sd-viewer__nav--prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.sd-viewer__nav--next').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => trigger?.focus());

  // Deslizar para os lados no celular.
  const stage = viewer.querySelector('.sd-viewer__stage');
  stage.addEventListener('pointerdown', (event) => { startX = event.clientX; });
  stage.addEventListener('pointerup', (event) => {
    if (startX === null) return;
    const delta = event.clientX - startX;
    startX = null;
    if (Math.abs(delta) > 45) show(current + (delta < 0 ? 1 : -1));
  });
};
/* FIM - Galeria ampliada */

/* INÍCIO - Profundidade das fotos e cartões inclinados (somente mouse) */
const initializePointerEffects = () => {
  const collage = document.querySelector('[data-parallax]');
  const hero = document.querySelector('[data-hero]');
  let frame = 0;
  let pointer = null;

  const allowed = () => sdFinePointer.matches && !sdReducedMotion.matches;

  if (collage && hero) {
    const layers = [...collage.querySelectorAll('[data-depth]')];
    const apply = () => {
      frame = 0;
      if (!pointer) return;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth);
        layer.style.setProperty('--sd-px', `${pointer.x * depth}px`);
        layer.style.setProperty('--sd-py', `${pointer.y * depth}px`);
      });
    };
    hero.addEventListener('pointermove', (event) => {
      if (!allowed()) return;
      const box = hero.getBoundingClientRect();
      pointer = { x: (event.clientX - box.left) / box.width - .5, y: (event.clientY - box.top) / box.height - .5 };
      if (!frame) frame = requestAnimationFrame(apply);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      pointer = { x: 0, y: 0 };
      if (!frame) frame = requestAnimationFrame(apply);
    });
  }

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    let tiltFrame = 0;
    let target = null;
    const update = () => {
      tiltFrame = 0;
      if (!target) return;
      card.style.setProperty('--sd-rx', `${target.y * -7}deg`);
      card.style.setProperty('--sd-ry', `${target.x * 9}deg`);
    };
    card.addEventListener('pointermove', (event) => {
      if (!allowed()) return;
      const box = card.getBoundingClientRect();
      target = { x: (event.clientX - box.left) / box.width - .5, y: (event.clientY - box.top) / box.height - .5 };
      if (!tiltFrame) tiltFrame = requestAnimationFrame(update);
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      target = { x: 0, y: 0 };
      if (!tiltFrame) tiltFrame = requestAnimationFrame(update);
    });
  });
};
/* FIM - Profundidade e cartões */

/* INÍCIO - Barra fixa do celular */
const initializeMobileBar = () => {
  const bar = document.querySelector('[data-mobile-bar]');
  const hero = document.querySelector('[data-hero]');
  const contact = document.querySelector('[data-contact]');
  if (!bar || !hero || !contact) return;

  // Aparece depois da primeira tela e some quando o formulário entra na tela.
  let frame = 0;
  const update = () => {
    frame = 0;
    const pastHero = hero.getBoundingClientRect().bottom < 0;
    const beforeContact = contact.getBoundingClientRect().top > window.innerHeight * .75;
    bar.classList.toggle('is-visible', pastHero && beforeContact);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
};
/* FIM - Barra fixa do celular */

/* INÍCIO - Mapa sob demanda */
const initializeMap = () => {
  const map = document.querySelector('[data-map]');
  const button = map?.querySelector('[data-map-load]');
  if (!map || !button) return;

  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = map.dataset.mapSrc;
    frame.title = 'Mapa: Bala e Balão Buffet Infantil, Av. Henriqueta Mendes Guerra, 726, Barueri - SP';
    frame.width = '600';
    frame.height = '260';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    button.replaceWith(frame);
    frame.focus();
  });
};
/* FIM - Mapa sob demanda */

/* INÍCIO - Animações de entrada em sequência */
const initializeAnimations = () => {
  const items = [...document.querySelectorAll('.sd-animate')];
  if (!('IntersectionObserver' in window) || sdReducedMotion.matches) return;

  // Itens irmãos entram em cascata.
  items.forEach((item) => {
    const siblings = [...item.parentElement.children].filter((child) => child.classList.contains('sd-animate'));
    if (siblings.length > 1) item.style.setProperty('--sd-stagger', `${siblings.indexOf(item) * 110}ms`);
  });

  document.body.classList.add('sd-motion-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
      window.setTimeout(() => entry.target.style.removeProperty('--sd-stagger'), 1400);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach((item) => observer.observe(item));
};
/* FIM - Animações de entrada */

document.addEventListener('DOMContentLoaded', () => {
  initializeMenu();
  initializeContactLinks();
  initializeConfetti();
  initializeQuoteForm();
  initializeGallery();
  initializePointerEffects();
  initializeMobileBar();
  initializeMap();
  initializeAnimations();
});
