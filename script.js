/* ==========================================================================
   PT MAHA HARMONI ABADI — SCRIPT.JS
   Vanilla JS, modular (IIFE per feature), no external dependencies.
   ========================================================================== */
'use strict';

/* ---------------------------------------------------------------------
   0. CONFIG
--------------------------------------------------------------------- */
const CONFIG = {
  whatsappNumber: '6287762579410', // ganti dengan nomor WhatsApp admin (format internasional tanpa +)
  companyEmail: 'agungadek8@gmail.com'
};

/* ---------------------------------------------------------------------
   1. PRELOADER
--------------------------------------------------------------------- */
(function preloader(){
  const pre = document.getElementById('preloader');
  if(!pre) return;
  window.addEventListener('load',() => {
    setTimeout(() => pre.classList.add('hide'),350);
  });
  // Fallback safety in case 'load' fires slowly
  setTimeout(() => pre.classList.add('hide'),4000);
})();

/* ---------------------------------------------------------------------
   2. SCROLL PROGRESS BAR
--------------------------------------------------------------------- */
(function scrollProgress(){
  const bar = document.getElementById('scroll-progress');
  if(!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    bar.style.width = height > 0 ? `${(scrolled / height) * 100}%` : '0%';
  };
  document.addEventListener('scroll',update,{passive:true});
  update();
})();

/* ---------------------------------------------------------------------
   3. HEADER: sticky style + active link on scroll
--------------------------------------------------------------------- */
(function headerBehavior(){
  const header = document.getElementById('header');
  if(!header) return;
  const toggleScrolled = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll',toggleScrolled,{passive:true});
  toggleScrolled();

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile ul a');
  if('IntersectionObserver' in window && sections.length){
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },{rootMargin:'-45% 0px -50% 0px',threshold:0});
    sections.forEach(sec => spy.observe(sec));
  }
})();

/* ---------------------------------------------------------------------
   4. MOBILE NAVIGATION (hamburger)
--------------------------------------------------------------------- */
(function mobileNav(){
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');
  const overlay = document.getElementById('navOverlay');
  if(!hamburger || !navMobile || !overlay) return;

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMobile.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded','false');
  };
  const openMenu = () => {
    hamburger.classList.add('active');
    navMobile.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded','true');
  };

  hamburger.addEventListener('click',() => {
    hamburger.classList.contains('active') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click',closeMenu);
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',(e) => { if(e.key === 'Escape') closeMenu(); });
})();

/* ---------------------------------------------------------------------
   5. DARK MODE TOGGLE (persists for this session only — no localStorage
      requirement stated in brief, so we keep it simple via a data attr;
      we still try localStorage gracefully and fall back silently)
--------------------------------------------------------------------- */
(function darkMode(){
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  if(!toggleBtns.length) return;
  const root = document.documentElement;

  let saved = null;
  try{ saved = localStorage.getItem('mha-theme'); }catch(e){ /* storage blocked, ignore */ }
  if(saved === 'dark') root.setAttribute('data-theme','dark');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click',() => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if(isDark){
        root.removeAttribute('data-theme');
        try{ localStorage.setItem('mha-theme','light'); }catch(e){}
      }else{
        root.setAttribute('data-theme','dark');
        try{ localStorage.setItem('mha-theme','dark'); }catch(e){}
      }
    });
  });
})();

/* ---------------------------------------------------------------------
   6. TYPING EFFECT (hero headline highlight word)
--------------------------------------------------------------------- */
(function typingEffect(){
  const el = document.getElementById('typingTarget');
  if(!el) return;
  const words = JSON.parse(el.getAttribute('data-words') || '[]');
  if(!words.length) return;
  let wordIndex = 0, charIndex = 0, deleting = false;

  const tick = () => {
    const current = words[wordIndex];
    if(!deleting){
      charIndex++;
      el.textContent = current.slice(0,charIndex);
      if(charIndex === current.length){
        deleting = true;
        setTimeout(tick,1400);
        return;
      }
    }else{
      charIndex--;
      el.textContent = current.slice(0,charIndex);
      if(charIndex === 0){
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? 45 : 85);
  };
  setTimeout(tick, 900);
})();

/* ---------------------------------------------------------------------
   7. SCROLL REVEAL ANIMATIONS
--------------------------------------------------------------------- */
(function scrollReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  if(!('IntersectionObserver' in window)){
    items.forEach(i => i.classList.add('in'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => entry.target.classList.add('in'), Number(delay));
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.15});
  items.forEach(i => obs.observe(i));
})();

/* ---------------------------------------------------------------------
   8. NUMBER COUNTER (statistics section)
--------------------------------------------------------------------- */
(function counters(){
  const counterEls = document.querySelectorAll('[data-counter]');
  if(!counterEls.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-counter'),10) || 0;
    const duration = 1800;
    const start = performance.now();
    const suffix = el.getAttribute('data-suffix') || '';

    const step = (now) => {
      const progress = Math.min((now - start) / duration,1);
      const eased = 1 - Math.pow(1 - progress,3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString('id-ID') + suffix;
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('id-ID') + suffix;
    };
    requestAnimationFrame(step);
  };

  if(!('IntersectionObserver' in window)){
    counterEls.forEach(animateCounter);
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.5});
  counterEls.forEach(el => obs.observe(el));
})();

