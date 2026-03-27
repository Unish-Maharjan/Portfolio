/* ============================================================
   script.js — Portfolio Interactivity
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   1. DOM REFERENCES
---------------------------------------------------------- */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const navLinks    = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formFeedback = document.getElementById('formFeedback');
const revealEls   = document.querySelectorAll('.reveal');
const sections    = document.querySelectorAll('section[id]');


/* ----------------------------------------------------------
   2. THEME TOGGLE (Dark / Light)
   - Persists preference in localStorage
---------------------------------------------------------- */
(function initTheme() {
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});


/* ----------------------------------------------------------
   3. NAVBAR — scroll shadow + active link highlighting
---------------------------------------------------------- */
function onScroll() {
  /* 3a. Add/remove scrolled class for background blur */
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  /* 3b. Highlight active nav link based on scroll position */
  let currentId = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) currentId = section.getAttribute('id');
  });

  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('active', isActive);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on page load


/* ----------------------------------------------------------
   4. MOBILE MENU — hamburger open / close
---------------------------------------------------------- */
function closeMobileMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

/* Close on link click */
mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

/* Close when clicking outside the menu */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) closeMobileMenu();
});


/* ----------------------------------------------------------
   5. SCROLL REVEAL (Intersection Observer)
   Elements with class .reveal fade in when entering viewport
---------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /* Stagger siblings inside the same parent */
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach(el => {
          if (!el.classList.contains('visible')) {
            el.style.transitionDelay = `${delay}ms`;
            delay += 80;
          }
        });
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ----------------------------------------------------------
   6. CONTACT FORM — validation & simulated submission
---------------------------------------------------------- */

/* Helper: set field error */
function setError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.parentElement.classList.add('error');
  error.textContent = message;
}

/* Helper: clear field error */
function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.parentElement.classList.remove('error');
  error.textContent = '';
}

/* Validate a single field on blur for instant feedback */
document.getElementById('name').addEventListener('blur', function () {
  if (this.value.trim().length < 2) {
    setError('name', 'nameError', 'Please enter your name (min 2 characters).');
  } else {
    clearError('name', 'nameError');
  }
});

document.getElementById('email').addEventListener('blur', function () {
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(this.value.trim())) {
    setError('email', 'emailError', 'Please enter a valid email address.');
  } else {
    clearError('email', 'emailError');
  }
});

document.getElementById('message').addEventListener('blur', function () {
  if (this.value.trim().length < 10) {
    setError('message', 'messageError', 'Message must be at least 10 characters.');
  } else {
    clearError('message', 'messageError');
  }
});

/* Full validation on submit */
function validateForm() {
  let valid = true;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Clear previous errors */
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

if (nameInput) {
  nameInput.addEventListener('blur', function () {
    if (this.value.trim().length < 2) {
      setError('name', 'nameError', 'Please enter your name (min 2 characters).');
    } else {
      clearError('name', 'nameError');
    }
  });
}

if (emailInput) {
  emailInput.addEventListener('blur', function ()  {
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(this.value.trim())) {
      setError('email', 'emailError', 'Please enter a valid email address.');
    } else {
      clearError('email', 'emailError');
    }
  });
}

if (messageInput) {
  messageInput.addEventListener('blur', function () {
    if (this.value.trim().length < 10) {
      setError('message', 'messageError', 'Message must be at least 10 characters.');
    } else {
      clearError('message', 'messageError');
    }
  });
}

  return valid;
}

/* Form submit handler — simulates async request */
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  /* Disable button and show loading state */
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

 try {
  const formData = new FormData(contactForm);

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  if (response.ok) {
    formFeedback.textContent = "✓ Message sent! I'll get back to you soon.";
    formFeedback.className   = 'form-feedback success';
    contactForm.reset();
  } else {
    formFeedback.textContent = "✗ " + data.message;
    formFeedback.className   = 'form-feedback error';
  }

} catch (error) {
  formFeedback.textContent = '✗ Something went wrong. Please try again.';
  formFeedback.className   = 'form-feedback error';
}
});


/* ----------------------------------------------------------
   7. SMOOTH SCROLL polyfill for older browsers
   (Modern browsers handle scroll-behavior: smooth natively,
    but this handles edge cases.)
---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - (navbar.offsetHeight + 8);
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});
