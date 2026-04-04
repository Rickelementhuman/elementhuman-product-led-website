/* Manifesto Dev Toolbar — remove before production */
(function () {
  const controls = [
    { label: 'Hero top',      prop: 'paddingTop',    target: '.manifesto-hero', min: 64, max: 300, unit: 'px' },
    { label: 'Hero bottom',   prop: 'paddingBottom',  target: '.manifesto-hero', min: 0,  max: 200, unit: 'px' },
    { label: 'Body top',      prop: 'paddingTop',    target: '.manifesto-body', min: 0,  max: 200, unit: 'px' },
    { label: 'Body width',    prop: 'maxWidth',      target: '.manifesto-body .container', min: 600, max: 1200, unit: 'px' },
    { label: 'Block spacing', prop: 'marginBottom',   target: '.manifesto-block', min: 16, max: 100, unit: 'px', all: true },
  ];

  const panel = document.createElement('div');
  panel.id = 'dev-toolbar';
  panel.innerHTML = `
    <style>
      #dev-toolbar {
        position: fixed; bottom: 16px; right: 16px; z-index: 9999;
        background: rgba(12,21,32,0.95); border: 1px solid rgba(255,255,255,0.12);
        border-radius: 12px; padding: 16px 20px; width: 280px;
        font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8A9AB5;
        backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      }
      #dev-toolbar.collapsed .dt-body { display: none; }
      #dev-toolbar .dt-header {
        display: flex; justify-content: space-between; align-items: center;
        cursor: pointer; user-select: none; margin-bottom: 12px;
      }
      #dev-toolbar.collapsed .dt-header { margin-bottom: 0; }
      #dev-toolbar .dt-title { font-weight: 700; color: #F0F0F5; font-size: 12px; letter-spacing: 1px; }
      #dev-toolbar .dt-toggle { color: #8A9AB5; font-size: 14px; }
      #dev-toolbar .dt-row { margin-bottom: 10px; }
      #dev-toolbar .dt-row:last-child { margin-bottom: 0; }
      #dev-toolbar .dt-label { display: flex; justify-content: space-between; margin-bottom: 4px; }
      #dev-toolbar .dt-val { color: #54E42B; }
      #dev-toolbar input[type=range] {
        width: 100%; height: 4px; -webkit-appearance: none; appearance: none;
        background: rgba(255,255,255,0.1); border-radius: 2px; outline: none;
      }
      #dev-toolbar input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none; width: 14px; height: 14px;
        background: #007AFF; border-radius: 50%; cursor: pointer;
      }
      #dev-toolbar .dt-copy {
        margin-top: 12px; padding: 6px 0; text-align: center;
        border-top: 1px solid rgba(255,255,255,0.08); cursor: pointer;
        color: #007AFF; font-weight: 600; transition: color 0.2s;
      }
      #dev-toolbar .dt-copy:hover { color: #54E42B; }
    </style>
    <div class="dt-header">
      <span class="dt-title">SPACING</span>
      <span class="dt-toggle">&#9660;</span>
    </div>
    <div class="dt-body"></div>
  `;

  document.body.appendChild(panel);

  const header = panel.querySelector('.dt-header');
  const toggle = panel.querySelector('.dt-toggle');
  header.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
    toggle.textContent = panel.classList.contains('collapsed') ? '\u25B6' : '\u25BC';
  });

  const body = panel.querySelector('.dt-body');

  controls.forEach(c => {
    const el = c.all
      ? document.querySelectorAll(c.target)
      : [document.querySelector(c.target)];
    if (!el[0]) return;

    const current = parseInt(getComputedStyle(el[0])[c.prop]) || c.min;

    const row = document.createElement('div');
    row.className = 'dt-row';
    row.innerHTML = `
      <div class="dt-label"><span>${c.label}</span><span class="dt-val">${current}${c.unit}</span></div>
      <input type="range" min="${c.min}" max="${c.max}" value="${current}">
    `;
    body.appendChild(row);

    const slider = row.querySelector('input');
    const val = row.querySelector('.dt-val');

    slider.addEventListener('input', () => {
      const v = slider.value + c.unit;
      val.textContent = v;
      el.forEach(e => { e.style[c.prop] = v; });
    });
  });

  // Copy CSS button
  const copyBtn = document.createElement('div');
  copyBtn.className = 'dt-copy';
  copyBtn.textContent = 'Copy CSS values';
  copyBtn.addEventListener('click', () => {
    const lines = [];
    controls.forEach(c => {
      const el = c.all
        ? document.querySelector(c.target)
        : document.querySelector(c.target);
      if (!el) return;
      const v = el.style[c.prop] || getComputedStyle(el)[c.prop];
      lines.push(`/* ${c.label} */ ${c.target} { ${c.prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}; }`);
    });
    navigator.clipboard.writeText(lines.join('\n'));
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy CSS values'; }, 1500);
  });
  body.appendChild(copyBtn);
})();
