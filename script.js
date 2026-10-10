/* ==========================================================================
   Stately — script.js
   Vanilla JavaScript. Sections:
   1. Data            4. Rendering          7. Overlays (modals, menu)
   2. Helpers/icons   5. Favorites/compare  8. Inquiry form
   3. State/filters   6. Controls/events    9. Testimonials + page effects
   ========================================================================== */
(() => {
  'use strict';

  /* ----------------------------------------------------------------------
     1. DATA — sample listings (fictional, for demonstration only)
     ---------------------------------------------------------------------- */
  const FEATURED_ID = 'villa-solenne';
  const MAX_COMPARE = 3;
  const FAV_KEY = 'stately.favorites.v1';

  const PROPERTIES = [
    {
      id: 'cedar-hollow',
      name: 'Cedar Hollow House',
      area: 'Barton Hills, Austin, Texas',
      type: 'house', kind: 'Modern house', status: 'sale',
      price: 1285000, beds: 4, baths: 3.5, sqft: 3420,
      featured: true, listed: '2026-09-24',
      photo: 'photo-1600596542815-ffad4c1539a9',
      description: 'A modern house wrapped around a limestone courtyard, with floor-to-ceiling glazing that pulls the live oaks into every main room. The open kitchen runs straight onto a covered terrace, and a separate guest suite keeps visiting family comfortable and private.',
      amenities: ['Heated plunge pool', 'Chef\'s kitchen with island', 'Covered outdoor terrace', 'Detached guest suite', 'EV charging', 'Smart home wiring', 'Two-car garage']
    },
    {
      id: 'meridian-penthouse',
      name: 'The Meridian Penthouse',
      area: 'The Loop, Chicago, Illinois',
      type: 'penthouse', kind: 'Premium penthouse', status: 'sale',
      price: 3450000, beds: 3, baths: 3.5, sqft: 3100,
      featured: true, listed: '2026-09-30',
      photo: 'photo-1545324418-cc1a3fa10c00',
      description: 'The top two floors of a landmark tower, with a wrap-around terrace above the river and a double-height living room facing the skyline. Private elevator access, a library with built-in oak joinery and a primary suite with its own dressing room.',
      amenities: ['Private elevator landing', 'Wrap-around terrace', 'Double-height living room', '24-hour concierge', 'Residents\' fitness studio', 'Wine storage', 'Two parking spaces']
    },
    {
      id: 'villa-solenne',
      name: 'Villa Solenne',
      area: 'La Jolla, San Diego, California',
      type: 'villa', kind: 'Contemporary villa', status: 'sale',
      price: 4950000, beds: 5, baths: 6, sqft: 6200,
      featured: true, listed: '2026-10-04',
      photo: 'photo-1613490493576-7fde63acd811',
      editorial: 'Villa Solenne is arranged as a quiet sequence of rooms rather than one grand gesture: pale stone, deep eaves and long sight lines that end in the Pacific. Every terrace is sheltered from the wind, so the garden works from morning coffee to late dinners.',
      description: 'A contemporary villa of pale stone and deep eaves, set above the coast with long sight lines to the Pacific. Five bedroom suites open onto sheltered terraces, and the pool pavilion turns the garden into a second living space.',
      amenities: ['Ocean-view infinity pool', 'Outdoor kitchen and dining pavilion', 'Home cinema', 'Wine cellar', 'Guest casita', 'Landscaped garden', 'Three-car garage']
    },
    {
      id: 'harbor-light-loft',
      name: 'Harbor Light Loft',
      area: 'Dumbo, Brooklyn, New York',
      type: 'apartment', kind: 'Loft apartment', status: 'rent',
      price: 5800, beds: 2, baths: 2, sqft: 1450,
      featured: false, listed: '2026-09-18',
      photo: 'photo-1502672260266-1c1ef2d93688',
      description: 'A converted warehouse loft with twelve-foot ceilings, original timber beams and tall arched windows facing the East River. The open plan has room for a dining table of eight, and both bedrooms sit on the quiet side of the building.',
      amenities: ['Exposed timber beams', 'In-unit washer and dryer', 'River-facing arched windows', 'Building roof deck', 'Bike storage', 'Pet friendly']
    },
    {
      id: 'willow-creek',
      name: 'Willow Creek Family Home',
      area: 'Washington Park, Denver, Colorado',
      type: 'house', kind: 'Family home', status: 'sale',
      price: 865000, beds: 4, baths: 3, sqft: 2800,
      featured: false, listed: '2026-09-12',
      photo: 'photo-1564013799919-ab600027ffc6',
      description: 'A warm, well-kept family home two blocks from the park, with a finished basement playroom, a fenced backyard and a kitchen that opens onto the dining room. Bedrooms are grouped upstairs, with a home office tucked beside the entry.',
      amenities: ['Fenced backyard with patio', 'Finished basement', 'Home office', 'Mudroom with storage', 'Updated kitchen', 'Attached two-car garage']
    },
    {
      id: 'palm-court',
      name: 'Palm Court Residences, Unit 12',
      area: 'Coconut Grove, Miami, Florida',
      type: 'apartment', kind: 'Luxury apartment', status: 'rent',
      price: 4200, beds: 2, baths: 2, sqft: 1280,
      featured: false, listed: '2026-09-27',
      photo: 'photo-1522708323590-d24dbb6b0267',
      description: 'A bright corner apartment on the sixth floor with a long balcony, light stone floors and sliding glass doors that open the living room to the breeze. The building is a short walk from the marina and the village cafés.',
      amenities: ['Private balcony', 'Resort-style pool', 'Fitness center', 'Secure covered parking', 'Concierge desk', 'Central air conditioning']
    },
    {
      id: 'ridgeline-villa',
      name: 'Ridgeline Villa',
      area: 'Paradise Valley, Scottsdale, Arizona',
      type: 'villa', kind: 'Contemporary villa', status: 'rent',
      price: 9500, beds: 4, baths: 4.5, sqft: 4300,
      featured: false, listed: '2026-09-08',
      photo: 'photo-1613977257363-707ba9348227',
      description: 'A contemporary desert villa on a half-acre lot, with a courtyard entry, a shaded loggia and mountain views from the primary suite. Offered on a twelve-month lease, furnished or unfurnished.',
      amenities: ['Heated pool and spa', 'Shaded loggia', 'Mountain views', 'Chef\'s kitchen', 'Guest casita', 'Three-car garage', 'Smart climate control']
    },
    {
      id: 'larkspur-fourplex',
      name: 'Larkspur Fourplex',
      area: 'East Nashville, Nashville, Tennessee',
      type: 'investment', kind: 'Investment property', status: 'sale',
      price: 1120000, beds: 8, baths: 4, sqft: 4200,
      featured: false, listed: '2026-09-20',
      photo: 'photo-1600047509807-ba8f99d2cdde',
      description: 'A brick fourplex in a rapidly improving east-side neighborhood. Each unit is a two-bedroom, one-bath layout with its own entrance, and the roof and mechanical systems were replaced in the last five years. Sample figure: current gross rent roll of $9,600 per month.',
      amenities: ['Four separate two-bedroom units', 'Individual utility meters', 'Off-street parking for six cars', 'Shared laundry room', 'New roof and HVAC', 'Fenced rear yard']
    },
    {
      id: 'skyline-terrace',
      name: 'Skyline Terrace Penthouse',
      area: 'Belltown, Seattle, Washington',
      type: 'penthouse', kind: 'Penthouse', status: 'sale',
      price: 2750000, beds: 3, baths: 3, sqft: 2650,
      featured: false, listed: '2026-10-02',
      photo: 'photo-1493809842364-78817add7ffb',
      description: 'A corner penthouse with glass on two sides, a private rooftop terrace and views from the Sound to the Olympic Mountains. The kitchen opens to a dining area for twelve, and the primary suite includes a soaking tub set against the window.',
      amenities: ['Private rooftop terrace', 'Floor-to-ceiling windows', 'Heated floors', 'Valet parking', 'Residents\' lounge', 'Storage room', '24-hour doorman']
    },
    {
      id: 'stonebridge-modern',
      name: 'Stonebridge Modern',
      area: 'Silver Lake, Los Angeles, California',
      type: 'house', kind: 'Modern house', status: 'rent',
      price: 7200, beds: 3, baths: 2.5, sqft: 2350,
      featured: false, listed: '2026-09-15',
      photo: 'photo-1600585154340-be6161a56a0c',
      description: 'An architect-designed hillside home with a steel-framed living room, polished concrete floors and a deck that overlooks the reservoir. Offered unfurnished on a twelve-month lease, a short walk from the neighborhood\'s cafés.',
      amenities: ['Reservoir-view deck', 'Polished concrete floors', 'Solar panels', 'Drought-tolerant garden', 'Two-car carport', 'Full-size laundry room']
    }
  ];

  /* ----------------------------------------------------------------------
     2. HELPERS AND ICONS
     ---------------------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const byId = (id) => PROPERTIES.find((p) => p.id === id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const moneyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const money = (n) => moneyFmt.format(n);
  const num = (n) => n.toLocaleString('en-US');
  const photo = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;
  const photoSrcset = (id, widths = [380, 600, 800]) => widths.map((w) => `${photo(id, w)} ${w}w`).join(', ');
  const statusLabel = (s) => (s === 'sale' ? 'For sale' : 'For rent');
  const debounce = (fn, wait = 180) => {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  };
  const priceHTML = (p) => `${money(p.price)}${p.status === 'rent' ? '<span class="per">/month</span>' : ''}`;
  const altText = (p) => `${p.kind} ${p.name}, ${p.area}`;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const formatDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const ICONS = {
    bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    bath: '<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/>',
    area: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    compare: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>'
  };

  const icon = (name, size = 20) =>
    `<svg class="icon" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;

  function hydrateIcons(root = document) {
    $$('[data-icon]', root).forEach((el) => {
      if (!el.firstChild) el.innerHTML = icon(el.dataset.icon, Number(el.dataset.size) || 20);
    });
  }

  function hydrateStars() {
    $$('[data-stars]').forEach((el) => {
      const n = Number(el.dataset.stars);
      el.innerHTML = [1, 2, 3, 4, 5].map((i) => `<span class="star${i <= n ? ' is-on' : ''}">${icon('star', 18)}</span>`).join('');
    });
  }

  /* ----------------------------------------------------------------------
     3. STATE AND FILTERING
     ---------------------------------------------------------------------- */
  const DEFAULTS = { status: 'all', type: 'all', location: '', min: 0, max: 0, sort: 'recommended', favoritesOnly: false };
  let state = { ...DEFAULTS };
  let favorites = loadFavorites();
  let compare = [];
  let currentSection = 'home';

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(list) ? list.filter((id) => byId(id)) : []);
    } catch (err) {
      return new Set();
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favorites)));
    } catch (err) {
      /* Storage can be unavailable */
    }
  }

  function getResults() {
    const query = state.location.trim().toLowerCase();
    const list = PROPERTIES.filter((p) => {
      if (state.status !== 'all' && p.status !== state.status) return false;
      if (state.type !== 'all' && p.type !== state.type) return false;
      if (query && !`${p.name} ${p.area}`.toLowerCase().includes(query)) return false;
      if (state.min && p.price < state.min) return false;
      if (state.max && p.price > state.max) return false;
      if (state.favoritesOnly && !favorites.has(p.id)) return false;
      return true;
    });

    const sorters = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      newest: (a, b) => b.listed.localeCompare(a.listed),
      recommended: (a, b) => Number(b.featured) - Number(a.featured) || b.listed.localeCompare(a.listed)
    };
    return list.sort(sorters[state.sort] || sorters.recommended);
  }

  const isFiltered = () =>
    state.status !== 'all' || state.type !== 'all' || state.location.trim() !== '' || state.min > 0 || state.max > 0 || state.favoritesOnly;

  function fixBudget() {
    if (state.min && state.max && state.min > state.max) {
      [state.min, state.max] = [state.max, state.min];
      toast('Your budget range was adjusted because the minimum was higher than the maximum.', 'info');
    }
  }

  /* ----------------------------------------------------------------------
     4. RENDERING
     ---------------------------------------------------------------------- */
  const grid = $('#property-grid');
  const emptyState = $('#empty-state');
  let swapTimer = null;

  function cardHTML(p, i) {
    const fav = favorites.has(p.id);
    const cmp = compare.includes(p.id);
    return `
      <article class="card" style="--i:${Math.min(i, 9)}" data-id="${p.id}">
        <div class="card-media has-img">
          <img class="fx-img"
               src="${photo(p.photo, 600)}"
               srcset="${photoSrcset(p.photo, [380, 600, 800])}"
               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
               alt="${altText(p)}"
               width="800" height="600"
               loading="lazy"
               decoding="async">
          <div class="card-badges">
            <span class="badge badge--${p.status}">${statusLabel(p.status)}</span>
            ${p.featured ? '<span class="badge badge--featured">Featured</span>' : ''}
          </div>
          <button type="button" class="fav-btn${fav ? ' is-active' : ''}" data-fav="${p.id}" aria-pressed="${fav}" aria-label="Save ${p.name} to favorites">${icon('heart', 20)}</button>
        </div>
        <div class="card-body">
          <p class="card-kind">${p.kind}</p>
          <h3 class="card-title"><button type="button" class="card-link" data-open="${p.id}">${p.name}</button></h3>
          <p class="card-location">${icon('pin', 16)}<span>${p.area}</span></p>
          <p class="card-price">${priceHTML(p)}</p>
          <ul class="card-specs" aria-label="Key specifications">
            <li>${icon('bed', 18)}<span>${plural(p.beds, 'bed', 'beds')}</span></li>
            <li>${icon('bath', 18)}<span>${plural(p.baths, 'bath', 'baths')}</span></li>
            <li>${icon('area', 18)}<span>${num(p.sqft)} sq ft</span></li>
          </ul>
          <div class="card-actions">
            <button type="button" class="compare-btn${cmp ? ' is-active' : ''}" data-compare="${p.id}" aria-pressed="${cmp}">
              <span class="compare-box">${icon('check', 14)}</span>Compare<span class="sr-only"> ${p.name}</span>
            </button>
            <button type="button" class="details-btn" data-open="${p.id}">Details${icon('arrow', 16)}<span class="sr-only"> for ${p.name}</span></button>
          </div>
        </div>
      </article>`;
  }

  function renderGrid() {
    const results = getResults();
    grid.innerHTML = results.map(cardHTML).join('');
    grid.hidden = results.length === 0;
    emptyState.hidden = results.length > 0;
    if (results.length === 0) renderEmpty();
    syncCompareUI();
  }

  function renderCounter() {
    const n = getResults().length;
    const total = PROPERTIES.length;
    $('#result-count').innerHTML = `Showing <strong>${n}</strong> of ${total} properties`;
    $('#reset-filters').hidden = !isFiltered();
  }

  function renderEmpty() {
    const noFavs = state.favoritesOnly && favorites.size === 0;
    $('#empty-title').textContent = noFavs ? 'No favorites yet' : 'No properties match these filters';
    $('#empty-text').textContent = noFavs
      ? 'Tap the heart on any listing to save it here. Your favorites stay on this device.'
      : 'Try widening your budget, clearing the location, or switching the listing type. Every filter narrows the same results, so removing one often brings listings back.';
    $('#empty-reset').textContent = noFavs ? 'Browse all properties' : 'Reset filters';
  }

  function refresh() {
    syncControls();
    renderCounter();
    updateNav();
    if (reduceMotion.matches) {
      renderGrid();
      return;
    }
    grid.classList.add('is-swapping');
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => {
      renderGrid();
      grid.classList.remove('is-swapping');
    }, 200);
  }

  function renderFeatured() {
    const p = byId(FEATURED_ID);
    $('#featured-root').innerHTML = `
      <div class="featured-media has-img">
        <img class="fx-img"
             src="${photo(p.photo, 1200)}"
             srcset="${photoSrcset(p.photo, [640, 1000, 1400])}"
             sizes="(max-width: 959px) 100vw, 65vw"
             alt="${altText(p)}"
             width="1600" height="1100"
             loading="lazy"
             decoding="async">
      </div>
      <div class="featured-panel reveal">
        <p class="featured-tag">Featured property</p>
        <h2 class="featured-title" id="featured-title">${p.name}</h2>
        <p class="card-location">${icon('pin', 16)}<span>${p.area}</span></p>
        <p class="featured-price">${priceHTML(p)}</p>
        <dl class="featured-specs">
          <div><dt>Bedrooms</dt><dd>${p.beds}</dd></div>
          <div><dt>Bathrooms</dt><dd>${p.baths}</dd></div>
          <div><dt>Area</dt><dd>${num(p.sqft)}<span> sq ft</span></dd></div>
        </dl>
        <p class="featured-text">${p.editorial}</p>
        <button type="button" class="btn btn--primary" data-open="${p.id}">View Property Details</button>
      </div>`;
  }

  const BUDGET = {
    min: { rent: [3000, 5000, 7000], sale: [500000, 1000000, 2000000, 3000000] },
    max: { rent: [4000, 6000, 8000, 10000], sale: [900000, 1500000, 3000000, 5000000] }
  };

  function budgetOptions(kind) {
    const group = BUDGET[kind];
    const opts = (list) => list.map((v) => `<option value="${v}">${money(v)}</option>`).join('');
    return `<option value="0">${kind === 'min' ? 'No minimum' : 'No maximum'}</option>
      <optgroup label="Monthly rent">${opts(group.rent)}</optgroup>
      <optgroup label="Purchase price">${opts(group.sale)}</optgroup>`;
  }

  function buildOptions() {
    ['#h-min', '#f-min'].forEach((s) => ($(s).innerHTML = budgetOptions('min')));
    ['#h-max', '#f-max'].forEach((s) => ($(s).innerHTML = budgetOptions('max')));
    $('#h-type').innerHTML = `
      <option value="all">Any type</option>
      <option value="house">House</option>
      <option value="apartment">Apartment</option>
      <option value="villa">Villa</option>
      <option value="penthouse">Penthouse</option>
      <option value="investment">Investment property</option>`;

    const places = new Set();
    PROPERTIES.forEach((p) => {
      const parts = p.area.split(', ');
      places.add(parts.slice(-2).join(', '));
      places.add(parts[0]);
    });
    $('#location-list').innerHTML = Array.from(places).sort().map((v) => `<option value="${v}"></option>`).join('');

    const listingOptions = PROPERTIES.map((p) => `<option value="${p.id}">${p.name} (${statusLabel(p.status)})</option>`).join('');
    $('#i-property').innerHTML = `
      <option value="">Select a property</option>
      <optgroup label="Listings">${listingOptions}</optgroup>
      <optgroup label="Something else">
        <option value="general">General question</option>
        <option value="list-my-property">I would like to list my own property</option>
      </optgroup>`;
  }

  function setValue(el, value) {
    if (el.value !== value) el.value = value;
  }

  function syncControls() {
    $$('[data-chip="status"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === state.status)));
    $$('[data-chip="type"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === state.type)));
    $('#chip-fav').setAttribute('aria-pressed', String(state.favoritesOnly));
    setValue($('#f-location'), state.location);
    setValue($('#h-location'), state.location);
    setValue($('#f-min'), String(state.min));
    setValue($('#h-min'), String(state.min));
    setValue($('#f-max'), String(state.max));
    setValue($('#h-max'), String(state.max));
    setValue($('#h-type'), state.type);
    setValue($('#f-sort'), state.sort);
  }

  function applyPreset(preset = {}) {
    state = { ...DEFAULTS, sort: state.sort, ...preset };
    refresh();
  }

  /* ----------------------------------------------------------------------
     5. FAVORITES AND COMPARISON
     ---------------------------------------------------------------------- */
  function updateFavCounts() {
    const n = favorites.size;
    const badge = $('#fav-count');
    badge.textContent = n;
    badge.hidden = n === 0;
    $('#fav-chip-count').textContent = n;
    $('#fav-nav-btn').setAttribute('aria-label', n === 0 ? 'View favorites, none saved yet' : `View favorites, ${n} saved`);
  }

  function syncFavorite(id, animate) {
    const on = favorites.has(id);
    $$(`[data-fav="${id}"]`).forEach((btn) => {
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
      if (animate && on) {
        btn.classList.remove('pop');
        void btn.offsetWidth;
        btn.classList.add('pop');
      }
    });
    updateFavCounts();
  }

  function toggleFavorite(id) {
    const p = byId(id);
    if (!p) return;
    if (favorites.has(id)) {
      favorites.delete(id);
      toast(`Removed ${p.name} from your favorites.`, 'info');
    } else {
      favorites.add(id);
      toast(`Saved ${p.name} to your favorites.`);
    }
    saveFavorites();
    syncFavorite(id, true);
    if (state.favoritesOnly) refresh();
  }

  function showFavorites() {
    if (favorites.size === 0) {
      toast('You have not saved any properties yet. Tap the heart on a listing to add one.', 'info');
      scrollToId('listings');
      return;
    }
    state = { ...DEFAULTS, sort: state.sort, favoritesOnly: true };
    refresh();
    scrollToId('listings');
  }

  function toggleCompare(id) {
    const p = byId(id);
    if (!p) return;
    if (compare.includes(id)) {
      compare = compare.filter((x) => x !== id);
    } else if (compare.length >= MAX_COMPARE) {
      toast(`You can compare up to ${MAX_COMPARE} properties. Remove one to add another.`, 'info');
      const tray = $('#compare-tray');
      tray.classList.remove('shake');
      void tray.offsetWidth;
      tray.classList.add('shake');
      return;
    } else {
      compare.push(id);
    }
    syncCompareUI();
  }

  function syncCompareUI() {
    const full = compare.length >= MAX_COMPARE;
    $$('[data-compare]').forEach((btn) => {
      const on = compare.includes(btn.dataset.compare);
      btn.classList.toggle('is-active', on);
      btn.classList.toggle('is-blocked', full && !on);
      btn.setAttribute('aria-pressed', String(on));
    });
    renderTray();
  }

  function renderTray() {
    const n = compare.length;
    const tray = $('#compare-tray');
    tray.classList.toggle('is-visible', n > 0);
    $('#tray-slots').innerHTML = [0, 1, 2].map((i) => {
      const p = byId(compare[i]);
      if (!p) return `<li class="slot" aria-hidden="true"><span>${i + 1}</span></li>`;
      return `<li class="slot is-filled has-img">
        <img class="fx-img" src="${photo(p.photo, 200)}" alt="${p.name}" width="200" height="150">
        <button type="button" data-compare-remove="${p.id}" aria-label="Remove ${p.name} from comparison">${icon('x', 14)}</button>
      </li>`;
    }).join('');

    let text = `${n} of ${MAX_COMPARE} selected`;
    if (n === 1) text = '1 of 3 selected. Add at least one more to compare.';
    if (n === MAX_COMPARE) text = 'Limit reached: you can compare up to 3 properties. Remove one to add another.';
    $('#tray-text').textContent = text;
    $('#tray-open').disabled = n < 2;

    const offset = n > 0 ? tray.offsetHeight : 0;
    document.documentElement.style.setProperty('--tray-offset', `${offset}px`);
    document.body.classList.toggle('has-tray', n > 0);
  }

  function renderCompareModal() {
    const items = compare.map(byId);
    if (items.length === 0) {
      closeOverlay();
      return;
    }
    $('#compare-sub').textContent = items.length < 2
      ? 'Add one more property from the listings to compare side by side.'
      : 'Review your selected properties side by side. Remove any property to make room for another.';

    const rows = [
      ['Price', (p) => `<span class="cmp-price">${priceHTML(p)}</span>`],
      ['Location', (p) => p.area],
      ['Property type', (p) => p.kind],
      ['Status', (p) => statusLabel(p.status)],
      ['Bedrooms', (p) => p.beds],
      ['Bathrooms', (p) => p.baths],
      ['Area', (p) => `${num(p.sqft)} sq ft`],
      ['Amenities', (p) => `<ul class="cmp-amenities">${p.amenities.map((a) => `<li>${icon('check', 14)}<span>${a}</span></li>`).join('')}</ul>`]
    ];

    $('#compare-wrap').innerHTML = `
      <table class="cmp-table" style="--n:${items.length}">
        <caption class="sr-only">Side-by-side comparison of selected properties</caption>
        <thead>
          <tr>
            <td class="cmp-corner"></td>
            ${items.map((p) => `
              <th scope="col" class="cmp-head">
                <div class="cmp-photo has-img"><img class="fx-img" src="${photo(p.photo, 500)}" alt="${altText(p)}" width="500" height="375"></div>
                <span class="cmp-name">${p.name}</span>
                <span class="cmp-actions">
                  <button type="button" class="link-btn" data-open="${p.id}">View details</button>
                  <button type="button" class="link-btn link-btn--muted" data-compare-remove="${p.id}">Remove</button>
                </span>
              </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(([label, fn]) => `<tr><th scope="row">${label}</th>${items.map((p) => `<td>${fn(p)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>`;
  }

  function openCompare(trigger) {
    if (compare.length < 2) {
      toast('Select at least two properties with the Compare buttons to open the comparison.', 'info');
      scrollToId('listings');
      return;
    }
    renderCompareModal();
    openOverlay($('#compare-overlay'), trigger);
  }

  /* ----------------------------------------------------------------------
     6. TOASTS, SCROLLING AND SCROLL LOCK
     ---------------------------------------------------------------------- */
  function toast(message, kind = 'ok') {
    const region = $('#toast-region');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `${icon(kind === 'info' ? 'info' : 'check', 18)}<span></span>`;
    el.lastElementChild.textContent = message;
    region.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-in'));
    setTimeout(() => {
      el.classList.remove('is-in');
      setTimeout(() => el.remove(), 350);
    }, 3800);
    while (region.children.length > 3) region.firstElementChild.remove();
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }

  let lockCount = 0;
  function lockScroll() {
    if (lockCount++ === 0) {
      const bar = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.classList.add('is-locked');
      if (bar > 0) document.body.style.paddingRight = `${bar}px`;
    }
  }
  function unlockScroll() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.documentElement.classList.remove('is-locked');
      document.body.style.paddingRight = '';
    }
  }

  /* ----------------------------------------------------------------------
     7. OVERLAYS AND MOBILE MENU
     ---------------------------------------------------------------------- */
  let activeOverlay = null;
  let lastFocused = null;

  function openOverlay(el, trigger) {
    if (activeOverlay && activeOverlay !== el) closeOverlay(true);
    if (activeOverlay === el) return;
    clearTimeout(el._hideTimer);
    lastFocused = trigger || document.activeElement;
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('is-open');
    lockScroll();
    activeOverlay = el;
    $('.modal-scroll', el).scrollTop = 0;
    $('.modal-close', el).focus({ preventScroll: true });
  }

  function closeOverlay(immediate = false) {
    const el = activeOverlay;
    if (!el) return;
    activeOverlay = null;
    el.classList.remove('is-open');
    unlockScroll();
    if (immediate || reduceMotion.matches) {
      el.hidden = true;
    } else {
      el._hideTimer = setTimeout(() => { el.hidden = true; }, 300);
    }
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus({ preventScroll: true });
  }

  function trapFocus(e) {
    const modal = $('.modal', activeOverlay);     const focusable = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', modal)
      .filter((el) => el.offsetParent !== null);
    if (focusable.length === 0) {
      e.preventDefault();
      modal.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === modal)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function detailHTML(p) {
    const fav = favorites.has(p.id);
    const cmp = compare.includes(p.id);
    return `
      <div class="detail-meta">
        <span class="badge badge--${p.status}">${statusLabel(p.status)}</span>
        ${p.featured ? '<span class="badge badge--featured">Featured</span>' : ''}
        <span class="detail-kind">${p.kind}</span>
      </div>
      <h2 class="detail-title" id="detail-title">${p.name}</h2>
      <p class="card-location">${icon('pin', 16)}<span>${p.area}</span></p>
      <p class="detail-price">${priceHTML(p)}</p>
      <dl class="detail-specs">
        <div>${icon('bed', 22)}<dt>Bedrooms</dt><dd>${p.beds}</dd></div>
        <div>${icon('bath', 22)}<dt>Bathrooms</dt><dd>${p.baths}</dd></div>
        <div>${icon('area', 22)}<dt>Area</dt><dd>${num(p.sqft)} sq ft</dd></div>
      </dl>
      <h3 class="detail-sub">About this property</h3>
      <p class="detail-text">${p.description}</p>
      <h3 class="detail-sub">Key amenities</h3>
      <ul class="amenity-list">${p.amenities.map((a) => `<li>${icon('check', 16)}<span>${a}</span></li>`).join('')}</ul>
      <dl class="detail-status">
        <div><dt>Status</dt><dd>${statusLabel(p.status)}${p.status === 'rent' ? ', 12-month lease' : ''}</dd></div>
        <div><dt>Listed</dt><dd>${formatDate(p.listed)}</dd></div>
      </dl>
      <div class="detail-actions">
        <button type="button" class="btn btn--primary" data-contact="${p.id}">Contact Agent</button>
        <button type="button" class="btn btn--ghost btn--toggle${fav ? ' is-active' : ''}" data-fav="${p.id}" aria-pressed="${fav}">${icon('heart', 18)}Favorite</button>
        <button type="button" class="btn btn--ghost btn--toggle${cmp ? ' is-active' : ''}" data-compare="${p.id}" aria-pressed="${cmp}">${icon('compare', 18)}Compare</button>
      </div>
      <p class="fine-print">Sample listing for a frontend demo. Agent contact is simulated.</p>`;
  }

  function openDetail(id, trigger) {
    const p = byId(id);
    if (!p) return;
    const media = $('#detail-media');
    media.classList.remove('img-failed');
    media.innerHTML = `<img class="fx-img"
      src="${photo(p.photo, 1000)}"
      srcset="${photoSrcset(p.photo, [500, 800, 1200])}"
      sizes="(max-width: 768px) 100vw, 50vw"
      alt="${altText(p)}"
      width="1200" height="900"
      decoding="async">`;
    $('#detail-body').innerHTML = detailHTML(p);
    syncCompareUI();
    openOverlay($('#detail-overlay'), trigger);
  }

  function contactAgent(id) {
    closeOverlay(true);
    selectInquiryProperty(id);
    scrollToId('contact');
    setTimeout(() => $('#i-name').focus({ preventScroll: true }), 80);
    toast(`${byId(id).name} is selected in the inquiry form.`);
  }

  const menuBtn = $('#menu-toggle');
  const nav = $('#primary-nav');
  let menuOpen = false;

  function setMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    open ? lockScroll() : unlockScroll();
  }

  /* ----------------------------------------------------------------------
     8. INQUIRY FORM
     ---------------------------------------------------------------------- */
  const form = $('#inquiry-form');
  const fields = { name: $('#i-name'), email: $('#i-email'), phone: $('#i-phone'), property: $('#i-property'), message: $('#i-message') };
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Enter your full name (at least 2 characters).'),
    email: (v) => {
      if (!v.trim()) return 'Enter your email address.';
      return EMAIL_RE.test(v.trim()) ? '' : 'Enter a valid email address, like name@example.com.';
    },
    phone: (v) => {
      if (!v.trim()) return '';
      const digits = v.replace(/\D/g, '');
      return /^[+()\d\s.-]+$/.test(v) && digits.length >= 7 && digits.length <= 15 ? '' : 'Enter a valid phone number, or leave this field empty.';
    },
    property: (v) => (v ? '' : 'Choose the property you are asking about.'),
    message: (v) => (v.trim().length >= 10 ? '' : 'Tell us a little more: write at least 10 characters.')
  };

  function setError(key, message) {
    const field = fields[key];
    const err = $(`#err-${key}`);
    err.textContent = message;
    err.hidden = !message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    field.closest('.form-field').classList.toggle('has-error', Boolean(message));
  }

  function validateField(key) {
    const message = rules[key](fields[key].value);
    setError(key, message);
    return !message;
  }

  function selectInquiryProperty(value) {
    fields.property.value = value;
    setError('property', '');
  }

  function initForm() {
    Object.keys(fields).forEach((key) => {
      fields[key].addEventListener('blur', () => {
        if (fields[key].value.trim() !== '') validateField(key);
      });
      const live = () => {
        if (fields[key].closest('.form-field').classList.contains('has-error')) validateField(key);
      };
      fields[key].addEventListener('input', live);
      fields[key].addEventListener('change', live);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;
      Object.keys(fields).forEach((key) => {
        if (!validateField(key) && !firstInvalid) firstInvalid = fields[key];
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const btn = $('#form-submit');
      const label = $('.btn-label', btn);
      btn.disabled = true;
      btn.classList.add('is-loading');
      label.textContent = 'Submitting...';

      setTimeout(() => {
        const first = fields.name.value.trim().split(/\s+/)[0];
        const choice = fields.property.selectedOptions[0].textContent;
        $('#success-text').textContent =
          `Thank you, ${first}. In a live product, your inquiry about "${choice}" would now reach an agent. This is a frontend demo, so nothing was sent or saved.`;
        form.hidden = true;
        const success = $('#form-success');
        success.hidden = false;
        success.focus({ preventScroll: true });
        btn.disabled = false;
        btn.classList.remove('is-loading');
        label.textContent = 'Submit inquiry';
      }, 700);
    });

    $('#success-reset').addEventListener('click', () => {
      form.reset();
      Object.keys(fields).forEach((key) => setError(key, ''));
      $('#form-success').hidden = true;
      form.hidden = false;
      fields.name.focus();
    });
  }

  /* ----------------------------------------------------------------------
     9. TESTIMONIALS AND PAGE EFFECTS
     ---------------------------------------------------------------------- */
  function initTestimonials() {
    const track = $('#t-track');
    const slides = $$('.t-slide', track);
    const dotsWrap = $('#t-dots');
    let index = 0;

    dotsWrap.innerHTML = slides.map((_, i) => `<button type="button" class="t-dot" data-dot="${i}" aria-label="Show testimonial ${i + 1}"></button>`).join('');
    const dots = $$('.t-dot', dotsWrap);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${-100 * index}%)`;
      slides.forEach((s, k) => {
        s.setAttribute('aria-hidden', String(k !== index));
        s.inert = k !== index;
      });
      dots.forEach((d, k) => {
        d.classList.toggle('is-active', k === index);
        if (k === index) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      $('#t-status').textContent = `Testimonial ${index + 1} of ${slides.length}`;
    }

    $('#t-prev').addEventListener('click', () => goTo(index - 1));
    $('#t-next').addEventListener('click', () => goTo(index + 1));
    dotsWrap.addEventListener('click', (e) => {
      const dot = e.target.closest('[data-dot]');
      if (dot) goTo(Number(dot.dataset.dot));
    });

    const region = $('#t-region');
    region.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    let startX = null;
    region.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    region.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 48) goTo(dx < 0 ? index + 1 : index - 1);
      startX = null;
    }, { passive: true });

    goTo(0);
  }

  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    items.forEach((el) => io.observe(el));
  }

  function updateNav() {
    $$('#primary-nav a').forEach((a) => {
      let active = false;
      if (a.dataset.section) active = a.dataset.section === currentSection;
      if (a.dataset.navStatus) active = currentSection === 'listings' && state.status === a.dataset.navStatus;
      if (a.dataset.section === 'home') active = currentSection === 'home';
      if (active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  function initNavObserver() {
    if (!('IntersectionObserver' in window)) return;
    const ids = ['home', 'listings', 'featured', 'about', 'services', 'contact'];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          currentSection = entry.target.id;
          updateNav();
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     10. EVENT WIRING AND MOTION
     ---------------------------------------------------------------------- */
  function bindControls() {
    $$('[data-chip]').forEach((chip) => {
      chip.addEventListener('click', () => {
        state[chip.dataset.chip] = chip.dataset.value;
        refresh();
      });
    });

    $('#chip-fav').addEventListener('click', () => {
      state.favoritesOnly = !state.favoritesOnly;
      refresh();
    });

    $('#f-location').addEventListener('input', debounce((e) => {
      state.location = e.target.value;
      refresh();
    }, 180));
    $('#f-min').addEventListener('change', (e) => { state.min = Number(e.target.value); fixBudget(); refresh(); });
    $('#f-max').addEventListener('change', (e) => { state.max = Number(e.target.value); fixBudget(); refresh(); });
    $('#f-sort').addEventListener('change', (e) => { state.sort = e.target.value; refresh(); });

    $('#filter-toggle').addEventListener('click', (e) => {
      const open = e.currentTarget.getAttribute('aria-expanded') !== 'true';
      e.currentTarget.setAttribute('aria-expanded', String(open));
      $('#filter-extra').classList.toggle('is-open', open);
    });

    const reset = () => applyPreset();
    $('#reset-filters').addEventListener('click', reset);
    $('#empty-reset').addEventListener('click', reset);

    $('#hero-search').addEventListener('submit', (e) => {
      e.preventDefault();
      state = {
        ...DEFAULTS,
        sort: state.sort,
        location: $('#h-location').value.trim(),
        type: $('#h-type').value,
        min: Number($('#h-min').value),
        max: Number($('#h-max').value)
      };
      fixBudget();
      refresh();
      scrollToId('listings');
    });

    $('#tray-open').addEventListener('click', (e) => openCompare(e.currentTarget));
    $('#tray-clear').addEventListener('click', () => { compare = []; syncCompareUI(); });
  }

  function bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      const t = e.target;

      const fav = t.closest('[data-fav]');
      if (fav) { toggleFavorite(fav.dataset.fav); return; }

      const cmp = t.closest('[data-compare]');
      if (cmp) { toggleCompare(cmp.dataset.compare); return; }

      const removeBtn = t.closest('[data-compare-remove]');
      if (removeBtn) {
        compare = compare.filter((id) => id !== removeBtn.dataset.compareRemove);
        syncCompareUI();
        if (activeOverlay && activeOverlay.id === 'compare-overlay') renderCompareModal();
        return;
      }

      const open = t.closest('[data-open]');
      if (open) { openDetail(open.dataset.open, open); return; }

      const contact = t.closest('[data-contact]');
      if (contact) { contactAgent(contact.dataset.contact); return; }

      if (t.closest('[data-close]')) { closeOverlay(); return; }

      const browse = t.closest('[data-browse]');
      if (browse) {
        applyPreset(browse.dataset.status ? { status: browse.dataset.status } : {});
        setMenu(false);
        return;
      }

      const listProp = t.closest('[data-list-property]');
      if (listProp) {
        selectInquiryProperty('list-my-property');
        setMenu(false);
        return;
      }

      const action = t.closest('[data-action]');
      if (action) {
        const type = action.dataset.action;
        if (type === 'show-favorites') { e.preventDefault(); setMenu(false); showFavorites(); }
        if (type === 'open-compare') { e.preventDefault(); openCompare(action); }
        if (type === 'social') toast(`${action.dataset.network} profiles are not active in this demo.`, 'info');
        return;
      }

      if (t.closest('#primary-nav a')) setMenu(false);
    });

    $$('.overlay').forEach((overlay) => {
      let downOnBackdrop = false;
      overlay.addEventListener('pointerdown', (e) => { downOnBackdrop = e.target === overlay; });
      overlay.addEventListener('click', (e) => {
        if (downOnBackdrop && e.target === overlay) closeOverlay();
        downOnBackdrop = false;
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (activeOverlay) closeOverlay();
        else if (menuOpen) { setMenu(false); menuBtn.focus(); }
      }
      if (e.key === 'Tab' && activeOverlay) trapFocus(e);
    });

    menuBtn.addEventListener('click', () => setMenu(!menuOpen));
    window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

    const header = $('#site-header');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        ticking = false;
      });
    }, { passive: true });

    document.addEventListener('error', (e) => {
      const img = e.target;
      if (img && img.tagName === 'IMG' && img.classList.contains('fx-img')) {
        const wrap = img.closest('.has-img');
        if (wrap) wrap.classList.add('img-failed');
      }
    }, true);

    window.addEventListener('resize', () => { if (compare.length) renderTray(); });
  }

  function initLuxuryMotion() {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer || reduceMotion.matches) return;

    let rafId = null;
    let targetCard = null;
    let clientX = 0;
    let clientY = 0;

    const updateSpotlight = () => {
      rafId = null;
      if (!targetCard) return;
      const rect = targetCard.getBoundingClientRect();
      targetCard.style.setProperty('--pointer-x', `${clientX - rect.left}px`);
      targetCard.style.setProperty('--pointer-y', `${clientY - rect.top}px`);
    };

    grid.addEventListener('pointermove', (event) => {
      const card = event.target.closest('.card');
      if (!card) {
        targetCard = null;
        return;
      }
      targetCard = card;
      clientX = event.clientX;
      clientY = event.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(updateSpotlight);
      }
    }, { passive: true });

    grid.addEventListener('pointerleave', () => {
      targetCard = null;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------------------
     INIT
     ---------------------------------------------------------------------- */
  function init() {
    buildOptions();
    hydrateIcons();
    hydrateStars();
    renderFeatured();
    initForm();
    initTestimonials();
    bindControls();
    bindGlobalEvents();

    syncControls();
    renderCounter();
    renderGrid();
    updateFavCounts();
    initReveal();
    initLuxuryMotion();
    initNavObserver();
    updateNav();

    $$('img.fx-img').forEach((img) => {
      if (img.complete && img.naturalWidth === 0) img.closest('.has-img')?.classList.add('img-failed');
    });
  }

  init();
})();