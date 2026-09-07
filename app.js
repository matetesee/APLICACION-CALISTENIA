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
    theme: 'forja_theme',
    lang: 'forja_lang',
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
  const MESES_BY_LANG = {
    es: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  };
  const DIAS_SEM_BY_LANG = {
    es: ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
    en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  };
  const CAL_DOW_BY_LANG = { es: ['L','M','X','J','V','S','D'], en: ['M','T','W','T','F','S','S'] };

  // ===== idioma =====
  // currentLang solo controla textos de interfaz que NO vienen de CONFIG
  // (botones, títulos fijos, etc). El contenido (recetas, días, bonos...)
  // se resuelve solo con CONFIG, que config.js ya deja apuntando al idioma
  // guardado. setLanguage() cambia ambos a la vez, en caliente.
  let currentLang = load(LS.lang, 'es');
  function t(key) { return (UI[currentLang] && UI[currentLang][key]) || UI.es[key] || key; }
  function tNivel(nivelKey) { return (NIVEL_DISPLAY[currentLang] && NIVEL_DISPLAY[currentLang][nivelKey]) || nivelKey; }
  function mesesArr() { return MESES_BY_LANG[currentLang] || MESES_BY_LANG.es; }
  function diasSemArr() { return DIAS_SEM_BY_LANG[currentLang] || DIAS_SEM_BY_LANG.es; }
  function calDowArr() { return CAL_DOW_BY_LANG[currentLang] || CAL_DOW_BY_LANG.es; }
  const NIVEL_DISPLAY = {
    es: { principiante: 'Principiante', intermedio: 'Intermedio', avanzado: 'Avanzado' },
    en: { principiante: 'Beginner', intermedio: 'Intermediate', avanzado: 'Advanced' },
  };
  const UI = {
    es: {
      settings_title: '⚙️ Configuración', settings_edit_profile: '👤 Editar nombre y foto', settings_appearance: 'Apariencia',
      settings_dark: '🌙 Oscuro', settings_light: '☀️ Claro', settings_language: 'Idioma',
      settings_lang_note: 'Por ahora "English" también está listo. El resto de idiomas están en camino — avisale a soporte cuál necesitás primero.',
      lang_not_ready: 'Ese idioma todavía no está listo, ¡pronto!',
      gear_tooltip: 'Configuración', share_streak_tooltip: 'Compartir mi racha',
      greeting_prefix: 'Hola', welcome_back: 'Bienvenido de nuevo', recruit_default: 'Recluta',
      profile_welcome_title: '¡Bienvenido, Recluta!', profile_edit_title: 'Editar Perfil',
      profile_welcome_sub: 'Antes de arrancar, contanos quién sos.', profile_edit_sub: 'Actualizá tu nombre o tu foto.',
      profile_name_label: 'Tu nombre', profile_name_placeholder: 'Ej: Mateo', profile_continue: 'Continuar →', profile_save: 'Guardar',
      share_copied_alert: '¡Copiado! Pegalo donde quieras compartirlo.',
      achievement_unlocked_label: 'Logro desbloqueado', badge_unlocked: 'DESBLOQUEADO', badge_locked: 'BLOQUEADO',
      photos_title: '📸 Fotos de Progreso', photos_day1: 'Día 1', photos_day32: 'Día 32 (mitad)', photos_day63: 'Día 63 (final)',
      photos_hint: 'Tocá cada casillero para subir o reemplazar tu foto.',
      photos_compare_hint: 'Subí la foto del Día 1 y del Día 63 para ver tu comparación antes/después.',
      photos_compare_title: 'Antes / Después', photos_before: 'ANTES', photos_after: 'DESPUÉS',
      home_recruitment_open: 'Reclutamiento Abierto', home_level_label: 'NIVEL:', home_phase_prefix: 'FASE',
      home_retry_quiz: '🔄 Rehacer test inicial', home_undo_day: '↩ Volver 1 día atrás',
      home_share_streak_btn: '📤 Compartir mi racha', home_start_training: '▷ Iniciar entrenamiento',
      home_mark_done: '✓ Marcar como completado', home_completed_check: '✓ Completado',
      home_official_platform_line2: 'Plataforma oficial. Acceso individual.',
      quiz_title: 'Test Inicial', quiz_finish: 'Finalizar', quiz_next: 'Siguiente',
      programa_title: 'Programa 63 Días', programa_sub: '3 Fases · 9 Semanas · Transformación completa',
      programa_total_progress: 'Progreso Total', status_pendiente: 'PENDIENTE', status_completo: 'COMPLETO', status_curso: 'EN CURSO',
      week_prefix: 'SEMANA', day_prefix: 'DÍA',
      watch_youtube: '▶ Mirar en YouTube', open_youtube: '↗ Abrir en YouTube',
      mark_completed_plain: 'Marcar como completado', modal_back: 'Volver',
      tuplan_premium_content: 'Contenido Premium', tuplan_bonos_sub: 'Contenido premium exclusivo para tu transformación',
      tuplan_progress_heading: 'Tu Progreso Personal', photos_card_tag: 'PERSONAL', photos_card_title: 'FOTOS DE PROGRESO',
      photos_card_desc: 'Subí tus fotos de antes/después y mirá tu transformación.', tuplan_bonos_included: 'Bonos Incluidos',
      bono_back: '‹ Volver',
      bono1_sub: 'Biblioteca de recetas interactiva', ingredients_label: 'Ingredientes', prep_label: 'Preparación',
      prep_today_btn: 'Hoy la preparo', saved_btn: '✓ Guardada', chosen_today_btn: '✓ Elegida para hoy',
      configure_profile: 'Configurá tu perfil', current_weight_label: 'Peso actual (kg)', target_weight_label: 'Peso objetivo (kg)',
      level_label: 'Nivel', save_profile_btn: 'Guardar Perfil', your_progress_label: 'Tu Progreso',
      current_kg_label: 'kg actual', target_kg_label: 'kg objetivo', estimated_progress: 'Progreso estimado',
      rep_goals_heading: 'Metas de repeticiones', plancha_label: 'Plancha (seg)', reminder_heading: 'Recordatorio',
      reminder_text: 'La constancia supera al talento. Entrená todos los días, aunque sea 15 minutos. Tu cuerpo cambia cuando tu mente no se rinde.',
      edit_profile_btn: 'Editar perfil',
      bono3_sub: 'Seleccioná tu estado actual',
      recommended_drink: 'Bebida recomendada', rest_type: 'Tipo de descanso', stretching_label: 'Estiramiento', resume_day_label: 'Día para retomar',
      bono4_sub: 'Registro diario de hábitos',
      today_prefix: '📅 Hoy –', habits_today_heading: '✅ Hábitos del día', history_heading: '📆 Historial de progreso',
      cal_legend_complete: 'Completo', cal_legend_partial: 'Parcial', cal_legend_none: 'Sin registro',
      summary_heading: '📊 Resumen de disciplina', days_trained_label: 'Días entrenados', consistency_label: 'Constancia', current_streak_label: 'Racha actual',
      bono5_sub: '// Archivo clasificado — Bono 05', configure_protocol: 'Configurá tu protocolo',
      four_data_note: '// 4 datos. Todo resuelto.', your_weight_label: 'Tu peso actual', train_time_label: '¿A qué hora entrenás?',
      objective_label: 'Objetivo', obj_grasa: 'Quemar grasa', obj_musculo: 'Ganar músculo', obj_ambos: 'Los dos',
      sleep_hours_label: '¿Cuántas horas dormís por noche?', sleep_time_label: '¿A qué hora te dormís?', activate_protocol_btn: 'Activar mi protocolo →',
      tab_pre: 'Pre-entreno', tab_nocturno: 'Nocturno', tab_alimentos: 'Alimentos', tab_compras: 'Compras', tab_timing: 'Timing', tab_mental: 'Mental',
      shake_title: 'Shake de Pólvora', today_protocol_note: '// Protocolo de hoy', classic_activation: 'Activación clásica',
      intake_time_label: 'Hora de toma', shake_ing1: 'Cacao puro — 8 g', shake_ing2: 'Jengibre fresco rallado — 1 cucharadita',
      shake_ing3: 'Agua caliente — 200 ml', shake_ing4: 'Pizca de sal marina',
      mark_taken_btn: '✓ Marcar como tomado', reconfig_btn: '⚙ Reconfigurar protocolo',
      night_ration_title: '🌙 Ración Nocturna de Testosterona', today_ration_note: '// Ración de hoy', suggested_time_label: 'Horario sugerido',
      objective_prefix: 'Objetivo:', eggs_warning: '⚠️ Siempre huevos bien cocidos. Nunca crudos.', mark_eaten_btn: '✓ Marcar como comido',
      clandestine_foods_title: '🥩 Alimentos Clandestinos',
      shopping_list_title: '🛒 Lista de Compras Semanal', shopping_list_sub: 'Lo que necesitás comprar esta semana para ejecutar los 3 protocolos.',
      copy_list_btn: 'Copiar lista', copied_btn: '✓ Copiado',
      today_protocol_title: '⏱ Tu Protocolo de Hoy', chronological_note: 'Todo en orden cronológico.',
      timeline_shake: 'Shake de Pólvora Pre-Combate', timeline_training: 'Entrenamiento',
      timeline_hydration: 'Hidratación post-entreno (500ml agua)', timeline_ration: 'Ración Nocturna de Testosterona', timeline_screens: 'Apagar pantallas',
      mental_title: '💪 Protocolo Mental del Toro', mental_sub: 'Para los días que no tenés ganas. Ese día es el más importante.',
      in_progress: 'En progreso…', start_mental_btn: 'Iniciar Protocolo Mental', phase_short: 'Fase',
      bono6_sub: '// Kit de blindaje — Bono 06',
      subsection_01: 'Sub-sección 01', audio_reset_title: '🎧 Audio de Reinicio — Nervio Vago',
      audio_reset_sub: 'Activación táctica del nervio vago en 3 minutos.', time_remaining_label: 'Tiempo restante',
      step_prefix: 'Paso', start_protocol_btn: 'Iniciar Protocolo',
      subsection_02: 'Sub-sección 02', hormone_guide_title: '🌙 Guía de Hormonas Nocturnas',
      hormone_guide_sub: 'Tildá cada noche al cumplir cada ítem.',
      subsection_03: 'Sub-sección 03', wakeup_manual_title: '☀️ Manual: Despertá Sin Dolor',
      info_title: 'Info', how_to_use: '¿Cómo usar el programa?',
      how_to_use_text: 'Cada día tiene un video de entrenamiento. Mirá el video, hacé la rutina y marcalo como completado. Al completar un día se desbloquea el siguiente. Las 3 semanas repiten los mismos 7 videos con intensidad progresiva.',
      recommendations_heading: 'Recomendaciones', what_do_i_need: '¿Qué necesito?',
      what_do_i_need_text: 'Solo tu cuerpo, un espacio libre (puede ser tu casa, un parque, cualquier lugar) y compromiso. No se necesitan pesas, bandas ni equipo especial.',
      support_heading: 'Soporte', support_text: '¿Tenés dudas o necesitás ayuda? Escribinos.',
      contact_support_btn: 'Contactar Soporte', copy_btn: 'Copiar',
      install_heading: 'Instalá la app en tu celular', install_sub: 'Accedé más rápido sin buscar el link cada vez. Se ve y funciona como una app real.',
      pwa_final_note: 'Una vez instalada, la app abre sin barras del navegador, igual que una app descargada.',
      ios_1t: 'Abrí esta página en Safari', ios_1d: 'No funciona desde Chrome ni otros navegadores',
      ios_2t: 'Tocá el botón Compartir', ios_2d: 'Es el ícono del centro abajo de la pantalla',
      ios_3t: 'Tocá Agregar a Inicio', ios_3d: 'Bajá en el menú hasta encontrar esa opción',
      ios_4t: 'Tocá Agregar arriba a la derecha', ios_4d: 'Listo, ya tenés el ícono en tu pantalla de inicio',
      and_1t: 'Abrí esta página en Chrome', and_1d: 'Funciona mejor desde el navegador Chrome',
      and_2t: 'Tocá el menú (3 puntos)', and_2d: 'Arriba a la derecha de la pantalla',
      and_3t: 'Tocá "Instalar app"', and_3d: 'O "Agregar a pantalla de inicio"',
      and_4t: 'Confirmá la instalación', and_4d: 'Listo, ya tenés el ícono en tu pantalla de inicio',
      nav_home: 'Home', nav_programa: 'Programa', nav_tuplan: 'Tu Plan', nav_info: 'Info',
    },
    en: {
      settings_title: '⚙️ Settings', settings_edit_profile: '👤 Edit name & photo', settings_appearance: 'Appearance',
      settings_dark: '🌙 Dark', settings_light: '☀️ Light', settings_language: 'Language',
      settings_lang_note: 'For now "Español" is also ready. The rest of the languages are on the way — let support know which one you need first.',
      lang_not_ready: "That language isn't ready yet, coming soon!",
      gear_tooltip: 'Settings', share_streak_tooltip: 'Share my streak',
      greeting_prefix: 'Hi', welcome_back: 'Welcome back', recruit_default: 'Recruit',
      profile_welcome_title: 'Welcome, Recruit!', profile_edit_title: 'Edit Profile',
      profile_welcome_sub: "Before we start, tell us who you are.", profile_edit_sub: 'Update your name or photo.',
      profile_name_label: 'Your name', profile_name_placeholder: 'E.g: John', profile_continue: 'Continue →', profile_save: 'Save',
      share_copied_alert: 'Copied! Paste it anywhere you want to share it.',
      achievement_unlocked_label: 'Achievement unlocked', badge_unlocked: 'UNLOCKED', badge_locked: 'LOCKED',
      photos_title: '📸 Progress Photos', photos_day1: 'Day 1', photos_day32: 'Day 32 (halfway)', photos_day63: 'Day 63 (final)',
      photos_hint: 'Tap each slot to upload or replace your photo.',
      photos_compare_hint: 'Upload your Day 1 and Day 63 photos to see your before/after comparison.',
      photos_compare_title: 'Before / After', photos_before: 'BEFORE', photos_after: 'AFTER',
      home_recruitment_open: 'Recruitment Open', home_level_label: 'LEVEL:', home_phase_prefix: 'PHASE',
      home_retry_quiz: '🔄 Retake initial test', home_undo_day: '↩ Go back 1 day',
      home_share_streak_btn: '📤 Share my streak', home_start_training: '▷ Start training',
      home_mark_done: '✓ Mark as completed', home_completed_check: '✓ Completed',
      home_official_platform_line2: 'Official platform. Individual access.',
      quiz_title: 'Initial Test', quiz_finish: 'Finish', quiz_next: 'Next',
      programa_title: '63-Day Program', programa_sub: '3 Phases · 9 Weeks · Complete transformation',
      programa_total_progress: 'Total Progress', status_pendiente: 'PENDING', status_completo: 'COMPLETE', status_curso: 'IN PROGRESS',
      week_prefix: 'WEEK', day_prefix: 'DAY',
      watch_youtube: '▶ Watch on YouTube', open_youtube: '↗ Open on YouTube',
      mark_completed_plain: 'Mark as completed', modal_back: 'Back',
      tuplan_premium_content: 'Premium Content', tuplan_bonos_sub: 'Exclusive premium content for your transformation',
      tuplan_progress_heading: 'Your Personal Progress', photos_card_tag: 'PERSONAL', photos_card_title: 'PROGRESS PHOTOS',
      photos_card_desc: 'Upload your before/after photos and watch your transformation.', tuplan_bonos_included: 'Included Bonuses',
      bono_back: '‹ Back',
      bono1_sub: 'Interactive recipe library', ingredients_label: 'Ingredients', prep_label: 'Preparation',
      prep_today_btn: "Making it today", saved_btn: '✓ Saved', chosen_today_btn: '✓ Chosen for today',
      configure_profile: 'Set up your profile', current_weight_label: 'Current weight (kg)', target_weight_label: 'Target weight (kg)',
      level_label: 'Level', save_profile_btn: 'Save Profile', your_progress_label: 'Your Progress',
      current_kg_label: 'current kg', target_kg_label: 'target kg', estimated_progress: 'Estimated progress',
      rep_goals_heading: 'Rep goals', plancha_label: 'Plank (sec)', reminder_heading: 'Reminder',
      reminder_text: "Consistency beats talent. Train every day, even if it's just 15 minutes. Your body changes when your mind doesn't give up.",
      edit_profile_btn: 'Edit profile',
      bono3_sub: 'Select your current state',
      recommended_drink: 'Recommended drink', rest_type: 'Type of rest', stretching_label: 'Stretching', resume_day_label: 'Day to resume',
      bono4_sub: 'Daily habit log',
      today_prefix: '📅 Today –', habits_today_heading: "✅ Today's habits", history_heading: '📆 Progress history',
      cal_legend_complete: 'Complete', cal_legend_partial: 'Partial', cal_legend_none: 'No record',
      summary_heading: '📊 Discipline summary', days_trained_label: 'Days trained', consistency_label: 'Consistency', current_streak_label: 'Current streak',
      bono5_sub: '// Classified file — Bonus 05', configure_protocol: 'Set up your protocol',
      four_data_note: '// 4 data points. All set.', your_weight_label: 'Your current weight', train_time_label: 'What time do you train?',
      objective_label: 'Goal', obj_grasa: 'Burn fat', obj_musculo: 'Gain muscle', obj_ambos: 'Both',
      sleep_hours_label: 'How many hours do you sleep per night?', sleep_time_label: 'What time do you go to sleep?', activate_protocol_btn: 'Activate my protocol →',
      tab_pre: 'Pre-Workout', tab_nocturno: 'Night', tab_alimentos: 'Foods', tab_compras: 'Shopping', tab_timing: 'Timing', tab_mental: 'Mental',
      shake_title: 'Gunpowder Shake', today_protocol_note: "// Today's protocol", classic_activation: 'Classic activation',
      intake_time_label: 'Intake time', shake_ing1: 'Pure cocoa — 8 g', shake_ing2: 'Fresh grated ginger — 1 teaspoon',
      shake_ing3: 'Hot water — 200 ml', shake_ing4: 'Pinch of sea salt',
      mark_taken_btn: '✓ Mark as taken', reconfig_btn: '⚙ Reconfigure protocol',
      night_ration_title: '🌙 Night Testosterone Ration', today_ration_note: "// Today's ration", suggested_time_label: 'Suggested time',
      objective_prefix: 'Goal:', eggs_warning: '⚠️ Always fully cooked eggs. Never raw.', mark_eaten_btn: '✓ Mark as eaten',
      clandestine_foods_title: '🥩 Clandestine Foods',
      shopping_list_title: '🛒 Weekly Shopping List', shopping_list_sub: 'What you need to buy this week to run all 3 protocols.',
      copy_list_btn: 'Copy list', copied_btn: '✓ Copied',
      today_protocol_title: '⏱ Your Protocol for Today', chronological_note: 'Everything in chronological order.',
      timeline_shake: 'Pre-Combat Gunpowder Shake', timeline_training: 'Training',
      timeline_hydration: 'Post-workout hydration (500ml water)', timeline_ration: 'Night Testosterone Ration', timeline_screens: 'Turn off screens',
      mental_title: "💪 The Bull's Mental Protocol", mental_sub: "For the days you don't feel like it. That's the day that matters most.",
      in_progress: 'In progress…', start_mental_btn: 'Start Mental Protocol', phase_short: 'Phase',
      bono6_sub: '// Armor kit — Bonus 06',
      subsection_01: 'Subsection 01', audio_reset_title: '🎧 Reset Audio — Vagus Nerve',
      audio_reset_sub: 'Tactical vagus nerve activation in 3 minutes.', time_remaining_label: 'Time remaining',
      step_prefix: 'Step', start_protocol_btn: 'Start Protocol',
      subsection_02: 'Subsection 02', hormone_guide_title: '🌙 Night Hormone Guide',
      hormone_guide_sub: 'Check each item off every night you complete it.',
      subsection_03: 'Subsection 03', wakeup_manual_title: '☀️ Manual: Wake Up Pain-Free',
      info_title: 'Info', how_to_use: 'How to use the program?',
      how_to_use_text: "Each day has a training video. Watch the video, do the routine and mark it as completed. Completing a day unlocks the next one. Each 3-week block repeats the same 7 videos with progressively higher intensity.",
      recommendations_heading: 'Recommendations', what_do_i_need: 'What do I need?',
      what_do_i_need_text: 'Just your body, an open space (your home, a park, anywhere) and commitment. No weights, bands or special equipment needed.',
      support_heading: 'Support', support_text: 'Have questions or need help? Write to us.',
      contact_support_btn: 'Contact Support', copy_btn: 'Copy',
      install_heading: 'Install the app on your phone', install_sub: 'Get in faster without searching for the link every time. It looks and works like a real app.',
      pwa_final_note: 'Once installed, the app opens without browser bars, just like a downloaded app.',
      ios_1t: 'Open this page in Safari', ios_1d: "Doesn't work from Chrome or other browsers",
      ios_2t: 'Tap the Share button', ios_2d: "It's the icon in the bottom center of the screen",
      ios_3t: 'Tap Add to Home Screen', ios_3d: 'Scroll down the menu until you find that option',
      ios_4t: 'Tap Add in the top right', ios_4d: "Done, you now have the icon on your home screen",
      and_1t: 'Open this page in Chrome', and_1d: 'Works best from the Chrome browser',
      and_2t: 'Tap the menu (3 dots)', and_2d: 'Top right of the screen',
      and_3t: 'Tap "Install app"', and_3d: 'Or "Add to Home screen"',
      and_4t: 'Confirm the install', and_4d: "Done, you now have the icon on your home screen",
      nav_home: 'Home', nav_programa: 'Program', nav_tuplan: 'My Plan', nav_info: 'Info',
    },
  };
  // Traduce el nombre de la pestaña inferior + el <title> de la página.
  function applyChromeStrings() {
    const map = { '/': 'nav_home', '/programa': 'nav_programa', '/tu-plan': 'nav_tuplan', '/info': 'nav_info' };
    document.querySelectorAll('.nav-link').forEach(a => {
      const key = map[a.dataset.path];
      if (key) { const ic = a.querySelector('.ic'); a.textContent = ''; if (ic) a.appendChild(ic); a.appendChild(document.createTextNode(t(key))); }
    });
    document.title = currentLang === 'en' ? 'Calistenia Pro — Military Calisthenics Program' : 'Calistenia Pro — Programa de Calistenia Militar';
  }
  // Cambia el idioma en caliente: repinta CONFIG, guarda la preferencia,
  // resetea estados transitorios de los bonos (para no mezclar textos de
  // dos idiomas en una pantalla ya abierta) y vuelve a renderizar.
  function setLanguage(lang) {
    if (!window.CONTENT[lang]) return;
    currentLang = lang;
    window.CONFIG = window.CONTENT[lang];
    save(LS.lang, lang);
    bonoState = null; recipeFilter = 'todas'; openRecipe = null;
    bono2Editing = false; recoverySel = null; bono5Tab = 'pre'; bono5Editing = false;
    applyChromeStrings();
    render();
  }

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

  // Tema claro/oscuro: se guarda en localStorage y se aplica con un atributo
  // en <html> (ver el bloque html[data-theme="light"] en index.html). Oscuro
  // sigue siendo el default de toda la vida si nunca se tocó el ajuste.
  function applyTheme(theme) {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    save(LS.theme, theme);
  }

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
      '<div class="top-header-name" id="hdrName"><b>' + t('greeting_prefix') + ', ' + (profile.name ? esc(profile.name) : t('recruit_default')) + ' 👋</b><span>' + t('welcome_back') + '</span></div>' +
      '<button class="streak-pill" id="hdrStreak" title="' + t('share_streak_tooltip') + '">🔥 ' + displayStreak + '</button>' +
      '<button class="gear-btn" id="hdrGear" title="' + t('gear_tooltip') + '">⚙️</button>';
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
    document.getElementById('hdrGear').onclick = openSettingsModal;
  }

  // Modal de Configuración: editar perfil, tema claro/oscuro e idioma.
  function openSettingsModal() {
    const theme = load(LS.theme, 'dark');
    const lang = load(LS.lang, 'es');
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal-box">' +
      '<div class="modal-top"><h2 style="font-size:17px;text-transform:uppercase">' + t('settings_title') + '</h2><button class="btn-ghost" id="mClose" style="font-size:20px;line-height:1">✕</button></div>' +
      '<button class="btn btn-secondary" id="sEditProfile" style="margin-bottom:10px">' + t('settings_edit_profile') + '</button>' +
      '<p class="settings-label">' + t('settings_appearance') + '</p>' +
      '<div class="seg-row">' +
      '<button class="seg-btn' + (theme !== 'light' ? ' sel' : '') + '" data-theme="dark">' + t('settings_dark') + '</button>' +
      '<button class="seg-btn' + (theme === 'light' ? ' sel' : '') + '" data-theme="light">' + t('settings_light') + '</button>' +
      '</div>' +
      '<p class="settings-label">' + t('settings_language') + '</p>' +
      CONFIG.LANGUAGES.map(l => '<div class="lang-row" data-lang="' + l.code + '"><span>' + l.flag + ' ' + esc(l.label) + '</span>' + (lang === l.code ? '<span class="chk">✓</span>' : '') + '</div>').join('') +
      '<p style="color:hsl(var(--muted-foreground));font-size:11.5px;margin-top:6px">' + t('settings_lang_note') + '</p>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#mClose').onclick = () => overlay.remove();
    overlay.querySelector('#sEditProfile').onclick = () => { overlay.remove(); openProfileModal(false); };
    overlay.querySelectorAll('.seg-btn').forEach(b => {
      b.onclick = () => { applyTheme(b.dataset.theme); overlay.remove(); openSettingsModal(); };
    });
    overlay.querySelectorAll('.lang-row').forEach(r => {
      r.onclick = () => {
        if (r.dataset.lang !== 'es' && r.dataset.lang !== 'en') { alert(t('lang_not_ready')); return; }
        overlay.remove();
        setLanguage(r.dataset.lang);
        openSettingsModal();
      };
    });
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
      '<h2 style="font-size:19px;text-transform:uppercase;margin-bottom:6px">' + (isOnboarding ? t('profile_welcome_title') : t('profile_edit_title')) + '</h2>' +
      '<p style="color:hsl(var(--muted-foreground));font-size:13px;margin-bottom:18px">' + (isOnboarding ? t('profile_welcome_sub') : t('profile_edit_sub')) + '</p>' +
      '<div class="avatar-picker" id="pAvatar">' + (tempPhoto ? '<img src="' + tempPhoto + '" alt="">' : '📷') + '</div>' +
      '<div class="field" style="text-align:left"><label>' + t('profile_name_label') + '</label><input type="text" id="pName" placeholder="' + t('profile_name_placeholder') + '" value="' + esc(profile.name || '') + '" maxlength="24"></div>' +
      '<button class="btn btn-primary" id="pSave"' + (profile.name ? '' : ' disabled') + '>' + (isOnboarding ? t('profile_continue') : t('profile_save')) + '</button>' +
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
    const toastEl = document.createElement('div');
    toastEl.style.cssText = 'position:fixed;left:50%;top:14px;transform:translate(-50%,-20px);opacity:0;transition:all .35s ease;background:hsl(var(--card));border:1px solid hsl(var(--primary));border-radius:14px;padding:12px 18px;display:flex;align-items:center;gap:10px;z-index:60;box-shadow:0 8px 24px -8px rgba(0,0,0,.5);max-width:90%';
    toastEl.innerHTML = '<span style="font-size:26px">' + ach.icon + '</span><div><b style="display:block;font-size:12px;color:hsl(var(--primary));text-transform:uppercase;letter-spacing:.04em">' + t('achievement_unlocked_label') + '</b><span style="font-size:13.5px;font-weight:700">' + esc(ach.title) + '</span></div>';
    document.body.appendChild(toastEl);
    requestAnimationFrame(() => { toastEl.style.opacity = '1'; toastEl.style.transform = 'translate(-50%,0)'; });
    setTimeout(() => { toastEl.style.opacity = '0'; toastEl.style.transform = 'translate(-50%,-20px)'; setTimeout(() => toastEl.remove(), 400); }, 3200);
  }

  // Comparte (o copia si el navegador no soporta compartir nativo) un
  // resumen de la racha + progreso actual.
  function shareProgress() {
    const progress = load(LS.progress, { completedDays: [] });
    const totalDone = new Set(progress.completedDays).size;
    const streak = load(LS.streak, { count: 0, best: 0, lastDate: null });
    const today = todayStr();
    const displayStreak = streak.lastDate && daysBetween(streak.lastDate, today) <= 1 ? streak.count : 0;
    const text = (currentLang === 'en'
      ? '🔥 I\'m on a ' + displayStreak + '-day streak training with ' + CONFIG.BRAND + '. I\'ve already completed ' + totalDone + ' of 63 days of my transformation! 💪' +
        '\n\nWant to start your own training? 👉 ' + CONFIG.QUIZ_URL
      : '🔥 Llevo ' + displayStreak + ' día' + (displayStreak === 1 ? '' : 's') + ' de racha entrenando con ' + CONFIG.BRAND + '. ¡Ya completé ' + totalDone + ' de 63 días de mi transformación! 💪' +
        '\n\n¿Querés arrancar tu propio entrenamiento? 👉 ' + CONFIG.QUIZ_URL);
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
      navigator.clipboard.writeText(text).then(() => alert(t('share_copied_alert'))).catch(() => { fallbackCopy(text); alert(t('share_copied_alert')); });
    } else {
      fallbackCopy(text); alert(t('share_copied_alert'));
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
      '<span class="pill ' + (unlocked ? 'completo' : 'pendiente') + '">' + (unlocked ? t('badge_unlocked') : t('badge_locked')) + '</span>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#mClose').onclick = () => overlay.remove();
  }

  // Fotos de progreso: 3 casilleros (día 1 / 32 / 63). Al tener día 1 y día
  // 63 muestra la comparación antes/después.
  function openProgressPhotosModal() {
    const photos = load(LS.progressPhotos, { d1: null, d32: null, d63: null });
    const defs = [['d1', t('photos_day1')], ['d32', t('photos_day32')], ['d63', t('photos_day63')]];
    function slotsHtml() {
      return '<div class="photo-slot-row">' + defs.map(([k, lbl]) => {
        const src = photos[k];
        return '<div class="photo-slot' + (src ? ' filled' : '') + '" data-k="' + k + '">' + (src ? '<img src="' + src + '" alt="">' : '') + '<span class="lbl">' + (src ? lbl : '📷<br>' + lbl) + '</span></div>';
      }).join('') + '</div>';
    }
    function compareHtml() {
      if (!photos.d1 || !photos.d63) return '<p style="text-align:center;color:hsl(var(--muted-foreground));font-size:12.5px;margin-top:6px">' + t('photos_compare_hint') + '</p>';
      return '<h3 style="font-size:12px;letter-spacing:.05em;color:hsl(var(--primary));text-transform:uppercase;margin:18px 0 8px;text-align:center">' + t('photos_compare_title') + '</h3>' +
        '<div style="display:flex;gap:10px">' +
        '<div style="flex:1"><img src="' + photos.d1 + '" style="width:100%;border-radius:12px;display:block;aspect-ratio:3/4;object-fit:cover"><p style="text-align:center;font-size:11px;color:hsl(var(--muted-foreground));margin-top:4px">' + t('photos_before') + '</p></div>' +
        '<div style="flex:1"><img src="' + photos.d63 + '" style="width:100%;border-radius:12px;display:block;aspect-ratio:3/4;object-fit:cover"><p style="text-align:center;font-size:11px;color:hsl(var(--muted-foreground));margin-top:4px">' + t('photos_after') + '</p></div>' +
        '</div>';
    }
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal-box">' +
      '<div class="modal-top"><h2 style="font-size:17px;text-transform:uppercase">' + t('photos_title') + '</h2><button class="btn-ghost" id="mClose" style="font-size:20px;line-height:1">✕</button></div>' +
      '<p style="color:hsl(var(--muted-foreground));font-size:12.5px;margin-bottom:4px">' + t('photos_hint') + '</p>' +
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
    let html = '<div class="hero-badge"><span class="dot"></span>' + t('home_recruitment_open') + '</div>' +
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
        '<div style="text-align:center;margin-bottom:14px"><span class="tag" style="font-size:12px">' + t('home_level_label') + ' <b style="color:hsl(var(--primary))">' + esc(tNivel(nivel).toUpperCase()) + '</b></span></div>' +
        '<p style="text-align:center;color:hsl(var(--muted-foreground));font-style:italic;font-size:13.5px;margin-bottom:16px">' + esc(CONFIG.MOTIVATIONAL_QUOTE) + '</p>' +
        '<p style="text-align:center;color:hsl(var(--primary));font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.03em;margin-bottom:14px">' + t('home_phase_prefix') + ' ' + (phase && CONFIG.PHASES.indexOf(phase) + 1) + ' – ' + esc(phase ? phase.name : '') + '</p>' +
        '<div style="display:flex;gap:10px;margin-bottom:24px">' +
        '<button class="btn btn-secondary" id="retryQuiz" style="flex:1;font-size:12.5px">' + t('home_retry_quiz') + '</button>' +
        '<button class="btn btn-secondary" id="undoDay" style="flex:1;font-size:12.5px"' + (totalDone === 0 ? ' disabled' : '') + '>' + t('home_undo_day') + '</button>' +
        '</div>' +
        '<div style="margin-bottom:8px">' + progressRingSVG(pct, totalDone, '/63') + '</div>' +
        '<p style="text-align:center;color:hsl(var(--muted-foreground));font-size:13px;margin-bottom:10px">' + (currentLang === 'en' ? "You've completed " + totalDone + ' of 63 days' : 'Has completado ' + totalDone + ' de 63 días') + '</p>' +
        '<button class="btn btn-secondary" id="shareStreak" style="margin-bottom:22px">' + t('home_share_streak_btn') + '</button>' +
        '<div class="card" style="text-align:center">' +
        '<span class="pill completo" style="margin-bottom:12px;display:inline-block">' + (currentLang === 'en' ? 'DAY ' + todayNum + ' OF 63' : 'DÍA ' + todayNum + ' DE 63') + '</span>' +
        '<h2 style="font-size:20px;text-transform:uppercase;margin-bottom:8px">' + esc(today.t) + '</h2>' +
        '<p style="color:hsl(var(--muted-foreground));font-size:13.5px;margin-bottom:12px">' + esc(today.desc || '') + '</p>' +
        '<p style="color:hsl(var(--muted-foreground));font-size:13px;margin-bottom:16px">🕐 ' + today.min + ' min</p>' +
        '<button class="btn btn-primary" id="startTraining" style="margin-bottom:10px">' + t('home_start_training') + '</button>' +
        '<button class="btn btn-secondary" id="markTodayDone"' + (todayDone ? ' disabled' : '') + '>' + (todayDone ? t('home_completed_check') : t('home_mark_done')) + '</button>' +
        '</div>' +
        '<p class="foot-note">' + esc(CONFIG.COPYRIGHT_FOOTER) + '<br>' + t('home_official_platform_line2') + '</p>';
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
      '<h2 class="quiz-title">' + t('quiz_title') + '</h2>' +
      '<p class="quiz-sub">' + (currentLang === 'en' ? 'Answer to find out your level (' + (step + 1) + '/' + total + ')' : 'Respondé para conocer tu nivel (' + (step + 1) + '/' + total + ')') + '</p>' +
      '<p class="quiz-q">' + esc(q.q) + '</p>';
    q.opts.forEach(o => {
      html += '<div class="radio-row' + (picked === o.v ? ' sel' : '') + '" data-v="' + o.v + '"><span class="radio-dot"></span><span>' + esc(o.t) + '</span></div>';
    });
    html += '<button class="btn btn-primary" id="quizNext"' + (!picked ? ' disabled' : '') + '>' + (step === total - 1 ? t('quiz_finish') : t('quiz_next')) + '</button>' +
      '</div><p class="foot-note">' + (currentLang === 'en' ? 'Official ' + esc(CONFIG.BRAND) + ' platform' : 'Plataforma oficial ' + esc(CONFIG.BRAND)) + '</p>';
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

    let html = '<h1 style="font-size:22px;text-transform:uppercase">' + t('programa_title') + '</h1>' +
      '<p style="color:hsl(var(--muted-foreground));font-size:13px;margin-top:4px">' + t('programa_sub') + '</p>' +
      '<div class="stat-block"><div style="font-size:11px;letter-spacing:.08em;color:hsl(var(--muted-foreground));text-transform:uppercase">' + t('programa_total_progress') + '</div>' +
      '<div class="stat-pct">' + pct + '%</div>' +
      '<div class="stat-sub">' + (currentLang === 'en' ? totalDone + '/63 days completed' : totalDone + '/63 días completados') + '</div>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>';

    CONFIG.PHASES.forEach((phase, pIdx) => {
      const phaseDays = DAYS.filter(d => d.phaseIdx === pIdx);
      const phaseDone = phaseDays.filter(d => doneSet.has(d.num)).length;
      const phasePct = Math.round((phaseDone / phaseDays.length) * 100);
      let status = 'pendiente', statusLabel = t('status_pendiente');
      if (phaseDone === phaseDays.length) { status = 'completo'; statusLabel = t('status_completo'); }
      else if (phaseDone > 0) { status = 'curso'; statusLabel = t('status_curso'); }
      html += '<div class="phase-block">' +
        '<div class="phase-head"><span style="font-size:12px;font-weight:700;letter-spacing:.06em;color:hsl(var(--muted-foreground))">' + t('home_phase_prefix') + ' ' + (pIdx + 1) + '</span><span class="pill ' + status + '">' + statusLabel + '</span></div>' +
        '<h2 class="phase-title">' + esc(phase.name) + '</h2>' +
        '<p class="phase-desc">' + esc(phase.desc) + '</p>' +
        '<p class="phase-meta">' + (currentLang === 'en' ? 'Weeks ' + phase.weekStart + '-' + phase.weekEnd + ' &middot; ' + phaseDone + '/' + phaseDays.length + ' days · ' + phasePct + '%' : 'Semanas ' + phase.weekStart + '-' + phase.weekEnd + ' &middot; ' + phaseDone + '/' + phaseDays.length + ' días · ' + phasePct + '%') + '</p>';
      for (let w = phase.weekStart; w <= phase.weekEnd; w++) {
        html += '<div class="week-head">' + t('week_prefix') + ' ' + w + '</div>';
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
      '<div class="modal-top"><div><span class="tag" style="margin-right:6px">' + t('day_prefix') + ' ' + num + '</span><span class="tag">' + day.min + ' min</span></div><button class="btn-ghost" id="mClose" style="font-size:20px;line-height:1">✕</button></div>' +
      '<h2 style="font-size:20px;text-transform:uppercase;margin:14px 0 12px">' + esc(day.t) + '</h2>' +
      '<a href="' + ytUrl + '" target="_blank" rel="noopener" class="video-wrap" style="display:block;position:relative">' +
      '<img src="' + CONFIG.PLACEHOLDER_VIDEO_THUMB + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block">' +
      '<span style="position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,.65);color:#fff;padding:6px 12px;border-radius:20px;font-size:12.5px;font-weight:700;display:flex;align-items:center;gap:6px">' + t('watch_youtube') + '</span>' +
      '</a>' +
      '<a class="btn btn-secondary" style="margin:14px 0 10px;display:block" href="' + ytUrl + '" target="_blank" rel="noopener">' + t('open_youtube') + '</a>' +
      '<button class="btn btn-secondary" id="mComplete" style="margin-bottom:14px">' + (done ? t('home_completed_check') : t('mark_completed_plain')) + '</button>' +
      '<button class="btn-ghost" id="mBack" style="display:block;margin:0 auto">' + t('modal_back') + '</button>' +
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
    let html = '<div class="hero-badge"><span class="dot"></span>' + t('tuplan_premium_content') + '</div>' +
      '<h1 class="brand-h1" style="font-size:22px">' + (currentLang === 'en' ? '🎁 ' + esc(CONFIG.BRAND_SHORT) + ' Bonuses' : '🎁 Bonos ' + esc(CONFIG.BRAND_SHORT)) + '</h1>' +
      '<p class="brand-sub">' + t('tuplan_bonos_sub') + '</p>';

    html += '<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:hsl(var(--muted-foreground));margin:22px 0 2px">' + t('tuplan_progress_heading') + '</h2>';
    html += '<div class="badge-grid">' + CONFIG.ACHIEVEMENTS.map(a => {
      const un = unlocked.has(a.id);
      return '<div class="badge-cell' + (un ? '' : ' locked') + '" data-id="' + a.id + '"><div class="badge-ic">' + a.icon + '</div><div class="badge-label">' + esc(a.title) + '</div></div>';
    }).join('') + '</div>';
    html += '<button class="bono-card" id="openFotos"><div class="bono-num">📸</div>' +
      '<div><span class="tag">' + t('photos_card_tag') + '</span><div class="bono-title">' + t('photos_card_title') + '</div><div class="bono-desc">' + t('photos_card_desc') + '</div></div></button>';

    html += '<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:hsl(var(--muted-foreground));margin:24px 0 2px">' + t('tuplan_bonos_included') + '</h2>';
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
    return '<button class="btn-ghost" id="bonoBack" style="margin-bottom:14px">' + t('bono_back') + '</button>' +
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
    let html = bonoHeader(CONFIG.BONOS[0].title, t('bono1_sub'));
    html += '<div class="filter-row">';
    CONFIG.RECIPE_CATEGORIES.forEach(c => {
      html += '<div class="chip' + (recipeFilter === c.v ? ' sel' : '') + '" data-v="' + c.v + '">' + esc(c.t) + '</div>';
    });
    html += '</div><p style="font-size:12px;color:hsl(var(--muted-foreground));margin-bottom:10px">' + (currentLang === 'en' ? list.length + ' recipes' : list.length + ' recetas') + '</p>';
    list.forEach(r => {
      const catObj = CONFIG.RECIPE_CATEGORIES.find(c => c.v === r.cat);
      const isOpen = openRecipe === r.i;
      const isSaved = saved.indexOf(r.i) !== -1;
      html += '<div class="recipe-row" data-i="' + r.i + '"><span class="tag">' + esc(catObj ? catObj.t : '') + '</span>' +
        '<h3>' + esc(r.name.toUpperCase()) + '</h3>';
      if (isOpen) {
        html += '<div class="recipe-body">' +
          '<h4>' + t('ingredients_label') + '</h4><ul class="ingredient-list">' + r.ing.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
          '<h4>' + t('prep_label') + '</h4><p>' + esc(r.prep) + '</p>' +
          '<div class="recipe-actions"><button class="btn btn-secondary" data-act="prep" data-i="' + r.i + '">' + t('prep_today_btn') + '</button>' +
          '<button class="btn ' + (isSaved ? 'btn-primary' : 'btn-secondary') + '" data-act="save" data-i="' + r.i + '">' + (isSaved ? t('saved_btn') : t('profile_save')) + '</button></div>' +
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
      b.onclick = (e) => { e.stopPropagation(); b.textContent = t('chosen_today_btn'); b.disabled = true; };
    });
  }

  // ---------- Bono 2: plan de progreso ----------
  let bono2Editing = false;
  function renderBono2() {
    const profile = load(LS.bono2, null);
    let html = bonoHeader(CONFIG.BONOS[1].title, (currentLang === 'en' ? 'Your ' + CONFIG.BRAND_SHORT + ' evolution' : 'Tu evolución ' + CONFIG.BRAND_SHORT));
    if (!profile || bono2Editing) {
      html += '<div class="card"><h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin-bottom:14px">' + t('configure_profile') + '</h3>' +
        '<div class="field"><label>' + t('current_weight_label') + '</label><input type="number" id="pesoActual" value="' + (profile ? profile.peso : 80) + '"></div>' +
        '<div class="field"><label>' + t('target_weight_label') + '</label><input type="number" id="pesoObjetivo" value="' + (profile ? profile.objetivo : 72) + '"></div>' +
        '<div class="field"><label>' + t('level_label') + '</label>';
      ['principiante', 'intermedio', 'avanzado'].forEach(nv => {
        html += '<div class="radio-row' + ((profile && profile.nivel === nv) ? ' sel' : '') + '" data-nivel="' + nv + '"><span class="radio-dot"></span><span>' + tNivel(nv) + '</span></div>';
      });
      html += '</div><button class="btn btn-primary" id="saveProfile">' + t('save_profile_btn') + '</button></div>';
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
    html += '<div class="card"><p style="text-align:center;font-size:11px;letter-spacing:.08em;color:hsl(var(--muted-foreground));text-transform:uppercase">' + t('your_progress_label') + '</p>' +
      '<p style="text-align:center;font-size:20px;font-weight:800;color:hsl(var(--primary));text-transform:uppercase;margin:2px 0 14px">' + tNivel(profile.nivel) + '</p>' +
      '<div class="stat-row"><div class="stat-box"><div class="v">' + profile.peso + '</div><div class="l">' + t('current_kg_label') + '</div></div>' +
      '<div class="stat-box"><div class="v">' + profile.objetivo + '</div><div class="l">' + t('target_kg_label') + '</div></div></div>' +
      '<p style="font-size:12px;color:hsl(var(--muted-foreground));margin-bottom:4px">' + t('estimated_progress') + '</p>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<p style="text-align:right;font-size:13px;font-weight:700;color:hsl(var(--primary));margin-top:4px">' + pct + '%</p>' +
      '<h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin:20px 0 10px">' + t('rep_goals_heading') + '</h3>' +
      '<div class="stat-row"><div class="stat-box"><div class="v">' + metas.pushups + '</div><div class="l">pushups</div></div><div class="stat-box"><div class="v">' + metas.squats + '</div><div class="l">squats</div></div></div>' +
      '<div class="stat-row"><div class="stat-box"><div class="v">' + metas.burpees + '</div><div class="l">burpees</div></div><div class="stat-box"><div class="v">' + metas.plancha + '</div><div class="l">' + t('plancha_label') + '</div></div></div>' +
      '<h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin:20px 0 8px">' + t('reminder_heading') + '</h3>' +
      '<p style="font-size:13.5px;color:hsl(var(--muted-foreground));line-height:1.5">' + t('reminder_text') + '</p>' +
      '<button class="btn btn-secondary" id="editProfile" style="margin-top:16px">' + t('edit_profile_btn') + '</button></div>';
    view.innerHTML = html; bindBack();
    document.getElementById('editProfile').onclick = () => { bono2Editing = true; renderBono2(); };
  }

  // ---------- Bono 3: recuperación ----------
  let recoverySel = null;
  function renderBono3() {
    let html = bonoHeader(CONFIG.BONOS[2].title, t('bono3_sub'));
    CONFIG.RECOVERY_STATES.forEach(s => {
      html += '<div class="recovery-btn' + (recoverySel === s.v ? ' sel' : '') + '" data-v="' + s.v + '"><b>' + esc(s.t) + '</b><span>' + esc(s.desc) + '</span></div>';
    });
    if (recoverySel) {
      const s = CONFIG.RECOVERY_STATES.find(x => x.v === recoverySel);
      html += '<div class="result-block"><h4>' + t('recommended_drink') + '</h4><p>' + esc(s.bebida) + '</p></div>' +
        '<div class="result-block"><h4>' + t('rest_type') + '</h4><p>' + esc(s.descanso) + '</p></div>' +
        '<div class="result-block"><h4>' + t('stretching_label') + '</h4><p>' + esc(s.estiramiento) + '</p></div>' +
        '<div class="result-block"><h4>' + t('resume_day_label') + '</h4><p>' + esc(s.retomar) + '</p></div>';
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
    let html = bonoHeader(CONFIG.BONOS[3].title, t('bono4_sub'));
    const todayLine = currentLang === 'en'
      ? diasSemArr()[today.getDay()] + ', ' + mesesArr()[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear()
      : diasSemArr()[today.getDay()] + ', ' + today.getDate() + ' de ' + mesesArr()[today.getMonth()] + ' de ' + today.getFullYear();
    html += '<p style="font-size:12px;color:hsl(var(--muted-foreground));text-transform:uppercase;letter-spacing:.04em">' + t('today_prefix') + ' ' + todayLine + '</p>';
    html += '<div class="card" style="margin-top:10px"><h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin-bottom:6px">' + t('habits_today_heading') + '</h3>';
    CONFIG.HABITS.forEach(h => {
      const on = !!todayHabits[h.k];
      html += '<div class="habit-row"><span>' + esc(h.t) + '</span><div class="habit-check' + (on ? ' on' : '') + '" data-k="' + h.k + '">' + (on ? '✓' : '') + '</div></div>';
    });
    html += '</div>';

    const y = today.getFullYear(), m = today.getMonth();
    const firstDay = new Date(y, m, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const monthLine = currentLang === 'en' ? mesesArr()[m] + ' ' + y : mesesArr()[m] + ' de ' + y;
    html += '<div class="card" style="margin-top:16px"><h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin-bottom:6px">' + t('history_heading') + '</h3>' +
      '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin-bottom:8px;text-transform:capitalize">' + monthLine + '</p><div class="cal-grid">';
    calDowArr().forEach(d => { html += '<div class="cal-dow">' + d + '</div>'; });
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
    html += '</div><div class="cal-legend"><span><i style="background:hsl(var(--primary))"></i>' + t('cal_legend_complete') + '</span><span><i style="background:hsla(var(--primary)/.35)"></i>' + t('cal_legend_partial') + '</span><span><i style="background:hsl(var(--secondary))"></i>' + t('cal_legend_none') + '</span></div></div>';

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
    html += '<div class="card" style="margin-top:16px"><h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin-bottom:10px">' + t('summary_heading') + '</h3>' +
      '<div class="stat-row"><div class="stat-box"><div class="v">' + trained + '</div><div class="l">' + t('days_trained_label') + '</div></div>' +
      '<div class="stat-box"><div class="v">' + constancia + '%</div><div class="l">' + t('consistency_label') + '</div></div>' +
      '<div class="stat-box"><div class="v">' + streak + '</div><div class="l">' + t('current_streak_label') + '</div></div></div></div>';

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
    let html = bonoHeader(CONFIG.BONOS[4].title, t('bono5_sub'));
    if (!profile || bono5Editing) {
      html += '<div class="card"><h3 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:hsl(var(--primary));margin-bottom:4px">' + t('configure_protocol') + '</h3>' +
        '<p style="font-size:12px;color:hsl(var(--muted-foreground));margin-bottom:16px">' + t('four_data_note') + '</p>' +
        '<div class="field"><label>' + t('your_weight_label') + '</label><input type="number" id="b5peso" value="' + (profile ? profile.peso : 80) + '"></div>' +
        '<div class="field"><label>' + t('train_time_label') + '</label><input type="time" id="b5hora" value="' + (profile ? profile.horaEntreno : '07:00') + '"></div>' +
        '<div class="field"><label>' + t('objective_label') + '</label>';
      [['grasa', t('obj_grasa')], ['musculo', t('obj_musculo')], ['ambos', t('obj_ambos')]].forEach(pair => {
        html += '<div class="radio-row" data-obj="' + pair[0] + '"><span class="radio-dot"></span><span>' + pair[1] + '</span></div>';
      });
      html += '</div><div class="field"><label>' + t('sleep_hours_label') + '</label><input type="number" id="b5horasSueno" value="' + (profile ? profile.horasSueno : 7) + '"></div>' +
        '<div class="field"><label>' + t('sleep_time_label') + '</label><input type="time" id="b5horaDormir" value="' + (profile ? profile.horaDormir : '23:00') + '"></div>' +
        '<button class="btn btn-primary" id="activarProtocolo">' + t('activate_protocol_btn') + '</button></div>';
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
    const tabs = [['pre', t('tab_pre')], ['nocturno', t('tab_nocturno')], ['alimentos', t('tab_alimentos')], ['compras', t('tab_compras')], ['timing', t('tab_timing')], ['mental', t('tab_mental')]];
    html += '<div class="tabs-row">' + tabs.map(pair => '<div class="tab-btn' + (bono5Tab === pair[0] ? ' sel' : '') + '" data-t="' + pair[0] + '">' + pair[1].toUpperCase() + '</div>').join('') + '</div>';

    if (bono5Tab === 'pre') {
      html += '<div class="card"><p style="font-size:18px;margin-bottom:2px">⚡ <b>' + t('shake_title') + '</b></p>' +
        '<p class="mono-header">' + t('today_protocol_note') + '</p>' +
        '<p style="font-weight:700;color:hsl(var(--primary));text-transform:uppercase;margin:8px 0 2px">' + t('classic_activation') + '</p>' +
        '<p style="font-size:11px;color:hsl(var(--muted-foreground));text-transform:uppercase">' + t('intake_time_label') + '</p>' +
        '<p style="font-size:26px;font-weight:800;font-family:monospace;margin-bottom:12px">' + horaShake + '</p>' +
        '<h4 style="font-size:11.5px;color:hsl(var(--primary));text-transform:uppercase;margin-bottom:6px">' + t('ingredients_label') + '</h4>' +
        '<ul class="ingredient-list"><li>' + t('shake_ing1') + '</li><li>' + t('shake_ing2') + '</li><li>' + t('shake_ing3') + '</li><li>' + t('shake_ing4') + '</li></ul>' +
        '<p style="font-size:13px;margin:10px 0">' + (currentLang === 'en' ? 'Take it at ' + horaShake + ', no excuses.' : 'Tomalo a las ' + horaShake + ' sin falta.') + '</p>' +
        '<button class="btn btn-primary" id="marcarTomado" style="margin-bottom:8px">' + t('mark_taken_btn') + '</button>' +
        '<button class="btn btn-secondary" id="reconfigurar">' + t('reconfig_btn') + '</button></div>';
    } else if (bono5Tab === 'nocturno') {
      const noc = CONFIG.COMBUSTIBLE_NOCTURNO[profile.objetivo];
      const objLabel = { grasa: t('obj_grasa'), musculo: t('obj_musculo'), ambos: t('obj_ambos') }[profile.objetivo];
      html += '<div class="card"><p style="font-size:18px;margin-bottom:2px">' + t('night_ration_title') + '</p>' +
        '<p class="mono-header">' + t('today_ration_note') + '</p>' +
        '<p style="font-weight:700;color:hsl(var(--primary));text-transform:uppercase;margin:8px 0 2px">' + esc(noc.label) + '</p>' +
        '<p style="font-size:11px;color:hsl(var(--muted-foreground));text-transform:uppercase">' + t('suggested_time_label') + '</p>' +
        '<p style="font-size:26px;font-weight:800;font-family:monospace;margin-bottom:8px">' + horaRacion + '</p>' +
        '<p style="font-size:12px;color:hsl(var(--muted-foreground));text-transform:uppercase;margin-bottom:10px">' + t('objective_prefix') + ' ' + objLabel + '</p>' +
        '<ul class="ingredient-list">' + noc.ing.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>' +
        '<p style="font-size:12.5px;color:hsl(var(--destructive));margin:10px 0">' + t('eggs_warning') + '</p>' +
        '<p style="font-size:13px;margin-bottom:14px">' + esc(noc.tag) + '</p>' +
        '<button class="btn btn-primary" id="marcarComido" style="margin-bottom:8px">' + t('mark_eaten_btn') + '</button>' +
        '<button class="btn btn-secondary" id="reconfigurar">' + t('reconfig_btn') + '</button></div>';
    } else if (bono5Tab === 'alimentos') {
      html += '<div class="card"><p style="font-size:18px;margin-bottom:12px">' + t('clandestine_foods_title') + '</p>';
      CONFIG.COMBUSTIBLE_ALIMENTOS.forEach(a => {
        html += '<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px"><span style="font-size:22px">' + a.ic + '</span><div><b style="display:block;font-size:14px">' + esc(a.name) + '</b><span style="font-size:12.5px;color:hsl(var(--muted-foreground))">' + esc(a.benefit) + '</span></div></div>';
      });
      html += '<button class="btn btn-secondary" id="reconfigurar">' + t('reconfig_btn') + '</button></div>';
    } else if (bono5Tab === 'compras') {
      html += '<div class="card"><p style="font-size:18px;margin-bottom:6px">' + t('shopping_list_title') + '</p>' +
        '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin-bottom:12px">' + t('shopping_list_sub') + '</p>' +
        '<ul class="ingredient-list">' + CONFIG.COMBUSTIBLE_COMPRAS.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
        '<button class="btn btn-secondary" id="copiarLista" style="margin-bottom:8px">' + t('copy_list_btn') + '</button>' +
        '<button class="btn btn-secondary" id="reconfigurar">' + t('reconfig_btn') + '</button></div>';
    } else if (bono5Tab === 'timing') {
      html += '<div class="card"><p style="font-size:18px;margin-bottom:4px">' + t('today_protocol_title') + '</p>' +
        '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin-bottom:16px">' + t('chronological_note') + '</p>';
      const items = [
        ['⚡', horaShake, t('timeline_shake')],
        ['🏋️', profile.horaEntreno, t('timeline_training')],
        ['💧', horaHidra, t('timeline_hydration')],
        ['🌙', horaRacion, t('timeline_ration')],
        ['📵', profile.horaDormir, t('timeline_screens')],
      ];
      items.forEach(it => {
        html += '<div class="timeline-item"><span class="ic">' + it[0] + '</span><div><div class="time">' + it[1] + '</div><div style="font-size:13.5px">' + it[2] + '</div></div></div>';
      });
      html += '<button class="btn btn-secondary" id="reconfigurar">' + t('reconfig_btn') + '</button></div>';
    } else if (bono5Tab === 'mental') {
      html += renderMentalTab();
    }

    view.innerHTML = html; bindBack();
    view.querySelectorAll('.tab-btn').forEach(tabEl => { tabEl.onclick = () => { bono5Tab = tabEl.dataset.t; renderBono5(); }; });
    const reconf = document.getElementById('reconfigurar');
    if (reconf) reconf.onclick = () => { bono5Editing = true; renderBono5(); };
    const mt = document.getElementById('marcarTomado'); if (mt) mt.onclick = () => { mt.textContent = currentLang === 'en' ? '✓ Taken today' : '✓ Tomado hoy'; mt.disabled = true; };
    const mc = document.getElementById('marcarComido'); if (mc) mc.onclick = () => { mc.textContent = currentLang === 'en' ? '✓ Eaten today' : '✓ Comido hoy'; mc.disabled = true; };
    const cl = document.getElementById('copiarLista');
    if (cl) cl.onclick = () => {
      const text = CONFIG.COMBUSTIBLE_COMPRAS.join('\n');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => { cl.textContent = t('copied_btn'); setTimeout(() => { cl.textContent = t('copy_list_btn'); }, 1500); }).catch(() => {});
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
    return '<div class="card"><p style="font-size:18px;margin-bottom:4px">' + t('mental_title') + '</p>' +
      '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin-bottom:14px">' + t('mental_sub') + '</p>' +
      '<p style="font-size:11px;color:hsl(var(--primary));text-transform:uppercase;font-weight:700">' + t('phase_short') + ' ' + (activePhase + 1) + (currentLang === 'en' ? ' of ' : ' de ') + fases.length + '</p>' +
      '<p style="font-weight:700;text-transform:uppercase;margin:6px 0 2px">' + esc(fase.t) + '</p>' +
      timerHtml +
      '<p style="font-size:13.5px;color:hsl(var(--muted-foreground));margin-bottom:14px">' + esc(fase.desc) + '</p>' +
      '<button class="btn btn-primary" id="iniciarMental"' + (mentalPhase >= 0 ? ' disabled' : '') + '>' + (mentalPhase >= 0 ? t('in_progress') : t('start_mental_btn')) + '</button>' +
      '<div class="phase-pills">' + fases.map((f, i) => '<div class="phase-pill' + (i === activePhase ? ' active' : '') + '">' + t('phase_short') + ' ' + (i + 1) + '<br>' + f.min + ' min</div>').join('') + '</div>' +
      '<button class="btn btn-secondary" id="reconfigurar" style="margin-top:14px">' + t('reconfig_btn') + '</button></div>';
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
    let html = bonoHeader(CONFIG.BONOS[5].title, t('bono6_sub'));
    const pasos = CONFIG.REINICIO_AUDIO_PASOS;
    const activePhase = reinicioAudio.active ? reinicioAudio.phase : -1;
    html += '<div class="card"><p style="font-size:11px;color:hsl(var(--primary));text-transform:uppercase;font-weight:700;margin-bottom:6px">' + t('subsection_01') + '</p>' +
      '<p style="font-size:15px;font-weight:700">' + t('audio_reset_title') + '</p>' +
      '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin:6px 0 14px">' + t('audio_reset_sub') + '</p>' +
      '<p style="font-size:11px;color:hsl(var(--muted-foreground));text-transform:uppercase">' + t('time_remaining_label') + '</p>';
    if (reinicioAudio.active) {
      html += '<p id="reinicioTimer" style="font-family:monospace;font-size:26px;font-weight:800;margin-bottom:14px">' + pad2(Math.floor(reinicioAudio.secondsLeft / 60)) + ':' + pad2(reinicioAudio.secondsLeft % 60) + '</p>';
    } else {
      html += '<p style="font-family:monospace;font-size:26px;font-weight:800;margin-bottom:14px">03:00</p>';
    }
    pasos.forEach((p, i) => {
      html += '<p style="font-size:11px;color:' + (i === activePhase ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))') + ';text-transform:uppercase;font-weight:700;margin-top:' + (i > 0 ? '12px' : '0') + '">' + t('step_prefix') + ' ' + (i + 1) + ' · ' + p.min + ' min</p>' +
        '<p style="font-weight:600;font-size:14px">' + esc(p.t) + '</p><p style="font-size:13px;color:hsl(var(--muted-foreground))">' + esc(p.desc) + '</p>';
    });
    html += '<button class="btn btn-primary" id="iniciarAudio" style="margin-top:16px"' + (reinicioAudio.active ? ' disabled' : '') + '>' + (reinicioAudio.active ? t('in_progress') : t('start_protocol_btn')) + '</button></div>';

    html += '<div class="card" style="margin-top:16px"><p style="font-size:11px;color:hsl(var(--primary));text-transform:uppercase;font-weight:700;margin-bottom:6px">' + t('subsection_02') + '</p>' +
      '<p style="font-size:15px;font-weight:700">' + t('hormone_guide_title') + '</p>' +
      '<p style="font-size:12.5px;color:hsl(var(--muted-foreground));margin:6px 0 14px">' + t('hormone_guide_sub') + '</p>';
    CONFIG.REINICIO_HORMONAS_CHECKLIST.forEach((item, i) => {
      const on = !!hormonas.checklist[i];
      html += '<div class="checklist-item"><div class="habit-check' + (on ? ' on' : '') + '" data-i="' + i + '">' + (on ? '✓' : '') + '</div><span>' + esc(item) + '</span></div>';
    });
    html += '</div>';

    html += '<div class="card" style="margin-top:16px"><p style="font-size:11px;color:hsl(var(--primary));text-transform:uppercase;font-weight:700;margin-bottom:6px">' + t('subsection_03') + '</p>' +
      '<p style="font-size:15px;font-weight:700">' + t('wakeup_manual_title') + '</p>';
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
        const timerEl = document.getElementById('reinicioTimer');
        if (timerEl) timerEl.textContent = pad2(Math.floor(reinicioAudio.secondsLeft / 60)) + ':' + pad2(reinicioAudio.secondsLeft % 60);
      }, 1000);
      renderBono6();
    };
  }

  // ================= INFO =================
  function renderInfo() {
    renderTopHeader();
    let html = '<h1 style="font-size:22px;text-transform:uppercase">' + t('info_title') + '</h1>' +
      '<p style="color:hsl(var(--muted-foreground));font-size:13px;margin:4px 0 20px">' + (currentLang === 'en' ? 'Everything you need to know about ' + esc(CONFIG.BRAND) : 'Todo lo que necesitás saber sobre ' + esc(CONFIG.BRAND)) + '</p>';
    html += '<div class="info-sec"><h3>' + (currentLang === 'en' ? 'What is ' + esc(CONFIG.BRAND) + '?' : '¿Qué es ' + esc(CONFIG.BRAND) + '?') + '</h3><p>' + esc(CONFIG.ABOUT_TEXT) + '</p></div>';
    html += '<div class="info-sec"><h3>' + t('how_to_use') + '</h3><p>' + t('how_to_use_text') + '</p></div>';
    html += '<div class="info-sec"><h3>' + t('recommendations_heading') + '</h3><ul>' + CONFIG.INFO_RECOMENDACIONES.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></div>';
    html += '<div class="info-sec"><h3>' + t('what_do_i_need') + '</h3><p>' + t('what_do_i_need_text') + '</p></div>';
    html += '<div class="info-sec"><h3>' + t('support_heading') + '</h3><p>' + t('support_text') + '</p>' +
      '<button class="btn btn-secondary" id="showSupportEmail" style="margin-top:10px">' + t('contact_support_btn') + '</button>' +
      '<div id="supportEmailBox" hidden style="margin-top:10px;gap:8px;align-items:center;background:hsl(var(--secondary));border:1px solid hsl(var(--border));border-radius:var(--radius);padding:12px 14px">' +
      '<span style="flex:1;font-size:13.5px;word-break:break-all">' + esc(CONFIG.SUPPORT_EMAIL) + '</span>' +
      '<button class="btn-ghost" id="copySupportEmail" style="flex:none;font-size:12px">' + t('copy_btn') + '</button></div></div>';
    html += '<div class="info-sec"><h3>' + t('install_heading') + '</h3><p>' + t('install_sub') + '</p>' +
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
      function marcarCopiado() { btn.textContent = t('copied_btn'); setTimeout(() => { btn.textContent = t('copy_btn'); }, 1500); }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(CONFIG.SUPPORT_EMAIL).then(marcarCopiado).catch(() => { fallbackCopy(CONFIG.SUPPORT_EMAIL); marcarCopiado(); });
      } else {
        fallbackCopy(CONFIG.SUPPORT_EMAIL); marcarCopiado();
      }
    };

    const stepsIOS = [
      ['🧭', t('ios_1t'), t('ios_1d')], ['📤', t('ios_2t'), t('ios_2d')],
      ['➕', t('ios_3t'), t('ios_3d')], ['✅', t('ios_4t'), t('ios_4d')],
    ];
    const stepsAndroid = [
      ['🧭', t('and_1t'), t('and_1d')], ['⋮', t('and_2t'), t('and_2d')],
      ['➕', t('and_3t'), t('and_3d')], ['✅', t('and_4t'), t('and_4d')],
    ];
    function paintSteps(os) {
      const steps = os === 'ios' ? stepsIOS : stepsAndroid;
      document.getElementById('pwaSteps').innerHTML = steps.map((s, i) =>
        '<div class="step-row"><div class="step-num">' + (i + 1) + '</div><div><b style="display:block;font-size:13.5px">' + s[0] + ' ' + esc(s[1]) + '</b>' + (s[2] ? '<span style="font-size:12px;color:hsl(var(--muted-foreground))">' + esc(s[2]) + '</span>' : '') + '</div></div>'
      ).join('') + '<p style="font-size:12px;color:hsl(var(--muted-foreground));margin-top:6px">' + t('pwa_final_note') + '</p>';
    }
    paintSteps('ios');
    view.querySelectorAll('[data-os]').forEach(osEl => {
      osEl.onclick = () => { view.querySelectorAll('[data-os]').forEach(x => x.classList.remove('sel')); osEl.classList.add('sel'); paintSteps(osEl.dataset.os); };
    });
  }

  applyTheme(load(LS.theme, 'dark'));
  applyChromeStrings();

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