/* ---------------------------------------------------------------------
   9. GALLERY LIGHTBOX
--------------------------------------------------------------------- */
(function galleryLightbox(){
  const items = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  if(!items.length || !lightbox) return;

  const lbImg = lightbox.querySelector('img');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const images = Array.from(items);
  let current = 0;

  const openAt = (index) => {
    current = (index + images.length) % images.length;
    lbImg.src = images[current].currentSrc || images[current].src;
    lbImg.alt = images[current].alt;
    caption.textContent = images[current].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  images.forEach((img,i) => img.closest('.gallery-item').addEventListener('click',() => openAt(i)));
  closeBtn.addEventListener('click',close);
  prevBtn.addEventListener('click',() => openAt(current - 1));
  nextBtn.addEventListener('click',() => openAt(current + 1));
  lightbox.addEventListener('click',(e) => { if(e.target === lightbox) close(); });
  document.addEventListener('keydown',(e) => {
    if(!lightbox.classList.contains('active')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') openAt(current - 1);
    if(e.key === 'ArrowRight') openAt(current + 1);
  });
})();

/* ---------------------------------------------------------------------
   10. TESTIMONIAL AUTO SLIDER
--------------------------------------------------------------------- */
(function testimonialSlider(){
  const track = document.getElementById('testiSlides');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.querySelector('.testi-arrow.prev');
  const nextBtn = document.querySelector('.testi-arrow.next');
  if(!track) return;

  const slides = Array.from(track.children);
  let index = 0;
  let timer = null;

  slides.forEach((_,i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label',`Testimoni ${i + 1}`);
    if(i === 0) dot.classList.add('active');
    dot.addEventListener('click',() => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render(){
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d,i) => d.classList.toggle('active', i === index));
  }
  function goTo(i){
    index = (i + slides.length) % slides.length;
    render();
    restart();
  }
  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }
  function restart(){
    clearInterval(timer);
    timer = setInterval(next,5500);
  }

  nextBtn && nextBtn.addEventListener('click',next);
  prevBtn && prevBtn.addEventListener('click',prev);

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart',(e) => { touchStartX = e.touches[0].clientX; },{passive:true});
  track.addEventListener('touchend',(e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if(diff > 50) prev();
    else if(diff < -50) next();
  },{passive:true});

  render();
  restart();
})();

/* ---------------------------------------------------------------------
   11. FAQ ACCORDION
--------------------------------------------------------------------- */
(function faqAccordion(){
  const items = document.querySelectorAll('.faq-item');
  if(!items.length) return;

  items.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click',() => {
      const isActive = item.classList.contains('active');
      items.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if(!isActive){
        item.classList.add('active');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded','true');
      }
    });
  });
})();

/* ---------------------------------------------------------------------
   12. RIPPLE EFFECT ON BUTTONS
--------------------------------------------------------------------- */
(function rippleEffect(){
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click',function(e){
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth,this.clientHeight);
      const rect = this.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
      circle.classList.add('ripple');
      const old = this.querySelector('.ripple');
      if(old) old.remove();
      this.appendChild(circle);
      setTimeout(() => circle.remove(),650);
    });
  });
})();

/* ---------------------------------------------------------------------
   13. BACK TO TOP BUTTON
--------------------------------------------------------------------- */
(function backToTop(){
  const btn = document.getElementById('backToTop');
  if(!btn) return;
  document.addEventListener('scroll',() => {
    btn.classList.toggle('show', window.scrollY > 600);
  },{passive:true});
  btn.addEventListener('click',() => window.scrollTo({top:0,behavior:'smooth'}));
})();

/* ---------------------------------------------------------------------
   14. SMOOTH SCROLL FOR ANCHOR LINKS (offset for sticky header)
--------------------------------------------------------------------- */
(function smoothAnchorScroll(){
  const header = document.getElementById('header');
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click',(e) => {
      const id = link.getAttribute('href');
      if(id.length < 2) return;
      const target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 0) + 12;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({top,behavior:'smooth'});
    });
  });
})();

