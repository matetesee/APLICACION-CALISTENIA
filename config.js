// ============================================================
// CONFIG — Calistenia Pro
// Clon funcional de Sistema Titanio. Todo el contenido vive acá.
// ============================================================
window.CONFIG = {
  BRAND: "Calistenia Pro",
  BRAND_SHORT: "Calistenia Pro",
  TAGLINE: "63 días · 3 fases",
  SUPPORT_EMAIL: "plenitudsaludable@gmail.com",
  // Link del quiz de venta, se usa al compartir la racha (CTA "arrancá tu entrenamiento").
  QUIZ_URL: "https://calisteniapro.up.railway.app",

  // Idiomas que se muestran en Configuración. Por ahora todo el contenido
  // (config.js completo) solo está escrito en español -> únicamente "es"
  // funciona de verdad; el resto queda listado pero avisa "todavía no está
  // listo" al tocarlo (ver openSettingsModal() en app.js). Agregar un idioma
  // real implica traducir TODO este archivo (recetas, días, bonos, info).
  LANGUAGES: [
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
  ],
  ABOUT_TEXT: "Calistenia Pro es un programa de calistenia militar de 21 días diseñado para construir fuerza real, resistencia extrema y disciplina. Entrenás con tu propio cuerpo, sin gimnasio, sin excusas.",

  // Video placeholder: TODO reemplazar por los 63 videos reales de cada día.
  // Por ahora, igual que en el original, todos los días usan el mismo video
  // (los días 2+ están bloqueados en el original hasta completar el anterior,
  // así que no pude verificar si tienen video propio — dejo el mismo placeholder
  // para los 63 hasta que sumes los reales).
  PLACEHOLDER_VIDEO_ID: "ouFzwHY9dmo",
  PLACEHOLDER_VIDEO_THUMB: "https://i.ytimg.com/vi/ouFzwHY9dmo/hqdefault.jpg",

  // Cita motivacional que se muestra en el Home una vez completado el test.
  MOTIVATIONAL_QUOTE: "La fuerza no nace en un gimnasio. Nace en tu disciplina.",
  COPYRIGHT_FOOTER: "Calistenia Pro. Uso personal exclusivo.",

  // Plantilla semanal de 7 días que se repite (título + duración en min + desc).
  // OJO: "desc" de "Rutina de Fuerza Total" es la real (la vi en la tarjeta del
  // día en el Home). Las otras 6 son una aproximación mía razonable: los días
  // 2 a 7 están bloqueados en el original (no se puede avanzar sin completar
  // el día 1, y ese "marcar completado" no persiste ahí) así que no pude ver
  // sus descripciones reales — si las tenés, pasámelas y las cambio.
  DAY_TEMPLATE: [
    { t: "Rutina de Fuerza Total", min: 15, desc: "Entrenamiento completo de fuerza con peso corporal." },
    { t: "Resistencia y Potencia", min: 11, desc: "Circuito de resistencia muscular y potencia explosiva." },
    { t: "Cardio Táctico", min: 7, desc: "Cardio de alta intensidad, estilo entrenamiento militar." },
    { t: "Core de Acero", min: 10, desc: "Trabajo de core completo para blindar tu zona media." },
    { t: "Tren Inferior Explosivo", min: 10, desc: "Piernas y glúteos con énfasis en potencia explosiva." },
    { t: "Fuerza Funcional", min: 10, desc: "Movimientos funcionales que suman fuerza real, no de gimnasio." },
    { t: "Recuperación Activa", min: 15, desc: "Movilidad y recuperación activa para bajar la carga sin frenar." },
  ],

  PHASES: [
    { name: "Fundamentos Pro", desc: "Construí las bases de tu fuerza y disciplina con movimientos fundamentales.", weekStart: 1, weekEnd: 3 },
    { name: "Intensificación", desc: "Aumentá la intensidad y desafiá tus límites con entrenamientos más exigentes.", weekStart: 4, weekEnd: 6 },
    { name: "Dominio Pro", desc: "Dominá cada ejercicio y consolidá tu transformación definitiva.", weekStart: 7, weekEnd: 9 },
  ],

  // ---------- Test inicial (Home) ----------
  // Nota: en el sitio original los pasos 2 y 3 estaban rotos (el radio no
  // respondía y el botón Siguiente quedaba deshabilitado para siempre).
  // Acá van 3 preguntas reales y funcionales.
  QUIZ: [
    {
      q: "¿Cuánto tiempo llevas entrenando?",
      key: "experiencia",
      opts: [
        { t: "Nunca entrené", v: "none" },
        { t: "Menos de 3 meses", v: "beginner" },
        { t: "3 a 12 meses", v: "intermediate" },
        { t: "Más de 1 año", v: "advanced" },
      ],
    },
    {
      q: "¿Cuántos días por semana podés entrenar?",
      key: "dias",
      opts: [
        { t: "2 a 3 días", v: "2-3" },
        { t: "4 a 5 días", v: "4-5" },
        { t: "Todos los días", v: "7" },
      ],
    },
    {
      q: "¿Cuál es tu objetivo principal?",
      key: "objetivo",
      opts: [
        { t: "Perder grasa", v: "grasa" },
        { t: "Ganar músculo", v: "musculo" },
        { t: "Los dos", v: "ambos" },
      ],
    },
  ],
  // experiencia -> nivel (usado para prellenar el Bono 2)
  NIVEL_BY_EXPERIENCIA: { none: "principiante", beginner: "principiante", intermediate: "intermedio", advanced: "avanzado" },

  // ---------- Tu Plan: 6 bonos ----------
  BONOS: [
    { n: 1, type: "PDF IMPORTADO", title: "Bebidas Quema Grasa", desc: "Biblioteca interactiva de recetas termogénicas" },
    { n: 2, type: "INTERACTIVO", title: "Plan de Progreso", desc: "Herramienta interactiva de seguimiento" },
    { n: 3, type: "INTERACTIVO", title: "Protocolo de Recuperación", desc: "Recomendaciones según tu estado físico" },
    { n: 4, type: "TRACKER", title: "Tracker de Disciplina", desc: "Registro diario de hábitos por fecha real" },
    { n: 5, type: "INTERACTIVO", title: "Protocolo del Combustible Negro", desc: "Ingeniería alimentaria táctica para máximo rendimiento" },
    { n: 6, type: "INTERACTIVO", title: "Protocolo Reinicio 72H", desc: "Reset hormonal y neural para despertar en modo combate" },
  ],

  // ---------- Bono 1: recetas ----------
  RECIPE_CATEGORIES: [
    { v: "todas", t: "Todas" },
    { v: "energia", t: "⚡ Energía" },
    { v: "pre", t: "🏋️ Pre-entreno" },
    { v: "recuperacion", t: "🧊 Recuperación" },
    { v: "masa", t: "💪 Masa Muscular" },
    { v: "termo", t: "🔥 Termogénico Fuerte" },
  ],
  RECIPES: [
    { cat: "energia", name: "Café con guaraná en polvo", ing: ["1 taza de café molido", "1 cucharada de guaraná en polvo", "1/2 cucharadita de endulzante de canela (opcional)"], prep: "Prepara una taza de café y agrega el guaraná en polvo. Si lo desea, agregue edulcorante. También se puede agregar canela para darle sabor." },
    { cat: "termo", name: "Café termogénico con agua helada", ing: ["1 taza de agua fría", "1/2 cucharadita de café molido", "Endulzante al gusto (opcional)", "Cubitos de hielo"], prep: "Agregue el café molido al fondo de la taza. Vierta agua fría y revuelva hasta que se disuelva. Endulce al gusto y cubra con cubitos de hielo." },
    { cat: "termo", name: "Café Termogénico con Albahaca", ing: ["1 taza de café negro", "1/2 cucharadita de albahaca molida", "Endulzante (opcional)"], prep: "Prepara 1 taza de café negro. Agregue 1/2 cucharadita de albahaca molida y edulcorante si lo desea. Revuelva bien para combinar." },
    { cat: "termo", name: "Café Quemagrasa con Jengibre y Canela", ing: ["1 taza de café", "1/2 cucharadita de jengibre húmedo", "1/4 cucharadita de canela", "1 cucharada de miel", "1/2 taza de agua", "1/4 taza de arroz integral crudo"], prep: "Combine el café, el jengibre, la canela, la miel y una taza de agua en una cacerola a fuego medio. Llevar a ebullición y cocinar durante 5 minutos. Agregue el arroz integral y el agua restante. Vuelva a hervir y cocine por 20 minutos." },
    { cat: "recuperacion", name: "Café termogénico con bálsamo de limón", ing: ["1 taza de café fuerte", "1 cucharada de aceite de coco", "1 cucharadita de miel", "1/2 cucharadita de jengibre molido", "Hojas frescas de toronjil (opcional)"], prep: "Prepara una taza de café fuerte y deja que se enfríe un poco. En una licuadora, combine el café, el aceite de coco, la miel y el jengibre molido. Mezcle hasta que quede suave. Sirve frío o con hielo." },
    { cat: "termo", name: "Café termogénico con cacao en polvo", ing: ["100g de café instantáneo en polvo", "100g de leche de coco en polvo", "50g de cacao en polvo", "50g de canela en polvo", "50g de matcha en polvo", "50g de azafrán de tierra en polvo", "10g de pimienta de cayena en polvo", "25g de jengibre en polvo", "50g de maca peruana en polvo", "100g de abrojo en polvo"], prep: "Tamizar todos los ingredientes en un tazón grande. Mezcla todo bien. Tamice nuevamente y repita al menos una vez más hasta que sea homogénea. Almacenar en recipiente con tapa. Para preparar: hierve 150-200ml de agua y mezcla con 1 cucharada de la mezcla y 1 cucharadita de aceite de coco." },
    { cat: "energia", name: "Café termogénico con canela", ing: ["1 cucharadita de canela", "1 taza de café", "1 cucharada de miel", "Leche o crema (opcional)"], prep: "Agregue canela al café antes de prepararlo. Endulza con miel. También puedes añadir leche o nata si prefieres una bebida más rica." },
    { cat: "pre", name: "Café termogénico con castañas", ing: ["1 taza de café", "1 cucharada de aceite de coco o aceite MCT", "1 cucharadita de canela", "1/2 cucharadita de jengibre", "Edulcorante (opcional)", "1/4 taza de castañas asadas"], prep: "Precaliente el horno a 350°F. Hornee las castañas 10-12 minutos. Caliente el aceite de coco, agregue café, canela, jengibre y edulcorante. Vierta en la licuadora con las castañas tostadas y mezcle a alta velocidad 30 segundos." },
    { cat: "masa", name: "Café termogénico con clara de huevo", ing: ["1 taza de café", "1/2 plátano", "1/4 cucharadita de extracto de vainilla", "1 cucharada de miel", "1 clara de huevo"], prep: "Mezcle todos los ingredientes en una licuadora hasta que quede suave. Disfrútalo de inmediato." },
    { cat: "termo", name: "Café termogénico con clavo de la India", ing: ["1 taza de café negro", "1 cucharadita de clavo molido", "1/2 cucharadita de canela molida", "Endulzante al gusto"], prep: "Prepare café negro. Agregue clavo molido, canela y edulcorante. Revuelve bien y disfruta." },
    { cat: "pre", name: "Café termogénico con copos de avena", ing: ["1 taza de café fuerte", "1/2 taza de copos de avena", "1 cucharadita de miel", "1/4 cucharadita de canela molida", "Una pizca de sal"], prep: "Prepare una taza de café fuerte. En un tazón, combine la avena, la miel, la canela y la sal. Vierta el café en una taza grande. Cubra con la mezcla de avena y revuelva bien." },
    { cat: "recuperacion", name: "Café termogénico con cúrcuma", ing: ["1 taza de café", "1/2 cucharadita de cúrcuma en polvo", "1 cucharadita de aceite de coco o mantequilla", "1 cucharada de miel"], prep: "Prepara tu café como de costumbre. Agregue la cúrcuma y cualquier especia deseada. Caliente el aceite de coco hasta que se derrita. Vierta el café en una taza y agregue el aceite de coco. Endulzar con miel al gusto." },
    { cat: "termo", name: "Café termogénico con jengibre en polvo", ing: ["200g de café soluble tradicional", "60g canela en polvo", "20g jengibre en polvo", "10g pimienta de cayena", "Edulcorante en polvo al gusto", "1 cucharadita de aceite de coco (al servir)"], prep: "Mezcle los ingredientes secos en un recipiente. Tenga cuidado con la pimienta. Transfiera a un frasco de vidrio. Para preparar: hierva 150-200ml de agua y mézclalo con 1 cucharada de la mezcla y aceite de coco." },
    { cat: "energia", name: "Café termogénico con mate", ing: ["1 taza de café", "1 cucharadita de hierba mate", "Agua caliente"], prep: "Prepara una taza de café. Prepare el mate vertiendo agua caliente sobre 1 cucharadita de hierba mate. Deje reposar 10 minutos y cuele. Agregue al café y revuelva. Beber inmediatamente." },
    { cat: "recuperacion", name: "Café termogénico con menta", ing: ["1 taza de café negro", "1/2 cucharadita de extracto de menta", "Endulzante al gusto"], prep: "Prepara el café normalmente. Añade el extracto de menta y el edulcorante. Vierte sobre hielo y disfruta." },
    { cat: "masa", name: "Café termogénico con Palta", ing: ["1/4 palta deshuesada", "1 taza de café", "1 cucharada de cacao en polvo sin azúcar", "1 cucharadita de miel"], prep: "Haz café con tu método preferido. Agregue la palta, el cacao en polvo y la miel a una licuadora y mezcle hasta que quede suave. Vierta en un vaso y bébalo inmediatamente." },
    { cat: "recuperacion", name: "Café termogénico con perejil", ing: ["1 taza de café caliente", "1 cucharada de perejil fresco picado", "1 cucharadita de miel", "1/2 cucharadita de jengibre húmedo"], prep: "Agregue perejil fresco picado al café caliente. Agregue la miel y el jengibre molido." },
    { cat: "termo", name: "Café termogénico con pimienta", ing: ["1 taza de café negro", "1/2 cucharadita de pimienta de cayena", "1 cucharadita de miel o sirope de arce", "Una pizca de canela (opcional)"], prep: "Combine todos los ingredientes en una cacerola y caliente a fuego medio, revolviendo hasta que se caliente por completo." },
    { cat: "recuperacion", name: "Café Termogénico con Té de Boldo", ing: ["1 taza de café", "1/2 cucharadita de hojas de té de boldo", "1/4 cucharadita de canela en polvo", "1 cucharada de miel"], prep: "Prepara el café. Remoje las hojas de té de boldo en agua caliente durante 5 minutos. Mezcla miel y canela en el café." },
    { cat: "energia", name: "Café termogénico con té verde", ing: ["1 taza de café molido", "1 cucharadita de hojas de té verde", "Edulcorante (opcional)", "Leche o crema (opcional)"], prep: "Prepare una taza de café. Remoje las hojas de té verde en agua caliente durante 3 minutos antes de verter sobre el café. Endulce al gusto." },
    { cat: "termo", name: "Café termogénico con vinagre de manzana", ing: ["Café de tu elección", "Vinagre de manzana", "Canela molida", "Nuez moscada", "Una pizca de pimienta de cayena (opcional)"], prep: "Agregue el café y el vinagre de sidra de manzana a la licuadora y mezcle. Caliente a fuego medio. Agregue la miel, canela, nuez moscada y pimienta. Sirve caliente con espuma encima." },
    { cat: "recuperacion", name: "Café termogénico de cola de caballo", ing: ["1 taza de café", "1 taza de agua", "1 cucharadita de alfalfa"], prep: "Lleva el agua a ebullición y deja que el té de alfalfa hierva 5-7 minutos. Vierta el agua caliente sobre el café molido y déjelo reposar 3-5 minutos. Colar y servir caliente." },
    { cat: "masa", name: "Café Quema Grasa con Proteína", ing: ["1 taza de café", "1 cucharada de aceite de coco", "1 cucharada de mantequilla", "1 cucharadita de canela", "1 cucharada de proteína de suero sabor chocolate"], prep: "Mezcle todos los ingredientes en la licuadora y sirva. El aceite de coco se compone de ácidos grasos de cadena media que se convierten en energía." },
    { cat: "pre", name: "Shake de café", ing: ["150ml de café helado (4 cubitos de hielo con café filtrado)", "30g de proteína sabor chocolate", "1 cucharada de mantequilla de maní sin azúcar", "1 cucharadita de cacao orgánico", "1 cucharadita de canela en polvo", "100ml de agua"], prep: "Junta todos los ingredientes y licúa por 30 segundos o hasta que quede homogéneo." },
    { cat: "masa", name: "Smoothie de café con whey", ing: ["4 cucharaditas de café instantáneo", "2 cucharadas de whey sabor chocolate", "3 cucharaditas de cacao en polvo", "2 tazas de leche descremada", "1 cuchara de linaza", "Canela, edulcorante y cubitos de hielo al gusto"], prep: "Licue todos los ingredientes en una licuadora hasta obtener textura homogénea." },
  ],

  // ---------- Bono 2: metas por nivel ----------
  PROGRESO_METAS: {
    principiante: { pushups: 10, squats: 15, burpees: 5, plancha: 20 },
    intermedio: { pushups: 25, squats: 30, burpees: 12, plancha: 45 },
    avanzado: { pushups: 50, squats: 50, burpees: 25, plancha: 90 },
  },

  // ---------- Bono 3: protocolo de recuperación ----------
  RECOVERY_STATES: [
    {
      v: "leve", t: "Dolor Muscular Leve", desc: "Molestia muscular normal post-entreno",
      bebida: "Café termogénico con cúrcuma – antiinflamatorio natural. Hidratación con agua + limón.",
      descanso: "Descanso activo: caminata de 20 minutos o yoga suave. Evitá entrenar el mismo grupo muscular.",
      estiramiento: "Estiramientos dinámicos suaves de 10 min: rotación de hombros, estiramiento de isquiotibiales, gato-vaca.",
      retomar: "Podés entrenar mañana. Enfocate en otro grupo muscular o bajá la intensidad al 60%.",
    },
    {
      v: "intenso", t: "Dolor Intenso", desc: "Dolor fuerte que limita el movimiento",
      bebida: "Shake de café con proteína whey y plátano para recuperación muscular. Agua con sal y limón para electrolitos.",
      descanso: "Descanso total 48-72 horas del grupo afectado. Aplicá hielo 15 min cada 2 horas las primeras 24h. Baño caliente antes de dormir.",
      estiramiento: "Estiramientos estáticos suaves, sin forzar. Foam roller si está disponible. 15 min mínimo.",
      retomar: "Esperá 2-3 días. Retomá al 50% de intensidad. Si el dolor persiste más de 5 días, consultá a un profesional.",
    },
    {
      v: "fatiga", t: "Fatiga General", desc: "Cansancio, falta de energía, agotamiento",
      bebida: "Café con guaraná + miel para energía sostenida. Smoothie de café con avena para recuperar glucógeno. Mínimo 3 litros de agua hoy.",
      descanso: "Dormí 8-9 horas esta noche. Siesta de 20 min si es posible. Evitá pantallas 1 hora antes de dormir.",
      estiramiento: "Respiración profunda 4-7-8 (inhalar 4s, sostener 7s, exhalar 8s). Estiramiento suave de cuello y espalda.",
      retomar: "Descansá hoy y mañana. Retomá en 48 horas con una sesión de baja intensidad (recuperación activa).",
    },
  ],

  // ---------- Bono 4: hábitos diarios ----------
  HABITS: [
    { k: "entrene", t: "Entrené" },
    { k: "bebida", t: "Tomé mi bebida" },
    { k: "dormir", t: "Dormí 7 horas" },
    { k: "agua", t: "Tomé suficiente agua" },
  ],

  // ---------- Bono 5: combustible negro ----------
  COMBUSTIBLE_ALIMENTOS: [
    { ic: "🍠", name: "Batata / Camote", benefit: "Glucógeno sostenido" },
    { ic: "🥩", name: "Hígado vacuno cocido", benefit: "Densidad hormonal" },
    { ic: "🐟", name: "Sardinas en lata", benefit: "Testosterona + antiinflamatorio" },
    { ic: "🌾", name: "Avena integral cocida", benefit: "Combustible pre-entreno" },
    { ic: "🧄", name: "Ajo picado (reposado 5 min)", benefit: "Vasodilatador natural" },
  ],
  COMBUSTIBLE_COMPRAS: [
    "Cacao puro sin azúcar: 59.5g", "Jengibre fresco: 1 raíz mediana", "Sal marina: 1 paquete pequeño",
    "Huevos: 14 unidades", "Bananas: 7 unidades", "Miel pura: 1 frasco pequeño", "Batata/Camote: 500g",
    "Hígado vacuno: 300g", "Sardinas en lata: 3 latas", "Avena integral: 500g", "Ajos: 1 cabeza",
  ],
  COMBUSTIBLE_NOCTURNO: {
    grasa: { label: "Corte Nocturno", ing: ["Huevos duros — 2 unidades", "Banana — 1 unidad", "Miel pura — 1 cucharadita"], tag: "Tu cuerpo quema grasa abdominal mientras dormís." },
    musculo: { label: "Construcción Nocturna", ing: ["Huevos duros — 3 unidades", "Banana — 1 unidad", "Avena integral cocida — 50 g", "Miel pura — 1 cucharadita"], tag: "Tu cuerpo construye músculo mientras dormís." },
    ambos: { label: "Equilibrio Nocturno", ing: ["Huevos duros — 2 unidades", "Banana — 1 unidad", "Miel pura — 1 cucharadita"], tag: "Equilibrio perfecto entre quemar y construir." },
  },
  COMBUSTIBLE_MENTAL_FASES: [
    { t: "Encendido Físico", min: 2, desc: "20 sentadillas + 10 flexiones + 30 segundos de saltos en el lugar. Hacelo ahora, antes de pensar." },
    { t: "Respiración de Combate", min: 3, desc: "Respiración 4-4-8 x 6 ciclos: inhalá 4s, retené 4s, exhalá 8s. Bajá el ritmo cardíaco y tomá el control." },
    { t: "Afirmación y Foco", min: 2, desc: "Repetí en voz alta 3 veces: \"El sistema está activo. Hoy entreno igual.\" Visualizá el primer ejercicio de hoy." },
  ],

  // ---------- Bono 6: reinicio 72h ----------
  REINICIO_AUDIO_PASOS: [
    { t: "Respiración 4-4-8", min: 1, desc: "Inhalá 4s por nariz, retené 4s, exhalá 8s por la boca. Repetir." },
    { t: "Masaje cervical", min: 1, desc: "Masajeá el cuello lateral derecho con dos dedos, círculos lentos." },
    { t: "Zumbido vagal", min: 1, desc: "Cantá o zumbá en voz baja con la boca cerrada (vibración activa el nervio vago)." },
  ],
  REINICIO_HORMONAS_CHECKLIST: [
    "Última pantalla 60 min antes de dormir",
    "Habitación a oscuras total (o antifaz)",
    "Temperatura ambiente fresca (18–20 °C ideal)",
    "Ración Nocturna de Testosterona consumida",
    "Sin alcohol ni cafeína desde las 18 hs",
  ],
  REINICIO_DESPERTAR_PASOS: [
    { t: "Hidratación de Combate", min: 2, desc: "500 ml de agua fría al despertar, antes de cualquier otra cosa." },
    { t: "Activación Espinal", min: 3, desc: "Gato-vaca x10, rotaciones de cadera x10 por lado, plancha 30 segundos." },
    { t: "Encendido Mental", min: 1, desc: "30 segundos de respiración rápida (Wim Hof básico). Luego en voz alta: \"El sistema está activo.\"" },
  ],

  // ---------- Info ----------
  INFO_RECOMENDACIONES: [
    "Entrená a la misma hora todos los días", "Usá ropa cómoda y un espacio libre", "Hidratate antes, durante y después",
    "Descansá al menos 7 horas por noche", "No te saltes días – la constancia es clave", "Escuchá tu cuerpo, no fuerces al dolor",
  ],
  INFO_QUOTE: "La disciplina es el puente entre tus metas y tus resultados.",

  // ---------- Logros (Mis Logros, dentro de Tu Plan) ----------
  // "type" + "value" los interpreta checkAchievements() en app.js:
  //   totalDone   -> días completados en total (progress.completedDays.size)
  //   streakBest  -> racha más larga alcanzada (forja_streak.best)
  //   photo       -> al menos 1 foto de progreso subida
  ACHIEVEMENTS: [
    { id: "primer_dia", icon: "🎖️", title: "Primer Paso", desc: "Completaste tu primer día de entrenamiento.", type: "totalDone", value: 1 },
    { id: "primera_semana", icon: "🥉", title: "Primera Semana", desc: "7 días de entrenamiento completados.", type: "totalDone", value: 7 },
    { id: "racha_7", icon: "🔥", title: "Racha de Fuego", desc: "7 días seguidos sin faltar.", type: "streakBest", value: 7 },
    { id: "fase1_superada", icon: "⚔️", title: "Fase 1 Superada", desc: "Completaste toda la Fase 1: Fundamentos Pro.", type: "totalDone", value: 21 },
    { id: "mitad_camino", icon: "🥈", title: "Mitad del Camino", desc: "32 de 63 días completados. Vas por la mitad.", type: "totalDone", value: 32 },
    { id: "transformacion", icon: "📸", title: "Transformación Registrada", desc: "Subiste al menos una foto de tu progreso.", type: "photo", value: 1 },
    { id: "racha_30", icon: "🌋", title: "Disciplina de Hierro", desc: "30 días seguidos sin faltar.", type: "streakBest", value: 30 },
    { id: "mision_cumplida", icon: "🏆", title: "Misión Cumplida", desc: "Completaste los 63 días del programa.", type: "totalDone", value: 63 },
  ],
};
