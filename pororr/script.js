/* ============================================
   Portfolio — Vanilla JavaScript
   ============================================ */

'use strict';

document.body.classList.add('loading');

/* ---- Loading Screen ---- */
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const percent = document.getElementById('loaderPercent');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        document.querySelectorAll('.reveal').forEach(el => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('visible');
          }
        });
      }, 400);
    }
    bar.style.width = progress + '%';
    percent.textContent = Math.floor(progress) + '%';
  }, 120);
})();

/* ---- Custom Cursor ---- */
(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  document.querySelectorAll('[data-cursor="hover"], a, button, .social-icon, .project-github, .testimonial-dot, .nav-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      outline.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      outline.classList.remove('hover');
    });
  });

  document.addEventListener('mousedown', () => {
    dot.classList.add('click');
    createCursorRipple(mouseX, mouseY);
  });
  document.addEventListener('mouseup', () => dot.classList.remove('click'));

  function createCursorRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }
})();

/* ---- Particle Canvas ---- */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let stars = [];
  let w, h;
  let animId;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    stars = [];
    const count = Math.min(80, Math.floor(w * h / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#00F5FF' : '#7B61FF'
      });
    }
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    stars.forEach(s => {
      s.twinkle += s.speed;
      const opacity = 0.3 + Math.sin(s.twinkle) * 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    });

    particles.forEach((p, i) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 245, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

/* ---- Mouse Glow ---- */
(function initMouseGlow() {
  const glow = document.getElementById('mouseGlow');
  if (!glow) return;
  let visible = false;

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    if (!visible) {
      glow.style.opacity = '1';
      visible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    visible = false;
  });
})();

/* ---- Scroll Progress & Header ---- */
(function initScroll() {
  const progress = document.getElementById('scrollProgress');
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progress) progress.style.width = scrollPercent + '%';
    if (header) header.classList.toggle('scrolled', scrollTop > 50);
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 500);
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

/* ---- Navigation ---- */
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(section => observer.observe(section));
})();

/* ---- Reveal On Scroll ---- */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

/* ---- Typing Animation ---- */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const words = ['AI Engineer', 'Automation Expert', 'Prompt Engineer', 'AI Ads Specialist'];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = words[wordIndex];
    if (!deleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 50 : 100);
  }

  setTimeout(type, 1000);
})();

/* ---- Animated Counters ---- */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target;
          }
          requestAnimationFrame(update);
        });
      }
    });
  }, { threshold: 0.5 });

  const section = document.querySelector('.counters');
  if (section) observer.observe(section);
})();

/* ---- Skill Bars ---- */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        fills.forEach(fill => {
          const width = fill.dataset.width;
          setTimeout(() => { fill.style.width = width + '%'; }, 200);
        });
      }
    });
  }, { threshold: 0.2 });

  const section = document.querySelector('.skills');
  if (section) observer.observe(section);
})();

/* ---- Testimonial Slider ---- */
(function initTestimonials() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!track || !dotsContainer) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  const total = slides.length;
  let current = 0;
  let autoplay;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.testimonial-dot');

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }

  function startAutoplay() {
    autoplay = setInterval(next, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  const slider = document.getElementById('testimonialSlider');
  if (slider) {
    slider.addEventListener('mouseenter', () => clearInterval(autoplay));
    slider.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
})();

/* ---- 3D Tilt Cards ---- */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.tilt-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ---- Magnetic Buttons ---- */
(function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ---- Button Ripple ---- */
(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();

/* ---- Parallax ---- */
(function initParallax() {
  const heroImage = document.querySelector('.hero-image');
  const shapes = document.querySelectorAll('.shape');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroImage && scrollY < window.innerHeight) {
      heroImage.style.setProperty('--parallax-y', `${scrollY * 0.08}px`);
    }
    shapes.forEach((shape, i) => {
      shape.style.transform = `translateY(${scrollY * (0.02 + i * 0.01)}px)`;
    });
  }, { passive: true });
})();

/* ---- Contact Form ---- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError'), validate: v => v.trim().length >= 2 || 'Name must be at least 2 characters' },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email' },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError'), validate: v => v.trim().length >= 3 || 'Subject is required' },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError'), validate: v => v.trim().length >= 10 || 'Message must be at least 10 characters' }
  };

  Object.values(fields).forEach(({ el, error }) => {
    if (el) {
      el.addEventListener('input', () => {
        if (error) error.textContent = '';
        el.style.borderColor = '';
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.entries(fields).forEach(([key, { el, error, validate }]) => {
      if (!el || !error) return;
      const result = validate(el.value);
      if (result !== true) {
        error.textContent = result;
        el.style.borderColor = '#ff4757';
        valid = false;
      } else {
        error.textContent = '';
        el.style.borderColor = '';
      }
    });

    if (valid) {
      const success = document.getElementById('formSuccess');
      if (success) {
        success.classList.add('show');
        form.reset();
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }
  });
})();

/* ---- Smooth Section Entrance ---- */
window.addEventListener('load', () => {
  const main = document.getElementById('main');
  if (main) main.classList.add('loaded');
});

/* ---- Icon Hover Interactions ---- */
document.querySelectorAll('.fas, .fab').forEach(icon => {
  const parent = icon.closest('a, button, .exp-icon, .service-icon, .timeline-icon');
  if (parent) {
    parent.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.15) rotate(5deg)';
      icon.style.transition = 'transform 0.3s ease';
    });
    parent.addEventListener('mouseleave', () => {
      icon.style.transform = '';
    });
  }
});