/* ---------------------------------------------------------------------
   15. HERO PARALLAX + MOUSE HOVER EFFECT
--------------------------------------------------------------------- */
(function heroParallax(){
  const hero = document.querySelector('.hero');
  const shapes = document.querySelectorAll('.hero-shape');
  if(!hero || !shapes.length) return;

  hero.addEventListener('mousemove',(e) => {
    const { innerWidth:w, innerHeight:h } = window;
    const x = (e.clientX / w - 0.5) * 2;
    const y = (e.clientY / h - 0.5) * 2;
    shapes.forEach((shape,i) => {
      const factor = (i + 1) * 8;
      shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  document.addEventListener('scroll',() => {
    const scrolled = window.scrollY;
    const bg = document.querySelector('.hero-bg');
    if(bg && scrolled < window.innerHeight) bg.style.transform = `translateY(${scrolled * 0.3}px)`;
  },{passive:true});
})();

/* ---------------------------------------------------------------------
   16. IMAGE LAZY LOADING (native + fade-in class)
--------------------------------------------------------------------- */
(function lazyLoading(){
  const lazyImgs = document.querySelectorAll('img.lazy');
  lazyImgs.forEach(img => {
    if(img.complete) img.classList.add('loaded');
    else img.addEventListener('load',() => img.classList.add('loaded'));
  });
})();

/* ---------------------------------------------------------------------
   17. CONTACT FORM VALIDATION + WHATSAPP / EMAIL SEND
--------------------------------------------------------------------- */
(function contactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;

  const fields = {
    name: form.querySelector('#cf-name'),
    email: form.querySelector('#cf-email'),
    phone: form.querySelector('#cf-phone'),
    service: form.querySelector('#cf-service'),
    message: form.querySelector('#cf-message')
  };

  const showError = (field,show) => {
    field.closest('.form-group').classList.toggle('invalid',show);
  };

  const validators = {
    name: (v) => v.trim().length >= 3,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: (v) => /^[0-9]{9,15}$/.test(v.trim()),
    service: (v) => v.trim().length > 0,
    message: (v) => v.trim().length >= 10
  };

  Object.keys(fields).forEach(key => {
    fields[key].addEventListener('input',() => {
      showError(fields[key], !validators[key](fields[key].value));
    });
  });

  function validateAll(){
    let valid = true;
    Object.keys(fields).forEach(key => {
      const ok = validators[key](fields[key].value);
      showError(fields[key], !ok);
      if(!ok) valid = false;
    });
    return valid;
  }

  function buildMessage(){
    return `Halo PT Maha Harmoni Abadi, saya ingin menanyakan layanan.%0A%0A` +
      `Nama: ${encodeURIComponent(fields.name.value.trim())}%0A` +
      `Email: ${encodeURIComponent(fields.email.value.trim())}%0A` +
      `WhatsApp: ${encodeURIComponent(fields.phone.value.trim())}%0A` +
      `Layanan: ${encodeURIComponent(fields.service.value.trim())}%0A` +
      `Pesan: ${encodeURIComponent(fields.message.value.trim())}`;
  }

  form.addEventListener('submit',(e) => {
    e.preventDefault();
    if(!validateAll()){
      const firstInvalid = form.querySelector('.form-group.invalid input,.form-group.invalid select,.form-group.invalid textarea');
      if(firstInvalid) firstInvalid.focus();
      return;
    }

    const sendVia = e.submitter ? e.submitter.getAttribute('data-send') : 'whatsapp';
    const text = buildMessage();

    if(sendVia === 'email'){
      const subject = encodeURIComponent('Permintaan Layanan - ' + fields.service.value.trim());
      window.location.href = `mailto:${CONFIG.companyEmail}?subject=${subject}&body=${text}`;
    }else{
      window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${text}`,'_blank');
    }

    showPopup();
    form.reset();
  });
})();

/* ---------------------------------------------------------------------
   18. SUCCESS POPUP
--------------------------------------------------------------------- */
function showPopup(){
  const popup = document.getElementById('successPopup');
  if(!popup) return;
  popup.classList.add('active');
}
(function popupClose(){
  const popup = document.getElementById('successPopup');
  if(!popup) return;
  popup.querySelectorAll('[data-close-popup]').forEach(btn => {
    btn.addEventListener('click',() => popup.classList.remove('active'));
  });
  popup.addEventListener('click',(e) => { if(e.target === popup) popup.classList.remove('active'); });
})();

/* ---------------------------------------------------------------------
   19. FLOATING CONTACT BUTTONS (dynamic WhatsApp / mailto links)
--------------------------------------------------------------------- */
(function floatingLinks(){
  const waLinks = document.querySelectorAll('[data-wa-link]');
  const mailLinks = document.querySelectorAll('[data-mail-link]');
  waLinks.forEach(a => {
    a.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('Halo PT Maha Harmoni Abadi, saya ingin bertanya mengenai layanan Anda.')}`;
  });
  mailLinks.forEach(a => {
    a.href = `mailto:${CONFIG.companyEmail}`;
  });
})();

/* ---------------------------------------------------------------------
   20. PRESET SERVICE (from "Request Tour" / "Consultation" / "Book Now")
--------------------------------------------------------------------- */
(function presetService(){
  const triggers = document.querySelectorAll('[data-preset-service]');
  const select = document.getElementById('cf-service');
  if(!triggers.length || !select) return;
  triggers.forEach(t => {
    t.addEventListener('click',() => {
      select.value = t.getAttribute('data-preset-service');
    });
  });
})();

/* ---------------------------------------------------------------------
   21. CURRENT YEAR IN FOOTER
--------------------------------------------------------------------- */
(function footerYear(){
  const el = document.getElementById('currentYear');
  if(el) el.textContent = new Date().getFullYear();
})();

