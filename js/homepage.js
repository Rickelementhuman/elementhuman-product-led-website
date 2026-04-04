/* ============================================
   Element Human — Homepage JS
   Section A: Reused patterns from main.js
   Section B: Condensed aha moment (3 phases)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     SECTION A — Reused patterns from main.js
     ============================================ */

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

  // ---- Stats Counter Animation ----
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
          const eased = 1 - Math.pow(1 - progress, 3);
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

  // ---- Logo Hover Glow ----
  const logoItems = document.querySelectorAll('.logo-item');
  logoItems.forEach(item => {
    const studies = parseInt(item.dataset.studies) || 1;
    const intensity = Math.min(studies / 10, 1);

    item.addEventListener('mouseenter', () => {
      item.style.boxShadow = `0 0 ${20 + intensity * 30}px rgba(0, 122, 255, ${0.1 + intensity * 0.3})`;
      item.style.background = `rgba(0, 122, 255, ${0.03 + intensity * 0.08})`;
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
      Array.from(item.parentElement.children).forEach(s => {
        if (s !== item) s.style.color = '';
      });
    });
  });

  // ---- Campaign Quiz Handler ----
  const quizSubmit = document.getElementById('quiz-submit');
  const quizResult = document.getElementById('quiz-result');
  if (quizSubmit) {
    quizSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      quizSubmit.textContent = 'Analyzing...';
      quizSubmit.disabled = true;
      setTimeout(() => {
        quizResult.classList.add('show');
        quizSubmit.textContent = 'Analyze with Ellie';
        quizSubmit.disabled = false;
      }, 1500);
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Pillar + Audience section in-view activation ----
  document.querySelectorAll('.pillar-section, .audience-section, .btr-section').forEach(section => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        section.classList.add('in-view');
        observer.unobserve(section);
      }
    }, { threshold: 0.25 });
    observer.observe(section);
  });


  /* ============================================
     PILLAR SECTION TOGGLES
     ============================================ */

  // SSP dot entrance animation (inside detail-distribution)
  const sspCard = document.getElementById('ssp-card');
  if (sspCard) {
    const sspDots = sspCard.querySelectorAll('.ssp-dot');
    const sspHero = sspCard.querySelector('.ssp-dot-hero');
    let sspAnimated = false;

    const sspObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !sspAnimated) {
        sspAnimated = true;
        sspDots.forEach((dot, i) => {
          const delay = i * 80 + Math.random() * 60;
          setTimeout(() => {
            dot.style.opacity = dot.classList.contains('ssp-dot-hero') ? '1' : '0.7';
          }, delay);
        });
        setTimeout(() => {
          if (sspHero) sspHero.classList.add('pulsing');
        }, sspDots.length * 80 + 200);
        sspObserver.unobserve(sspCard);
      }
    }, { threshold: 0.3 });
    sspObserver.observe(sspCard);
  }



  // ---- Discovery: Creator Impact Ladder (5 metrics) ----
  const cilCard = document.getElementById('cil-card');
  if (cilCard) {
    const cilLeaderboard = document.getElementById('cil-leaderboard');
    const cilCallout = document.getElementById('cil-callout');
    const cilCalloutText = document.getElementById('cil-callout-text');
    const cilToggles = cilCard.querySelectorAll('.cil-toggle');
    const cilRows = Array.from(cilLeaderboard.querySelectorAll('.cil-row'));

    // Helper: convert data-attribute name from camelCase sort key to kebab-case dataset key
    // data-stopping-power => stoppingPower in dataset
    function getMetricValue(row, sortKey) {
      if (sortKey === 'followers') return parseInt(row.dataset.followers);
      if (sortKey === 'stoppingPower') return parseInt(row.dataset.stoppingPower);
      if (sortKey === 'stayingPower') return parseInt(row.dataset.stayingPower);
      if (sortKey === 'brandCutThrough') return parseInt(row.dataset.brandCutThrough);
      if (sortKey === 'emotionalResonance') return parseInt(row.dataset.emotionalResonance);
      return 0;
    }

    // Creator data for sorting — includes all 5 metrics
    const creators = cilRows.map(row => ({
      el: row,
      handle: row.dataset.handle,
      followers: parseInt(row.dataset.followers),
      stoppingPower: parseInt(row.dataset.stoppingPower),
      stayingPower: parseInt(row.dataset.stayingPower),
      brandCutThrough: parseInt(row.dataset.brandCutThrough),
      emotionalResonance: parseInt(row.dataset.emotionalResonance)
    }));

    // Pre-compute sort orders for each metric
    const sortOrders = {
      followers: [...creators].sort((a, b) => b.followers - a.followers),
      stoppingPower: [...creators].sort((a, b) => b.stoppingPower - a.stoppingPower),
      stayingPower: [...creators].sort((a, b) => b.stayingPower - a.stayingPower),
      brandCutThrough: [...creators].sort((a, b) => b.brandCutThrough - a.brandCutThrough),
      emotionalResonance: [...creators].sort((a, b) => b.emotionalResonance - a.emotionalResonance)
    };

    // Callout messages per tab
    const calloutMessages = {
      followers: '',
      stoppingPower: '48K followers \u2192 #1 by stopping power',
      stayingPower: '127K followers \u2192 #1 by staying power',
      brandCutThrough: '127K followers \u2192 #1 by brand cut-through',
      emotionalResonance: '340K followers \u2192 #1 by emotional resonance'
    };

    let currentSort = 'followers';
    let cilAnimated = false;
    let cilAutoPlayed = false;
    let cachedRowH = 0;

    // Compute row height once from the natural layout (offsetHeight)
    function getRowHeight() {
      if (cachedRowH > 0) return cachedRowH;
      cachedRowH = cilRows[0].offsetHeight || 56;
      return cachedRowH;
    }

    // Recalculate on resize
    window.addEventListener('resize', () => { cachedRowH = 0; });

    // Get original DOM index of a creator
    function getOriginalIndex(creator) {
      return cilRows.indexOf(creator.el);
    }

    // Apply sort: compute translateY for each row to move it to its target slot
    function applySort(sortKey, animate) {
      const order = sortOrders[sortKey] || sortOrders.followers;
      const rowH = getRowHeight();

      order.forEach((creator, targetSlot) => {
        const originalSlot = getOriginalIndex(creator);
        const offset = (targetSlot - originalSlot) * rowH;

        if (animate) {
          creator.el.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.4s ease, box-shadow 0.4s ease';
        } else {
          creator.el.style.transition = 'none';
        }

        creator.el.style.transform = `translateY(${offset}px)`;

        // Update rank number
        creator.el.querySelector('.cil-rank').textContent = targetSlot + 1;

        // Top slot glow (only for non-followers sorts)
        if (sortKey !== 'followers' && targetSlot === 0) {
          creator.el.classList.add('cil-top');
        } else {
          creator.el.classList.remove('cil-top');
        }
      });

      // Update bars to show the selected metric's scores
      fillBars(sortKey);

      // Update score labels
      updateScoreLabels(sortKey);

      // Toggle active button
      cilToggles.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sortKey);
      });

      // Callout badge — show for all non-followers tabs, hide for followers
      if (sortKey !== 'followers' && calloutMessages[sortKey]) {
        cilCalloutText.textContent = calloutMessages[sortKey];
        setTimeout(() => { cilCallout.classList.add('visible'); }, animate ? 500 : 0);
      } else {
        cilCallout.classList.remove('visible');
      }

      currentSort = sortKey;
    }

    // Follower bar widths (scaled for visual clarity since raw range is 48K–5.2M)
    const followerBarWidths = {
      'maxviral': 100,
      'trendsetterkai': 82,
      'lifestyle.jade': 64,
      'nova.daily': 48,
      'creativemira': 34,
      'luna.creates': 22
    };

    // Follower display labels
    const followerDisplayLabels = {
      'maxviral': '5.2M',
      'trendsetterkai': '2.1M',
      'lifestyle.jade': '890K',
      'nova.daily': '340K',
      'creativemira': '127K',
      'luna.creates': '48K'
    };

    // Fill bars based on the currently selected metric
    function fillBars(sortKey) {
      cilRows.forEach(row => {
        const bar = row.querySelector('.cil-bar');
        if (sortKey === 'followers') {
          // Show follower count as scaled bar width
          const handle = row.dataset.handle;
          const width = followerBarWidths[handle] || 0;
          bar.style.width = width + '%';
        } else {
          const score = getMetricValue(row, sortKey);
          bar.style.width = score + '%';
        }
      });
    }

    // Update the score number shown on each row
    function updateScoreLabels(sortKey) {
      cilRows.forEach(row => {
        const scoreEl = row.querySelector('.cil-score');
        if (sortKey === 'followers') {
          // Show formatted follower count (e.g. "5.2M", "890K")
          const handle = row.dataset.handle;
          scoreEl.textContent = followerDisplayLabels[handle] || '';
        } else {
          scoreEl.textContent = getMetricValue(row, sortKey);
        }
      });
    }

    // Manual toggle clicks
    cilToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const sortKey = btn.dataset.sort;
        if (sortKey === currentSort) return;
        applySort(sortKey, true);
      });
    });

    // Initialize: set to followers order with no animation, bars at 0
    applySort('followers', false);
    // Reset bars to 0 width initially (they'll animate on scroll)
    cilRows.forEach(row => {
      row.querySelector('.cil-bar').style.width = '0%';
    });

    // IntersectionObserver for scroll-triggered auto-play
    const cilObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !cilAnimated) {
        cilAnimated = true;

        // Step 1: Fill the bars with animation
        requestAnimationFrame(() => {
          fillBars('followers');
        });

        // Step 2: After 1.5s pause, auto-flip to BY STOPPING POWER
        if (!cilAutoPlayed) {
          cilAutoPlayed = true;
          setTimeout(() => {
            applySort('stoppingPower', true);
          }, 1500);
        }

        cilObserver.unobserve(cilCard);
      }
    }, { threshold: 0.3 });
    cilObserver.observe(cilCard);
  }

  // ---- Strategy: Brand Territory Reframe ----
  var btrCard = document.getElementById('btr-card');
  if (btrCard) {
    // Territory data
    var BTR_DATA = {
      premium: {
        score: 78, benchmark: 72,
        metrics: { awareness: 81, favorability: 84, consideration: 68, purchaseIntent: 62, brandMemory: 76 },
        insight: 'Your brand over-indexes on premium perception. This is your strongest territory \u2014 lean into it.'
      },
      innovation: {
        score: 52, benchmark: 71,
        metrics: { awareness: 64, favorability: 55, consideration: 48, purchaseIntent: 41, brandMemory: 53 },
        insight: 'Innovation is your biggest gap. Premium leaders who add an innovation narrative see 23% higher consideration.'
      },
      authenticity: {
        score: 67, benchmark: 69,
        metrics: { awareness: 72, favorability: 71, consideration: 63, purchaseIntent: 55, brandMemory: 68 },
        insight: 'Solid authenticity scores, but you\u2019re trailing the leaders. Creator-led content drives the biggest gains here.'
      },
      trust: {
        score: 71, benchmark: 73,
        metrics: { awareness: 75, favorability: 78, consideration: 66, purchaseIntent: 59, brandMemory: 72 },
        insight: 'Trust is your baseline \u2014 you\u2019re competitive but not differentiated. Most brands in your category score similarly.'
      },
      sustainability: {
        score: 58, benchmark: 68,
        metrics: { awareness: 62, favorability: 61, consideration: 52, purchaseIntent: 46, brandMemory: 59 },
        insight: 'Sustainability is emerging as a differentiator in your category. Early movers see 2\u00d7 the brand memory uplift.'
      }
    };

    // Premium benchmark metrics for computing deltas
    var BTR_BENCHMARKS = {
      premium:        { awareness: 75, favorability: 78, consideration: 64, purchaseIntent: 58, brandMemory: 70 },
      innovation:     { awareness: 72, favorability: 68, consideration: 65, purchaseIntent: 60, brandMemory: 66 },
      authenticity:   { awareness: 70, favorability: 73, consideration: 67, purchaseIntent: 58, brandMemory: 71 },
      trust:          { awareness: 74, favorability: 80, consideration: 68, purchaseIntent: 62, brandMemory: 74 },
      sustainability: { awareness: 66, favorability: 65, consideration: 58, purchaseIntent: 52, brandMemory: 64 }
    };

    var btrPills = btrCard.querySelectorAll('.btr-pill');
    var btrScoreEl = document.getElementById('btr-score-number');
    var btrDelta = document.getElementById('btr-delta');
    var btrDeltaArrow = document.getElementById('btr-delta-arrow');
    var btrDeltaText = document.getElementById('btr-delta-text');
    var btrInsightText = document.getElementById('btr-insight-text');
    var btrArcFill = document.getElementById('btr-arc-fill');
    var btrArcBg = document.getElementById('btr-arc-bg');
    var btrBenchLine = document.getElementById('btr-benchmark-line');
    var btrBenchLabel = document.getElementById('btr-benchmark-label');

    var btrCurrentTerritory = 'premium';
    var btrAnimated = false;
    var btrTransitioning = false;

    // Gauge arc geometry
    var ARC_CX = 150, ARC_CY = 150, ARC_R = 110;
    var ARC_START = Math.PI;      // left (180deg)
    var ARC_END = 2 * Math.PI;    // right (360deg = 0deg)
    var ARC_TOTAL = ARC_END - ARC_START; // PI radians = semicircle

    function arcPoint(angle) {
      return {
        x: ARC_CX + ARC_R * Math.cos(angle),
        y: ARC_CY + ARC_R * Math.sin(angle)
      };
    }

    function describeArc(startAngle, endAngle) {
      var start = arcPoint(startAngle);
      var end = arcPoint(endAngle);
      var sweep = endAngle - startAngle;
      var largeArc = sweep > Math.PI ? 1 : 0;
      return 'M ' + start.x + ' ' + start.y +
             ' A ' + ARC_R + ' ' + ARC_R + ' 0 ' + largeArc + ' 1 ' + end.x + ' ' + end.y;
    }

    // Draw full background arc
    var bgArcPath = describeArc(ARC_START, ARC_END - 0.01);
    btrArcBg.setAttribute('d', bgArcPath);

    // Compute arc path length for dash animation
    var fullArcLength = Math.PI * ARC_R; // semicircle circumference

    function setGauge(score, benchmark, animate) {
      var pct = Math.min(score / 100, 1);
      var fillAngle = ARC_START + ARC_TOTAL * pct;
      var fillPath = describeArc(ARC_START, Math.max(fillAngle, ARC_START + 0.01));
      btrArcFill.setAttribute('d', fillPath);

      // Dash-based animation
      var arcLen = Math.PI * ARC_R * pct;
      var totalLen = Math.PI * ARC_R;
      btrArcFill.style.strokeDasharray = totalLen;
      if (animate) {
        btrArcFill.style.strokeDashoffset = totalLen;
        // Force reflow then animate
        btrArcFill.getBoundingClientRect();
        btrArcFill.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)';
        btrArcFill.style.strokeDashoffset = totalLen - arcLen;
      } else {
        btrArcFill.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        btrArcFill.style.strokeDashoffset = totalLen - arcLen;
      }

      // Benchmark tick mark
      var bmPct = Math.min(benchmark / 100, 1);
      var bmAngle = ARC_START + ARC_TOTAL * bmPct;
      var bmInner = arcPoint(bmAngle);
      // Compute outer point (further from center)
      var bmOuter = {
        x: ARC_CX + (ARC_R + 14) * Math.cos(bmAngle),
        y: ARC_CY + (ARC_R + 14) * Math.sin(bmAngle)
      };
      var bmInnerShort = {
        x: ARC_CX + (ARC_R - 14) * Math.cos(bmAngle),
        y: ARC_CY + (ARC_R - 14) * Math.sin(bmAngle)
      };
      btrBenchLine.setAttribute('x1', bmInnerShort.x);
      btrBenchLine.setAttribute('y1', bmInnerShort.y);
      btrBenchLine.setAttribute('x2', bmOuter.x);
      btrBenchLine.setAttribute('y2', bmOuter.y);

      // Benchmark label position
      var labelR = ARC_R + 26;
      var labelPt = {
        x: ARC_CX + labelR * Math.cos(bmAngle),
        y: ARC_CY + labelR * Math.sin(bmAngle)
      };
      btrBenchLabel.setAttribute('x', labelPt.x);
      btrBenchLabel.setAttribute('y', labelPt.y);
    }

    function countTo(el, target, suffix, duration, startVal) {
      var start = startVal || 0;
      var startTime = performance.now();
      suffix = suffix || '';
      function step(now) {
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(start + (target - start) * eased);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function updateTerritory(territory, animate) {
      var data = BTR_DATA[territory];
      var benchmarks = BTR_BENCHMARKS[territory];
      var duration = animate ? 800 : 0;
      var prevScore = parseInt(btrScoreEl.textContent) || 0;

      // Update gauge
      setGauge(data.score, data.benchmark, animate);

      // Animate score number
      if (animate) {
        countTo(btrScoreEl, data.score, '', 800, prevScore);
      } else {
        btrScoreEl.textContent = data.score;
      }

      // Delta
      var diff = data.score - data.benchmark;
      var isAbove = diff >= 0;
      btrDelta.className = 'btr-delta ' + (isAbove ? 'above' : 'below');
      btrDeltaArrow.innerHTML = isAbove ? '&#8593;' : '&#8595;';
      btrDeltaText.textContent = (isAbove ? '+' + diff : diff) + (isAbove ? ' above benchmark' : ' below benchmark');

      // Metrics
      var metricKeys = ['awareness', 'favorability', 'consideration', 'purchaseIntent', 'brandMemory'];
      metricKeys.forEach(function(key, i) {
        var valEl = document.getElementById('btr-m-' + key);
        var deltaEl = document.getElementById('btr-md-' + key);
        var val = data.metrics[key];
        var bmVal = benchmarks[key];
        var metricDiff = val - bmVal;
        var metricAbove = metricDiff >= 0;

        if (animate) {
          var prevVal = parseInt(valEl.textContent) || 0;
          setTimeout(function() {
            countTo(valEl, val, '%', 600, prevVal);
          }, i * 60);
        } else {
          valEl.textContent = val + '%';
        }

        deltaEl.className = 'btr-metric-delta ' + (metricAbove ? 'above' : 'below');
        deltaEl.textContent = (metricAbove ? '+' + metricDiff : metricDiff);
      });

      // Insight text crossfade
      if (animate) {
        btrInsightText.style.opacity = '0';
        setTimeout(function() {
          btrInsightText.textContent = data.insight;
          btrInsightText.style.opacity = '1';
        }, 300);
      } else {
        btrInsightText.textContent = data.insight;
      }

      btrCurrentTerritory = territory;
    }

    // Pill click handlers
    btrPills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        if (btrTransitioning) return;
        var territory = pill.getAttribute('data-territory');
        if (territory === btrCurrentTerritory) return;

        btrTransitioning = true;
        btrPills.forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');

        updateTerritory(territory, true);

        setTimeout(function() { btrTransitioning = false; }, 700);
      });
    });

    // Scroll-triggered entrance animation
    var btrSection = document.getElementById('detail-strategy');
    var btrEntranceAnimated = false;

    function animateBtrEntrance() {
      if (btrEntranceAnimated) return;
      btrEntranceAnimated = true;

      // Set initial state (premium territory, no animation)
      setGauge(0, BTR_DATA.premium.benchmark, false);
      btrScoreEl.textContent = '0';

      // Small delay then animate in
      setTimeout(function() {
        updateTerritory('premium', true);
      }, 200);
    }

    var btrObs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        animateBtrEntrance();
        btrObs.unobserve(btrSection);
      }
    }, { threshold: 0.2 });
    btrObs.observe(btrSection);
  }

  // ---- Measurement: animate bars and counters on in-view ----
  const measSection = document.querySelector('.pillar-measurement');
  if (measSection) {
    const measObs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      measObs.unobserve(measSection);
      measSection.querySelectorAll('.metric-bar-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') + 'px';
      });
      measSection.querySelectorAll('.metric-value').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const step = () => {
          current += Math.ceil(target / 40);
          if (current >= target) { el.textContent = target + '%'; return; }
          el.textContent = current + '%';
          requestAnimationFrame(step);
        };
        step();
      });
    }, { threshold: 0.3 });
    measObs.observe(measSection);
  }


  /* ============================================
     CREATION: Creative Comparison Grid (4 Cards)
     ============================================ */
  const ccGrid = document.getElementById('cc-grid');
  if (ccGrid) {
    const ccCards = Array.from(ccGrid.querySelectorAll('.cc-card'));
    const ccWinnerBadge = document.getElementById('cc-winner-badge');
    const ccWinnerCard = ccGrid.querySelector('.cc-card-winner');
    const ccEllie = document.getElementById('cc-ellie');
    const ccEllieBody = document.getElementById('cc-ellie-body');

    // Per-card Ellie comments
    const ccEllieComments = {
      default: 'Version B leads on emotional response \u2014 the opening hook and pacing drive 77% higher engagement than Version A. But don\u2019t overlook Version D: it converts better on recall and purchase intent. Consider combining B\u2019s emotional storytelling with D\u2019s brand integration for maximum impact.',
      a: 'Version A underperforms across all metrics. The pacing drops at the 8-second mark and the hook isn\u2019t strong enough. Consider re-cutting the opening 3 seconds.',
      b: 'Version B is your strongest creative overall. The emotional peak at 0:12 is driving recall, and the narrative arc sustains attention throughout.',
      c: 'Version C grabs attention but fails to convert it into brand recall. The visuals are strong but the brand integration comes too late \u2014 move it earlier.',
      d: 'Version D excels at brand integration and drives purchase intent, but the emotional response is flat. Add an emotional beat in the first 5 seconds.'
    };

    let ccAnimated = false;
    let ccActiveCard = null;

    // Count-up animation helper
    function ccCountUp(el, target, duration, delay) {
      setTimeout(() => {
        const startTime = performance.now();
        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }, delay);
    }

    // Animate bars from 0 to value
    function ccAnimateBars() {
      ccCards.forEach((card, cardIdx) => {
        const bars = card.querySelectorAll('.cc-bar-fill');
        const vals = card.querySelectorAll('.cc-metric-val');
        bars.forEach((bar, i) => {
          const value = parseInt(bar.dataset.value);
          const delay = cardIdx * 150 + i * 80;
          setTimeout(() => {
            bar.style.width = value + '%';
          }, delay);
        });
        vals.forEach((val, i) => {
          const target = parseInt(val.dataset.target);
          ccCountUp(val, target, 800, cardIdx * 150 + i * 80);
        });
      });
    }

    // Run the full entrance animation sequence
    function ccAnimate() {
      // Reset
      ccCards.forEach(c => {
        c.classList.remove('cc-visible');
        c.querySelectorAll('.cc-bar-fill').forEach(b => { b.style.width = '0%'; });
        c.querySelectorAll('.cc-metric-val').forEach(v => { v.textContent = '0'; });
      });
      if (ccWinnerBadge) ccWinnerBadge.classList.remove('cc-visible');
      if (ccWinnerCard) ccWinnerCard.classList.remove('cc-winner-glow');
      if (ccEllie) ccEllie.classList.remove('cc-visible');

      // Step 1: Cards fade in with staggered delay (left to right)
      ccCards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add('cc-visible');
        }, i * 120);
      });

      // Step 2: Metric bars animate from 0 to values
      setTimeout(() => {
        ccAnimateBars();
      }, ccCards.length * 120 + 100);

      // Step 3: Winner highlight appears after bars finish
      const barAnimDuration = ccCards.length * 150 + 4 * 80 + 800;
      setTimeout(() => {
        if (ccWinnerBadge) ccWinnerBadge.classList.add('cc-visible');
        if (ccWinnerCard) ccWinnerCard.classList.add('cc-winner-glow');
      }, ccCards.length * 120 + 100 + barAnimDuration - 200);

      // Step 4: Ellie comment slides up
      setTimeout(() => {
        if (ccEllie) ccEllie.classList.add('cc-visible');
      }, ccCards.length * 120 + 100 + barAnimDuration + 200);
    }

    // Click handler: highlight card and update Ellie comment
    ccCards.forEach(card => {
      card.addEventListener('click', () => {
        const version = card.dataset.version;

        // If clicking the already active card, deselect and show default
        if (ccActiveCard === version) {
          ccCards.forEach(c => c.classList.remove('cc-active'));
          ccActiveCard = null;
          // Crossfade Ellie text back to default
          if (ccEllieBody) {
            ccEllieBody.style.opacity = '0';
            setTimeout(() => {
              ccEllieBody.textContent = ccEllieComments.default;
              ccEllieBody.style.opacity = '1';
            }, 200);
          }
          return;
        }

        // Highlight the clicked card
        ccCards.forEach(c => c.classList.remove('cc-active'));
        card.classList.add('cc-active');
        ccActiveCard = version;

        // Crossfade Ellie comment
        if (ccEllieBody && ccEllieComments[version]) {
          ccEllieBody.style.opacity = '0';
          setTimeout(() => {
            ccEllieBody.textContent = ccEllieComments[version];
            ccEllieBody.style.opacity = '1';
          }, 200);
        }
      });
    });

    // IntersectionObserver to trigger on scroll
    const ccDetailSection = document.getElementById('detail-creation') || ccGrid;
    const ccObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !ccAnimated) {
        ccAnimated = true;
        ccAnimate();
        ccObserver.unobserve(ccDetailSection);
      }
    }, { threshold: 0.15 });
    ccObserver.observe(ccDetailSection);
  }


  /* ============================================
     AUDIENCE MAP — Interactive Living World + Ask Ellie
     ============================================ */
  const audCanvas = document.getElementById('audience-canvas');
  if (audCanvas) {
    const audCtx = audCanvas.getContext('2d');
    let audW = 0, audH = 0;
    let audActive = false;
    let audRevealed = false;
    let audRevealTime = 0;
    let audHoverDot = null;

    // --- Query state ---
    var audQueryActive = false;
    var audActivePreset = null;
    var audTransitionProgress = 0;
    var audTransitionStart = 0;
    var audTransitioning = false;
    var TRANSITION_DURATION = 1200;

    // --- Simplified continent outlines [lng, lat] ---
    const LAND = [
      [[-130,55],[-120,60],[-100,68],[-80,68],[-65,60],[-58,52],[-60,47],[-70,42],[-75,35],[-82,30],[-90,18],[-105,20],[-118,32],[-125,48],[-130,55]],
      [[-55,60],[-44,60],[-20,72],[-18,78],[-35,83],[-50,78],[-55,60]],
      [[-80,10],[-60,8],[-50,2],[-35,-5],[-35,-12],[-40,-22],[-55,-35],[-68,-55],[-75,-45],[-70,-18],[-78,2],[-80,10]],
      [[-10,36],[5,43],[10,55],[25,56],[30,62],[28,71],[15,70],[5,62],[-5,55],[-10,36]],
      [[-8,50],[-5,55],[-2,58],[1,58],[2,53],[0,50],[-8,50]],
      [[-17,15],[-5,35],[10,37],[32,32],[42,12],[50,2],[40,-12],[30,-34],[18,-35],[12,-6],[5,5],[-17,15]],
      [[30,40],[50,25],[65,25],[78,8],[88,22],[100,15],[105,2],[120,10],[130,35],[142,44],[135,52],[100,50],[70,42],[30,40]],
      [[130,31],[136,35],[140,42],[142,45],[140,43],[136,36],[130,31]],
      [[115,-14],[135,-12],[150,-15],[153,-25],[148,-38],[135,-35],[125,-30],[115,-22],[115,-14]],
    ];

    // --- Deterministic RNG for consistent dot generation ---
    var _seed = 42;
    function rng() { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; }

    // --- Emotion palette ---
    var EMOTIONS = [
      { name: 'Joy', color: '#FF2198' },
      { name: 'Surprise', color: '#F9BE00' },
      { name: 'Trust', color: '#10A8B7' },
      { name: 'Excitement', color: '#54E42B' },
      { name: 'Focus', color: '#007AFF' },
      { name: 'Curiosity', color: '#8F21A1' },
    ];
    var PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'CTV'];

    // --- Status colors for query mode ---
    var STATUS_COLORS = {
      above: '#54E42B',
      opportunity: '#F9BE00',
      whitespace: '#FF2198'
    };

    // --- Generate ~300 dots from regional clusters ---
    var REGIONS = [
      { name:'New York', lat:40.7, lng:-74, n:12, s:3 },
      { name:'Los Angeles', lat:34, lng:-118, n:10, s:3 },
      { name:'Chicago', lat:41.9, lng:-87.6, n:6, s:2 },
      { name:'Miami', lat:25.8, lng:-80.2, n:5, s:2 },
      { name:'San Francisco', lat:37.8, lng:-122.4, n:7, s:2 },
      { name:'Washington DC', lat:38.9, lng:-77, n:5, s:2 },
      { name:'Atlanta', lat:33.7, lng:-84.4, n:5, s:2 },
      { name:'Dallas', lat:32.8, lng:-96.8, n:4, s:2 },
      { name:'Seattle', lat:47.6, lng:-122.3, n:4, s:1.5 },
      { name:'Boston', lat:42.4, lng:-71.1, n:4, s:1.5 },
      { name:'Toronto', lat:43.7, lng:-79.4, n:5, s:2 },
      { name:'Vancouver', lat:49.3, lng:-123.1, n:3, s:1.5 },
      { name:'Mexico City', lat:19.4, lng:-99.1, n:6, s:3 },
      { name:'S\u00e3o Paulo', lat:-23.5, lng:-46.6, n:10, s:4 },
      { name:'Rio de Janeiro', lat:-22.9, lng:-43.2, n:5, s:2 },
      { name:'Buenos Aires', lat:-34.6, lng:-58.4, n:4, s:2 },
      { name:'Bogot\u00e1', lat:4.7, lng:-74.1, n:3, s:2 },
      { name:'Santiago', lat:-33.4, lng:-70.7, n:3, s:2 },
      { name:'Lima', lat:-12, lng:-77, n:3, s:2 },
      { name:'London', lat:51.5, lng:-0.12, n:14, s:3 },
      { name:'Paris', lat:48.9, lng:2.35, n:8, s:2.5 },
      { name:'Berlin', lat:52.5, lng:13.4, n:7, s:2.5 },
      { name:'Amsterdam', lat:52.4, lng:4.9, n:4, s:1.5 },
      { name:'Madrid', lat:40.4, lng:-3.7, n:5, s:2 },
      { name:'Rome', lat:41.9, lng:12.5, n:4, s:2 },
      { name:'Stockholm', lat:59.3, lng:18.1, n:4, s:2 },
      { name:'Warsaw', lat:52.2, lng:21, n:3, s:2 },
      { name:'Zurich', lat:47.4, lng:8.5, n:3, s:1 },
      { name:'Munich', lat:48.1, lng:11.6, n:3, s:1.5 },
      { name:'Barcelona', lat:41.4, lng:2.2, n:4, s:1.5 },
      { name:'Istanbul', lat:41, lng:28.9, n:5, s:3 },
      { name:'Moscow', lat:55.8, lng:37.6, n:5, s:3 },
      { name:'Dubai', lat:25.3, lng:55.3, n:5, s:2 },
      { name:'Riyadh', lat:24.7, lng:46.7, n:3, s:2 },
      { name:'Cairo', lat:30, lng:31.2, n:4, s:2 },
      { name:'Lagos', lat:6.5, lng:3.4, n:6, s:3 },
      { name:'Nairobi', lat:-1.3, lng:36.8, n:3, s:2 },
      { name:'Cape Town', lat:-34, lng:18.4, n:3, s:2 },
      { name:'Johannesburg', lat:-26.2, lng:28, n:3, s:2 },
      { name:'Mumbai', lat:19.1, lng:72.9, n:10, s:4 },
      { name:'Delhi', lat:28.6, lng:77.2, n:8, s:3 },
      { name:'Bangalore', lat:13, lng:77.6, n:5, s:2 },
      { name:'Chennai', lat:13.1, lng:80.3, n:3, s:2 },
      { name:'Kolkata', lat:22.6, lng:88.4, n:4, s:2 },
      { name:'Bangkok', lat:13.8, lng:100.5, n:5, s:2.5 },
      { name:'Singapore', lat:1.4, lng:103.8, n:5, s:1.5 },
      { name:'Jakarta', lat:-6.2, lng:106.8, n:6, s:3 },
      { name:'Ho Chi Minh', lat:10.8, lng:106.7, n:3, s:2 },
      { name:'Manila', lat:14.6, lng:121, n:4, s:2 },
      { name:'Shanghai', lat:31.2, lng:121.5, n:10, s:4 },
      { name:'Beijing', lat:39.9, lng:116.4, n:8, s:3 },
      { name:'Shenzhen', lat:22.5, lng:114.1, n:5, s:2 },
      { name:'Guangzhou', lat:23.1, lng:113.3, n:4, s:2 },
      { name:'Chengdu', lat:30.6, lng:104, n:3, s:2 },
      { name:'Tokyo', lat:35.7, lng:139.7, n:12, s:3 },
      { name:'Osaka', lat:34.7, lng:135.5, n:5, s:2 },
      { name:'Seoul', lat:37.6, lng:126.9, n:8, s:2.5 },
      { name:'Sydney', lat:-33.9, lng:151.2, n:7, s:3 },
      { name:'Melbourne', lat:-37.8, lng:145, n:5, s:2 },
      { name:'Auckland', lat:-36.9, lng:174.8, n:3, s:2 },
    ];

    // --- Region defaults for default-state tooltip ---
    var REGION_DEFAULTS = {};
    (function() {
      var defaults = [
        ['New York',{audienceSize:'18.4M',topPlatform:'Instagram',receptivity:'High'}],
        ['Los Angeles',{audienceSize:'14.2M',topPlatform:'TikTok',receptivity:'High'}],
        ['Chicago',{audienceSize:'6.8M',topPlatform:'YouTube',receptivity:'Medium'}],
        ['Miami',{audienceSize:'5.1M',topPlatform:'Instagram',receptivity:'High'}],
        ['San Francisco',{audienceSize:'7.2M',topPlatform:'YouTube',receptivity:'High'}],
        ['Washington DC',{audienceSize:'4.9M',topPlatform:'CTV',receptivity:'Medium'}],
        ['Atlanta',{audienceSize:'5.5M',topPlatform:'TikTok',receptivity:'Medium'}],
        ['Dallas',{audienceSize:'4.3M',topPlatform:'CTV',receptivity:'Medium'}],
        ['Seattle',{audienceSize:'3.8M',topPlatform:'YouTube',receptivity:'High'}],
        ['Boston',{audienceSize:'3.5M',topPlatform:'Instagram',receptivity:'Medium'}],
        ['Toronto',{audienceSize:'8.1M',topPlatform:'YouTube',receptivity:'High'}],
        ['Vancouver',{audienceSize:'3.2M',topPlatform:'Instagram',receptivity:'Medium'}],
        ['Mexico City',{audienceSize:'12.6M',topPlatform:'TikTok',receptivity:'High'}],
        ['S\u00e3o Paulo',{audienceSize:'22.1M',topPlatform:'Instagram',receptivity:'Very High'}],
        ['Rio de Janeiro',{audienceSize:'9.4M',topPlatform:'TikTok',receptivity:'High'}],
        ['Buenos Aires',{audienceSize:'6.2M',topPlatform:'Instagram',receptivity:'Medium'}],
        ['Bogot\u00e1',{audienceSize:'5.8M',topPlatform:'TikTok',receptivity:'High'}],
        ['Santiago',{audienceSize:'4.1M',topPlatform:'YouTube',receptivity:'Medium'}],
        ['Lima',{audienceSize:'5.3M',topPlatform:'TikTok',receptivity:'Medium'}],
        ['London',{audienceSize:'21.3M',topPlatform:'Instagram',receptivity:'Very High'}],
        ['Paris',{audienceSize:'12.8M',topPlatform:'TikTok',receptivity:'High'}],
        ['Berlin',{audienceSize:'8.4M',topPlatform:'YouTube',receptivity:'High'}],
        ['Amsterdam',{audienceSize:'4.6M',topPlatform:'Instagram',receptivity:'High'}],
        ['Madrid',{audienceSize:'6.1M',topPlatform:'Instagram',receptivity:'Medium'}],
        ['Rome',{audienceSize:'5.2M',topPlatform:'TikTok',receptivity:'Medium'}],
        ['Stockholm',{audienceSize:'3.9M',topPlatform:'YouTube',receptivity:'High'}],
        ['Warsaw',{audienceSize:'3.4M',topPlatform:'TikTok',receptivity:'Medium'}],
        ['Zurich',{audienceSize:'2.8M',topPlatform:'Instagram',receptivity:'Medium'}],
        ['Munich',{audienceSize:'3.6M',topPlatform:'YouTube',receptivity:'Medium'}],
        ['Barcelona',{audienceSize:'5.0M',topPlatform:'TikTok',receptivity:'High'}],
        ['Istanbul',{audienceSize:'11.2M',topPlatform:'TikTok',receptivity:'High'}],
        ['Moscow',{audienceSize:'14.5M',topPlatform:'YouTube',receptivity:'Medium'}],
        ['Dubai',{audienceSize:'6.7M',topPlatform:'Instagram',receptivity:'Very High'}],
        ['Riyadh',{audienceSize:'4.8M',topPlatform:'TikTok',receptivity:'High'}],
        ['Cairo',{audienceSize:'9.1M',topPlatform:'TikTok',receptivity:'Medium'}],
        ['Lagos',{audienceSize:'15.8M',topPlatform:'TikTok',receptivity:'Very High'}],
        ['Nairobi',{audienceSize:'6.3M',topPlatform:'TikTok',receptivity:'High'}],
        ['Cape Town',{audienceSize:'3.7M',topPlatform:'Instagram',receptivity:'Medium'}],
        ['Johannesburg',{audienceSize:'4.4M',topPlatform:'YouTube',receptivity:'Medium'}],
        ['Mumbai',{audienceSize:'24.6M',topPlatform:'Instagram',receptivity:'Very High'}],
        ['Delhi',{audienceSize:'19.8M',topPlatform:'YouTube',receptivity:'High'}],
        ['Bangalore',{audienceSize:'8.9M',topPlatform:'YouTube',receptivity:'High'}],
        ['Chennai',{audienceSize:'5.6M',topPlatform:'YouTube',receptivity:'Medium'}],
        ['Kolkata',{audienceSize:'7.2M',topPlatform:'YouTube',receptivity:'Medium'}],
        ['Bangkok',{audienceSize:'10.5M',topPlatform:'TikTok',receptivity:'High'}],
        ['Singapore',{audienceSize:'5.9M',topPlatform:'Instagram',receptivity:'Very High'}],
        ['Jakarta',{audienceSize:'16.4M',topPlatform:'TikTok',receptivity:'Very High'}],
        ['Ho Chi Minh',{audienceSize:'8.7M',topPlatform:'TikTok',receptivity:'High'}],
        ['Manila',{audienceSize:'11.3M',topPlatform:'TikTok',receptivity:'High'}],
        ['Shanghai',{audienceSize:'20.2M',topPlatform:'CTV',receptivity:'High'}],
        ['Beijing',{audienceSize:'17.1M',topPlatform:'CTV',receptivity:'Medium'}],
        ['Shenzhen',{audienceSize:'9.8M',topPlatform:'CTV',receptivity:'High'}],
        ['Guangzhou',{audienceSize:'8.5M',topPlatform:'CTV',receptivity:'Medium'}],
        ['Chengdu',{audienceSize:'6.9M',topPlatform:'CTV',receptivity:'Medium'}],
        ['Tokyo',{audienceSize:'18.9M',topPlatform:'YouTube',receptivity:'High'}],
        ['Osaka',{audienceSize:'8.2M',topPlatform:'YouTube',receptivity:'Medium'}],
        ['Seoul',{audienceSize:'14.7M',topPlatform:'YouTube',receptivity:'Very High'}],
        ['Sydney',{audienceSize:'9.6M',topPlatform:'Instagram',receptivity:'High'}],
        ['Melbourne',{audienceSize:'7.1M',topPlatform:'YouTube',receptivity:'High'}],
        ['Auckland',{audienceSize:'2.9M',topPlatform:'Instagram',receptivity:'Medium'}],
      ];
      defaults.forEach(function(d) { REGION_DEFAULTS[d[0]] = d[1]; });
    })();

    // --- Brand presets ---
    var PRESETS = {
      nike: {
        highlights: ['London','New York','Tokyo','S\u00e3o Paulo','Mumbai','Lagos','Berlin','Seoul','Sydney','Mexico City','Shanghai','Paris'],
        data: {
          'London':      { status:'above', brandAwareness:{value:82,category:61}, favorability:{value:76,category:54}, consideration:{value:65,category:44}, purchaseIntent:{value:52,category:36}, topPlatform:'Instagram', competitorShare:'Leading by 12pt', audienceSize:'21.3M' },
          'New York':    { status:'above', brandAwareness:{value:85,category:63}, favorability:{value:78,category:56}, consideration:{value:68,category:48}, purchaseIntent:{value:55,category:38}, topPlatform:'CTV', competitorShare:'Leading by 9pt', audienceSize:'18.4M' },
          'Tokyo':       { status:'above', brandAwareness:{value:78,category:62}, favorability:{value:71,category:55}, consideration:{value:59,category:46}, purchaseIntent:{value:45,category:35}, topPlatform:'YouTube', competitorShare:'Leading by 7pt', audienceSize:'18.9M' },
          'S\u00e3o Paulo':   { status:'opportunity', brandAwareness:{value:62,category:60}, favorability:{value:54,category:55}, consideration:{value:42,category:46}, purchaseIntent:{value:31,category:36}, topPlatform:'Instagram', competitorShare:'Trailing by 4pt', audienceSize:'22.1M' },
          'Mumbai':      { status:'opportunity', brandAwareness:{value:66,category:63}, favorability:{value:56,category:54}, consideration:{value:44,category:48}, purchaseIntent:{value:33,category:38}, topPlatform:'Instagram', competitorShare:'Tied', audienceSize:'24.6M' },
          'Lagos':       { status:'whitespace', brandAwareness:{value:38,category:58}, favorability:{value:30,category:52}, consideration:{value:22,category:42}, purchaseIntent:{value:15,category:32}, topPlatform:'TikTok', competitorShare:'No competitor presence', audienceSize:'15.8M' },
          'Berlin':      { status:'above', brandAwareness:{value:79,category:60}, favorability:{value:72,category:53}, consideration:{value:61,category:43}, purchaseIntent:{value:48,category:34}, topPlatform:'YouTube', competitorShare:'Leading by 6pt', audienceSize:'8.4M' },
          'Seoul':       { status:'opportunity', brandAwareness:{value:64,category:62}, favorability:{value:55,category:56}, consideration:{value:43,category:47}, purchaseIntent:{value:34,category:40}, topPlatform:'YouTube', competitorShare:'Trailing by 2pt', audienceSize:'14.7M' },
          'Sydney':      { status:'above', brandAwareness:{value:81,category:59}, favorability:{value:74,category:52}, consideration:{value:63,category:42}, purchaseIntent:{value:50,category:33}, topPlatform:'Instagram', competitorShare:'Leading by 11pt', audienceSize:'9.6M' },
          'Mexico City': { status:'opportunity', brandAwareness:{value:58,category:61}, favorability:{value:50,category:54}, consideration:{value:38,category:45}, purchaseIntent:{value:28,category:37}, topPlatform:'TikTok', competitorShare:'Trailing by 5pt', audienceSize:'12.6M' },
          'Shanghai':    { status:'opportunity', brandAwareness:{value:61,category:64}, favorability:{value:49,category:57}, consideration:{value:36,category:49}, purchaseIntent:{value:26,category:41}, topPlatform:'TikTok', competitorShare:'Trailing by 8pt', audienceSize:'20.2M' },
          'Paris':       { status:'above', brandAwareness:{value:77,category:58}, favorability:{value:70,category:51}, consideration:{value:58,category:41}, purchaseIntent:{value:46,category:32}, topPlatform:'TikTok', competitorShare:'Leading by 8pt', audienceSize:'12.8M' },
        },
        insight: '<strong>Nike has strong brand awareness in 6 of 12 key markets.</strong> New York (85% awareness vs 63% cat) and London (82% vs 61% cat) are your strongest \u2014 high favorability translates directly into purchase intent. The biggest growth opportunity is <strong>S\u00e3o Paulo</strong> (22.1M reachable) where awareness is on par with category but consideration lags \u2014 closing the 4pt competitor gap requires moving audiences down the funnel. Shanghai is a recovery play \u2014 awareness at 61% but favorability trails category as domestic rivals Li-Ning and Anta dominate sentiment. Lagos is true whitespace (38% awareness vs 58% cat) with high upside for first-mover advantage.' +
          '<div class="insight-metrics"><div class="insight-metric"><span class="insight-metric-val">6/12</span><span class="insight-metric-label">Markets above benchmark</span></div><div class="insight-metric"><span class="insight-metric-val">85%</span><span class="insight-metric-label">Peak awareness (New York)</span></div><div class="insight-metric"><span class="insight-metric-val">24.6M</span><span class="insight-metric-label">Biggest growth audience (Mumbai)</span></div></div>'
      },
      netflix: {
        highlights: ['Lagos','Nairobi','Mumbai','Delhi','Jakarta','Ho Chi Minh','Bangkok','Manila','S\u00e3o Paulo','Bogot\u00e1'],
        data: {
          'Lagos':       { status:'whitespace', brandAwareness:{value:35,category:57}, favorability:{value:28,category:50}, consideration:{value:20,category:40}, purchaseIntent:{value:13,category:30}, topPlatform:'TikTok', competitorShare:'Showmax leads locally', audienceSize:'15.8M' },
          'Nairobi':     { status:'whitespace', brandAwareness:{value:30,category:56}, favorability:{value:25,category:49}, consideration:{value:18,category:39}, purchaseIntent:{value:12,category:29}, topPlatform:'TikTok', competitorShare:'Minimal competition', audienceSize:'6.3M' },
          'Mumbai':      { status:'opportunity', brandAwareness:{value:63,category:62}, favorability:{value:52,category:55}, consideration:{value:40,category:46}, purchaseIntent:{value:30,category:38}, topPlatform:'Instagram', competitorShare:'Trailing by 8pt', audienceSize:'24.6M' },
          'Delhi':       { status:'opportunity', brandAwareness:{value:59,category:61}, favorability:{value:50,category:54}, consideration:{value:38,category:44}, purchaseIntent:{value:28,category:36}, topPlatform:'YouTube', competitorShare:'Trailing by 6pt', audienceSize:'19.8M' },
          'Jakarta':     { status:'opportunity', brandAwareness:{value:57,category:60}, favorability:{value:49,category:53}, consideration:{value:37,category:43}, purchaseIntent:{value:27,category:35}, topPlatform:'TikTok', competitorShare:'Trailing by 4pt', audienceSize:'16.4M' },
          'Ho Chi Minh': { status:'whitespace', brandAwareness:{value:33,category:58}, favorability:{value:27,category:51}, consideration:{value:19,category:41}, purchaseIntent:{value:14,category:31}, topPlatform:'TikTok', competitorShare:'Local platforms lead, no global rival', audienceSize:'8.7M' },
          'Bangkok':     { status:'opportunity', brandAwareness:{value:65,category:63}, favorability:{value:55,category:56}, consideration:{value:44,category:47}, purchaseIntent:{value:34,category:39}, topPlatform:'TikTok', competitorShare:'Trailing by 3pt', audienceSize:'10.5M' },
          'Manila':      { status:'opportunity', brandAwareness:{value:60,category:62}, favorability:{value:51,category:55}, consideration:{value:39,category:45}, purchaseIntent:{value:29,category:37}, topPlatform:'TikTok', competitorShare:'Trailing by 5pt', audienceSize:'11.3M' },
          'S\u00e3o Paulo':   { status:'above', brandAwareness:{value:78,category:60}, favorability:{value:72,category:53}, consideration:{value:62,category:44}, purchaseIntent:{value:49,category:35}, topPlatform:'Instagram', competitorShare:'Leading by 6pt', audienceSize:'22.1M' },
          'Bogot\u00e1':      { status:'opportunity', brandAwareness:{value:56,category:59}, favorability:{value:48,category:53}, consideration:{value:36,category:42}, purchaseIntent:{value:25,category:34}, topPlatform:'TikTok', competitorShare:'Trailing by 4pt', audienceSize:'8.2M' },
        },
        insight: '<strong>Netflix has massive untapped potential across emerging markets.</strong> Africa (Lagos, Nairobi) and Vietnam are early-stage whitespace \u2014 brand awareness sits 20+ points below category average and purchase intent is minimal. <strong>Mumbai</strong> (24.6M reachable) is the biggest prize: awareness matches category (63% vs 62%) but favorability and consideration lag, with an 8pt competitor gap to close. S\u00e3o Paulo is your only above-benchmark market (78% awareness) \u2014 use it as a playbook for Latin America expansion.' +
          '<div class="insight-metrics"><div class="insight-metric"><span class="insight-metric-val">3</span><span class="insight-metric-label">Whitespace markets</span></div><div class="insight-metric"><span class="insight-metric-val">24.6M</span><span class="insight-metric-label">Biggest opportunity</span></div><div class="insight-metric"><span class="insight-metric-val">144M</span><span class="insight-metric-label">Total reachable audience</span></div></div>'
      },
      spotify: {
        highlights: ['London','Los Angeles','Seoul','Stockholm','Berlin','Toronto','Sydney','Tokyo','Amsterdam','S\u00e3o Paulo','Lagos','Bangkok'],
        data: {
          'London':      { status:'above', brandAwareness:{value:80,category:59}, favorability:{value:74,category:52}, consideration:{value:63,category:43}, purchaseIntent:{value:50,category:34}, topPlatform:'Instagram', competitorShare:'Leading by 10pt', audienceSize:'21.3M' },
          'Los Angeles': { status:'above', brandAwareness:{value:83,category:62}, favorability:{value:76,category:55}, consideration:{value:66,category:46}, purchaseIntent:{value:53,category:37}, topPlatform:'TikTok', competitorShare:'Leading by 8pt', audienceSize:'14.2M' },
          'Seoul':       { status:'opportunity', brandAwareness:{value:60,category:63}, favorability:{value:52,category:57}, consideration:{value:40,category:48}, purchaseIntent:{value:30,category:40}, topPlatform:'YouTube', competitorShare:'Trailing by 8pt', audienceSize:'14.7M' },
          'Stockholm':   { status:'above', brandAwareness:{value:85,category:57}, favorability:{value:80,category:50}, consideration:{value:70,category:40}, purchaseIntent:{value:58,category:30}, topPlatform:'YouTube', competitorShare:'Leading by 18pt', audienceSize:'3.9M' },
          'Berlin':      { status:'above', brandAwareness:{value:76,category:58}, favorability:{value:69,category:51}, consideration:{value:58,category:42}, purchaseIntent:{value:46,category:33}, topPlatform:'YouTube', competitorShare:'Leading by 7pt', audienceSize:'8.4M' },
          'Toronto':     { status:'above', brandAwareness:{value:78,category:60}, favorability:{value:72,category:53}, consideration:{value:61,category:44}, purchaseIntent:{value:49,category:35}, topPlatform:'YouTube', competitorShare:'Leading by 6pt', audienceSize:'8.1M' },
          'Sydney':      { status:'opportunity', brandAwareness:{value:63,category:61}, favorability:{value:54,category:54}, consideration:{value:42,category:45}, purchaseIntent:{value:32,category:37}, topPlatform:'Instagram', competitorShare:'Tied', audienceSize:'9.6M' },
          'Tokyo':       { status:'opportunity', brandAwareness:{value:61,category:64}, favorability:{value:50,category:56}, consideration:{value:38,category:47}, purchaseIntent:{value:27,category:38}, topPlatform:'YouTube', competitorShare:'Trailing by 4pt', audienceSize:'18.9M' },
          'Amsterdam':   { status:'above', brandAwareness:{value:81,category:58}, favorability:{value:75,category:51}, consideration:{value:64,category:41}, purchaseIntent:{value:51,category:32}, topPlatform:'Instagram', competitorShare:'Leading by 11pt', audienceSize:'4.6M' },
          'S\u00e3o Paulo':   { status:'above', brandAwareness:{value:79,category:59}, favorability:{value:73,category:52}, consideration:{value:62,category:43}, purchaseIntent:{value:48,category:34}, topPlatform:'Instagram', competitorShare:'Leading by 9pt', audienceSize:'22.1M' },
          'Lagos':       { status:'whitespace', brandAwareness:{value:34,category:56}, favorability:{value:28,category:50}, consideration:{value:20,category:40}, purchaseIntent:{value:14,category:30}, topPlatform:'TikTok', competitorShare:'Trailing local platforms', audienceSize:'15.8M' },
          'Bangkok':     { status:'opportunity', brandAwareness:{value:58,category:62}, favorability:{value:50,category:55}, consideration:{value:38,category:46}, purchaseIntent:{value:28,category:38}, topPlatform:'TikTok', competitorShare:'Trailing by 6pt', audienceSize:'10.5M' },
        },
        insight: '<strong>Spotify dominates in music-culture capitals with 7 of 12 markets above benchmark.</strong> Stockholm (85% awareness, home-market advantage) and Los Angeles (83%) are your strongest \u2014 high favorability converts to industry-leading purchase intent. <strong>Tokyo</strong> (18.9M reachable) is the biggest growth play: awareness trails category (61% vs 64%) and consideration is weak \u2014 J-pop/anime crossover content could move the needle. <strong>Lagos</strong> (15.8M, Afrobeats epicenter) is untouched whitespace at just 34% awareness with minimal Western competitor presence.' +
          '<div class="insight-metrics"><div class="insight-metric"><span class="insight-metric-val">7/12</span><span class="insight-metric-label">Markets above benchmark</span></div><div class="insight-metric"><span class="insight-metric-val">85%</span><span class="insight-metric-label">Peak awareness (Stockholm)</span></div><div class="insight-metric"><span class="insight-metric-val">152M</span><span class="insight-metric-label">Total reachable audience</span></div></div>'
      },
      cocacola: {
        highlights: ['New York','London','Tokyo','Shanghai','Mumbai','S\u00e3o Paulo','Mexico City','Dubai','Sydney','Paris','Lagos','Istanbul'],
        data: {
          'New York':    { status:'above', brandAwareness:{value:84,category:62}, favorability:{value:77,category:55}, consideration:{value:67,category:47}, purchaseIntent:{value:54,category:37}, topPlatform:'CTV', competitorShare:'Leading by 11pt', audienceSize:'18.4M' },
          'London':      { status:'above', brandAwareness:{value:81,category:60}, favorability:{value:74,category:53}, consideration:{value:63,category:44}, purchaseIntent:{value:50,category:35}, topPlatform:'Instagram', competitorShare:'Leading by 9pt', audienceSize:'21.3M' },
          'Tokyo':       { status:'above', brandAwareness:{value:79,category:63}, favorability:{value:71,category:56}, consideration:{value:60,category:47}, purchaseIntent:{value:47,category:37}, topPlatform:'YouTube', competitorShare:'Leading by 7pt', audienceSize:'18.9M' },
          'Shanghai':    { status:'opportunity', brandAwareness:{value:64,category:65}, favorability:{value:53,category:58}, consideration:{value:41,category:49}, purchaseIntent:{value:30,category:40}, topPlatform:'CTV', competitorShare:'Trailing by 5pt', audienceSize:'20.2M' },
          'Mumbai':      { status:'opportunity', brandAwareness:{value:67,category:64}, favorability:{value:56,category:56}, consideration:{value:43,category:48}, purchaseIntent:{value:32,category:39}, topPlatform:'Instagram', competitorShare:'Trailing by 3pt', audienceSize:'24.6M' },
          'S\u00e3o Paulo':   { status:'above', brandAwareness:{value:82,category:61}, favorability:{value:76,category:54}, consideration:{value:65,category:45}, purchaseIntent:{value:53,category:36}, topPlatform:'Instagram', competitorShare:'Leading by 8pt', audienceSize:'22.1M' },
          'Mexico City': { status:'above', brandAwareness:{value:85,category:60}, favorability:{value:79,category:52}, consideration:{value:69,category:43}, purchaseIntent:{value:57,category:34}, topPlatform:'TikTok', competitorShare:'Leading by 13pt', audienceSize:'12.6M' },
          'Dubai':       { status:'opportunity', brandAwareness:{value:65,category:63}, favorability:{value:55,category:55}, consideration:{value:43,category:46}, purchaseIntent:{value:33,category:38}, topPlatform:'Instagram', competitorShare:'Trailing by 2pt', audienceSize:'6.7M' },
          'Sydney':      { status:'above', brandAwareness:{value:80,category:59}, favorability:{value:73,category:52}, consideration:{value:62,category:42}, purchaseIntent:{value:49,category:33}, topPlatform:'CTV', competitorShare:'Leading by 6pt', audienceSize:'9.6M' },
          'Paris':       { status:'opportunity', brandAwareness:{value:62,category:62}, favorability:{value:51,category:54}, consideration:{value:39,category:46}, purchaseIntent:{value:29,category:38}, topPlatform:'TikTok', competitorShare:'Trailing by 4pt', audienceSize:'12.8M' },
          'Lagos':       { status:'above', brandAwareness:{value:75,category:57}, favorability:{value:68,category:50}, consideration:{value:57,category:41}, purchaseIntent:{value:44,category:32}, topPlatform:'TikTok', competitorShare:'Leading by 6pt', audienceSize:'15.8M' },
          'Istanbul':    { status:'opportunity', brandAwareness:{value:66,category:63}, favorability:{value:57,category:55}, consideration:{value:45,category:47}, purchaseIntent:{value:35,category:39}, topPlatform:'TikTok', competitorShare:'Leading by 2pt', audienceSize:'11.2M' },
        },
        insight: '<strong>Coca-Cola has strong brand awareness across 7 above-benchmark markets.</strong> Mexico City (85% awareness, 79% favorability) is your strongest market globally with the highest purchase intent conversion. The biggest growth prize is <strong>Mumbai</strong> (24.6M) \u2014 awareness leads category (67% vs 64%) but favorability is flat and consideration trails, leaving a 3pt competitor gap to close. Paris and Shanghai are the key opportunity markets where brand perception lags local beverage competitors.' +
          '<div class="insight-metrics"><div class="insight-metric"><span class="insight-metric-val">7/12</span><span class="insight-metric-label">Markets above benchmark</span></div><div class="insight-metric"><span class="insight-metric-val">85%</span><span class="insight-metric-label">Peak awareness (Mexico City)</span></div><div class="insight-metric"><span class="insight-metric-val">194M</span><span class="insight-metric-label">Total reachable audience</span></div></div>'
      },
      bbc: {
        highlights: ['London','New York','Sydney','Toronto','Mumbai','Singapore','Berlin','Stockholm','Dubai','Tokyo'],
        data: {
          'London':    { status:'above', brandAwareness:{value:85,category:58}, favorability:{value:80,category:52}, consideration:{value:70,category:42}, purchaseIntent:{value:58,category:32}, topPlatform:'CTV', competitorShare:'Leading by 20pt', audienceSize:'21.3M' },
          'New York':  { status:'opportunity', brandAwareness:{value:62,category:64}, favorability:{value:53,category:57}, consideration:{value:41,category:48}, purchaseIntent:{value:30,category:39}, topPlatform:'YouTube', competitorShare:'Trailing by 6pt', audienceSize:'18.4M' },
          'Sydney':    { status:'above', brandAwareness:{value:78,category:59}, favorability:{value:72,category:53}, consideration:{value:61,category:43}, purchaseIntent:{value:48,category:34}, topPlatform:'CTV', competitorShare:'Leading by 9pt', audienceSize:'9.6M' },
          'Toronto':   { status:'above', brandAwareness:{value:76,category:58}, favorability:{value:70,category:52}, consideration:{value:59,category:42}, purchaseIntent:{value:46,category:33}, topPlatform:'YouTube', competitorShare:'Leading by 7pt', audienceSize:'8.1M' },
          'Mumbai':    { status:'opportunity', brandAwareness:{value:58,category:62}, favorability:{value:49,category:55}, consideration:{value:37,category:45}, purchaseIntent:{value:26,category:37}, topPlatform:'YouTube', competitorShare:'Trailing by 5pt', audienceSize:'24.6M' },
          'Singapore': { status:'opportunity', brandAwareness:{value:63,category:61}, favorability:{value:54,category:54}, consideration:{value:42,category:44}, purchaseIntent:{value:31,category:36}, topPlatform:'YouTube', competitorShare:'Trailing by 3pt', audienceSize:'5.9M' },
          'Berlin':    { status:'opportunity', brandAwareness:{value:57,category:60}, favorability:{value:48,category:54}, consideration:{value:36,category:44}, purchaseIntent:{value:26,category:36}, topPlatform:'YouTube', competitorShare:'Trailing by 4pt', audienceSize:'8.4M' },
          'Stockholm': { status:'opportunity', brandAwareness:{value:60,category:59}, favorability:{value:52,category:53}, consideration:{value:40,category:43}, purchaseIntent:{value:30,category:35}, topPlatform:'YouTube', competitorShare:'Trailing by 4pt', audienceSize:'3.9M' },
          'Dubai':     { status:'opportunity', brandAwareness:{value:55,category:61}, favorability:{value:48,category:55}, consideration:{value:35,category:44}, purchaseIntent:{value:25,category:37}, topPlatform:'YouTube', competitorShare:'Trailing by 7pt', audienceSize:'6.7M' },
          'Tokyo':     { status:'opportunity', brandAwareness:{value:55,category:63}, favorability:{value:42,category:56}, consideration:{value:30,category:46}, purchaseIntent:{value:20,category:38}, topPlatform:'YouTube', competitorShare:'Trailing by 7pt', audienceSize:'18.9M' },
        },
        insight: '<strong>BBC dominates in English-speaking markets but has room to grow globally.</strong> London is untouchable (85% awareness, 80% favorability \u2014 20pt competitor lead). Sydney and Toronto are strong Commonwealth secondary markets with awareness well above category. <strong>Mumbai</strong> (24.6M) is the biggest opportunity \u2014 awareness lags at 58% vs 62% category, but BBC Hindi could close the 5pt gap. Tokyo (18.9M) shows the language barrier challenge: awareness is 55% vs 63% cat with favorability dropping sharply. Dubai is underperforming despite BBC Arabic\u2019s long regional presence \u2014 digital migration from satellite could unlock growth.' +
          '<div class="insight-metrics"><div class="insight-metric"><span class="insight-metric-val">3/10</span><span class="insight-metric-label">Markets above benchmark</span></div><div class="insight-metric"><span class="insight-metric-val">85%</span><span class="insight-metric-label">Peak awareness (London)</span></div><div class="insight-metric"><span class="insight-metric-val">24.6M</span><span class="insight-metric-label">Biggest growth audience</span></div></div>'
      }
    };

    var DOTS = [];
    REGIONS.forEach(function(reg) {
      for (var i = 0; i < reg.n; i++) {
        var emo = EMOTIONS[Math.floor(rng() * EMOTIONS.length)];
        var attention = Math.round(25 + rng() * 75);
        DOTS.push({
          lng: reg.lng + (rng() - 0.5) * reg.s * 2,
          lat: reg.lat + (rng() - 0.5) * reg.s * 2,
          region: reg.name,
          emotion: emo.name,
          color: emo.color,
          attention: attention,
          r: 2 + (attention / 100) * 8,
          resonance: Math.round(30 + rng() * 65),
          uplift: Math.round(5 + rng() * 35),
          platform: PLATFORMS[Math.floor(rng() * PLATFORMS.length)],
          phase: rng() * Math.PI * 2,
          freqX: 0.2 + rng() * 0.3,
          freqY: 0.2 + rng() * 0.3,
          ampX: 0.8 + rng() * 1.5,
          ampY: 0.8 + rng() * 1.5,
          entranceDelay: rng() * 2000,
        });
      }
    });

    function hexRgba(hex, a) {
      var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return 'rgba('+r+','+g+','+b+','+a+')';
    }

    function audProject(lng, lat) {
      var mapAspect = 2;
      var canvasAspect = audW / audH;
      var mapW, mapH, offX, offY;
      if (canvasAspect > mapAspect) {
        mapH = audH * 0.82;
        mapW = mapH * mapAspect;
        offX = (audW - mapW) / 2;
        offY = audH * 0.09;
      } else {
        mapW = audW * 0.96;
        mapH = mapW / mapAspect;
        offX = audW * 0.02;
        offY = (audH - mapH) / 2;
      }
      return [offX + ((lng + 180) / 360) * mapW, offY + ((90 - lat) / 180) * mapH];
    }

    function audResize() {
      var rect = audCanvas.parentElement.getBoundingClientRect();
      audW = rect.width * 2;
      audH = rect.height * 2;
      audCanvas.width = audW;
      audCanvas.height = audH;
    }

    // --- Easing ---
    function easeInOutCubic(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    // --- Check if a region is highlighted in active preset ---
    function isHighlightedRegion(regionName) {
      if (!audQueryActive || !audActivePreset) return false;
      return audActivePreset.highlights.indexOf(regionName) !== -1;
    }

    function getQueryData(regionName) {
      if (!audActivePreset) return null;
      return audActivePreset.data[regionName] || null;
    }

    // --- Color interpolation helper ---
    function lerpColor(a, b, t) {
      var ar = parseInt(a.slice(1,3),16), ag = parseInt(a.slice(3,5),16), ab = parseInt(a.slice(5,7),16);
      var br = parseInt(b.slice(1,3),16), bg = parseInt(b.slice(3,5),16), bb = parseInt(b.slice(5,7),16);
      var rr = Math.round(ar + (br - ar) * t);
      var rg = Math.round(ag + (bg - ag) * t);
      var rb = Math.round(ab + (bb - ab) * t);
      return '#' + ((1<<24)|(rr<<16)|(rg<<8)|rb).toString(16).slice(1);
    }

    // --- Store computed screen positions for hit-testing ---
    var dotScreenPos = [];

    function audDraw() {
      requestAnimationFrame(audDraw);
      if (!audActive) return;

      var now = performance.now();
      var elapsed = audRevealed ? (now - audRevealTime) : 0;
      var t = now * 0.001;

      // Update transition progress
      if (audTransitioning) {
        var rawTP = (now - audTransitionStart) / TRANSITION_DURATION;
        if (rawTP >= 1) {
          rawTP = 1;
          audTransitioning = false;
        }
        audTransitionProgress = audQueryActive ? easeInOutCubic(rawTP) : easeInOutCubic(1 - rawTP);
        if (!audQueryActive && rawTP >= 1) audTransitionProgress = 0;
      }
      var tp = audTransitionProgress;

      audCtx.clearRect(0, 0, audW, audH);

      // Continent outlines
      audCtx.fillStyle = 'rgba(255,255,255,0.025)';
      audCtx.strokeStyle = 'rgba(255,255,255,0.05)';
      audCtx.lineWidth = 1;
      audCtx.lineJoin = 'round';
      LAND.forEach(function(outline) {
        audCtx.beginPath();
        outline.forEach(function(pt, i) {
          var p = audProject(pt[0], pt[1]);
          if (i === 0) audCtx.moveTo(p[0], p[1]); else audCtx.lineTo(p[0], p[1]);
        });
        audCtx.closePath();
        audCtx.fill();
        audCtx.stroke();
      });

      // Compute visible dots
      var visible = [];
      DOTS.forEach(function(d, idx) {
        if (elapsed < d.entranceDelay) return;
        var base = audProject(d.lng, d.lat);
        var x = base[0] + Math.sin(t * d.freqX + d.phase) * d.ampX * 2;
        var y = base[1] + Math.cos(t * d.freqY + d.phase) * d.ampY * 2;
        var fadeIn = Math.min(1, (elapsed - d.entranceDelay) / 800);
        var highlighted = isHighlightedRegion(d.region);
        var qData = highlighted ? getQueryData(d.region) : null;
        visible.push({ x:x, y:y, fadeIn:fadeIn, idx:idx, d:d, highlighted:highlighted, qData:qData });
      });

      // Update screen positions for hover (in CSS pixels, not canvas pixels)
      dotScreenPos = visible.map(function(v) {
        return { x: v.x / 2, y: v.y / 2, idx: v.idx, highlighted: v.highlighted };
      });

      // Connections between nearby dots
      var connThresh = audW * 0.055;
      if (tp > 0) {
        connThresh = audW * (0.055 + tp * 0.02);
      }
      audCtx.lineWidth = 1;
      for (var i = 0; i < visible.length; i++) {
        for (var j = i + 1; j < visible.length; j++) {
          var dx = visible[i].x - visible[j].x;
          var dy = visible[i].y - visible[j].y;
          var dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < connThresh) {
            var bothHighlighted = visible[i].highlighted && visible[j].highlighted;
            var baseAlpha = (1 - dist/connThresh) * 0.08 * Math.min(visible[i].fadeIn, visible[j].fadeIn);
            if (tp > 0) {
              if (bothHighlighted) {
                baseAlpha = baseAlpha * (1 + tp * 1.5);
              } else {
                baseAlpha = baseAlpha * (1 - tp * 0.85);
              }
            }
            if (baseAlpha > 0.002) {
              audCtx.strokeStyle = 'rgba(255,255,255,' + baseAlpha + ')';
              audCtx.beginPath();
              audCtx.moveTo(visible[i].x, visible[i].y);
              audCtx.lineTo(visible[j].x, visible[j].y);
              audCtx.stroke();
            }
          }
        }
      }

      // Draw dots
      var hoverIdx = audHoverDot ? audHoverDot.idx : -1;
      visible.forEach(function(v) {
        var d = v.d;
        var isHover = (v.idx === hoverIdx);
        var pulseR = d.r * (1 + Math.sin(t * 1.5 + d.phase) * 0.2);
        var scale = 2;

        // Determine color and opacity based on query state
        var dotColor = d.color;
        var dotOpacity = (isHover ? 1 : 0.85) * v.fadeIn;
        var drawGlow = true;

        if (tp > 0) {
          if (v.highlighted && v.qData) {
            var statusColor = STATUS_COLORS[v.qData.status] || d.color;
            dotColor = lerpColor(d.color, statusColor, tp);
            dotOpacity = (isHover ? 1 : 0.9) * v.fadeIn;
            pulseR = pulseR * (1 + tp * 0.3);
          } else {
            dotOpacity = (isHover ? 0.3 : Math.max(0.05, 0.85 * (1 - tp * 0.94))) * v.fadeIn;
            pulseR = pulseR * (1 - tp * 0.4);
            drawGlow = (tp < 0.5);
          }
        }

        // Outer glow
        if (drawGlow) {
          var glowMul = isHover ? 7 : 4;
          var glowR = pulseR * glowMul * scale;
          var glow = audCtx.createRadialGradient(v.x, v.y, 0, v.x, v.y, glowR);
          var glowAlpha = isHover ? 0.4 : 0.2;
          glow.addColorStop(0, hexRgba(dotColor, glowAlpha * dotOpacity));
          glow.addColorStop(0.4, hexRgba(dotColor, 0.05 * dotOpacity));
          glow.addColorStop(1, hexRgba(dotColor, 0));
          audCtx.fillStyle = glow;
          audCtx.beginPath();
          audCtx.arc(v.x, v.y, glowR, 0, Math.PI * 2);
          audCtx.fill();
        }

        // Core dot
        var coreR = pulseR * scale * (isHover ? 1.3 : 1);
        audCtx.fillStyle = hexRgba(dotColor, dotOpacity);
        audCtx.beginPath();
        audCtx.arc(v.x, v.y, coreR, 0, Math.PI * 2);
        audCtx.fill();

        // Bright center highlight
        if (dotOpacity > 0.2) {
          audCtx.fillStyle = hexRgba('#ffffff', (isHover ? 0.7 : 0.4) * dotOpacity);
          audCtx.beginPath();
          audCtx.arc(v.x, v.y, coreR * 0.3, 0, Math.PI * 2);
          audCtx.fill();
        }

        // Hover ring
        if (isHover && dotOpacity > 0.2) {
          audCtx.strokeStyle = hexRgba(dotColor, 0.6 * v.fadeIn);
          audCtx.lineWidth = 2;
          audCtx.beginPath();
          audCtx.arc(v.x, v.y, coreR + 6, 0, Math.PI * 2);
          audCtx.stroke();
        }
      });
    }

    // --- Hover: find nearest dot + show tooltip ---
    var tipEl = document.getElementById('aud-tooltip');
    var mapWrap = audCanvas.parentElement;

    audCanvas.addEventListener('mousemove', function(e) {
      var rect = audCanvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;

      // Find nearest dot (CSS pixel space)
      var best = null, bestDist = Infinity;
      dotScreenPos.forEach(function(sp) {
        if (audQueryActive && !sp.highlighted) return;
        var dx = sp.x - mx, dy = sp.y - my;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < bestDist) { bestDist = dist; best = sp; }
      });

      var hoverThreshold = audQueryActive ? 80 : 120;
      if (best && bestDist < hoverThreshold) {
        var d = DOTS[best.idx];
        audHoverDot = { idx: best.idx };

        if (audQueryActive && audActivePreset) {
          var qData = audActivePreset.data[d.region];
          if (qData) {
            var statusClass = 'aud-tip-status-' + qData.status;
            var statusLabel = qData.status === 'above' ? 'Above Benchmark' : qData.status === 'opportunity' ? 'Growth Opportunity' : 'Whitespace';
            var liftColor = function(m) { return m.value >= m.category ? '#54E42B' : '#F9BE00'; };
            tipEl.innerHTML =
              '<div class="aud-tip-region">' + d.region + ' <span class="aud-tip-status ' + statusClass + '">' + statusLabel + '</span></div>' +
              '<div class="aud-tip-row"><span>Audience Size</span><span class="aud-tip-val">' + qData.audienceSize + '</span></div>' +
              '<div class="aud-tip-row"><span>Brand Awareness</span><span class="aud-tip-val" style="color:' + liftColor(qData.brandAwareness) + '">' + qData.brandAwareness.value + '% vs ' + qData.brandAwareness.category + '% cat</span></div>' +
              '<div class="aud-tip-row"><span>Favorability</span><span class="aud-tip-val" style="color:' + liftColor(qData.favorability) + '">' + qData.favorability.value + '% vs ' + qData.favorability.category + '% cat</span></div>' +
              '<div class="aud-tip-row"><span>Consideration</span><span class="aud-tip-val" style="color:' + liftColor(qData.consideration) + '">' + qData.consideration.value + '% vs ' + qData.consideration.category + '% cat</span></div>' +
              '<div class="aud-tip-row"><span>Purchase Intent</span><span class="aud-tip-val" style="color:' + liftColor(qData.purchaseIntent) + '">' + qData.purchaseIntent.value + '% vs ' + qData.purchaseIntent.category + '% cat</span></div>' +
              '<div class="aud-tip-row"><span>Top Platform</span><span class="aud-tip-val">' + qData.topPlatform + '</span></div>' +
              '<div class="aud-tip-row"><span>Competitor Share</span><span class="aud-tip-val">' + qData.competitorShare + '</span></div>';
          }
        } else {
          var rd = REGION_DEFAULTS[d.region] || {};
          tipEl.innerHTML =
            '<div class="aud-tip-region">' + d.region + '</div>' +
            '<div class="aud-tip-row"><span>Reachable Audience</span><span class="aud-tip-val">' + (rd.audienceSize || '\u2014') + '</span></div>' +
            '<div class="aud-tip-row"><span>Top Platform</span><span class="aud-tip-val">' + (rd.topPlatform || d.platform) + '</span></div>' +
            '<div class="aud-tip-row"><span>Receptivity</span><span class="aud-tip-val">' + (rd.receptivity || 'Medium') + '</span></div>' +
            '<div class="aud-tip-row"><span>Emotion</span><span class="aud-tip-val" style="color:' + d.color + '">' + d.emotion + '</span></div>';
        }

        var tipW = 260, tipH = 240;
        var tx = e.clientX - rect.left + 20;
        var ty = e.clientY - rect.top - tipH / 2;
        if (tx + tipW > rect.width - 10) tx = e.clientX - rect.left - tipW - 20;
        if (ty < 10) ty = 10;
        if (ty + tipH > rect.height - 10) ty = rect.height - tipH - 10;
        tipEl.style.left = tx + 'px';
        tipEl.style.top = ty + 'px';
        tipEl.style.opacity = '1';
      } else {
        audHoverDot = null;
        tipEl.style.opacity = '0';
      }
    });

    audCanvas.addEventListener('mouseleave', function() {
      audHoverDot = null;
      tipEl.style.opacity = '0';
    });

    // --- Legend swap helper ---
    function swapLegend(toQuery) {
      var defaults = document.querySelectorAll('.aud-leg-default');
      var queries = document.querySelectorAll('.aud-leg-query');
      defaults.forEach(function(el) { el.style.display = toQuery ? 'none' : ''; });
      queries.forEach(function(el) { el.style.display = toQuery ? '' : 'none'; });
    }

    // --- Activate query ---
    function activateQuery(presetKey) {
      audActivePreset = PRESETS[presetKey];
      if (!audActivePreset) return;
      audQueryActive = true;
      audTransitioning = true;
      audTransitionStart = performance.now();
      swapLegend(true);

      var insightCard = document.getElementById('aud-insight-card');
      var insightBody = document.getElementById('aud-insight-body');
      if (insightCard && insightBody) {
        setTimeout(function() {
          insightBody.innerHTML = audActivePreset.insight;
          insightCard.style.display = 'block';
          insightCard.offsetHeight;
          insightCard.classList.add('visible');
        }, 800);
      }
    }

    // --- Reset query ---
    function resetAudienceQuery() {
      if (!audQueryActive) return;
      audQueryActive = false;
      audTransitioning = true;
      audTransitionStart = performance.now();
      swapLegend(false);

      var insightCard = document.getElementById('aud-insight-card');
      if (insightCard) {
        insightCard.classList.remove('visible');
        setTimeout(function() {
          insightCard.style.display = 'none';
        }, 500);
      }
    }

    // --- Ask Ellie button handler ---
    var askBtn = document.getElementById('aud-ask-btn');
    var brandSel = document.getElementById('aud-brand');
    var goalSel = document.getElementById('aud-goal');

    if (askBtn && brandSel && goalSel) {
      askBtn.addEventListener('click', function() {
        var brand = brandSel.value;
        var goal = goalSel.value;

        var valid = true;
        if (!brand) {
          brandSel.classList.add('pulse-invalid');
          setTimeout(function() { brandSel.classList.remove('pulse-invalid'); }, 600);
          valid = false;
        }
        if (!goal) {
          goalSel.classList.add('pulse-invalid');
          setTimeout(function() { goalSel.classList.remove('pulse-invalid'); }, 600);
          valid = false;
        }
        if (!valid) return;

        askBtn.classList.add('analyzing');
        askBtn.innerHTML = '<span class="ellie-icon">&#10022;</span> Analyzing\u2026';

        setTimeout(function() {
          askBtn.classList.remove('analyzing');
          askBtn.innerHTML = '<span class="ellie-icon">&#10022;</span> Ask Ellie';
          activateQuery(brand);
        }, 1500);
      });

      brandSel.addEventListener('change', function() { resetAudienceQuery(); });
      goalSel.addEventListener('change', function() { resetAudienceQuery(); });
    }

    // --- Intersection observer ---
    var audSection = document.getElementById('audience');
    var audObs = new IntersectionObserver(function(entries) {
      audActive = entries[0].isIntersecting;
      if (entries[0].isIntersecting && !audRevealed) {
        audRevealed = true;
        audRevealTime = performance.now();
      }
    }, { threshold: 0.1 });
    audObs.observe(audSection);

    // --- Init + resize ---
    audResize();
    window.addEventListener('resize', function() { audResize(); });
    audDraw();
  }


  /* ============================================
     SECTION B — Aha Moment (4 phases, no Creative)
     Adapted from aha-moment.js
     ============================================ */

  const scroller  = document.getElementById('hp-scroller');
  const heatEl    = document.getElementById('hp-heat');
  const heatDim   = document.getElementById('hp-heat-dim');
  const emotionEl = document.getElementById('hp-layer-emotion');
  const memoryEl  = document.getElementById('hp-layer-memory');
  const upliftEl  = document.getElementById('hp-layer-uplift');
  const legendEl  = document.getElementById('hp-legend');
  const barFill   = document.getElementById('hp-c-bar-fill');
  const timeEl    = document.getElementById('hp-c-time');
  const durEl     = document.getElementById('hp-c-dur');
  const bgVideo   = document.getElementById('hp-bg-video');

  const stories   = document.querySelectorAll('.hp-product .story-card');
  const dots      = document.querySelectorAll('.hp-product .dot');
  const creativeWrap = document.getElementById('hp-creative-wrap');
  const phaseSweep   = document.getElementById('hp-phase-sweep');
  const ahaOrb1      = document.querySelector('.aha-orb-1');
  const ahaOrb2      = document.querySelector('.aha-orb-2');

  if (!scroller) return;

  /* ---- Phase color config for orbs ---- */
  const phaseOrbColors = [
    /* Phase 0: Attention — blue */ {
      orb1: 'radial-gradient(circle, rgba(0,122,255,0.5), rgba(0,160,255,0.2) 60%, transparent 80%)',
      orb2: 'radial-gradient(circle, rgba(0,160,255,0.3), rgba(0,122,255,0.1) 60%, transparent 80%)'
    },
    /* Phase 1: Emotion — pink */ {
      orb1: 'radial-gradient(circle, rgba(255,33,152,0.5), rgba(143,33,161,0.2) 60%, transparent 80%)',
      orb2: 'radial-gradient(circle, rgba(143,33,161,0.3), rgba(255,33,152,0.1) 60%, transparent 80%)'
    },
    /* Phase 2: Memory — teal */ {
      orb1: 'radial-gradient(circle, rgba(16,168,183,0.5), rgba(0,122,255,0.2) 60%, transparent 80%)',
      orb2: 'radial-gradient(circle, rgba(0,122,255,0.3), rgba(16,168,183,0.1) 60%, transparent 80%)'
    },
    /* Phase 3: Uplift — green */ {
      orb1: 'radial-gradient(circle, rgba(84,228,43,0.5), rgba(16,168,183,0.2) 60%, transparent 80%)',
      orb2: 'radial-gradient(circle, rgba(16,168,183,0.3), rgba(84,228,43,0.1) 60%, transparent 80%)'
    }
  ];

  /* ---- Sweep trigger helper ---- */
  function triggerSweep(phase) {
    if (!phaseSweep) return;
    phaseSweep.classList.remove('sweeping');
    phaseSweep.dataset.sweep = phase;
    // Force reflow to restart animation
    void phaseSweep.offsetWidth;
    phaseSweep.classList.add('sweeping');
    // Remove class after animation completes
    setTimeout(() => {
      phaseSweep.classList.remove('sweeping');
    }, 750);
  }

  /* ---- Video setup ---- */
  let videoDuration = 0;

  function updateDuration() {
    if (!bgVideo || !bgVideo.duration || isNaN(bgVideo.duration)) return;
    videoDuration = bgVideo.duration;
    if (durEl) {
      const m = Math.floor(videoDuration / 60);
      const s = Math.floor(videoDuration % 60);
      durEl.textContent = m + ':' + String(s).padStart(2, '0');
    }
  }

  if (bgVideo) {
    bgVideo.pause();
    if (bgVideo.readyState >= 1) updateDuration();
    bgVideo.addEventListener('loadedmetadata', updateDuration);
  }

  /* ---- 4 Phases (original minus Creative) ---- */
  const P = [
    { n: 'Attention', a: 0,    b: 0.25 },
    { n: 'Emotion',   a: 0.25, b: 0.50 },
    { n: 'Memory',    a: 0.50, b: 0.75 },
    { n: 'Uplift',    a: 0.75, b: 1.0  },
  ];
  let cur = -1;

  /* ---- Heatmap canvas ---- */
  let ctx = null;

  function initCanvas() {
    if (!heatEl) return;
    const r = heatEl.getBoundingClientRect();
    heatEl.width  = r.width * 2;
    heatEl.height = r.height * 2;
    ctx = heatEl.getContext('2d');
  }

  const spots = [
    { x: .50, y: .40, r: .20, i: 1.0,  dx: .06, dy: .05, freq: 0.8 },
    { x: .40, y: .35, r: .16, i: .85,  dx: .08, dy: .04, freq: 1.2 },
    { x: .60, y: .50, r: .14, i: .75,  dx: .05, dy: .07, freq: 1.0 },
    { x: .30, y: .55, r: .12, i: .55,  dx: .10, dy: .06, freq: 1.5 },
    { x: .75, y: .70, r: .10, i: .50,  dx: .04, dy: .05, freq: 0.9 },
    { x: .15, y: .12, r: .08, i: .20,  dx: .03, dy: .03, freq: 1.8 },
    { x: .55, y: .65, r: .10, i: .40,  dx: .07, dy: .08, freq: 1.3 },
    { x: .35, y: .25, r: .09, i: .30,  dx: .06, dy: .04, freq: 1.6 },
  ];

  let scrollT = 0;

  function drawHeat(t) {
    if (!ctx) return;
    const w = heatEl.width, h = heatEl.height;
    ctx.clearRect(0, 0, w, h);
    if (t <= 0) return;
    spots.forEach(s => {
      const driftX = s.x + Math.sin(scrollT * Math.PI * 2 * s.freq) * s.dx;
      const driftY = s.y + Math.cos(scrollT * Math.PI * 2 * s.freq * 0.7) * s.dy;
      const cx = Math.max(0.05, Math.min(0.95, driftX)) * w;
      const cy = Math.max(0.05, Math.min(0.95, driftY)) * h;
      const rad = s.r * Math.max(w, h);
      const a = s.i * t;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0,   'rgba(255,50,20,'  + (a * .75) + ')');
      g.addColorStop(.25, 'rgba(255,140,0,'  + (a * .55) + ')');
      g.addColorStop(.55, 'rgba(255,220,0,'  + (a * .25) + ')');
      g.addColorStop(.8,  'rgba(0,180,90,'   + (a * .1)  + ')');
      g.addColorStop(1,   'rgba(0,80,200,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });
  }

  /* ---- Emotion curves ---- */
  const paths = ['hp-c-att', 'hp-c-val', 'hp-c-hap', 'hp-c-sur', 'hp-c-ang'].map(id => document.getElementById(id));
  const lens  = [];

  function initCurves() {
    paths.forEach((p, i) => {
      if (!p) return;
      const l = p.getTotalLength();
      lens[i] = l;
      p.style.strokeDasharray  = l;
      p.style.strokeDashoffset = l;
    });
  }

  function drawCurves(t) {
    paths.forEach((p, i) => {
      if (!p || !lens[i]) return;
      const stag = i * .06;
      const adj  = Math.max(0, Math.min(1, (t - stag) / (1 - stag)));
      p.style.strokeDashoffset = lens[i] * (1 - adj);
    });

    const ph = document.getElementById('hp-playhead');
    if (ph) { const x = 10 + t * 980; ph.setAttribute('x1', x); ph.setAttribute('x2', x); }

    const pd = document.getElementById('hp-peak-dot');
    const pl = document.getElementById('hp-peak-label');
    const showPk = t > .35;
    pd?.classList.toggle('visible', showPk);
    pl?.classList.toggle('visible', showPk);
  }

  /* ---- Memory bars ---- */
  const MEM = [
    { f: 'hp-mf-logo',    v: 'hp-mv-logo',    t: 78 },
    { f: 'hp-mf-aided',   v: 'hp-mv-aided',   t: 64 },
    { f: 'hp-mf-unaided', v: 'hp-mv-unaided', t: 31 },
    { f: 'hp-mf-message', v: 'hp-mv-message',  t: 52 },
  ];
  let memDone = false;

  function animMem() {
    if (memDone) return;
    memDone = true;
    MEM.forEach((m, i) => {
      const fe = document.getElementById(m.f);
      const ve = document.getElementById(m.v);
      if (!fe || !ve) return;
      setTimeout(() => {
        fe.style.width = m.t + '%';
        let c = 0;
        const s = m.t / 40;
        const iv = setInterval(() => {
          c += s;
          if (c >= m.t) { c = m.t; clearInterval(iv); }
          ve.textContent = Math.round(c) + '%';
        }, 25);
      }, i * 120);
    });
  }

  function resetMem() {
    memDone = false;
    MEM.forEach(m => {
      const fe = document.getElementById(m.f);
      const ve = document.getElementById(m.v);
      if (fe) fe.style.width = '0%';
      if (ve) ve.textContent = '0%';
    });
  }

  /* ---- Uplift counters ---- */
  let uplDone = false;

  function animUpl() {
    if (uplDone) return;
    uplDone = true;
    document.querySelectorAll('#hp-layer-uplift .u-val[data-t]').forEach((el, i) => {
      const t = +el.dataset.t;
      setTimeout(() => {
        let c = 0;
        const s = t / 35;
        const iv = setInterval(() => {
          c += s;
          if (c >= t) { c = t; clearInterval(iv); }
          el.textContent = '+' + Math.round(c);
        }, 30);
      }, i * 100);
    });
  }

  function resetUpl() {
    uplDone = false;
    document.querySelectorAll('#hp-layer-uplift .u-val[data-t]').forEach(el => {
      el.textContent = '+0';
    });
  }

  /* ---- Video scrub + progress bar ---- */
  function vidBar(p) {
    const pct = Math.min(p * 1.2, 1);
    if (barFill) barFill.style.width = (pct * 100) + '%';

    if (bgVideo && videoDuration > 0) {
      const targetTime = pct * videoDuration;
      if (Math.abs(bgVideo.currentTime - targetTime) > 0.05) {
        bgVideo.currentTime = targetTime;
      }
    }

    const totalSec = videoDuration > 0 ? videoDuration : 30;
    const currentSec = Math.round(pct * totalSec);
    if (timeEl) {
      timeEl.textContent = Math.floor(currentSec / 60) + ':' + String(currentSec % 60).padStart(2, '0');
    }
  }

  /* ---- UI helpers ---- */
  function setStory(i) { stories.forEach((s, j) => s.classList.toggle('active', j === i)); }
  function setDots(i)  { dots.forEach((d, j) => { d.classList.remove('active', 'done'); if (j === i) d.classList.add('active'); else if (j < i) d.classList.add('done'); }); }

  function show(el) { el?.classList.add('visible'); }
  function hide(el) { el?.classList.remove('visible'); }

  /* ---- Layer visibility per phase ----
     Phase 0: Attention — heatmap fades in over video
     Phase 1: Emotion — heatmap fades, emotion curves draw
     Phase 2: Memory — emotion frozen, memory card appears
     Phase 3: Brand Uplift — uplift card centered
  */
  function layers(phase, pp) {
    hide(heatEl); hide(heatDim); hide(emotionEl); hide(memoryEl); hide(upliftEl); hide(legendEl);

    switch (phase) {
      case 0:
        // Attention — heatmap
        show(heatDim);
        show(heatEl);
        drawHeat(pp);
        break;
      case 1:
        // Emotion — heatmap fades out, curves draw in
        show(heatDim);
        show(heatEl);
        drawHeat(Math.max(.25, 1 - pp * .75));
        show(emotionEl);
        show(legendEl);
        drawCurves(pp);
        break;
      case 2:
        // Memory — emotion stays, memory card animates
        show(emotionEl);
        show(legendEl);
        drawCurves(1);
        show(memoryEl);
        animMem();
        break;
      case 3:
        // Brand Uplift
        show(upliftEl);
        animUpl();
        break;
    }
  }

  /* ---- Main scroll tick ---- */
  function tick() {
    const rect = scroller.getBoundingClientRect();
    const scrollable = scroller.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));

    let phase = 0, pp = 0;
    for (let i = P.length - 1; i >= 0; i--) {
      if (progress >= P[i].a) {
        phase = i;
        pp = Math.min(1, (progress - P[i].a) / (P[i].b - P[i].a));
        break;
      }
    }

    vidBar(progress);
    scrollT = progress;

    if (phase !== cur) {
      cur = phase;
      setStory(phase);
      setDots(phase);
      if (phase < 2) resetMem();
      if (phase < 3) resetUpl();

      // IMPROVEMENT 1: Set data-phase for CSS gradient border
      if (creativeWrap) creativeWrap.dataset.phase = phase;
      if (emotionEl) emotionEl.dataset.phase = phase;

      // IMPROVEMENT 4: Shift orb colors per phase
      if (ahaOrb1 && phaseOrbColors[phase]) {
        ahaOrb1.style.background = phaseOrbColors[phase].orb1;
        ahaOrb1.style.transition = 'background 1.2s ease';
      }
      if (ahaOrb2 && phaseOrbColors[phase]) {
        ahaOrb2.style.background = phaseOrbColors[phase].orb2;
        ahaOrb2.style.transition = 'background 1.2s ease';
      }

      // IMPROVEMENT 5: Trigger phase sweep animation
      triggerSweep(phase);
    }

    layers(phase, pp);
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { tick(); ticking = false; });
    }
  }

  /* ---- Init aha ---- */
  let ahaInitDone = false;

  function initAha() {
    initCanvas();
    initCurves();
    setStory(0);
    setDots(0);
    // Set initial data-phase for gradient border
    if (creativeWrap) creativeWrap.dataset.phase = 0;
    tick();

    if (!ahaInitDone) {
      ahaInitDone = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => { initCanvas(); tick(); });
    }
  }

  // Init aha-moment (always visible)
  requestAnimationFrame(initAha);


});
