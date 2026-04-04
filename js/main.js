/* ============================================
   Element Human — Homepage Interactions
   All 7 interactive concepts + scroll animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll Fade-Up Animations ----
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => fadeObserver.observe(el));

  // ---- Mobile Nav Toggle ----
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  if (hamburger) {
    hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  // ---- Nav background on scroll ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 50
      ? 'rgba(12, 21, 32, 0.92)'
      : 'rgba(12, 21, 32, 0.7)';
  });

  /* ============================================
     CONCEPT 1: Turn On Ellie Toggle
     ============================================ */
  const ellieSwitch = document.getElementById('ellie-switch');
  const toggleLabel = document.getElementById('toggle-label');
  const heatOverlay = document.getElementById('heat-map-overlay');
  const emotionTl = document.getElementById('emotion-timeline');
  const ellieInsight = document.getElementById('ellie-insight');

  if (ellieSwitch) {
    ellieSwitch.addEventListener('change', () => {
      const on = ellieSwitch.checked;
      toggleLabel.textContent = on ? 'Ellie is analyzing' : 'Turn on Ellie';

      if (on) {
        heatOverlay.classList.add('active');
        setTimeout(() => emotionTl.classList.add('active'), 300);
        setTimeout(() => {
          ellieInsight.classList.add('active');
          animateMetrics();
        }, 600);
      } else {
        heatOverlay.classList.remove('active');
        emotionTl.classList.remove('active');
        ellieInsight.classList.remove('active');
      }
    });
  }

  function animateMetrics() {
    document.querySelectorAll('#ellie-insight .metric-value').forEach(el => {
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = target / 30;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = '+' + Math.round(current);
      }, 30);
    });
  }

  /* ============================================
     CONCEPT 2: Live Pain Point Counter
     ============================================ */
  const counterEl = document.getElementById('counter-value');
  let counterStarted = false;

  if (counterEl) {
    // Estimated: ~$2B+ per day in unproven ROI globally
    // We show a slowly ticking number
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counterStarted) {
        counterStarted = true;
        let value = 1.2;
        const tick = () => {
          value += 0.001 + Math.random() * 0.003;
          counterEl.textContent = value.toFixed(2);
          requestAnimationFrame(tick);
        };
        tick();
      }
    }, { threshold: 0.3 });
    counterObserver.observe(document.getElementById('live-counter'));
  }

  /* ============================================
     CONCEPT 3: Interactive Campaign Comparison
     ============================================ */
  const compareA = document.getElementById('compare-a');
  const compareB = document.getElementById('compare-b');

  // Simulated benchmark data (anonymized, based on 341 studies)
  const platformData = {
    tiktok:    { recall: 22, intent: 18, emotion: 76 },
    instagram: { recall: 17, intent: 14, emotion: 62 },
    youtube:   { recall: 19, intent: 16, emotion: 68 },
    ctv:       { recall: 24, intent: 20, emotion: 72 },
  };

  function updateComparison() {
    const a = platformData[compareA.value];
    const b = platformData[compareB.value];
    const max = 30; // max scale for bars

    animateBar('bar-recall-a', a.recall, max, '+' + a.recall + 'pt');
    animateBar('bar-recall-b', b.recall, max, '+' + b.recall + 'pt');
    animateBar('bar-intent-a', a.intent, max, '+' + a.intent + 'pt');
    animateBar('bar-intent-b', b.intent, max, '+' + b.intent + 'pt');
    animateBar('bar-emotion-a', a.emotion, 100, a.emotion + '%');
    animateBar('bar-emotion-b', b.emotion, 100, b.emotion + '%');
  }

  function animateBar(id, value, max, label) {
    const bar = document.getElementById(id);
    if (!bar) return;
    const pct = Math.round((value / max) * 100);
    bar.style.width = pct + '%';
    bar.querySelector('span').textContent = label;
  }

  if (compareA && compareB) {
    compareA.addEventListener('change', updateComparison);
    compareB.addEventListener('change', updateComparison);

    // Trigger on scroll into view
    const compObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateComparison();
        compObserver.unobserve(entries[0].target);
      }
    }, { threshold: 0.3 });
    compObserver.observe(document.getElementById('comparison-tool'));
  }

  /* ============================================
     CONCEPT 4: Scroll Feed Analysis
     ============================================ */
  const feedDemo = document.getElementById('feed-demo');
  if (feedDemo) {
    const scrollTargets = [
      { overlay: 'scroll-heatmap', label: 'label-see', threshold: 0.3 },
      { overlay: 'scroll-emotion', label: 'label-feel', threshold: 0.5 },
      { overlay: 'scroll-metrics', label: 'label-act', threshold: 0.7 },
    ];

    const feedObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ratio = entry.intersectionRatio;
          scrollTargets.forEach(t => {
            const overlay = document.getElementById(t.overlay);
            const label = document.getElementById(t.label);
            if (ratio >= t.threshold) {
              overlay?.classList.add('active');
              label?.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      rootMargin: '-10% 0px -10% 0px'
    });
    feedObserver.observe(feedDemo);

    // Also trigger on scroll position for more reliable activation
    window.addEventListener('scroll', () => {
      const rect = feedDemo.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = 1 - (rect.top / vh);

      scrollTargets.forEach((t, i) => {
        const threshold = 0.2 + (i * 0.25);
        const overlay = document.getElementById(t.overlay);
        const label = document.getElementById(t.label);
        if (progress >= threshold) {
          overlay?.classList.add('active');
          label?.classList.add('active');
        }
      });
    });
  }

  /* ============================================
     CONCEPT 5: What Would Ellie Tell You?
     ============================================ */
  const quizSubmit = document.getElementById('quiz-submit');
  const quizResult = document.getElementById('quiz-result');
  const campaignUrl = document.getElementById('campaign-url');

  if (quizSubmit) {
    quizSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      // Show typing animation then result
      quizSubmit.textContent = 'Analyzing...';
      quizSubmit.disabled = true;

      setTimeout(() => {
        quizResult.classList.add('show');
        quizSubmit.textContent = 'Analyze with Ellie';
        quizSubmit.disabled = false;
      }, 1500);
    });
  }

  /* ============================================
     CONCEPT 6: Before/After Slider
     ============================================ */
  const baHandle = document.getElementById('ba-handle');
  const baAfter = document.getElementById('ba-after');
  const baContainer = document.getElementById('before-after');

  if (baHandle && baContainer) {
    let isDragging = false;

    const onDrag = (clientX) => {
      const rect = baContainer.querySelector('.ba-slider-wrap').getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(10, Math.min(90, pct));
      baHandle.style.left = pct + '%';
      baAfter.style.width = (100 - pct) + '%';
      baAfter.style.position = 'absolute';
      baAfter.style.right = '0';
      baAfter.style.top = '0';
      baAfter.style.bottom = '0';
    };

    baHandle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });
    baHandle.addEventListener('touchstart', (e) => {
      isDragging = true;
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) onDrag(e.clientX);
    });
    document.addEventListener('touchmove', (e) => {
      if (isDragging) onDrag(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchend', () => isDragging = false);

    // Setup initial positioning
    const sliderWrap = baContainer.querySelector('.ba-slider-wrap');
    sliderWrap.style.position = 'relative';
    baAfter.style.width = '50%';
    baAfter.style.position = 'absolute';
    baAfter.style.right = '0';
    baAfter.style.top = '0';
    baAfter.style.bottom = '0';
  }

  /* ============================================
     CONCEPT 7: Logo Heat Map
     ============================================ */
  const logoItems = document.querySelectorAll('.logo-item');
  logoItems.forEach(item => {
    const studies = parseInt(item.dataset.studies) || 1;
    // More studies = brighter glow on hover
    const intensity = Math.min(studies / 10, 1);

    item.addEventListener('mouseenter', () => {
      item.style.boxShadow = `0 0 ${20 + intensity * 30}px rgba(0, 122, 255, ${0.1 + intensity * 0.3})`;
      item.style.background = `rgba(0, 122, 255, ${0.03 + intensity * 0.08})`;

      // Glow neighboring items slightly
      const siblings = item.parentElement.children;
      const idx = Array.from(siblings).indexOf(item);
      [-1, 1].forEach(offset => {
        const neighbor = siblings[idx + offset];
        if (neighbor) {
          neighbor.style.color = 'rgba(255,255,255,0.5)';
          neighbor.style.transition = 'all 0.3s ease';
        }
      });
    });

    item.addEventListener('mouseleave', () => {
      item.style.boxShadow = '';
      item.style.background = '';

      const siblings = item.parentElement.children;
      Array.from(siblings).forEach(s => {
        if (s !== item) {
          s.style.color = '';
        }
      });
    });
  });

  /* ============================================
     Stats Counter Animation
     ============================================ */
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  statValues.forEach(el => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const target = parseInt(el.dataset.target);
        let current = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          current = Math.round(target * eased);
          el.textContent = current;
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  /* ============================================
     Smooth scroll for anchor links
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
