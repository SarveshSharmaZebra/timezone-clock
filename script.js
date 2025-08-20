(function () {
  const elClocks = document.getElementById('clocks');
  const elToggle24h = document.getElementById('toggle24h');
  const form = document.getElementById('addZoneForm');
  const input = document.getElementById('zoneInput');

  const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const prettyNames = new Map(Object.entries({
    UTC: 'UTC',
    [localTZ]: 'Local',
    'America/Los_Angeles': 'Los Angeles',
    'America/Denver': 'Denver',
    'America/Chicago': 'Chicago',
    'America/New_York': 'New York',
    'America/Toronto': 'Toronto',
    'America/Vancouver': 'Vancouver',
    'America/Mexico_City': 'Mexico City',
    'America/Sao_Paulo': 'São Paulo',
    'Europe/London': 'London',
    'Europe/Paris': 'Paris',
    'Europe/Berlin': 'Berlin',
    'Europe/Madrid': 'Madrid',
    'Europe/Rome': 'Rome',
    'Europe/Moscow': 'Moscow',
    'Africa/Johannesburg': 'Johannesburg',
    'Asia/Dubai': 'Dubai',
    'Asia/Karachi': 'Karachi',
    'Asia/Kolkata': 'Kolkata',
    'Asia/Dhaka': 'Dhaka',
    'Asia/Bangkok': 'Bangkok',
    'Asia/Singapore': 'Singapore',
    'Asia/Hong_Kong': 'Hong Kong',
    'Asia/Tokyo': 'Tokyo',
    'Asia/Seoul': 'Seoul',
    'Australia/Perth': 'Perth',
    'Australia/Sydney': 'Sydney',
    'Pacific/Auckland': 'Auckland'
  }));

  const persisted = JSON.parse(localStorage.getItem('tz-clock-state') || '{}');
  const state = {
    use24h: !!persisted.use24h,
    zones: Array.isArray(persisted.zones) && persisted.zones.length
      ? persisted.zones
      : [localTZ, 'UTC', 'America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney']
  };

  elToggle24h.checked = state.use24h;

  function isValidTimeZone(tz) {
    try {
      new Intl.DateTimeFormat('en', { timeZone: tz }).format(0);
      return true;
    } catch {
      return false;
    }
  }

  function offsetLabel(date, timeZone) {
    try {
      const dtf = new Intl.DateTimeFormat('en', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'shortOffset'
      });
      const parts = dtf.formatToParts(date);
      const tzName = parts.find(p => p.type === 'timeZoneName');
      return tzName ? tzName.value : '';
    } catch {
      try {
        const dtf2 = new Intl.DateTimeFormat('en', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        });
        const parts = dtf2.formatToParts(date);
        const tzName = parts.find(p => p.type === 'timeZoneName');
        return tzName ? tzName.value : '';
      } catch {
        return '';
      }
    }
  }

  function formatTime(date, timeZone, use24h) {
    const options = {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: use24h ? 'h23' : 'h12'
    };
    return new Intl.DateTimeFormat(undefined, options).format(date);
  }

  function formatDate(date, timeZone) {
    const options = {
      timeZone,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    };
    return new Intl.DateTimeFormat(undefined, options).format(date);
  }

  function persist() {
    localStorage.setItem('tz-clock-state', JSON.stringify(state));
  }

  function makeClockCard(tz) {
    const card = document.createElement('article');
    card.className = 'clock';
    card.dataset.tz = tz;

    const title = prettyNames.get(tz) || tz;
    const sub = tz === localTZ ? `${tz} (Detected)` : tz;

    card.innerHTML = `
      <div class="clock-header">
        <div>
          <div class="title">${escapeHtml(title)}</div>
          <div class="meta" data-role="offset"></div>
        </div>
        <button class="rm" title="Remove">✕</button>
      </div>
      <div class="time" data-role="time">--:--:--</div>
      <div class="date" data-role="date">${escapeHtml(sub)}</div>
    `;

    const btn = card.querySelector('.rm');
    btn.addEventListener('click', () => {
      state.zones = state.zones.filter(z => z !== tz);
      card.remove();
      persist();
    });

    return card;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
  }

  function render() {
    elClocks.innerHTML = '';
    const seen = new Set();
    for (const tz of state.zones) {
      if (seen.has(tz)) continue;
      seen.add(tz);
      if (!isValidTimeZone(tz)) continue;
      elClocks.appendChild(makeClockCard(tz));
    }
  }

  function tick() {
    const now = new Date();
    const use24h = elToggle24h.checked;
    document.querySelectorAll('.clock').forEach(card => {
      const tz = card.dataset.tz;
      const timeEl = card.querySelector('[data-role="time"]');
      const dateEl = card.querySelector('[data-role="date"]');
      const offEl  = card.querySelector('[data-role="offset"]');

      timeEl.textContent = formatTime(now, tz, use24h);
      offEl.textContent  = offsetLabel(now, tz);
      dateEl.textContent = formatDate(now, tz);
    });
  }

  elToggle24h.addEventListener('change', () => {
    state.use24h = elToggle24h.checked;
    persist();
    tick();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const tz = (input.value || '').trim();
    if (!tz) return;
    if (!isValidTimeZone(tz)) {
      input.setCustomValidity('Please enter a valid IANA time zone, e.g., Europe/Paris');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    if (!state.zones.includes(tz)) {
      state.zones.push(tz);
      persist();
      elClocks.appendChild(makeClockCard(tz));
      tick();
    }
    input.value = '';
  });

  render();
  tick();
  setInterval(tick, 1000);
})();