// ============================================================
// APP — Calistenia Pro (motor)
// Clon funcional de Sistema Titanio: 4 pestañas + 63 días + 6 bonos.
// Vanilla JS, sin frameworks. Estado persistido en localStorage.
// Navegación por pestañas = recarga de página normal (server.js hace
// fallback de SPA), así que el estado "vivo" (paso del quiz en pantalla,
// bono abierto, etc.) es simple: variables de módulo, se resetean al
// cambiar de pestaña (el progreso guardado en localStorage no se pierde).
// ============================================================
(function () {
  const LS = {
    quiz: 'forja_quiz',
    progress: 'forja_progress',
    bono2: 'forja_bono2',
    bono4: 'forja_bono4',
    bono5: 'forja_bono5',
    bono6: 'forja_bono6',
    recipesSaved: 'forja_recipes_saved',
    profile: 'forja_profile',
    streak: 'forja_streak',
    achievements: 'forja_achievements',
    progressPhotos: 'forja_progress_photos',
  };
  function load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function todayStr() { const d = new Date(); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  // Diferencia en días de calendario entre dos 'YYYY-MM-DD' (b - a).
  function daysBetween(a, b) {
    const da = new Date(a + 'T00:00:00'), db = new Date(b + 'T00:00:00');
    return Math.round((db - da) / 86400000);
  }
  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const DIAS_SEM = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

  // ===== foto: elegir archivo + redimensionar a un data URL chico =====
  // (localStorage tiene ~5-10MB de límite total, así que las fotos que suba
  // el usuario se comprimen a un cuadrado chico antes de guardarse).
  function pickImageFile() {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/*';
      input.onchange = () => resolve(input.files && input.files[0] ? input.files[0] : null);
      input.click();
    });
  }
  function resizeImageFile(file, maxSize, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const side = Math.min(img.width, img.height);
          const sx = (img.width - side) / 2, sy = (img.height - side) / 2;
          const canvas = document.createElement('canvas');
          canvas.width = maxSize; canvas.height = maxSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, sx, sy, side, side, 0, 0, maxSize, maxSize);
          resolve(canvas.toDataURL('image/jpeg', quality || .82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const view = document.getElementById('view');

  // ============================================================
  // PERFIL, RACHA Y LOGROS
  // ============================================================

  // Header persistente (foto + nombre + racha), visible arriba en las 4
  // pestañas. Se vuelve a pintar al principio de cada render*() de pestaña
  // y cada vez que cambia algo (foto, nombre, racha).
  function renderTopHeader() {
    const header = document.getElementById('topHeader');
    if (!header) return;
    const profile = load(LS.profile, { name: '', photo: '' });
    const streak = load(LS.streak, { count: 0, best: 0, lastDate: null });
    const today = todayStr();
    // Si pasó más de 1 día de calendario sin marcar nada, la racha ya está
    // rota visualmente (aunque el número viejo siga guardado hasta la
    // próxima acción real).
    const displayStreak = streak.lastDate && daysBetween(streak.lastDate, today) <= 1 ? streak.count : 0;
    header.innerHTML =
      '<div class="avatar-circle" id="hdrAvatar">' + (profile.photo ? '<img src="' + profile.photo + '" alt="">' : '🙂') + '</div>' +
      '<div class="top-header-name" id="hdrName"><b>Hola, ' + (profile.name ? esc(profile.name) : 'Recluta') + ' 👋</b><span>Bienvenido de nuevo</span></div>' +
      '<button class="streak-pill" id="hdrStreak" title="Compartir mi racha">🔥 ' + displayStreak + '</button>';
    document.getElementById('hdrAvatar').onclick = async () => {
      const file = await pickImageFile();
      if (!file) return;
      const dataUrl = await resizeImageFile(file, 200, .85);
      const p = load(LS.profile, { name: '', photo: '' });
      p.photo = dataUrl; save(LS.profile, p);
      renderTopHeader();
    };
    document.getElementById('hdrName').onclick = () => openProfileModal(false);
    document.getElementById('hdrStreak').onclick = shareProgress;
  }

  // Modal para elegir nombre + foto. isOnboarding=true la primera vez que se
  // abre la app (bloquea hasta completar); false cuando se reabre a mano
  // tocando el nombre en el header, para editar.
  function openProfileModal(isOnboarding) {
    const profile = load(LS.profile, { name: '', photo: '' });
    let tempPhoto = profile.photo || '';
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal-box" style="text-align:center">' +
      (isOnboarding ? '' : '<div class="modal-top" style="justify-content:flex-end"><button class="btn-ghost" id="mClose" style="font-size:20px;line-height:1">✕</button></div>') +
      '<h2 style="font-size:19px;text-transform:uppercase;margin-bottom:6px">' + (isOnboarding ? '¡Bienvenido, Recluta!' : 'Editar Perfil') + '</h2>' +
      '<p style="color:hsl(var(--muted-foreground));font-size:13px;margin-bottom:18px">' + (isOnboarding ? 'Antes de arrancar, contanos quién sos.' : 'Actualizá tu nombre o tu foto.') + '</p>' +
      '<div class="avatar-picker" id="pAvatar">' + (tempPhoto ? '<img src="' + tempPhoto + '" alt="">' : '📷') + '</div>' +
      '<div class="field" style="text-align:left"><label>Tu nombre</label><input type="text" id="pName" placeholder="Ej: Mateo" value="' + esc(profile.name || '') + '" maxlength="24"></div>' +
      '<button class="btn btn-primary" id="pSave"' + (profile.name ? '' : ' disabled') + '>' + (isOnboarding ? 'Continuar →' : 'Guardar') + '</button>' +
      '</div>';
    document.body.appendChild(overlay);
    const nameInput = overlay.querySelector('#pName');
    const saveBtn = overlay.querySelector('#pSave');
    nameInput.oninput = () => { saveBtn.disabled = !nameInput.value.trim(); };
    overlay.querySelector('#pAvatar').onclick = async () => {
      const file = await pickImageFile();
      if (!file) return;
      tempPhoto = await resizeImageFile(file, 200, .85);
      overlay.querySelector('#pAvatar').innerHTML = '<img src="' + tempPhoto + '" alt="">';
    };
    const closeBtn = overlay.querySelector('#mClose');
    if (closeBtn) closeBtn.onclick = () => overlay.remove();
    saveBtn.onclick = () => {
      const name = nameInput.value.trim();
      if (!name) return;
      save(LS.profile, { name, photo: tempPhoto });
      overlay.remove();
      renderTopHeader();
      if (isOnboarding) render();
    };
    setTimeout(() => nameInput.focus(), 50);
  }

  // Racha: se llama cada vez que se marca un día como completado (sin
  // importar cuál de los 63 días del programa sea). Si ya se había marcado
  // algo hoy no suma de nuevo; si el último día activo fue ayer, suma 1; si
  // se saltó uno o más días, arranca de nuevo en 1.
  function registerActivityToday() {
    const streak = load(LS.streak, { count: 0, best: 0, lastDate: null });
    const today = todayStr();
    if (streak.lastDate === today) return streak;
    if (streak.lastDate && daysBetween(streak.lastDate, today) === 1) streak.count += 1;
    else streak.count = 1;
    streak.lastDate = today;
    streak.best = Math.max(streak.best || 0, streak.count);
    save(LS.streak, streak);
    return streak;
  }

  // Revisa CONFIG.ACHIEVEMENTS contra el progreso actual y desbloquea los
  // que correspondan (quedan desbloqueados para siempre, no se revocan).
  function checkAchievements() {
    const progress = load(LS.progress, { completedDays: [] });
    const totalDone = new Set(progress.completedDays).size;
    const streak = load(LS.streak, { count: 0, best: 0, lastDate: null });
    const photos = load(LS.progressPhotos, { d1: null, d32: null, d63: null });
    const hasPhoto = !!(photos.d1 || photos.d32 || photos.d63);
    const unlocked = new Set(load(LS.achievements, []));
    const fresh = [];
    CONFIG.ACHIEVEMENTS.forEach(a => {
      if (unlocked.has(a.id)) return;
      let ok = false;
      if (a.type === 'totalDone') ok = totalDone >= a.value;
      else if (a.type === 'streakBest') ok = (streak.best || 0) >= a.value;
      else if (a.type === 'photo') ok = hasPhoto;
      if (ok) { unlocked.add(a.id); fresh.push(a); }
    });
    if (fresh.length) { save(LS.achievements, [...unlocked]); fresh.forEach(showAchievementToast); }
    return fresh;
  }

  function showAchievementToast(ach) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;left:50%;top:14px;transform:translate(-50%,-20px);opacity:0;transition:all .35s ease;background:hsl(var(--card));border:1px solid hsl(var(--primary));border-radius:14px;padding:12px 18px;display:flex;align-items:center;gap:10px;z-index:60;box-shadow:0 8px 24px -8px rgba(0,0,0,.5);max-width:90%';
    t.innerHTML = '<span style="font-size:26px">' + ach.icon + '</span><div><b style="display:block;font-size:12px;color:hsl(var(--primary));text-transform:uppercase;letter-spacing:.04em">Logro desbloqueado</b><span style="font-size:13.5px;font-weight:700">' + esc(ach.title) + '</span></div>';
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translate(-50%,0)'; });
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translate(-50%,-20px)'; setTimeout(() => t.remove(), 400); }, 3200);
  }

  // Comparte (o copia si el navegador no soporta compartir nativo) un
  // resumen de la racha + progreso actual.
  function shareProgress() {
    const progress = load(LS.progress, { completedDays: [] });
    const totalDone = new Set(progress.completedDays).size;
    const streak = load(LS.streak, { count: 0, best: 0, lastDate: null });
    const today = todayStr();
    const displayStreak = streak.lastDate && daysBetween(streak.lastDate, today) <= 1 ? streak.count : 0;
    const text = '🔥 Llevo ' + displayStreak + ' día' + (displayStreak === 1 ? '' : 's') + ' de racha entrenando con ' + CONFIG.BRAND + '. ¡Ya completé ' + totalDone + ' de 63 días de mi transformación! 💪';
    function fallbackCopy(txt) {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => alert('¡Copiado! Pegalo donde quieras compartirlo.')).catch(() => { fallbackCopy(text); alert('¡Copiado! Pegalo donde quieras compartirlo.'); });
    } else {
      fallbackCopy(text); alert('¡Copiado! Pegalo donde quieras compartirlo.');
    }
  }

  function openBadgeModal(ach, unlocked) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal-box" style="text-align:center">' +
      '<div class="modal-top" style="justify-content:flex-end"><button class="btn-ghost" id="mClose" style="font-size:20px;line-height:1">✕</button></div>' +
      '<div style="font-size:52px' + (unlocked ? '' : ';opacity:.35;filter:grayscale(1)') + '">' + ach.icon + '</div>' +
      '<h2 style="font-size:18px;text-transform:uppercase;margin:10px 0 6px">' + esc(ach.title) + '</h2>' +
      '<p style="color:hsl(var(--muted-foreground));font-size:13.5px;margin-bottom:14px">' + esc(ach.desc) + '</p>' +
      '<span class="pill ' + (unlocked ? 'completo' : 'pendiente') + '">' + (unlocked ? 'DESBLOQUEADO' : 'BLOQUEADO') + '</span>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#mClose').onclick = () => overlay.remove();
  }

  // Fotos de progreso: 3 casilleros (día 1 / 32 / 63). Al tener día 1 y día
  // 63 muestra la comparación antes/después.
  function openProgressPhotosModal() {
    const photos = load(LS.progressPhotos, { d1: null, d32: null, d63: null });
    const defs = [['d1', 'Día 1'], ['d32', 'Día 32 (mitad)'], ['d63', 'Día 63 (final)']];
    function slotsHtml() {
      return '<div class="photo-slot-row">' + defs.map(([k, lbl]) => {
        const src = photos[k];
        return '<div class="photo-slot' + (src ? ' filled' : '') + '" data-k="' + k + '">' + (src ? '<img src="' + src + '" alt="">' : '') + '<span class="lbl">' + (src ? lbl : '📷<br>' + lbl) + '</span></div>';
      }).join('') + '</div>';
    }
    function compareHtml() {
      if (!photos.d1 || !photos.d63) return '<p style="text-align:center;color:hsl(var(--muted-foreground));font-size:12.5px;margin-top:6px">Subí la foto del Día 1 y del Día 63 para ver tu comparación antes/después.</p>';
      return '<h3 style="font-size:12px;letter-spacing:.05em;color:hsl(var(--primary));text-transform:uppercase;margin:18px 0 8px;text-align:center">Antes / Después</h3>' +
        '<div style="display:flex;gap:10px">' +
        '<div style="flex:1"><img src="' + photos.d1 + '" style="width:100%;border-radius:12px;display:block;aspect-ratio:3/4;object-fit:cover"><p style="text-align:center;font-size:11px;color:hsl(var(--muted-foreground));margin-top:4px">ANTES</p></div>' +
        '<div style="flex:1"><img src="' + photos.d63 + '" style="width:100%;border-radius:12px;display:block;aspect-ratio:3/4;object-fit:cover"><p style="text-align:center;font-size:11px;color:hsl(var(--muted-foreground));margin-top:4px">DESPUÉS</p></div>' +
        '</div>';
    }
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal-box">' +
      '<div class="modal-top"><h2 style="font-size:17px;text-transform:uppercase">📸 Fotos de Progreso</h2><button class="btn-ghost" id="mClose" style="font-size:20px;line-height:1">✕</button></div>' +
      '<p style="color:hsl(var(--muted-foreground));font-size:12.5px;margin-bottom:4px">Tocá cada casillero para subir o reemplazar tu foto.</p>' +
      '<div id="pSlots">' + slotsHtml() + '</div>' +
      '<div id="pCompare">' + compareHtml() + '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#mClose').onclick = () => overlay.remove();
    function bindSlots() {
      overlay.querySelectorAll('.photo-slot').forEach(s => {
        s.onclick = async () => {
          const file = await pickImageFile();
          if (!file) return;
          const dataUrl = await resizeImageFile(file, 600, .82);
          photos[s.dataset.k] = dataUrl;
          save(LS.progressPhotos, photos);
          overlay.querySelector('#pSlots').innerHTML = slotsHtml();
          overlay.querySelector('#pCompare').innerHTML = compareHtml();
          bindSlots();
          checkAchievements();
        };
      });
    }
    bindSlots();
  }

  // ===== generar los 63 días =====
  function buildDays() {
    const days = [];
    for (let i = 1; i <= 63; i++) {
      const tpl = CONFIG.DAY_TEMPLATE[(i - 1) % 7];
      const week = Math.ceil(i / 7);
      const phaseIdx = week <= 3 ? 0 : week <= 6 ? 1 : 2;
      days.push({ num: i, t: tpl.t, min: tpl.min, desc: tpl.desc, week, phaseIdx });
    }
    return days;
  }
  const DAYS = buildDays();

  // Día "de hoy" = el primero que todavía no está completado (o el último, si ya se completaron los 63).
  function currentDayNum(doneSet) {
    for (let i = 1; i <= 63; i++) if (!doneSet.has(i)) return i;
    return 63;
  }
  function currentPhaseIdx(dayNum) {
    const d = DAYS.find(x => x.num === dayNum);
    return d ? d.phaseIdx : 0;
  }
  // Anillo circular de progreso (SVG), en base al % completado.
  function progressRingSVG(pct, big, small) {
    const r = 54, c = 2 * Math.PI * r;
    const offset = c * (1 - pct / 100);
    return '<svg width="140" height="140" viewBox="0 0 120 120" style="display:block;margin:0 auto">' +
      '<circle cx="60" cy="60" r="' + r + '" fill="none" stroke="hsl(var(--secondary))" stroke-width="8"/>' +
      '<circle cx="60" cy="60" r="' + r + '" fill="none" stroke="hsl(var(--primary))" stroke-width="8" stroke-linecap="round" ' +
      'stroke-dasharray="' + c + '" stroke-dashoffset="' + offset + '" transform="rotate(-90 60 60)"/>' +
      '<text x="60" y="58" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="800" font-size="30" fill="hsl(var(--foreground))">' + big + '</text>' +
      '<text x="60" y="78" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" fill="hsl(var(--muted-foreground))">' + small + '</text>' +
      '</svg>';
  }

  function setActiveNav() {
    const path = location.pathname === '' ? '/' : location.pathname;
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('nav-link-active', a.dataset.path === path);
    });
  }

  // ===== ROUTER =====
  function render() {
    setActiveNav();
    const path = location.pathname;
    if (path === '/programa') return renderPrograma();
    if (path === '/tu-plan') return renderTuPlan();
    if (path === '/info') return renderInfo();
    return renderHome();
  }

  // ================= HOME =================
  function renderHome() {
    renderTopHeader();
    const quiz = load(LS.quiz, { step: 0, answers: {}, done: false });
    let html = '<div class="hero-badge"><span class="dot"></span>Reclutamiento Abierto</div>' +
      '<h1 class="brand-h1">' + esc(CONFIG.BRAND) + '</h1>' +
      '<p class="brand-sub">' + esc(CONFIG.TAGLINE) + '</p>';

    if (quiz.done) {
      const nivel = CONFIG.NIVEL_BY_EXPERIENCIA[quiz.answers.experiencia] || 'principiante';
      const progress = load(LS.progress, { completedDays: [] });
      const doneSet = new Set(progress.completedDays);
      const totalDone = doneSet.size;
      const pct = Math.round((totalDone / 63) * 100);
      const todayNum = currentDayNum(doneSet);
      const today = DAYS.find(d => d.num === todayNum);
      const phase = CONFIG.PHASES[currentPhaseIdx(todayNum)];
      const todayDone = doneSet.has(todayNum);

      html = '<h1 class="brand-h1">' + esc(CONFIG.BRAND) + '</h1>' +
        '<p class="brand-sub">' + esc(CONFIG.TAGLINE) + '</p>' +
        '<div style="text-align:center;margin-bottom:14px"><span class="tag" style="font-size:12px">NIVEL: <b style="color:hsl(var(--primary))">' + esc(nivel.toUpperCase()) + '</b></span></div>' +
        '<p style="text-align:center;color:hsl(var(--muted-foreground));font-style:italic;font-size:13.5px;margin-bottom:16px">' + esc(CONFIG.MOTIVATIONAL_QUOTE) + '</p>' +
        '<p style="text-align:center;color:hsl(var(--primary));font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.03em;margin-bottom:14px">FASE ' + (phase && CONFIG.PHASES.indexOf(phase) + 1) + ' – ' + esc(phase ? phase.name : '') + '</p>' +
        '<div style="display:flex;gap:10px;margin-bottom:24px">' +
        '<button class="btn btn-secondary" id="retryQuiz" style="flex:1;font-size:12.5px">🔄 Rehacer test inicial</button>' +
        '<button class="btn btn-secondary" id="undoDay" style="flex:1;font-size:12.5px"' + (totalDone === 0 ? ' disabled' : '') + '>↩ Volver 1 día atrás</button>' +
        '</div>' +
        '<div style="margin-bottom:8px">' + progressRingSVG(pct, totalDone, '/63') + '</div>' +
        '<p style="text-align:center;color:hsl(var(--muted-foreground));font-size:13px;margin-bottom:10px">Has completado ' + totalDone + ' de 63 días</p>' +
        '<button class="btn btn-secondary" id="shareStreak" style="margin-bottom:22px">📤 Compartir mi racha</button>' +
        '<div class="card" style="text-align:center">' +
        '<span class="pill completo" style="margin-bottom:12px;display:inline-block">DÍA ' + todayNum + ' DE 63</span>' +
        '<h2 style="font-size:20px;text-transform:uppercase;margin-bottom:8px">' + esc(today.t) + '</h2>' +
        '<p style="color:hsl(var(--muted-foreground));font-size:13.5px;margin-bottom:12px">' + esc(today.desc || '') + '</p>' +
        '<p style="color:hsl(var(--muted-foreground));font-size:13px;margin-bottom:16px">🕐 ' + today.min + ' min</p>' +
        '<button class="btn btn-primary" id="startTraining" style="margin-bottom:10px">▷ Iniciar entrenamiento</button>' +
        '<button class="btn btn-secondary" id="markTodayDone"' + (todayDone ? ' disabled' : '') + '>' + (todayDone ? '✓ Completado' : '✓ Marcar como completado') + '</button>' +
        '</div>' +
        '<p class="foot-note">' + esc(CONFIG.COPYRIGHT_FOOTER) + '<br>Plataforma oficial. Acceso individual.</p>';
      view.innerHTML = html;
      document.getElementById('retryQuiz').onclick = () => { save(LS.quiz, { step: 0, answers: {}, done: false }); renderHome(); };
      const undoBtn = document.getElementById('undoDay');
      if (undoBtn) undoBtn.onclick = () => {
        const p = load(LS.progress, { completedDays: [] });
        p.completedDays.sort((a, b) => a - b);
        p.completedDays.pop();
        save(LS.progress, p);
        renderHome();
      };
      document.getElementById('startTraining').onclick = () => openDayModal(todayNum);
      const markBtn = document.getElementById('markTodayDone');
      if (markBtn) markBtn.onclick = () => {
        const p = load(LS.progress, { completedDays: [] });
        if (!p.completedDays.includes(todayNum)) p.completedDays.push(todayNum);
        save(LS.progress, p);
        registerActivityToday();
        checkAchievements();
        renderHome();
      };
      const shareBtn = document.getElementById('shareStreak');
      if (shareBtn) shareBtn.onclick = shareProgress;
      return;
    }

    const step = quiz.step || 0;
    const total = CONFIG.QUIZ.length;
    const q = CONFIG.QUIZ[step];
    const picked = quiz.answers[q.key];
    html += '<div class="card">' +
      '<div class="quiz-icon">🏋️</div>' +
      '<h2 class="quiz-title">Test Inicial</h2>' +
      '<p class="quiz-sub">Respondé para conocer tu nivel (' + (step + 1) + '/' + total + ')</p>' +
      '<p class="quiz-q">' + esc(q.q) + '</p>';
    q.opts.forEach(o => {
      html += '<div class="radio-row' + (picked === o.v ? ' sel' : '') + '" data-v="' + o.v + '"><span class="radio-dot"></span><span>' + esc(o.t) + '</span></div>';
    });
    html += '<button class="btn btn-primary" id="quizNext"' + (!picked ? ' disabled' : '') + '>' + (step === total - 1 ? 'Finalizar' : 'Siguiente') + '</button>' +
      '</div><p class="foot-note">Plataforma oficial ' + esc(CONFIG.BRAND) + '</p>';
    view.innerHTML = html;

    view.querySelectorAll('.radio-row').forEach(r => {
      r.onclick = () => {
        const cur = load(LS.quiz, { step: 0, answers: {}, done: false });
        cur.answers[q.key] = r.dataset.v;
        save(LS.quiz, cur);
        renderHome();
      };
    });
    const nextBtn = document.getElementById('quizNext');
    if (nextBtn) nextBtn.onclick = () => {
      const cur = load(LS.quiz, { step: 0, answers: {}, done: false });
      if (step === total - 1) cur.done = true; else cur.step = step + 1;
      save(LS.quiz, cur);
      renderHome();
    };
  }

  // ================= PROGRAMA =================
  function renderPrograma() {
    renderTopHeader();
    const progress = load(LS.progress, { completedDays: [] });
    const doneSet = new Set(progress.completedDays);
    const totalDone = doneSet.size;
    const pct = Math.round((totalDone / 63) * 100);

    let html = '<h1 style="font-size:22px;text-transform:uppercase">Programa 63 Días</h1>' +
      '<p style="color:hsl(var(--muted-foreground));font-size:13px;margin-top:4px">3 Fases · 9 Semanas · Transformación completa</p>' +
      '<div class="stat-block"><div style="font-size:11px;letter-spacing:.08em;color:hsl(var(--muted-foreground));text-transform:uppercase">Progreso Total</div>' +
      '<div class="stat-pct">' + pct + '%</div>' +
      '<div class="stat-sub">' + totalDone + '/63 días completados</div>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>';

    CONFIG.PHASES.forEach((phase, pIdx) => {
      const phaseDays = DAYS.filter(d => d.phaseIdx === pIdx);
      const phaseDone = phaseDays.filter(d => doneSet.has(d.num)).length;
      const phasePct = Math.round((phaseDone / phaseDays.length) * 100);
      let status = 'pendiente', statusLabel = 'PENDIENTE';
      if (phaseDone === phaseDays.length) { status = 'completo'; statusLabel = 'COMPLETO'; }
      else if (phaseDone > 0) { status = 'curso'; statusLabel = 'EN CURSO'; }
      html += '<div class="phase-block">' +
        '<div class="phase-head"><span style="font-size:12px;font-weight:700;letter-spacing:.06em;color:hsl(var(--muted-foreground))">FASE ' + (pIdx + 1) + '</span><span class="pill ' + status + '">' + statusLabel + '</span></div>' +
        '<h2 class="phase-title">' + esc(phase.name) + '</h2>' +
        '<p class="phase-desc">' + esc(phase.desc) + '</p>' +
        '<p class="phase-meta">Semanas ' + phase.weekStart + '-' + phase.weekEnd + ' &middot; ' + phaseDone + '/' + phaseDays.length + ' días · ' + phasePct + '%</p>';
      for (let w = phase.weekStart; w <= phase.weekEnd; w++) {
        html += '<div class="week-head">SEMANA ' + w + '</div>';
        DAYS.filter(d => d.week === w).forEach(d => {
          const done = doneSet.has(d.num);
          const unlocked = d.num === 1 || doneSet.has(d.num - 1) || done;
          html += '<div class="day-row ' + (done ? 'done' : '') + ' ' + (unlocked ? '' : 'locked') + '" data-day="' + d.num + '">' +
            '<div class="day-num">' + d.num + '</div>' +
            '<div class="day-info"><div class="day-title">' + esc(d.t) + '</div><div class="day-min">' + d.min + ' min</div></div>' +
            (done ? '<div class="day-check">✓</div>' : (unlocked ? '<span style="color:hsl(var(--muted-foreground))">›</span>' : '<div style="opacity:.6">🔒</div>')) +
            '</div>';
        });
      }
      html += '</div>';
    });

    view.innerHTML = html;
    view.querySelectorAll('.day-row').forEach(row => {
      if (row.classList.contains('locked')) return;
      row.onclick = () => openDayModal(+row.dataset.day);
    });
  }

  function openDayModal(num) {
    const day = DAYS.find(d => d.num === num);
    const progress = load(LS.progress, { completedDays: [] });
    const done = progress.completedDays.includes(num);
    const ytUrl = 'https://www.youtube.com/watch?v=' + CONFIG.PLACEHOLDER_VIDEO_ID;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal-box">' +
      '<div class="modal-top"><div><span class="tag" style="margin-right:6px">DÍA ' + num + '</span><span class="tag">' + day.min + ' min</span></div><button class="btn-ghost" id="mClose" style="font-size:20px;line-height:1">✕</button></div>' +
      '<h2 style="font-size:20px;text-transform:uppercase;margin:14px 0 12px">' + esc(day.t) + '</h2>' +
      '<a href="' + ytUrl + '" target="_blank" rel="noopener" class="video-wrap" style="display:block;position:relative">' +
      '<img src="' + CONFIG.PLACEHOLDER_VIDEO_THUMB + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block">' +
      '<span style="position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,.65);color:#fff;padding:6px 12px;border-radius:20px;font-size:12.5px;font-weight:700;display:flex;align-items:center;gap:6px">▶ Mirar en YouTube</span>' +
      '</a>' +
      '<a class="btn btn-secondary" style="margin:14px 0 10px;display:block" href="' + ytUrl + '" target="_blank" rel="noopener">↗ Abrir en YouTube</a>' +
      '<button class="btn btn-secondary" id="mComplete" style="margin-bottom:14px">' + (done ? '✓ Completado' : 'Marcar como completado') + '</button>' +
      '<button class="btn-ghost" id="mBack" style="display:block;margin:0 auto">Volver</button>' +
      '<p style="text-align:center;color:hsl(var(--muted-foreground));font-size:11.5px;margin-top:16px">' + esc(CONFIG.COPYRIGHT_FOOTER) + '</p>' +
      '</div>';
    document.body.appendChild(overlay);
    function closeModal() { overlay.remove(); }
    overlay.querySelector('#mClose').onclick = closeModal;
    overlay.querySelector('#mBack').onclick = closeModal;
    overlay.querySelector('#mComplete').onclick = () => {
      const p = load(LS.progress, { completedDays: [] });
      if (!p.completedDays.includes(num)) p.completedDays.push(num);
      save(LS.progress, p);
      registerActivityToday();
      checkAchievements();
      closeModal();
      render();
    };
  }

  // ================= TU PLAN =================
  let bonoState = null;
  function renderTuPlan() {
    if (bonoState) return renderBonoDetail();
    renderTopHeader();
    const unlocked = new Set(load(LS.achievements, []));
    let html = '<div class="hero-badge"><span class="dot"></span>Contenido Premium</div>' +
      '<h1 class="brand-h1" style="font-size:22px">🎁 Bonos ' + esc(CONFIG.BRAND_SHORT) + '</h1>' +
      '<p class="brand-sub">Contenido premium exclusivo para tu transformación</p>';

    html += '<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:hsl(var(--muted-foreground));margin:22px 0 2px">Tu Progreso Personal</h2>';
    html += '<div class="badge-grid">' + CONFIG.ACHIEVEMENTS.map(a => {
      const un = unlocked.has(a.id);
      return '<div class="badge-cell' + (un ? '' : ' locked') + '" data-id="' + a.id + '"><div class="badge-ic">' + a.icon + '</div><div class="badge-label">' + esc(a.title) + '</div></div>';
    }).join('') + '</div>';
    html += '<button class="bono-card" id="openFotos"><div class="bono-num">📸</div>' +
      '<div><span class="tag">PERSONAL</span><div class="bono-title">FOTOS DE PROGRESO</div><div class="bono-desc">Subí tus fotos de antes/después y mirá tu transformación.</div></div></button>';

    html += '<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:hsl(var(--muted-foreground));margin:24px 0 2px">Bonos Incluidos</h2>';
    CONFIG.BONOS.forEach(b => {
      html += '<button class="bono-card" data-n="' + b.n + '"><div class="bono-num">' + b.n + '</div>' +
        '<div><span class="tag">' + esc(b.type) + '</span><div class="bono-title">' + esc(b.title.toUpperCase()) + '</div><div class="bono-desc">' + esc(b.desc) + '</div></div></button>';
    });
    view.innerHTML = html;
    view.querySelectorAll('.bono-card[data-n]').forEach(c => {
      c.onclick = () => { bonoState = { n: +c.dataset.n }; renderTuPlan(); };
    });
    view.querySelectorAll('.badge-cell').forEach(c => {
      c.onclick = () => {
        const ach = CONFIG.ACHIEVEMENTS.find(a => a.id === c.dataset.id);
        openBadgeModal(ach, unlocked.has(c.dataset.id));
      };
    });
    document.getElementById('openFotos').onclick = openProgressPhotosModal;
  }

  function bonoHeader(title, sub) {
    return '<button class="btn-ghost" id="bonoBack" style="margin-bottom:14px">‹ Volver</button>' +
      '<h1 style="font-size:19px;text-transform:uppercase">' + esc(title) + '</h1>' +
      (sub ? '<p style="color:hsl(var(--muted-foreground));font-size:12.5px;margin:4px 0 18px">' + esc(sub) + '</p>' : '<div style="margin-bottom:10px"></div>');
  }
  function bindBack() { document.getElementById('bonoBack').onclick = () => { bonoState = null; renderTuPlan(); }; }

  function renderBonoDetail() {
    const n = bonoState.n;
    if (n === 1) return renderBono1();
    if (n === 2) return renderBono2();
    if (n === 3) return renderBono3();
    if (n === 4) return renderBono4();
    if (n === 5) return renderBono5();
    if (n === 6) return renderBono6();
  }

  // ---------- Bono 1: recetas ----------
  let recipeFilter = 'todas';
  let openRecipe = null;
  function renderBono1() {
    const saved = load(LS.recipesSaved, []);
    let list = CONFIG.RECIPES.map((r, i) => Object.assign({ i: i }, r));
    if (recipeFilter !== 'todas') list = list.filter(r => r.cat === recipeFilter);
    let html = bonoHeader('Bebidas Quema Grasa', 'Biblioteca de recetas interactiva');
    html += '<div class="filter-row">';
    CONFIG.RECIPE_CATEGORIES.forEach(c => {
      html += '<div class="chip' + (recipeFilter === c.v ? ' sel' : '') + '" data-v="' + c.v + '">' + esc(c.t) + '</div>';
    });
    html += '</div><p style="font-size:12px;color:hsl(var(--muted-foreground));margin-bottom:10px">' + list.length + ' recetas</p>';
    list.forEach(r => {
      const catObj = CONFIG.RECIPE_CATEGORIES.find(c => c.v === r.cat);
      const isOpen = openRecipe === r.i;
      const isSaved = saved.indexOf(r.i) !== -1;
      html += '<div class="recipe-row" data-i="' + r.i + '"><span class="tag">' + esc(catObj ? catObj.t : '') + '</span>' +
        '<h3>' + esc(r.name.toUpperCase()) + '</h3>';
      if (isOpen) {
        html += '<div class="recipe-body">' +
          '<h4>Ingredientes</h4><ul class="ingredient-list">' + r.ing.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
          '<h4>Preparación</h4><p>' + esc(r.prep) + '</p>' +
          '<div class="recipe-actions"><button class="btn btn-secondary" data-act="prep" data-i="' + r.i + '">Hoy la preparo</button>' +
          '<button class="btn ' + (isSaved ? 'btn-primary' : 'btn-secondary') + '" data-act="save" data-i="' + r.i + '">' + (isSaved ? '✓ Guardada' : 'Guardar') + '</button></div>' +
          '</div>';
      }
      html += '</div>';
    });
    view.innerHTML = html; bindBack();
    view.querySelectorAll('.chip').forEach(c => { c.onclick = () => { recipeFilter = c.dataset.v; renderBono1(); }; });
    view.querySelectorAll('.recipe-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-act]')) return;
        const i = +row.dataset.i;
        openRecipe = openRecipe === i ? null : i;
        renderBono1();
      });
    });
    view.querySelectorAll('[data-act="save"]').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        const i = +b.dataset.i; let s = load(LS.recipesSaved, []);
        s = s.indexOf(i) !== -1 ? s.filter(x => x !== i) : s.concat([i]);
        save(LS.recipesSaved, s); renderBono1();
      };
    });
    view.querySelectorAll('[data-act="prep"]').forEach(b => {
      b.onclick = (e) => { e.stopPropagation(); b.textContent = '✓ Elegida para hoy'; b.disabled = true; };
    });
  }

  // ---------- Bono 2: plan de progreso ----------
  let bono2Editing = false;
  function renderBono2() {
    const profile = load(LS.bono2, null);
    let html = bonoHeader('Plan de Progreso', 'Tu evolución ' + CONFIG.BRAND_SHORT);
    if (!profile || bono2Editing) {
      html += '<div class="card"><h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin-bottom:14px">Configurá tu perfil</h3>' +
        '<div class="field"><label>Peso actual (kg)</label><input type="number" id="pesoActual" value="' + (profile ? profile.peso : 80) + '"></div>' +
        '<div class="field"><label>Peso objetivo (kg)</label><input type="number" id="pesoObjetivo" value="' + (profile ? profile.objetivo : 72) + '"></div>' +
        '<div class="field"><label>Nivel</label>';
      ['principiante', 'intermedio', 'avanzado'].forEach(nv => {
        html += '<div class="radio-row' + ((profile && profile.nivel === nv) ? ' sel' : '') + '" data-nivel="' + nv + '"><span class="radio-dot"></span><span style="text-transform:capitalize">' + nv + '</span></div>';
      });
      html += '</div><button class="btn btn-primary" id="saveProfile">Guardar Perfil</button></div>';
      view.innerHTML = html; bindBack();
      let selNivel = profile ? profile.nivel : 'intermedio';
      view.querySelectorAll('[data-nivel]').forEach(r => {
        r.onclick = () => { selNivel = r.dataset.nivel; view.querySelectorAll('[data-nivel]').forEach(x => x.classList.toggle('sel', x.dataset.nivel === selNivel)); };
      });
      document.getElementById('saveProfile').onclick = () => {
        const peso = +document.getElementById('pesoActual').value || 80;
        const objetivo = +document.getElementById('pesoObjetivo').value || 72;
        save(LS.bono2, { peso: peso, objetivo: objetivo, nivel: selNivel });
        bono2Editing = false;
        renderBono2();
      };
      return;
    }
    const metas = CONFIG.PROGRESO_METAS[profile.nivel];
    const diff = Math.abs(profile.peso - profile.objetivo);
    const pct = Math.max(5, Math.min(95, Math.round(100 - (diff / Math.max(profile.peso, 1)) * 100)));
    html += '<div class="card"><p style="text-align:center;font-size:11px;letter-spacing:.08em;color:hsl(var(--muted-foreground));text-transform:uppercase">Tu Progreso</p>' +
      '<p style="text-align:center;font-size:20px;font-weight:800;color:hsl(var(--primary));text-transform:uppercase;margin:2px 0 14px">' + profile.nivel + '</p>' +
      '<div class="stat-row"><div class="stat-box"><div class="v">' + profile.peso + '</div><div class="l">kg actual</div></div>' +
      '<div class="stat-box"><div class="v">' + profile.objetivo + '</div><div class="l">kg objetivo</div></div></div>' +
      '<p style="font-size:12px;color:hsl(var(--muted-foreground));margin-bottom:4px">Progreso estimado</p>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<p style="text-align:right;font-size:13px;font-weight:700;color:hsl(var(--primary));margin-top:4px">' + pct + '%</p>' +
      '<h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin:20px 0 10px">Metas de repeticiones</h3>' +
      '<div class="stat-row"><div class="stat-box"><div class="v">' + metas.pushups + '</div><div class="l">pushups</div></div><div class="stat-box"><div class="v">' + metas.squats + '</div><div class="l">squats</div></div></div>' +
      '<div class="stat-row"><div class="stat-box"><div class="v">' + metas.burpees + '</div><div class="l">burpees</div></div><div class="stat-box"><div class="v">' + metas.plancha + '</div><div class="l">Plancha (seg)</div></div></div>' +
      '<h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin:20px 0 8px">Recordatorio</h3>' +
      '<p style="font-size:13.5px;color:hsl(var(--muted-foreground));line-height:1.5">La constancia supera al talento. Entrená todos los días, aunque sea 15 minutos. Tu cuerpo cambia cuando tu mente no se rinde.</p>' +
      '<button class="btn btn-secondary" id="editProfile" style="margin-top:16px">Editar perfil</button></div>';
    view.innerHTML = html; bindBack();
    document.getElementById('editProfile').onclick = () => { bono2Editing = true; renderBono2(); };
  }

  // ---------- Bono 3: recuperación ----------
  let recoverySel = null;
  function renderBono3() {
    let html = bonoHeader('Protocolo de Recuperación', 'Seleccioná tu estado actual');
    CONFIG.RECOVERY_STATES.forEach(s => {
      html += '<div class="recovery-btn' + (recoverySel === s.v ? ' sel' : '') + '" data-v="' + s.v + '"><b>' + esc(s.t) + '</b><span>' + esc(s.desc) + '</span></div>';
    });
    if (recoverySel) {
      const s = CONFIG.RECOVERY_STATES.find(x => x.v === recoverySel);
      html += '<div class="result-block"><h4>Bebida recomendada</h4><p>' + esc(s.bebida) + '</p></div>' +
        '<div class="result-block"><h4>Tipo de descanso</h4><p>' + esc(s.descanso) + '</p></div>' +
        '<div class="result-block"><h4>Estiramiento</h4><p>' + esc(s.estiramiento) + '</p></div>' +
        '<div class="result-block"><h4>Día para retomar</h4><p>' + esc(s.retomar) + '</p></div>';
    }
    view.innerHTML = html; bindBack();
    view.querySelectorAll('.recovery-btn').forEach(b => { b.onclick = () => { recoverySel = b.dataset.v; renderBono3(); }; });
  }

  // ---------- Bono 4: tracker de disciplina ----------
  function renderBono4() {
    const today = new Date();
    const key = todayStr();
    const all = load(LS.bono4, {});
    const todayHabits = all[key] || {};
    let html = bonoHeader('Tracker Disciplina', 'Registro diario de hábitos');
    html += '<p style="font-size:12px;color:hsl(var(--muted-foreground));text-transform:uppercase;letter-spacing:.04em">📅 Hoy – ' + DIAS_SEM[today.getDay()] + ', ' + today.getDate() + ' de ' + MESES[today.getMonth()] + ' de ' + today.getFullYear() + '</p>';
    html += '<div class="card" style="margin-top:10px"><h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin-bottom:6px">✅ Hábitos del día</h3>';
    CONFIG.HABITS.forEach(h => {
      const on = !!todayHabits[h.k];
      html += '<div class="habit-row"><span>' + esc(h.t) + '</span><div class="habit-check' + (on ? ' on' : '') + '" data-k="' + h.k + '">' + (on ? '✓' : '') + '</div></div>';
    });
    html += '</div>';

    const y = today.getFullYear(), m = today.getMonth();
    const firstDay = new Date(y, m, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    html += '<div class="card" style="margin-top:16px"><h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin-bottom:6px">📆 Historial de progreso</h3>' +
      '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin-bottom:8px;text-transform:capitalize">' + MESES[m] + ' de ' + y + '</p><div class="cal-grid">';
    ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach(d => { html += '<div class="cal-dow">' + d + '</div>'; });
    for (let i = 0; i < startOffset; i++) html += '<div></div>';
    let trained = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dk = y + '-' + pad2(m + 1) + '-' + pad2(d);
      const rec = all[dk] || {};
      const count = CONFIG.HABITS.filter(h => rec[h.k]).length;
      let cls = '';
      if (count === CONFIG.HABITS.length) cls = 'completo';
      else if (count > 0) cls = 'parcial';
      html += '<div class="cal-day ' + cls + '">' + d + '</div>';
      if (rec.entrene) trained++;
    }
    html += '</div><div class="cal-legend"><span><i style="background:hsl(var(--primary))"></i>Completo</span><span><i style="background:hsla(var(--primary)/.35)"></i>Parcial</span><span><i style="background:hsl(var(--secondary))"></i>Sin registro</span></div></div>';

    // racha actual: días consecutivos (incluyendo hoy) con "entrené" marcado.
    let streak = 0;
    const cursor = new Date(today);
    for (;;) {
      const k2 = cursor.getFullYear() + '-' + pad2(cursor.getMonth() + 1) + '-' + pad2(cursor.getDate());
      if (all[k2] && all[k2].entrene) { streak++; cursor.setDate(cursor.getDate() - 1); }
      else break;
    }
    const daysPassed = today.getDate();
    const constancia = Math.round((trained / daysPassed) * 100);
    html += '<div class="card" style="margin-top:16px"><h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin-bottom:10px">📊 Resumen de disciplina</h3>' +
      '<div class="stat-row"><div class="stat-box"><div class="v">' + trained + '</div><div class="l">Días entrenados</div></div>' +
      '<div class="stat-box"><div class="v">' + constancia + '%</div><div class="l">Constancia</div></div>' +
      '<div class="stat-box"><div class="v">' + streak + '</div><div class="l">Racha actual</div></div></div></div>';

    view.innerHTML = html; bindBack();
    view.querySelectorAll('.habit-check').forEach(c => {
      c.onclick = () => {
        const all2 = load(LS.bono4, {});
        const rec = all2[key] || {};
        rec[c.dataset.k] = !rec[c.dataset.k];
        all2[key] = rec;
        save(LS.bono4, all2);
        renderBono4();
      };
    });
  }

  // ---------- Bono 5: combustible negro ----------
  let bono5Tab = 'pre';
  let bono5Editing = false;
  let mentalTimer = null, mentalPhase = -1, mentalSecondsLeft = 0;
  function timeAdd(hhmm, deltaMin) {
    const parts = hhmm.split(':').map(Number);
    let total = parts[0] * 60 + parts[1] + deltaMin;
    total = ((total % 1440) + 1440) % 1440;
    return pad2(Math.floor(total / 60)) + ':' + pad2(total % 60);
  }
  function renderBono5() {
    const profile = load(LS.bono5, null);
    let html = bonoHeader('Protocolo del Combustible Negro', '// Archivo clasificado — Bono 05');
    if (!profile || bono5Editing) {
      html += '<div class="card"><h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin-bottom:4px">Configurá tu protocolo</h3>' +
        '<p style="font-size:12px;color:hsl(var(--muted-foreground));margin-bottom:16px">// 4 datos. Todo resuelto.</p>' +
        '<div class="field"><label>Tu peso actual</label><input type="number" id="b5peso" value="' + (profile ? profile.peso : 80) + '"></div>' +
        '<div class="field"><label>¿A qué hora entrenás?</label><input type="time" id="b5hora" value="' + (profile ? profile.horaEntreno : '07:00') + '"></div>' +
        '<div class="field"><label>Objetivo</label>';
      [['grasa', 'Quemar grasa'], ['musculo', 'Ganar músculo'], ['ambos', 'Los dos']].forEach(pair => {
        html += '<div class="radio-row" data-obj="' + pair[0] + '"><span class="radio-dot"></span><span>' + pair[1] + '</span></div>';
      });
      html += '</div><div class="field"><label>¿Cuántas horas dormís por noche?</label><input type="number" id="b5horasSueno" value="' + (profile ? profile.horasSueno : 7) + '"></div>' +
        '<div class="field"><label>¿A qué hora te dormís?</label><input type="time" id="b5horaDormir" value="' + (profile ? profile.horaDormir : '23:00') + '"></div>' +
        '<button class="btn btn-primary" id="activarProtocolo">Activar mi protocolo →</button></div>';
      view.innerHTML = html; bindBack();
      let selObj = profile ? profile.objetivo : 'grasa';
      view.querySelectorAll('[data-obj]').forEach(r => {
        r.classList.toggle('sel', r.dataset.obj === selObj);
        r.onclick = () => { selObj = r.dataset.obj; view.querySelectorAll('[data-obj]').forEach(x => x.classList.toggle('sel', x.dataset.obj === selObj)); };
      });
      document.getElementById('activarProtocolo').onclick = () => {
        save(LS.bono5, {
          peso: +document.getElementById('b5peso').value || 80,
          horaEntreno: document.getElementById('b5hora').value || '07:00',
          objetivo: selObj,
          horasSueno: +document.getElementById('b5horasSueno').value || 7,
          horaDormir: document.getElementById('b5horaDormir').value || '23:00',
        });
        bono5Editing = false; bono5Tab = 'pre';
        renderBono5();
      };
      return;
    }
    const horaShake = timeAdd(profile.horaEntreno, -15);
    const horaHidra = timeAdd(profile.horaEntreno, 30);
    const horaRacion = timeAdd(profile.horaDormir, -30);
    const tabs = [['pre', 'Pre-entreno'], ['nocturno', 'Nocturno'], ['alimentos', 'Alimentos'], ['compras', 'Compras'], ['timing', 'Timing'], ['mental', 'Mental']];
    html += '<div class="tabs-row">' + tabs.map(pair => '<div class="tab-btn' + (bono5Tab === pair[0] ? ' sel' : '') + '" data-t="' + pair[0] + '">' + pair[1].toUpperCase() + '</div>').join('') + '</div>';

    if (bono5Tab === 'pre') {
      html += '<div class="card"><p style="font-size:18px;margin-bottom:2px">⚡ <b>Shake de Pólvora</b></p>' +
        '<p class="mono-header">// Protocolo de hoy</p>' +
        '<p style="font-weight:700;color:hsl(var(--primary));text-transform:uppercase;margin:8px 0 2px">Activación clásica</p>' +
        '<p style="font-size:11px;color:hsl(var(--muted-foreground));text-transform:uppercase">Hora de toma</p>' +
        '<p style="font-size:26px;font-weight:800;font-family:monospace;margin-bottom:12px">' + horaShake + '</p>' +
        '<h4 style="font-size:11.5px;color:hsl(var(--primary));text-transform:uppercase;margin-bottom:6px">Ingredientes</h4>' +
        '<ul class="ingredient-list"><li>Cacao puro — 8 g</li><li>Jengibre fresco rallado — 1 cucharadita</li><li>Agua caliente — 200 ml</li><li>Pizca de sal marina</li></ul>' +
        '<p style="font-size:13px;margin:10px 0">Tomalo a las ' + horaShake + ' sin falta.</p>' +
        '<button class="btn btn-primary" id="marcarTomado" style="margin-bottom:8px">✓ Marcar como tomado</button>' +
        '<button class="btn btn-secondary" id="reconfigurar">⚙ Reconfigurar protocolo</button></div>';
    } else if (bono5Tab === 'nocturno') {
      const noc = CONFIG.COMBUSTIBLE_NOCTURNO[profile.objetivo];
      const objLabel = { grasa: 'Quemar grasa', musculo: 'Ganar músculo', ambos: 'Los dos' }[profile.objetivo];
      html += '<div class="card"><p style="font-size:18px;margin-bottom:2px">🌙 <b>Ración Nocturna de Testosterona</b></p>' +
        '<p class="mono-header">// Ración de hoy</p>' +
        '<p style="font-weight:700;color:hsl(var(--primary));text-transform:uppercase;margin:8px 0 2px">' + esc(noc.label) + '</p>' +
        '<p style="font-size:11px;color:hsl(var(--muted-foreground));text-transform:uppercase">Horario sugerido</p>' +
        '<p style="font-size:26px;font-weight:800;font-family:monospace;margin-bottom:8px">' + horaRacion + '</p>' +
        '<p style="font-size:12px;color:hsl(var(--muted-foreground));text-transform:uppercase;margin-bottom:10px">Objetivo: ' + objLabel + '</p>' +
        '<ul class="ingredient-list">' + noc.ing.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>' +
        '<p style="font-size:12.5px;color:hsl(var(--destructive));margin:10px 0">⚠️ Siempre huevos bien cocidos. Nunca crudos.</p>' +
        '<p style="font-size:13px;margin-bottom:14px">' + esc(noc.tag) + '</p>' +
        '<button class="btn btn-primary" id="marcarComido" style="margin-bottom:8px">✓ Marcar como comido</button>' +
        '<button class="btn btn-secondary" id="reconfigurar">⚙ Reconfigurar protocolo</button></div>';
    } else if (bono5Tab === 'alimentos') {
      html += '<div class="card"><p style="font-size:18px;margin-bottom:12px">🥩 <b>Alimentos Clandestinos</b></p>';
      CONFIG.COMBUSTIBLE_ALIMENTOS.forEach(a => {
        html += '<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px"><span style="font-size:22px">' + a.ic + '</span><div><b style="display:block;font-size:14px">' + esc(a.name) + '</b><span style="font-size:12.5px;color:hsl(var(--muted-foreground))">' + esc(a.benefit) + '</span></div></div>';
      });
      html += '<button class="btn btn-secondary" id="reconfigurar">⚙ Reconfigurar protocolo</button></div>';
    } else if (bono5Tab === 'compras') {
      html += '<div class="card"><p style="font-size:18px;margin-bottom:6px">🛒 <b>Lista de Compras Semanal</b></p>' +
        '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin-bottom:12px">Lo que necesitás comprar esta semana para ejecutar los 3 protocolos.</p>' +
        '<ul class="ingredient-list">' + CONFIG.COMBUSTIBLE_COMPRAS.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
        '<button class="btn btn-secondary" id="copiarLista" style="margin-bottom:8px">Copiar lista</button>' +
        '<button class="btn btn-secondary" id="reconfigurar">⚙ Reconfigurar protocolo</button></div>';
    } else if (bono5Tab === 'timing') {
      html += '<div class="card"><p style="font-size:18px;margin-bottom:4px">⏱ <b>Tu Protocolo de Hoy</b></p>' +
        '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin-bottom:16px">Todo en orden cronológico.</p>';
      const items = [
        ['⚡', horaShake, 'Shake de Pólvora Pre-Combate'],
        ['🏋️', profile.horaEntreno, 'Entrenamiento'],
        ['💧', horaHidra, 'Hidratación post-entreno (500ml agua)'],
        ['🌙', horaRacion, 'Ración Nocturna de Testosterona'],
        ['📵', profile.horaDormir, 'Apagar pantallas'],
      ];
      items.forEach(it => {
        html += '<div class="timeline-item"><span class="ic">' + it[0] + '</span><div><div class="time">' + it[1] + '</div><div style="font-size:13.5px">' + it[2] + '</div></div></div>';
      });
      html += '<button class="btn btn-secondary" id="reconfigurar">⚙ Reconfigurar protocolo</button></div>';
    } else if (bono5Tab === 'mental') {
      html += renderMentalTab();
    }

    view.innerHTML = html; bindBack();
    view.querySelectorAll('.tab-btn').forEach(t => { t.onclick = () => { bono5Tab = t.dataset.t; renderBono5(); }; });
    const reconf = document.getElementById('reconfigurar');
    if (reconf) reconf.onclick = () => { bono5Editing = true; renderBono5(); };
    const mt = document.getElementById('marcarTomado'); if (mt) mt.onclick = () => { mt.textContent = '✓ Tomado hoy'; mt.disabled = true; };
    const mc = document.getElementById('marcarComido'); if (mc) mc.onclick = () => { mc.textContent = '✓ Comido hoy'; mc.disabled = true; };
    const cl = document.getElementById('copiarLista');
    if (cl) cl.onclick = () => {
      const text = CONFIG.COMBUSTIBLE_COMPRAS.join('\n');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => { cl.textContent = '✓ Copiado'; setTimeout(() => { cl.textContent = 'Copiar lista'; }, 1500); }).catch(() => {});
      }
    };
    bindMentalHandlers();
  }
  function renderMentalTab() {
    const fases = CONFIG.COMBUSTIBLE_MENTAL_FASES;
    const activePhase = mentalPhase >= 0 ? mentalPhase : 0;
    const fase = fases[activePhase];
    let timerHtml;
    if (mentalPhase >= 0) {
      timerHtml = '<div class="timer-circle" id="mentalTimerEl">' + pad2(Math.floor(mentalSecondsLeft / 60)) + ':' + pad2(mentalSecondsLeft % 60) + '</div>';
    } else {
      timerHtml = '<p style="font-family:monospace;font-size:26px;font-weight:800;margin:10px 0">' + pad2(fase.min) + ':00</p>';
    }
    return '<div class="card"><p style="font-size:18px;margin-bottom:4px">💪 <b>Protocolo Mental del Toro</b></p>' +
      '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin-bottom:14px">Para los días que no tenés ganas. Ese día es el más importante.</p>' +
      '<p style="font-size:11px;color:hsl(var(--primary));text-transform:uppercase;font-weight:700">Fase ' + (activePhase + 1) + ' de ' + fases.length + '</p>' +
      '<p style="font-weight:700;text-transform:uppercase;margin:6px 0 2px">' + esc(fase.t) + '</p>' +
      timerHtml +
      '<p style="font-size:13.5px;color:hsl(var(--muted-foreground));margin-bottom:14px">' + esc(fase.desc) + '</p>' +
      '<button class="btn btn-primary" id="iniciarMental"' + (mentalPhase >= 0 ? ' disabled' : '') + '>' + (mentalPhase >= 0 ? 'En progreso…' : 'Iniciar Protocolo Mental') + '</button>' +
      '<div class="phase-pills">' + fases.map((f, i) => '<div class="phase-pill' + (i === activePhase ? ' active' : '') + '">Fase ' + (i + 1) + '<br>' + f.min + ' min</div>').join('') + '</div>' +
      '<button class="btn btn-secondary" id="reconfigurar" style="margin-top:14px">⚙ Reconfigurar protocolo</button></div>';
  }
  function bindMentalHandlers() {
    const btn = document.getElementById('iniciarMental');
    if (!btn) return;
    btn.onclick = () => {
      mentalPhase = 0;
      mentalSecondsLeft = CONFIG.COMBUSTIBLE_MENTAL_FASES[0].min * 60;
      clearInterval(mentalTimer);
      mentalTimer = setInterval(() => {
        mentalSecondsLeft--;
        if (mentalSecondsLeft <= 0) {
          if (mentalPhase < CONFIG.COMBUSTIBLE_MENTAL_FASES.length - 1) {
            mentalPhase++; mentalSecondsLeft = CONFIG.COMBUSTIBLE_MENTAL_FASES[mentalPhase].min * 60;
            renderBono5();
          } else {
            clearInterval(mentalTimer); mentalPhase = -1;
            renderBono5();
          }
          return;
        }
        const el = document.getElementById('mentalTimerEl');
        if (el) el.textContent = pad2(Math.floor(mentalSecondsLeft / 60)) + ':' + pad2(mentalSecondsLeft % 60);
      }, 1000);
      renderBono5();
    };
  }

  // ---------- Bono 6: reinicio 72h ----------
  let reinicioAudio = { active: false, phase: 0, secondsLeft: 0, timer: null };
  function renderBono6() {
    const hormonas = load(LS.bono6, { checklist: [false, false, false, false, false] });
    let html = bonoHeader('Protocolo Reinicio 72H', '// Kit de blindaje — Bono 06');
    const pasos = CONFIG.REINICIO_AUDIO_PASOS;
    const activePhase = reinicioAudio.active ? reinicioAudio.phase : -1;
    html += '<div class="card"><p style="font-size:11px;color:hsl(var(--primary));text-transform:uppercase;font-weight:700;margin-bottom:6px">Sub-sección 01</p>' +
      '<p style="font-size:15px;font-weight:700">🎧 Audio de Reinicio — Nervio Vago</p>' +
      '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin:6px 0 14px">Activación táctica del nervio vago en 3 minutos.</p>' +
      '<p style="font-size:11px;color:hsl(var(--muted-foreground));text-transform:uppercase">Tiempo restante</p>';
    if (reinicioAudio.active) {
      html += '<p id="reinicioTimer" style="font-family:monospace;font-size:26px;font-weight:800;margin-bottom:14px">' + pad2(Math.floor(reinicioAudio.secondsLeft / 60)) + ':' + pad2(reinicioAudio.secondsLeft % 60) + '</p>';
    } else {
      html += '<p style="font-family:monospace;font-size:26px;font-weight:800;margin-bottom:14px">03:00</p>';
    }
    pasos.forEach((p, i) => {
      html += '<p style="font-size:11px;color:' + (i === activePhase ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))') + ';text-transform:uppercase;font-weight:700;margin-top:' + (i > 0 ? '12px' : '0') + '">Paso ' + (i + 1) + ' · ' + p.min + ' min</p>' +
        '<p style="font-weight:600;font-size:14px">' + esc(p.t) + '</p><p style="font-size:13px;color:hsl(var(--muted-foreground))">' + esc(p.desc) + '</p>';
    });
    html += '<button class="btn btn-primary" id="iniciarAudio" style="margin-top:16px"' + (reinicioAudio.active ? ' disabled' : '') + '>' + (reinicioAudio.active ? 'En progreso…' : 'Iniciar Protocolo') + '</button></div>';

    html += '<div class="card" style="margin-top:16px"><p style="font-size:11px;color:hsl(var(--primary));text-transform:uppercase;font-weight:700;margin-bottom:6px">Sub-sección 02</p>' +
      '<p style="font-size:15px;font-weight:700">🌙 Guía de Hormonas Nocturnas</p>' +
      '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin:6px 0 14px">Tildá cada noche al cumplir cada ítem.</p>';
    CONFIG.REINICIO_HORMONAS_CHECKLIST.forEach((item, i) => {
      const on = !!hormonas.checklist[i];
      html += '<div class="checklist-item"><div class="habit-check' + (on ? ' on' : '') + '" data-i="' + i + '">' + (on ? '✓' : '') + '</div><span>' + esc(item) + '</span></div>';
    });
    html += '</div>';

    html += '<div class="card" style="margin-top:16px"><p style="font-size:11px;color:hsl(var(--primary));text-transform:uppercase;font-weight:700;margin-bottom:6px">Sub-sección 03</p>' +
      '<p style="font-size:15px;font-weight:700">☀️ Manual: Despertá Sin Dolor</p>';
    CONFIG.REINICIO_DESPERTAR_PASOS.forEach((p, i) => {
      html += '<div style="display:flex;gap:12px;margin-top:14px"><div class="day-num" style="width:26px;height:26px;font-size:11px">' + (i + 1) + '</div>' +
        '<div><p style="font-size:10.5px;color:hsl(var(--muted-foreground));text-transform:uppercase;font-weight:700">' + p.min + ' min</p>' +
        '<b style="font-size:14px">' + esc(p.t) + '</b><p style="font-size:13px;color:hsl(var(--muted-foreground))">' + esc(p.desc) + '</p></div></div>';
    });
    html += '</div>';

    view.innerHTML = html; bindBack();
    view.querySelectorAll('.checklist-item .habit-check').forEach(c => {
      c.onclick = () => {
        const st = load(LS.bono6, { checklist: [false, false, false, false, false] });
        st.checklist[+c.dataset.i] = !st.checklist[+c.dataset.i];
        save(LS.bono6, st);
        renderBono6();
      };
    });
    const iniciarAudio = document.getElementById('iniciarAudio');
    if (iniciarAudio) iniciarAudio.onclick = () => {
      reinicioAudio.active = true; reinicioAudio.phase = 0;
      reinicioAudio.secondsLeft = pasos[0].min * 60;
      clearInterval(reinicioAudio.timer);
      reinicioAudio.timer = setInterval(() => {
        reinicioAudio.secondsLeft--;
        if (reinicioAudio.secondsLeft <= 0) {
          if (reinicioAudio.phase < pasos.length - 1) {
            reinicioAudio.phase++; reinicioAudio.secondsLeft = pasos[reinicioAudio.phase].min * 60;
            renderBono6();
          } else {
            clearInterval(reinicioAudio.timer); reinicioAudio.active = false;
            renderBono6();
          }
          return;
        }
        const t = document.getElementById('reinicioTimer');
        if (t) t.textContent = pad2(Math.floor(reinicioAudio.secondsLeft / 60)) + ':' + pad2(reinicioAudio.secondsLeft % 60);
      }, 1000);
      renderBono6();
    };
  }

  // ================= INFO =================
  function renderInfo() {
    renderTopHeader();
    let html = '<h1 style="font-size:22px;text-transform:uppercase">Info</h1>' +
      '<p style="color:hsl(var(--muted-foreground));font-size:13px;margin:4px 0 20px">Todo lo que necesitás saber sobre ' + esc(CONFIG.BRAND) + '</p>';
    html += '<div class="info-sec"><h3>¿Qué es ' + esc(CONFIG.BRAND) + '?</h3><p>' + esc(CONFIG.ABOUT_TEXT) + '</p></div>';
    html += '<div class="info-sec"><h3>¿Cómo usar el programa?</h3><p>Cada día tiene un video de entrenamiento. Mirá el video, hacé la rutina y marcalo como completado. Al completar un día se desbloquea el siguiente. Las 3 semanas repiten los mismos 7 videos con intensidad progresiva.</p></div>';
    html += '<div class="info-sec"><h3>Recomendaciones</h3><ul>' + CONFIG.INFO_RECOMENDACIONES.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></div>';
    html += '<div class="info-sec"><h3>¿Qué necesito?</h3><p>Solo tu cuerpo, un espacio libre (puede ser tu casa, un parque, cualquier lugar) y compromiso. No se necesitan pesas, bandas ni equipo especial.</p></div>';
    html += '<div class="info-sec"><h3>Soporte</h3><p>¿Tenés dudas o necesitás ayuda? Escribinos.</p>' +
      '<button class="btn btn-secondary" id="showSupportEmail" style="margin-top:10px">Contactar Soporte</button>' +
      '<div id="supportEmailBox" hidden style="margin-top:10px;gap:8px;align-items:center;background:hsl(var(--secondary));border:1px solid hsl(var(--border));border-radius:var(--radius);padding:12px 14px">' +
      '<span style="flex:1;font-size:13.5px;word-break:break-all">' + esc(CONFIG.SUPPORT_EMAIL) + '</span>' +
      '<button class="btn-ghost" id="copySupportEmail" style="flex:none;font-size:12px">Copiar</button></div></div>';
    html += '<div class="info-sec"><h3>Instalá la app en tu celular</h3><p>Accedé más rápido sin buscar el link cada vez. Se ve y funciona como una app real.</p>' +
      '<div class="tabs-row" style="margin-top:12px"><div class="tab-btn sel" data-os="ios">📱 iPhone</div><div class="tab-btn" data-os="android">🤖 Android</div></div>' +
      '<div id="pwaSteps"></div></div>';
    html += '<p class="quote">"' + esc(CONFIG.INFO_QUOTE) + '"</p>';
    view.innerHTML = html;

    // "Contactar Soporte": muchos celulares no tienen una app de mail
    // configurada y el link mailto: no hace nada (falla en silencio). Por
    // eso, en vez de un link, mostramos el mail como texto + botón copiar.
    document.getElementById('showSupportEmail').onclick = () => {
      const box = document.getElementById('supportEmailBox');
      box.hidden = false;
      box.style.display = 'flex';
    };
    document.getElementById('copySupportEmail').onclick = () => {
      const btn = document.getElementById('copySupportEmail');
      function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
      }
      function marcarCopiado() { btn.textContent = '✓ Copiado'; setTimeout(() => { btn.textContent = 'Copiar'; }, 1500); }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(CONFIG.SUPPORT_EMAIL).then(marcarCopiado).catch(() => { fallbackCopy(CONFIG.SUPPORT_EMAIL); marcarCopiado(); });
      } else {
        fallbackCopy(CONFIG.SUPPORT_EMAIL); marcarCopiado();
      }
    };

    const stepsIOS = [
      ['🧭', 'Abrí esta página en Safari', 'No funciona desde Chrome ni otros navegadores'],
      ['📤', 'Tocá el botón Compartir', 'Es el ícono del centro abajo de la pantalla'],
      ['➕', 'Tocá Agregar a Inicio', 'Bajá en el menú hasta encontrar esa opción'],
      ['✅', 'Tocá Agregar arriba a la derecha', 'Listo, ya tenés el ícono en tu pantalla de inicio'],
    ];
    const stepsAndroid = [
      ['🧭', 'Abrí esta página en Chrome', 'Funciona mejor desde el navegador Chrome'],
      ['⋮', 'Tocá el menú (3 puntos)', 'Arriba a la derecha de la pantalla'],
      ['➕', 'Tocá "Instalar app"', 'O "Agregar a pantalla de inicio"'],
      ['✅', 'Confirmá la instalación', 'Listo, ya tenés el ícono en tu pantalla de inicio'],
    ];
    function paintSteps(os) {
      const steps = os === 'ios' ? stepsIOS : stepsAndroid;
      document.getElementById('pwaSteps').innerHTML = steps.map((s, i) =>
        '<div class="step-row"><div class="step-num">' + (i + 1) + '</div><div><b style="display:block;font-size:13.5px">' + s[0] + ' ' + esc(s[1]) + '</b>' + (s[2] ? '<span style="font-size:12px;color:hsl(var(--muted-foreground))">' + esc(s[2]) + '</span>' : '') + '</div></div>'
      ).join('') + '<p style="font-size:12px;color:hsl(var(--muted-foreground));margin-top:6px">Una vez instalada, la app abre sin barras del navegador, igual que una app descargada.</p>';
    }
    paintSteps('ios');
    view.querySelectorAll('[data-os]').forEach(t => {
      t.onclick = () => { view.querySelectorAll('[data-os]').forEach(x => x.classList.remove('sel')); t.classList.add('sel'); paintSteps(t.dataset.os); };
    });
  }

  // Primer uso: todavía no hay nombre guardado -> pedimos perfil antes de
  // mostrar el contenido. Si ya existe, arranca directo.
  const initialProfile = load(LS.profile, { name: '', photo: '' });
  if (!initialProfile.name) {
    renderTopHeader();
    openProfileModal(true);
  } else {
    render();
  }
})();
