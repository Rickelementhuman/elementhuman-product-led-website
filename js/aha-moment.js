/* ============================================
   Element Human — Aha Moment  V3
   No JS positioning — CSS handles layout.
   JS only: scroll progress, canvas draw,
   SVG stroke animation, number counters.
   ============================================ */

(function () {
  'use strict';

  const scroller  = document.getElementById('scroller');
  const heatEl    = document.getElementById('heat');
  const heatDim   = document.getElementById('heat-dim');
  const emotionEl = document.getElementById('layer-emotion');
  const memoryEl  = document.getElementById('layer-memory');
  const upliftEl  = document.getElementById('layer-uplift');
  const legendEl  = document.getElementById('legend');
  const pillEl    = document.getElementById('phase-pill');
  const barFill   = document.getElementById('c-bar-fill');
  const timeEl    = document.getElementById('c-time');
  const durEl     = document.getElementById('c-dur');
  const bgVideo   = document.getElementById('bg-video');

  const stories   = document.querySelectorAll('.story-card');
  const dots      = document.querySelectorAll('.dot');

  if (!scroller) return;

  /* ---- video setup ---- */
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
    // Handle both: metadata already loaded (cached) or loading
    if (bgVideo.readyState >= 1) {
      updateDuration();
    }
    bgVideo.addEventListener('loadedmetadata', updateDuration);
  }

  /* ---- phases ---- */
  const P = [
    { n:'Creative',  a:0,    b:0.18 },
    { n:'Attention', a:0.18, b:0.38 },
    { n:'Emotion',   a:0.38, b:0.58 },
    { n:'Memory',    a:0.58, b:0.78 },
    { n:'Uplift',    a:0.78, b:1.0  },
  ];
  let cur = -1;

  /* ---- heatmap ---- */
  let ctx = null;

  function initCanvas() {
    if (!heatEl) return;
    // Size canvas to match its CSS size (which is inset:0 = creative-wrap size)
    const r = heatEl.getBoundingClientRect();
    heatEl.width  = r.width * 2;
    heatEl.height = r.height * 2;
    ctx = heatEl.getContext('2d');
  }

  /*
   * HEATMAP HOTSPOT CONFIG
   * ──────────────────────
   * To align with your actual creative, adjust x/y to match where
   * key elements appear in the video frame:
   *
   *   x, y  = center of hotspot (0-1, where 0,0 = top-left)
   *   r     = radius (0-1 scale relative to frame size)
   *   i     = intensity (0-1, higher = hotter/redder)
   *   dx,dy = how far the spot drifts as user scrolls (amplitude)
   *   freq  = drift speed (higher = faster oscillation)
   *
   * Example: if your product is at center-right of the frame,
   * set x:0.7, y:0.5 with high intensity.
   */
  const spots = [
    {x:.50,y:.40,r:.20,i:1.0,  dx:.06, dy:.05, freq:0.8 },  // primary focus (center)
    {x:.40,y:.35,r:.16,i:.85,  dx:.08, dy:.04, freq:1.2 },  // secondary focus
    {x:.60,y:.50,r:.14,i:.75,  dx:.05, dy:.07, freq:1.0 },  // right-center interest
    {x:.30,y:.55,r:.12,i:.55,  dx:.10, dy:.06, freq:1.5 },  // left area
    {x:.75,y:.70,r:.10,i:.50,  dx:.04, dy:.05, freq:0.9 },  // bottom-right (CTA area)
    {x:.15,y:.12,r:.08,i:.20,  dx:.03, dy:.03, freq:1.8 },  // top-left (logo - low attention)
    {x:.55,y:.65,r:.10,i:.40,  dx:.07, dy:.08, freq:1.3 },  // mid-lower
    {x:.35,y:.25,r:.09,i:.30,  dx:.06, dy:.04, freq:1.6 },  // top area glance
  ];

  // scrollT is the overall scroll progress (0-1) used to drift the heatmap spots
  let scrollT = 0;

  function drawHeat(t) {
    if (!ctx) return;
    const w = heatEl.width, h = heatEl.height;
    ctx.clearRect(0,0,w,h);
    if (t <= 0) return;
    spots.forEach(s => {
      // Drift the spot position based on scroll using sine/cosine for organic motion
      const driftX = s.x + Math.sin(scrollT * Math.PI * 2 * s.freq) * s.dx;
      const driftY = s.y + Math.cos(scrollT * Math.PI * 2 * s.freq * 0.7) * s.dy;
      // Clamp to stay within canvas
      const cx = Math.max(0.05, Math.min(0.95, driftX)) * w;
      const cy = Math.max(0.05, Math.min(0.95, driftY)) * h;
      const rad = s.r * Math.max(w,h);
      const a = s.i * t;
      const g = ctx.createRadialGradient(cx,cy,0,cx,cy,rad);
      g.addColorStop(0,   `rgba(255,50,20,${a*.75})`);
      g.addColorStop(.25, `rgba(255,140,0,${a*.55})`);
      g.addColorStop(.55, `rgba(255,220,0,${a*.25})`);
      g.addColorStop(.8,  `rgba(0,180,90,${a*.1})`);
      g.addColorStop(1,   `rgba(0,80,200,0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0,0,w,h);
    });
  }

  /* ---- emotion curves ---- */
  const paths = ['c-att','c-val','c-hap','c-sur','c-ang'].map(id => document.getElementById(id));
  const lens  = [];

  function initCurves() {
    paths.forEach((p,i) => {
      if (!p) return;
      const l = p.getTotalLength();
      lens[i] = l;
      p.style.strokeDasharray  = l;
      p.style.strokeDashoffset = l;
    });
  }

  function drawCurves(t) {
    paths.forEach((p,i) => {
      if (!p||!lens[i]) return;
      const stag = i * .06;
      const adj  = Math.max(0, Math.min(1, (t-stag)/(1-stag)));
      p.style.strokeDashoffset = lens[i] * (1-adj);
    });

    const ph = document.getElementById('playhead');
    if (ph) { const x = 10 + t*980; ph.setAttribute('x1',x); ph.setAttribute('x2',x); }

    const pd = document.getElementById('peak-dot');
    const pl = document.getElementById('peak-label');
    const show = t > .35;
    pd?.classList.toggle('visible', show);
    pl?.classList.toggle('visible', show);
  }

  /* ---- memory bars ---- */
  const MEM = [
    {f:'mf-logo',   v:'mv-logo',   t:78},
    {f:'mf-aided',  v:'mv-aided',  t:64},
    {f:'mf-unaided',v:'mv-unaided',t:31},
    {f:'mf-message',v:'mv-message', t:52},
  ];
  let memDone = false;

  function animMem() {
    if (memDone) return; memDone = true;
    MEM.forEach((m,i) => {
      const fe = document.getElementById(m.f);
      const ve = document.getElementById(m.v);
      if (!fe||!ve) return;
      setTimeout(() => {
        fe.style.width = m.t+'%';
        let c=0; const s=m.t/40;
        const iv = setInterval(() => {
          c+=s; if(c>=m.t){c=m.t;clearInterval(iv)}
          ve.textContent = Math.round(c)+'%';
        },25);
      }, i*120);
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

  /* ---- uplift counters ---- */
  let uplDone = false;
  function animUpl() {
    if (uplDone) return; uplDone = true;
    document.querySelectorAll('.u-val[data-t]').forEach((el,i) => {
      const t = +el.dataset.t;
      setTimeout(() => {
        let c=0; const s=t/35;
        const iv = setInterval(() => {
          c+=s; if(c>=t){c=t;clearInterval(iv)}
          el.textContent = '+'+Math.round(c);
        },30);
      }, i*100);
    });
  }
  function resetUpl() {
    uplDone = false;
    document.querySelectorAll('.u-val[data-t]').forEach(el => el.textContent='+0');
  }

  /* ---- video scrub + progress bar ---- */
  function vidBar(p) {
    const pct = Math.min(p * 1.2, 1);

    // Update progress bar
    if (barFill) barFill.style.width = (pct * 100) + '%';

    // Scrub video to match scroll position
    if (bgVideo && videoDuration > 0) {
      const targetTime = pct * videoDuration;
      // Only seek if the difference is significant (avoid micro-seeks)
      if (Math.abs(bgVideo.currentTime - targetTime) > 0.05) {
        bgVideo.currentTime = targetTime;
      }
    }

    // Update time display (use actual video duration or fallback to 30s)
    const totalSec = videoDuration > 0 ? videoDuration : 30;
    const currentSec = Math.round(pct * totalSec);
    if (timeEl) {
      timeEl.textContent = Math.floor(currentSec / 60) + ':' + String(currentSec % 60).padStart(2, '0');
    }
  }

  /* ---- UI helpers ---- */
  function setStory(i)  { stories.forEach((s,j) => s.classList.toggle('active', j===i)); }
  function setDots(i)   { dots.forEach((d,j) => { d.classList.remove('active','done'); if(j===i) d.classList.add('active'); else if(j<i) d.classList.add('done'); }); }
  function setPill(name) { if(pillEl) pillEl.textContent = name; }

  function show(el)  { el?.classList.add('visible'); }
  function hide(el)  { el?.classList.remove('visible'); }

  /* ---- layer visibility per phase ---- */
  function layers(phase, pp) {
    hide(heatEl); hide(heatDim); hide(emotionEl); hide(memoryEl); hide(upliftEl); hide(legendEl);

    switch (phase) {
      case 0:
        drawHeat(0);
        drawCurves(0);
        break;
      case 1:
        show(heatDim);        // dim the video
        show(heatEl);
        drawHeat(pp);
        break;
      case 2:
        show(heatDim);
        show(heatEl);
        drawHeat(Math.max(.25, 1 - pp*.75));
        show(emotionEl);
        show(legendEl);
        drawCurves(pp);
        break;
      case 3:
        show(emotionEl);
        show(legendEl);
        drawCurves(1);
        show(memoryEl);
        animMem();
        break;
      case 4:
        show(upliftEl);
        animUpl();
        break;
    }
  }

  /* ---- main scroll ---- */
  function tick() {
    const rect = scroller.getBoundingClientRect();
    const scrollable = scroller.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));

    let phase = 0, pp = 0;
    for (let i = P.length-1; i >= 0; i--) {
      if (progress >= P[i].a) {
        phase = i;
        pp = Math.min(1, (progress - P[i].a) / (P[i].b - P[i].a));
        break;
      }
    }

    vidBar(progress);
    scrollT = progress;  // feed to heatmap drift

    if (phase !== cur) {
      cur = phase;
      setPill(P[phase].n);
      setStory(phase);
      setDots(phase);
      if (phase < 3) resetMem();
      if (phase < 4) resetUpl();
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

  /* ---- init ---- */
  function init() {
    initCanvas();
    initCurves();
    setStory(0);
    setDots(0);
    setPill('Creative');
    tick();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { initCanvas(); tick(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    requestAnimationFrame(init);
  }
})();

/* ============================================
   ASK ELLIE — Scroll-driven Feed + Chat Logic
   ============================================ */
(function () {
  'use strict';

  const section    = document.getElementById('ask-ellie');
  const feed       = document.getElementById('ae-feed');
  const introText  = document.getElementById('ae-intro-text');
  const cards      = document.querySelectorAll('.ae-card');
  const orb        = document.getElementById('ae-orb');
  const chatWrap   = document.getElementById('ae-chat');
  const welcomeEl  = document.getElementById('ae-welcome');
  const msgArea    = document.getElementById('ae-messages');
  const sugWrap    = document.getElementById('ae-suggestions');

  if (!section) return;

  const WELCOME = "I've analyzed all your creatives across attention, emotion, memory, and brand metrics. What would you like to know?";

  const QA = [
    {
      q: "Which creative had the highest emotional peak?",
      a: "Creative B ('Summer Vibes') hit the highest emotional peak at 0:08 \u2014 a valence score of 0.92 driven by the product reveal. Creative D came close at 0.85, but it peaked later at 0:14 where attention had already dropped 40%."
    },
    {
      q: "Should I use Creative B for my campaign?",
      a: "Creative B drives the strongest emotional response, but there's a problem: only 12% of viewers noticed the brand logo, and unaided recall was just 31%. I'd recommend repositioning the logo into the first 3 seconds where attention peaks at 87%, then retest before scaling spend."
    },
    {
      q: "Which platform should I run this on?",
      a: "Based on 341 benchmark studies, Creative B's format performs best on CTV (+24pt ad recall) and TikTok (+22pt). Instagram showed 15% lower emotional engagement for this video length. For your budget, I'd split 60/40 between CTV and TikTok."
    },
    {
      q: "How can I improve brand recall across all creatives?",
      a: "Three quick wins: 1) Move logo to the first 3 seconds \u2014 that's where 87% of attention lands. 2) Extend logo display from 1.2s to 3s minimum. 3) Add a sonic brand cue \u2014 our data shows audio signatures boost unaided recall by +18pt on average."
    }
  ];

  /*
   * Scroll-driven phases (mapped to 0-1 progress through the section):
   *   0.00 – 0.08  Intro text fades in
   *   0.08 – 0.30  Cards animate in (staggered)
   *   0.30 – 0.42  Orb appears
   *   0.42 – 0.58  Cards converge into orb, orb glows
   *   0.58 – 0.68  Orb fades, feed hides
   *   0.68 – 1.00  Chat visible (welcome types once, suggestions appear, user can interact)
   */

  let lastPhase = -1;
  let chatReady = false;
  let welcomeTyped = false;
  let sugsShown = false;

  /* ---- Main scroll tick ---- */
  function aeTick() {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));

    // Phase 0: Intro text
    if (progress >= 0.02) {
      introText.classList.add('ae-show');
    } else {
      introText.classList.remove('ae-show');
    }

    // Phase 1: Cards stagger in (0.08 – 0.30)
    const cardStart = 0.08;
    const cardEnd = 0.30;
    cards.forEach((c, i) => {
      const threshold = cardStart + (i / cards.length) * (cardEnd - cardStart);
      if (progress >= threshold && progress < 0.42) {
        c.classList.add('ae-visible');
        c.classList.remove('ae-converge');
        c.style.opacity = '';
        c.style.transform = '';
      } else if (progress < threshold) {
        c.classList.remove('ae-visible', 'ae-converge');
        c.style.opacity = '';
        c.style.transform = '';
      }
    });

    // Phase 2: Orb appears (0.30+)
    if (progress >= 0.30 && progress < 0.64) {
      orb.classList.add('ae-orb-visible');
    } else if (progress < 0.30) {
      orb.classList.remove('ae-orb-visible', 'ae-orb-active');
    }

    // Phase 3: Cards converge into orb (0.42 – 0.58)
    if (progress >= 0.42 && progress < 0.64) {
      const convergeP = Math.min(1, (progress - 0.42) / 0.16);
      orb.classList.add('ae-orb-active');
      cards.forEach((c, i) => {
        c.classList.remove('ae-visible');
        c.classList.add('ae-converge');
        const scale = 1 - convergeP * 0.8;
        const fade = 1 - convergeP;
        c.style.opacity = fade;
        c.style.transform = 'scale(' + scale + ')';
      });
    }

    // Phase 4: Orb shrinks, feed hides (0.58 – 0.68)
    if (progress >= 0.58) {
      const fadeP = Math.min(1, (progress - 0.58) / 0.10);
      orb.style.opacity = 1 - fadeP;
      orb.style.transform = 'scale(' + (1.3 - fadeP * 1.0) + ')';
    } else {
      orb.style.opacity = '';
      orb.style.transform = '';
    }

    // Phase 5: Feed hidden, chat visible (0.64+)
    if (progress >= 0.64) {
      feed.classList.add('ae-feed-hidden');
      chatWrap.classList.add('ae-chat-visible');

      // Type welcome message once
      if (!welcomeTyped) {
        welcomeTyped = true;
        const welcomeMsg = msgArea.querySelector('.ae-msg');
        welcomeMsg.classList.add('ae-msg-show');
        typeText(welcomeEl, WELCOME, 25, () => {
          showSuggestions();
        });
      }
    } else {
      // Scrolling back up — hide chat, show feed
      chatWrap.classList.remove('ae-chat-visible');
      feed.classList.remove('ae-feed-hidden');

      // Reset welcome if user scrolls back before chat
      if (progress < 0.58 && welcomeTyped && !chatHasUserMessages()) {
        welcomeTyped = false;
        sugsShown = false;
        chatReady = false;
        welcomeEl.textContent = '';
        msgArea.querySelector('.ae-msg').classList.remove('ae-msg-show');
        sugWrap.querySelectorAll('.ae-sug').forEach(s => s.classList.remove('ae-sug-show'));
      }
    }
  }

  function chatHasUserMessages() {
    return msgArea.querySelectorAll('.ae-msg-user').length > 0;
  }

  function showSuggestions() {
    if (sugsShown) return;
    sugsShown = true;
    const subs = sugWrap.querySelectorAll('.ae-sug:not(.ae-sug-used)');
    subs.forEach((s, i) => {
      setTimeout(() => s.classList.add('ae-sug-show'), i * 150);
    });
    chatReady = true;
  }

  /* ---- Typewriter effect ---- */
  function typeText(el, text, speed, cb) {
    let i = 0;
    el.textContent = '';
    function step() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(step, speed);
      } else if (cb) {
        cb();
      }
    }
    step();
  }

  /* ---- Suggestion click handler ---- */
  sugWrap.addEventListener('click', function (e) {
    var btn = e.target.closest('.ae-sug');
    if (!btn || !chatReady || btn.classList.contains('ae-sug-used')) return;
    chatReady = false;

    var idx = +btn.dataset.q;
    var pair = QA[idx];
    if (!pair) return;

    // Mark button as used
    btn.classList.add('ae-sug-used');

    // Add user bubble
    var userMsg = createMsg('user', pair.q);
    msgArea.appendChild(userMsg);
    requestAnimationFrame(function () {
      userMsg.classList.add('ae-msg-show');
      scrollChat();
    });

    // Add typing indicator after short delay
    setTimeout(function () {
      var typingMsg = createTyping();
      msgArea.appendChild(typingMsg);
      requestAnimationFrame(function () {
        typingMsg.classList.add('ae-msg-show');
        scrollChat();
      });

      // Replace typing with actual response
      var delay = 1500 + Math.random() * 1500;
      setTimeout(function () {
        msgArea.removeChild(typingMsg);
        var ellieMsg = createMsg('ellie', '');
        msgArea.appendChild(ellieMsg);
        requestAnimationFrame(function () {
          ellieMsg.classList.add('ae-msg-show');
          var bubble = ellieMsg.querySelector('.ae-bubble');
          typeText(bubble, pair.a, 18, function () {
            chatReady = true;
            scrollChat();
          });
          scrollChat();
        });
      }, delay);
    }, 400);
  });

  /* ---- Helper: create message DOM ---- */
  function createMsg(role, text) {
    var wrap = document.createElement('div');
    wrap.className = 'ae-msg ae-msg-' + role;

    var avatar = document.createElement('div');
    avatar.className = 'ae-avatar-sm';
    avatar.textContent = role === 'ellie' ? 'E' : 'Y';

    var bubble = document.createElement('div');
    bubble.className = 'ae-bubble';
    bubble.textContent = text;

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    return wrap;
  }

  /* ---- Helper: create typing indicator ---- */
  function createTyping() {
    var wrap = document.createElement('div');
    wrap.className = 'ae-msg ae-msg-ellie';

    var avatar = document.createElement('div');
    avatar.className = 'ae-avatar-sm';
    avatar.textContent = 'E';

    var dots = document.createElement('div');
    dots.className = 'ae-bubble ae-typing';
    dots.innerHTML = '<span class="ae-typing-dot"></span><span class="ae-typing-dot"></span><span class="ae-typing-dot"></span>';

    wrap.appendChild(avatar);
    wrap.appendChild(dots);
    return wrap;
  }

  /* ---- Helper: scroll chat to bottom ---- */
  function scrollChat() {
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  /* ---- Scroll listener (shares the passive scroll with the scroller IIFE) ---- */
  var aeTicking = false;
  function onAeScroll() {
    if (!aeTicking) {
      aeTicking = true;
      requestAnimationFrame(function () { aeTick(); aeTicking = false; });
    }
  }

  window.addEventListener('scroll', onAeScroll, { passive: true });

  // Initial tick in case user reloads mid-page
  requestAnimationFrame(aeTick);
})();
