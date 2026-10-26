// CricMatch Pro - Main Application Logic
// Handles SPA routing, screen switching, reactive state, modals, filters, and scoring

(function () {
  'use strict';

  // Navigation History Stack
  const navHistory = ['hub'];
  let currentScreen = 'hub';
  let currentSpotlightIndex = 0;
  let activeRoleFilter = 'all';
  let currentSort = 'performance';
  let searchQuery = '';
  let activeTournamentFilter = 'all';
  let activeDetailsTab = 'overview';
  let isBookmarked = false;

  // DOM Elements cache
  const elements = {};

  function initElements() {
    elements.viewport = document.getElementById('app-viewport');
    elements.screens = {
      hub: document.getElementById('screen-hub'),
      details: document.getElementById('screen-details'),
      register: document.getElementById('screen-register'),
      roster: document.getElementById('screen-roster'),
      matches: document.getElementById('screen-matches'),
      venues: document.getElementById('screen-venues')
    };

    elements.navTabs = document.querySelectorAll('.bottom-nav-tab');
    elements.phoneTime = document.getElementById('phone-time');
    elements.toastContainer = document.getElementById('toast-container');
    
    // Modals
    elements.playerModal = document.getElementById('modal-player-detail');
    elements.addPlayerModal = document.getElementById('modal-add-player');
    elements.createTourneyModal = document.getElementById('modal-create-tournament');
    elements.ticketModal = document.getElementById('modal-team-pass');
    elements.notificationsModal = document.getElementById('modal-notifications');
  }

  // --- Clock updater for phone status bar ---
  function initClock() {
    function updateClock() {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      if (elements.phoneTime) {
        elements.phoneTime.textContent = `${hours}:${minutes}`;
      }
    }
    updateClock();
    setInterval(updateClock, 30000);
  }

  // --- Toast System ---
  function showToast(message, icon = 'check_circle', duration = 3200) {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-secondary-container" data-icon="${icon}">${icon}</span>
      <span class="flex-1 font-medium">${message}</span>
      <button class="text-outline hover:text-white" onclick="this.parentElement.remove()">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    `;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- SPA Screen Router ---
  function navigateTo(screenId, params = {}) {
    if (!elements.screens[screenId]) return;

    // Save previous in stack
    if (currentScreen !== screenId) {
      navHistory.push(screenId);
    }
    currentScreen = screenId;

    // Toggle active screen classes
    Object.keys(elements.screens).forEach((key) => {
      if (elements.screens[key]) {
        elements.screens[key].classList.toggle('active', key === screenId);
      }
    });

    // Reset scroll position
    if (elements.viewport) {
      elements.viewport.scrollTop = 0;
    }

    // Update bottom nav bar highlight
    updateBottomNavState(screenId);

    // Contextual screen actions
    if (screenId === 'details' && params.tournamentId) {
      loadTournamentDetails(params.tournamentId);
    }
    if (screenId === 'register' && params.tournamentId) {
      loadRegistrationPreview(params.tournamentId);
    }

    // Smooth transition trigger
    window.dispatchEvent(new CustomEvent('screenchange', { detail: { screen: screenId } }));
  }

  function goBack() {
    if (navHistory.length > 1) {
      navHistory.pop(); // Current
      const prevScreen = navHistory[navHistory.length - 1];
      navigateTo(prevScreen);
    } else {
      navigateTo('hub');
    }
  }

  function updateBottomNavState(screenId) {
    let activeTabKey = 'tournaments';
    if (screenId === 'hub' || screenId === 'details' || screenId === 'register') {
      activeTabKey = 'tournaments';
    } else if (screenId === 'matches') {
      activeTabKey = 'matches';
    } else if (screenId === 'roster') {
      activeTabKey = 'teams';
    } else if (screenId === 'venues') {
      activeTabKey = 'venues';
    }

    elements.navTabs.forEach((tab) => {
      const tabTarget = tab.getAttribute('data-tab');
      if (tabTarget === activeTabKey) {
        tab.className =
          'bottom-nav-tab flex flex-col items-center justify-center bg-primary-container text-on-primary rounded-xl px-3 py-1 shadow-sm transition-transform duration-100 active:scale-95';
        const icon = tab.querySelector('.material-symbols-outlined');
        const label = tab.querySelector('span:not(.material-symbols-outlined)');
        if (icon) icon.className = 'material-symbols-outlined text-[22px] text-white';
        if (label) label.className = 'text-label-sm font-label-sm text-white font-bold mt-0.5';
      } else {
        tab.className =
          'bottom-nav-tab flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:bg-surface-container-low transition-colors duration-150 active:scale-95';
        const icon = tab.querySelector('.material-symbols-outlined');
        const label = tab.querySelector('span:not(.material-symbols-outlined)');
        if (icon) icon.className = 'material-symbols-outlined text-[22px] text-on-surface-variant';
        if (label) label.className = 'text-label-sm font-label-sm mt-0.5';
      }
    });
  }

  // --- Spotlight Carousel Controller ---
  function updateSpotlightSlide(index) {
    const tourneys = window.CricData.spotlightTournaments;
    if (!tourneys || !tourneys.length) return;
    currentSpotlightIndex = (index + tourneys.length) % tourneys.length;
    const tourney = tourneys[currentSpotlightIndex];

    const container = document.getElementById('spotlight-banner-content');
    const counter = document.getElementById('spotlight-counter');
    if (counter) counter.textContent = `${currentSpotlightIndex + 1} / ${tourneys.length}`;

    if (!container) return;
    const progressPercent = Math.round((tourney.registeredTeams / tourney.totalTeams) * 100);

    container.innerHTML = `
      <!-- Card Top Bar -->
      <div class="relative z-10 flex items-center justify-between mb-3">
        <div class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-label-sm font-label-sm shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-on-secondary-fixed animate-ping"></span>
          <span class="font-extrabold uppercase">${tourney.badge}</span>
        </div>
        <div class="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-secondary-fixed text-label-sm font-label-sm">
          <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">trophy</span>
          <span>${tourney.tag}</span>
        </div>
      </div>
      <!-- Tournament Title -->
      <div class="relative z-10 mb-4">
        <h3 class="text-headline-md font-headline-md text-white tracking-tight leading-snug">${tourney.title}</h3>
        <p class="text-body-sm font-body-sm text-primary-fixed flex items-center space-x-1 mt-0.5">
          <span class="material-symbols-outlined text-[14px]">location_on</span>
          <span>${tourney.venueName} • ${tourney.dates}</span>
        </p>
      </div>
      <!-- Metrics Grid -->
      <div class="relative z-10 grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 mb-4">
        <div>
          <span class="text-label-sm font-label-sm text-surface-container-high block">Prize Pool</span>
          <span class="text-headline-sm font-headline-sm text-secondary-fixed-dim font-bold">${tourney.prizePool}</span>
        </div>
        <div>
          <div class="flex justify-between items-center">
            <span class="text-label-sm font-label-sm text-surface-container-high">Teams Registered</span>
            <span class="text-label-sm font-label-sm text-primary-fixed font-bold">${tourney.registeredTeams}/${tourney.totalTeams}</span>
          </div>
          <div class="w-full bg-white/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div class="bg-secondary-container h-full rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
          </div>
        </div>
      </div>
      <!-- CTA & Status Footer -->
      <div class="relative z-10 flex items-center justify-between pt-1">
        <div class="text-label-sm font-label-sm text-white/80 flex items-center space-x-1">
          <span class="material-symbols-outlined text-[14px]">timer</span>
          <span>${tourney.slotsRemaining} spots remaining</span>
        </div>
        <button class="px-4 py-2 rounded-lg bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-label-md font-label-md transition-all shadow-md active:scale-95 flex items-center space-x-1 font-bold" onclick="window.CricApp.navigateTo('details', { tournamentId: '${tourney.id}' })">
          <span>View Details</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    `;
  }

  // --- Tournament List Rendering & Filter ---
  function renderTournamentsList() {
    const listContainer = document.getElementById('tournaments-list-container');
    if (!listContainer) return;

    let items = window.CricData.tournaments;

    // Filter by tab
    if (activeTournamentFilter === 'upcoming') {
      items = items.filter((t) => t.status === 'upcoming');
    } else if (activeTournamentFilter === 'live') {
      items = items.filter((t) => t.status === 'live');
    } else if (activeTournamentFilter === 'completed') {
      items = items.filter((t) => t.status === 'completed');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.venue.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    const countHeader = document.getElementById('tournaments-count-header');
    if (countHeader) countHeader.textContent = `See All (${items.length})`;

    if (items.length === 0) {
      listContainer.innerHTML = `
        <div class="p-8 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/50">
          <span class="material-symbols-outlined text-4xl text-outline mb-2">sports_cricket</span>
          <p class="font-headline-sm text-on-surface">No tournaments found</p>
          <p class="text-body-sm text-on-surface-variant mt-1">Try refining your search keyword or selecting a different filter.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = items
      .map(
        (tourney) => `
      <article class="bg-surface-container-lowest rounded-xl border border-outline-variant/70 p-space-md turf-card-shadow relative overflow-hidden transition-all hover:border-primary-container/40">
        <!-- Active Left Border Accent -->
        <div class="absolute left-0 top-0 bottom-0 w-1.5 ${tourney.borderAccent || 'bg-primary'}"></div>
        <!-- Header -->
        <div class="flex items-start justify-between gap-2 mb-2 pl-1">
          <div>
            <span class="inline-block px-2 py-0.5 rounded ${tourney.categoryColor} text-label-sm font-label-sm font-bold uppercase mb-1">
              ${tourney.category}
            </span>
            <h3 class="text-headline-sm font-headline-sm text-on-surface leading-snug cursor-pointer hover:text-primary transition-colors" onclick="window.CricApp.navigateTo('details', { tournamentId: '${tourney.id}' })">
              ${tourney.name}
            </h3>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="text-label-sm font-label-sm text-outline uppercase block">Entry Fee</span>
            <span class="text-headline-sm font-headline-sm text-primary font-bold">${tourney.entryFee}<span class="text-body-sm font-body-sm text-outline font-normal">/team</span></span>
          </div>
        </div>
        <!-- Venue Location Tag -->
        <div class="flex items-center text-body-sm font-body-sm text-on-surface-variant mb-3 pl-1">
          <span class="material-symbols-outlined text-[16px] text-outline mr-1">stadium</span>
          <span class="truncate">${tourney.venue}</span>
        </div>
        <!-- Key Dates & Info Banner -->
        <div class="grid grid-cols-2 gap-2 bg-surface-container-low/70 rounded-lg p-2.5 mb-4 text-body-sm font-body-sm pl-2">
          <div>
            <span class="text-label-sm font-label-sm text-outline uppercase block">Tournament Starts</span>
            <span class="font-headline-sm text-body-md text-on-surface font-semibold flex items-center gap-1 mt-0.5">
              <span class="material-symbols-outlined text-[15px] text-primary">calendar_month</span>
              ${tourney.startDate}
            </span>
          </div>
          <div>
            <span class="text-label-sm font-label-sm ${tourney.isDeadlineUrgent ? 'text-error' : 'text-outline'} uppercase block">Reg. Deadline</span>
            <span class="font-headline-sm text-body-md ${tourney.isDeadlineUrgent ? 'text-error' : 'text-on-surface'} font-semibold flex items-center gap-1 mt-0.5">
              <span class="material-symbols-outlined text-[15px] ${tourney.isDeadlineUrgent ? 'text-error' : 'text-outline'}">${tourney.isDeadlineUrgent ? 'alarm' : 'event'}</span>
              ${tourney.deadline}
            </span>
          </div>
        </div>
        <!-- Footer Actions -->
        <div class="flex items-center justify-between pt-2 border-t border-surface-variant pl-1">
          <div class="flex items-center space-x-1.5 text-body-sm font-body-sm text-on-surface-variant">
            <span class="material-symbols-outlined text-[16px] text-primary">groups</span>
            <span>${tourney.registered} of ${tourney.maxTeams} Registered</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1.5 rounded-lg border border-primary-container/40 text-primary font-bold hover:bg-surface-container text-label-md font-label-md transition-colors" onclick="window.CricApp.navigateTo('details', { tournamentId: '${tourney.id}' })">
              Details
            </button>
            <button class="px-3.5 py-1.5 rounded-lg bg-primary-container text-white text-label-md font-label-md hover:bg-primary transition-colors active:scale-95 shadow-sm flex items-center space-x-1" onclick="window.CricApp.navigateTo('register', { tournamentId: '${tourney.id}' })">
              <span>Register</span>
              <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </article>
    `
      )
      .join('');
  }

  // --- Tournament Details Screen Logic ---
  function loadTournamentDetails(tourneyId) {
    const tourneys = window.CricData.tournaments;
    const tourney = tourneys.find((t) => t.id === tourneyId) || window.CricData.spotlightTournaments[0];

    const titleEl = document.getElementById('details-page-title');
    const heroTitleEl = document.getElementById('details-hero-title');
    const heroVenueEl = document.getElementById('details-hero-venue');
    const heroDatesEl = document.getElementById('details-hero-dates');
    const feeEl = document.getElementById('details-entry-fee');

    if (titleEl) titleEl.textContent = tourney.name || tourney.title;
    if (heroTitleEl) heroTitleEl.textContent = tourney.name || tourney.title;
    if (heroVenueEl) heroVenueEl.textContent = tourney.venue || tourney.venueName || 'National Cricket Arena';
    if (heroDatesEl) heroDatesEl.textContent = tourney.fullDates || `${tourney.startDate} - Complete`;
    if (feeEl) feeEl.textContent = tourney.entryFee;
  }

  function setDetailsTab(tabName) {
    activeDetailsTab = tabName;
    document.querySelectorAll('.details-nav-tab').forEach((btn) => {
      const match = btn.getAttribute('data-subtab') === tabName;
      if (match) {
        btn.className =
          'details-nav-tab px-4 py-2 rounded-lg font-label-lg text-label-lg whitespace-nowrap bg-primary-container text-on-primary shadow-sm transition-all duration-150';
      } else {
        btn.className =
          'details-nav-tab px-4 py-2 rounded-lg font-label-lg text-label-lg whitespace-nowrap text-on-surface-variant hover:bg-surface-container-low transition-colors duration-150';
      }
    });

    // Content panels
    const overviewPanel = document.getElementById('details-tab-overview');
    const fixturesPanel = document.getElementById('details-tab-fixtures');
    const teamsPanel = document.getElementById('details-tab-teams');
    const pointsPanel = document.getElementById('details-tab-points');
    const venuePanel = document.getElementById('details-tab-venue');

    if (overviewPanel) overviewPanel.style.display = tabName === 'overview' ? 'block' : 'none';
    if (fixturesPanel) fixturesPanel.style.display = tabName === 'fixtures' ? 'block' : 'none';
    if (teamsPanel) teamsPanel.style.display = tabName === 'teams' ? 'block' : 'none';
    if (pointsPanel) pointsPanel.style.display = tabName === 'points' ? 'block' : 'none';
    if (venuePanel) venuePanel.style.display = tabName === 'venue' ? 'block' : 'none';
  }

  // --- Team Registration Form Logic ---
  function loadRegistrationPreview(tourneyId) {
    const tourneys = window.CricData.tournaments;
    const tourney = tourneys.find((t) => t.id === tourneyId) || window.CricData.spotlightTournaments[0];

    const titleEl = document.getElementById('reg-preview-title');
    const feeEl = document.getElementById('reg-preview-fee');
    const deadlineEl = document.getElementById('reg-preview-deadline');
    const payNowAmount = document.getElementById('pay-now-amount');
    const payGroundAmount = document.getElementById('pay-ground-amount');

    if (titleEl) titleEl.textContent = tourney.name || tourney.title;
    if (feeEl) feeEl.textContent = tourney.entryFee;
    if (deadlineEl) deadlineEl.textContent = tourney.deadline || 'Oct 10';
    if (payNowAmount) payNowAmount.textContent = `${tourney.entryFee}.00`;
    if (payGroundAmount) payGroundAmount.textContent = `${tourney.entryFee}.00`;
  }

  function initRegistrationForm() {
    const slider = document.getElementById('squad-slider');
    const counter = document.getElementById('squad-count');
    const decBtn = document.getElementById('btn-decrement');
    const incBtn = document.getElementById('btn-increment');

    function updateSquad(val) {
      val = Math.max(11, Math.min(16, parseInt(val, 10)));
      if (slider) slider.value = val;
      if (counter) counter.textContent = val;
      if (decBtn) decBtn.disabled = val <= 11;
      if (incBtn) incBtn.disabled = val >= 16;
    }

    if (slider && counter && decBtn && incBtn) {
      slider.addEventListener('input', (e) => updateSquad(e.target.value));
      decBtn.addEventListener('click', () => updateSquad(parseInt(slider.value, 10) - 1));
      incBtn.addEventListener('click', () => updateSquad(parseInt(slider.value, 10) + 1));
    }

    // Radio selection toggle visual state
    const radioLabels = document.querySelectorAll('input[name="payment_mode"]');
    radioLabels.forEach((radio) => {
      radio.addEventListener('change', function () {
        radioLabels.forEach((r) => {
          const container = r.closest('label');
          const dot = container.querySelector('.radio-dot-indicator');
          if (r.checked) {
            container.className =
              'relative flex flex-col p-3.5 bg-surface-container-low border-2 border-primary-container rounded-xl cursor-pointer hover:bg-surface-bright transition-all';
            if (dot) {
              dot.className =
                'radio-dot-indicator w-4 h-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center';
              dot.innerHTML = '<span class="w-1.5 h-1.5 bg-white rounded-full"></span>';
            }
          } else {
            container.className =
              'relative flex flex-col p-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container-low transition-all';
            if (dot) {
              dot.className =
                'radio-dot-indicator w-4 h-4 rounded-full border-2 border-outline flex items-center justify-center';
              dot.innerHTML = '';
            }
          }
        });
      });
    });

    // Promo code button
    const promoBtn = document.getElementById('btn-apply-promo');
    const promoInput = document.getElementById('discount-code');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'PROMO2025' || code === 'CRIC25') {
          showToast('Coupon Applied! $25 Club Discount Deducted.', 'sell');
          const payNowAmount = document.getElementById('pay-now-amount');
          if (payNowAmount) payNowAmount.textContent = '$225.00';
          promoBtn.textContent = 'Applied';
          promoBtn.className = 'px-4 py-2 bg-primary text-white font-label-md text-label-md rounded-lg';
          promoBtn.disabled = true;
        } else if (code) {
          showToast('Invalid coupon code. Try PROMO2025', 'error');
        } else {
          showToast('Please enter a coupon code', 'info');
        }
      });
    }

    // Submit Registration form
    const regForm = document.getElementById('team-registration-form');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const teamName = document.getElementById('team-name').value.trim();
        const captainName = document.getElementById('captain-name').value.trim();
        const captainPhone = document.getElementById('captain-phone').value.trim();
        const captainEmail = document.getElementById('captain-email').value.trim();
        const category = document.getElementById('format-category').value;
        const squadSize = document.getElementById('squad-slider').value;

        if (!teamName || !captainName || !category) {
          showToast('Please fill all mandatory fields marked with *', 'error');
          return;
        }

        // Show registration digital ticket modal
        openTeamPassModal({
          teamName,
          captainName,
          captainPhone,
          captainEmail,
          category,
          squadSize,
          passId: `CP-${Math.floor(1000 + Math.random() * 9000)}-${teamName.substring(0, 2).toUpperCase()}`
        });

        showToast(`Registration Successful! Pass generated for ${teamName}`, 'verified');
      });
    }
  }

  // --- Team Pass Ticket Modal ---
  function openTeamPassModal(data) {
    const modal = elements.ticketModal;
    if (!modal) return;

    document.getElementById('ticket-team-name').textContent = data.teamName;
    document.getElementById('ticket-captain').textContent = data.captainName;
    document.getElementById('ticket-id').textContent = data.passId;
    document.getElementById('ticket-squad-size').textContent = `${data.squadSize} Players`;

    modal.classList.add('open');
  }

  function closeTeamPassModal() {
    if (elements.ticketModal) {
      elements.ticketModal.classList.remove('open');
    }
    navigateTo('roster');
  }

  // --- Players Roster Screen Logic ---
  function renderPlayersRoster() {
    const container = document.getElementById('roster-players-grid');
    if (!container) return;

    let players = [...window.CricData.teamProfile.players];

    // Filter by role
    if (activeRoleFilter !== 'all') {
      players = players.filter((p) => p.roleType === activeRoleFilter);
    }

    // Search query filter
    const searchInput = document.getElementById('player-search-input');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
      players = players.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.jerseyNo.includes(query) ||
          p.role.toLowerCase().includes(query) ||
          p.subRole.toLowerCase().includes(query)
      );
    }

    // Sort order
    if (currentSort === 'name') {
      players.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'runs') {
      players.sort((a, b) => (b.runs || 0) - (a.runs || 0));
    } else if (currentSort === 'wickets') {
      players.sort((a, b) => (b.wickets || 0) - (a.wickets || 0));
    } else if (currentSort === 'strike-rate') {
      players.sort((a, b) => (b.strikeRate || 0) - (a.strikeRate || 0));
    }

    // Render cards
    container.innerHTML = players
      .map((p) => {
        const isBowler = p.roleType === 'bowler';
        const isKeeper = p.roleType === 'wicket-keeper';
        const metric1 = 'Matches';
        const metric1Val = p.matches;
        const metric2 = isBowler ? 'Wickets' : isKeeper ? 'Dismissals' : 'Runs';
        const metric2Val = isBowler ? p.wickets : isKeeper ? p.dismissals : p.runs;
        const metric3 = isBowler ? 'Economy' : 'Average';
        const metric3Val = isBowler ? p.economy : p.average;

        const avatarImg = p.avatar
          ? `<img src="${p.avatar}" alt="${p.name}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
             <div class="w-full h-full bg-primary-container text-white font-bold items-center justify-center text-sm hidden">${p.name.substring(0, 2).toUpperCase()}</div>`
          : `<div class="w-full h-full bg-primary-container text-white font-bold flex items-center justify-center text-sm">${p.name.substring(0, 2).toUpperCase()}</div>`;

        return `
        <article class="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-space-md shadow-[0_2px_8px_-2px_rgba(19,93,56,0.08)] hover:shadow-md transition-all duration-200 relative group flex flex-col justify-between cursor-pointer" onclick="window.CricApp.openPlayerModal('${p.id}')">
          <div class="flex items-start justify-between gap-space-sm">
            <div class="flex items-center gap-space-sm">
              <!-- Circular Avatar -->
              <div class="relative shrink-0">
                <div class="w-14 h-14 rounded-full overflow-hidden bg-surface-container ring-2 ring-primary/20">
                  ${avatarImg}
                </div>
                <span class="absolute -bottom-1 -right-1 bg-surface-container-highest text-on-surface text-[10px] font-bold px-1.5 py-0.2 rounded border border-outline-variant">
                  #${p.jerseyNo}
                </span>
              </div>
              <div>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h4 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                    ${p.name}
                  </h4>
                </div>
                <!-- Role Badge -->
                <div class="mt-1 flex items-center gap-1.5">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm font-label-sm ${p.badgeBg || 'bg-surface-container text-primary'} border">
                    <span class="w-1.5 h-1.5 rounded-full ${p.dotBg || 'bg-primary'}"></span>
                    ${p.role}
                  </span>
                  <span class="text-body-sm text-outline text-xs">${p.subRole}</span>
                </div>
              </div>
            </div>
            <button aria-label="Player profile details" class="text-on-surface-variant hover:text-primary p-1" type="button">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <!-- Metric Highlight Bar -->
          <div class="mt-space-md pt-space-sm border-t border-surface-variant flex items-center justify-between text-center bg-surface-container-low/40 rounded-lg px-3 py-2">
            <div>
              <span class="block text-label-sm font-label-sm text-on-surface-variant uppercase">${metric1}</span>
              <span class="block font-headline-sm text-headline-sm text-on-surface">${metric1Val}</span>
            </div>
            <div class="w-px h-6 bg-outline-variant/60"></div>
            <div>
              <span class="block text-label-sm font-label-sm text-on-surface-variant uppercase">${metric2}</span>
              <span class="block font-headline-sm text-headline-sm text-primary font-bold">${metric2Val}</span>
            </div>
            <div class="w-px h-6 bg-outline-variant/60"></div>
            <div>
              <span class="block text-label-sm font-label-sm text-on-surface-variant uppercase">${metric3}</span>
              <span class="block font-headline-sm text-headline-sm text-on-surface">${metric3Val}</span>
            </div>
          </div>
        </article>
      `;
      })
      .join('');
  }

  // --- Player Detail Modal Bottom Sheet ---
  function openPlayerModal(playerId) {
    let player = null;
    if (playerId === 'captain') {
      player = window.CricData.teamProfile.captain;
    } else {
      player = window.CricData.teamProfile.players.find((p) => p.id === playerId);
    }
    if (!player) return;

    const modal = elements.playerModal;
    if (!modal) return;

    const avatarContainer = document.getElementById('sheet-player-avatar');
    if (avatarContainer) {
      if (player.avatar) {
        avatarContainer.innerHTML = `<img src="${player.avatar}" alt="${player.name}" class="w-full h-full object-cover" />`;
      } else {
        avatarContainer.innerHTML = `<div class="w-full h-full bg-primary-container text-white text-2xl font-bold flex items-center justify-center">${player.name.substring(0, 2).toUpperCase()}</div>`;
      }
    }

    document.getElementById('sheet-player-name').textContent = player.name;
    document.getElementById('sheet-player-jersey').textContent = `#${player.jerseyNo}`;
    document.getElementById('sheet-player-role').textContent = player.role;
    document.getElementById('sheet-player-style').textContent = player.subRole || player.style || 'Right-Handed Batsman';
    document.getElementById('sheet-stat-matches').textContent = player.matches || '0';
    document.getElementById('sheet-stat-runs').textContent = player.runs || '0';
    document.getElementById('sheet-stat-sr').textContent = player.strikeRate || '0.0';
    document.getElementById('sheet-stat-avg').textContent = player.average || '0.0';
    document.getElementById('sheet-stat-hs').textContent = player.highScore || '-';
    document.getElementById('sheet-stat-wickets').textContent = player.wickets || '0';
    document.getElementById('sheet-stat-econ').textContent = player.economy || '0.0';

    // Form badges
    const formContainer = document.getElementById('sheet-player-form');
    if (formContainer && player.recentForm) {
      formContainer.innerHTML = player.recentForm
        .map(
          (f) => `
        <span class="px-2.5 py-1 rounded-lg bg-surface-container font-headline-sm text-xs font-bold text-primary">${f}</span>
      `
        )
        .join('');
    }

    modal.classList.add('open');
  }

  function closePlayerModal() {
    if (elements.playerModal) {
      elements.playerModal.classList.remove('open');
    }
  }

  // --- Add Player Modal ---
  function initAddPlayerModal() {
    const form = document.getElementById('add-player-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('new-player-name').value.trim();
      const jerseyNo = document.getElementById('new-player-jersey').value.trim();
      const role = document.getElementById('new-player-role').value;
      const subRole = document.getElementById('new-player-subrole').value.trim();

      if (!name || !jerseyNo) {
        showToast('Please enter player name and jersey number', 'error');
        return;
      }

      const roleType = role.toLowerCase().includes('bowler')
        ? 'bowler'
        : role.toLowerCase().includes('round')
        ? 'all-rounder'
        : role.toLowerCase().includes('keeper')
        ? 'wicket-keeper'
        : 'batsman';

      const newPlayer = {
        id: `p-${Date.now()}`,
        name,
        jerseyNo,
        role,
        roleType,
        subRole: subRole || 'Right-Handed',
        matches: 0,
        runs: 0,
        average: 0.0,
        strikeRate: 0.0,
        wickets: 0,
        economy: 0.0,
        recentForm: ['-', '-', '-', '-', '-']
      };

      window.CricData.teamProfile.players.push(newPlayer);
      window.CricData.teamProfile.squadCount++;

      renderPlayersRoster();
      closeAddPlayerModal();
      form.reset();
      showToast(`${name} (#${jerseyNo}) added to Apex Strikers!`, 'person_add');
    });
  }

  function openAddPlayerModal() {
    if (elements.addPlayerModal) {
      elements.addPlayerModal.classList.add('open');
    }
  }

  function closeAddPlayerModal() {
    if (elements.addPlayerModal) {
      elements.addPlayerModal.classList.remove('open');
    }
  }

  // --- Create Tournament Modal ---
  function initCreateTournamentModal() {
    const form = document.getElementById('create-tournament-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('new-tourney-title').value.trim();
      const format = document.getElementById('new-tourney-format').value;
      const fee = document.getElementById('new-tourney-fee').value.trim();
      const venue = document.getElementById('new-tourney-venue').value.trim();
      const teams = document.getElementById('new-tourney-teams').value;

      if (!title || !fee || !venue) {
        showToast('Please fill all required tournament fields', 'error');
        return;
      }

      const newTourney = {
        id: `tourney-${Date.now()}`,
        name: title,
        category: format,
        categoryColor: 'bg-surface-container-low text-tertiary',
        borderAccent: 'bg-primary-container',
        entryFee: fee.startsWith('$') ? fee : `$${fee}`,
        venue: venue,
        startDate: 'Nov 25, 2025',
        deadline: 'Nov 15, 2025',
        isDeadlineUrgent: false,
        registered: 1,
        maxTeams: parseInt(teams, 10) || 16,
        status: 'upcoming',
        prizePool: '$10,000'
      };

      window.CricData.tournaments.unshift(newTourney);
      renderTournamentsList();
      closeCreateTourneyModal();
      form.reset();
      showToast(`Tournament "${title}" created successfully!`, 'emoji_events');
    });
  }

  function openCreateTourneyModal() {
    if (elements.createTourneyModal) {
      elements.createTourneyModal.classList.add('open');
    }
  }

  function closeCreateTourneyModal() {
    if (elements.createTourneyModal) {
      elements.createTourneyModal.classList.remove('open');
    }
  }

  // --- Notifications Drawer Modal ---
  function openNotificationsModal() {
    if (elements.notificationsModal) {
      elements.notificationsModal.classList.add('open');
    }
  }

  function closeNotificationsModal() {
    if (elements.notificationsModal) {
      elements.notificationsModal.classList.remove('open');
    }
  }

  // --- Live Scoring Keypad Engine (Matches Screen) ---
  let matchScore = { runs: 184, wickets: 4, overs: 18, balls: 2 };
  let currentOver = ['0', '1', '4', '6', 'W', '2'];

  function recordScoreBall(type) {
    let ballLabel = type;
    if (type === '0') {
      matchScore.balls++;
    } else if (type === '1') {
      matchScore.runs += 1;
      matchScore.balls++;
    } else if (type === '2') {
      matchScore.runs += 2;
      matchScore.balls++;
    } else if (type === '3') {
      matchScore.runs += 3;
      matchScore.balls++;
    } else if (type === '4') {
      matchScore.runs += 4;
      matchScore.balls++;
    } else if (type === '6') {
      matchScore.runs += 6;
      matchScore.balls++;
    } else if (type === 'W') {
      matchScore.wickets += 1;
      matchScore.balls++;
      showToast('WICKET! Outstanding delivery!', 'sports_cricket');
    } else if (type === 'WD') {
      matchScore.runs += 1;
      ballLabel = '1wd';
    } else if (type === 'NB') {
      matchScore.runs += 1;
      ballLabel = '1nb';
    }

    if (matchScore.balls >= 6) {
      matchScore.overs++;
      matchScore.balls = 0;
      currentOver = [];
      showToast('Over Complete! Switching strike.', 'autorenew');
    }

    currentOver.push(ballLabel);

    // Update Live Score UI
    const scoreDisplay = document.getElementById('live-score-display');
    const oversDisplay = document.getElementById('live-overs-display');
    const currentOverContainer = document.getElementById('live-current-over-balls');

    if (scoreDisplay) scoreDisplay.textContent = `${matchScore.runs}/${matchScore.wickets}`;
    if (oversDisplay) oversDisplay.textContent = `(${matchScore.overs}.${matchScore.balls} ov)`;

    if (currentOverContainer) {
      currentOverContainer.innerHTML = currentOver
        .map((b) => {
          let bgClass = 'bg-[#EDF5F0] text-slate-800';
          if (b === '4') bgClass = 'bg-primary-container text-white';
          if (b === '6') bgClass = 'bg-tertiary text-white';
          if (b === 'W') bgClass = 'bg-error text-white font-bold animate-bounce';
          return `<div class="w-8 h-8 rounded-full ${bgClass} flex items-center justify-center text-xs font-bold shadow-sm">${b}</div>`;
        })
        .join('');
    }
  }

  // --- View Mode Toggle (Phone Mockup vs Full Screen) ---
  function setViewMode(mode) {
    const body = document.body;
    const btnPhone = document.getElementById('btn-view-phone');
    const btnFull = document.getElementById('btn-view-full');

    if (mode === 'full') {
      body.classList.remove('device-view');
      body.classList.add('full-view');
      if (btnPhone) btnPhone.classList.remove('active-tool');
      if (btnFull) btnFull.classList.add('active-tool');
      showToast('Switched to Full Screen Responsive Mode', 'fullscreen');
    } else {
      body.classList.remove('full-view');
      body.classList.add('device-view');
      if (btnPhone) btnPhone.classList.add('active-tool');
      if (btnFull) btnFull.classList.remove('active-tool');
      showToast('Switched to iPhone Device Mockup Mode', 'smartphone');
    }
  }

  // --- Export Roster Feature ---
  function exportRoster() {
    const data = window.CricData.teamProfile;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Apex_Strikers_Official_Roster_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Official squad roster downloaded as JSON', 'download');
  }

  // --- Toggle Bookmark ---
  function toggleBookmark() {
    isBookmarked = !isBookmarked;
    const icon = document.getElementById('details-bookmark-icon');
    if (icon) {
      icon.style.fontVariationSettings = isBookmarked ? "'FILL' 1" : "'FILL' 0";
      icon.className = `material-symbols-outlined ${isBookmarked ? 'text-secondary-container' : 'text-primary'}`;
    }
    showToast(isBookmarked ? 'Tournament saved to Bookmarks' : 'Bookmark removed', 'bookmark');
  }

  // --- Share Tournament ---
  function shareTournament() {
    if (navigator.share) {
      navigator
        .share({
          title: 'Premier Cricket Championship 2025',
          text: 'Check out Premier Championship 2025 on CricMatch Pro!',
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tournament link copied to clipboard!', 'share');
    }
  }

  // --- Event Listeners Initialization ---
  function initEvents() {
    // Bottom Navigation Clicks
    elements.navTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tab.getAttribute('data-tab');
        if (target === 'tournaments') navigateTo('hub');
        else if (target === 'matches') navigateTo('matches');
        else if (target === 'teams') navigateTo('roster');
        else if (target === 'venues') navigateTo('venues');
      });
    });

    // Hub Filter Buttons
    document.querySelectorAll('.hub-filter-chip').forEach((btn) => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.hub-filter-chip').forEach((b) => {
          b.className =
            'hub-filter-chip px-4 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-low text-label-md font-label-md whitespace-nowrap transition-colors';
        });
        this.className =
          'hub-filter-chip px-4 py-1.5 rounded-full bg-primary-container text-white text-label-md font-label-md whitespace-nowrap shadow-sm';
        activeTournamentFilter = this.getAttribute('data-filter');
        renderTournamentsList();
      });
    });

    // Hub Search Input
    const hubSearch = document.getElementById('hub-search-input');
    if (hubSearch) {
      hubSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTournamentsList();
      });
    }

    // Role Filter Chips (Roster screen)
    document.querySelectorAll('.roster-role-chip').forEach((btn) => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.roster-role-chip').forEach((b) => {
          b.className =
            'roster-role-chip shrink-0 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md active:scale-95 transition-transform flex items-center gap-1.5';
        });
        this.className =
          'roster-role-chip shrink-0 px-3.5 py-1.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm active:scale-95 transition-transform flex items-center gap-1';
        activeRoleFilter = this.getAttribute('data-role');
        renderPlayersRoster();
      });
    });

    // Roster Sort Dropdown
    const rosterSort = document.getElementById('roster-sort-select');
    if (rosterSort) {
      rosterSort.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderPlayersRoster();
      });
    }

    // Roster Search Input
    const rosterSearch = document.getElementById('player-search-input');
    if (rosterSearch) {
      rosterSearch.addEventListener('input', () => {
        renderPlayersRoster();
      });
    }
  }

  // --- Initialize Application on DOM Ready ---
  document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initClock();
    initEvents();
    initRegistrationForm();
    initAddPlayerModal();
    initCreateTournamentModal();

    // Initial renders
    updateSpotlightSlide(0);
    renderTournamentsList();
    renderPlayersRoster();

    // Default start screen is Hub
    navigateTo('hub');
  });

  // Public Interface attached to window
  window.CricApp = {
    navigateTo,
    goBack,
    updateSpotlightSlide,
    setDetailsTab,
    openPlayerModal,
    closePlayerModal,
    openAddPlayerModal,
    closeAddPlayerModal,
    openCreateTourneyModal,
    closeCreateTourneyModal,
    openTeamPassModal,
    closeTeamPassModal,
    openNotificationsModal,
    closeNotificationsModal,
    recordScoreBall,
    setViewMode,
    exportRoster,
    toggleBookmark,
    shareTournament,
    showToast
  };
})();
