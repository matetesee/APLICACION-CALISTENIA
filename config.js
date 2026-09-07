// ============================================================
// CONFIG — Calistenia Pro
// Clon funcional de Sistema Titanio. Todo el contenido vive acá.
//
// Multi-idioma: CONTENT.es y CONTENT.en son dos copias completas del
// mismo contenido (misma forma/claves), una por idioma. window.CONFIG
// apunta a la que corresponda según el idioma guardado (forja_lang en
// localStorage), y así el resto de app.js no necesita saber nada de
// idiomas: sigue leyendo CONFIG.XXX como siempre. Ver setLanguage() en
// app.js para el switch en caliente (sin recargar la página).
// ============================================================
window.CONTENT = {

  es: {
    BRAND: "Calistenia Pro",
    BRAND_SHORT: "Calistenia Pro",
    TAGLINE: "63 días · 3 fases",
    SUPPORT_EMAIL: "plenitudsaludable@gmail.com",
    QUIZ_URL: "https://calisteniapro.up.railway.app",
    LANGUAGES: [
      { code: "es", label: "Español", flag: "🇪🇸" },
      { code: "en", label: "English", flag: "🇺🇸" },
      { code: "pt", label: "Português", flag: "🇧🇷" },
      { code: "zh", label: "中文", flag: "🇨🇳" },
      { code: "ja", label: "日本語", flag: "🇯🇵" },
    ],
    ABOUT_TEXT: "Calistenia Pro es un programa de calistenia militar de 21 días diseñado para construir fuerza real, resistencia extrema y disciplina. Entrenás con tu propio cuerpo, sin gimnasio, sin excusas.",
    PLACEHOLDER_VIDEO_ID: "ouFzwHY9dmo",
    PLACEHOLDER_VIDEO_THUMB: "https://i.ytimg.com/vi/ouFzwHY9dmo/hqdefault.jpg",
    MOTIVATIONAL_QUOTE: "La fuerza no nace en un gimnasio. Nace en tu disciplina.",
    COPYRIGHT_FOOTER: "Calistenia Pro. Uso personal exclusivo.",

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

    QUIZ: [
      { q: "¿Cuánto tiempo llevas entrenando?", key: "experiencia", opts: [
        { t: "Nunca entrené", v: "none" }, { t: "Menos de 3 meses", v: "beginner" },
        { t: "3 a 12 meses", v: "intermediate" }, { t: "Más de 1 año", v: "advanced" },
      ] },
      { q: "¿Cuántos días por semana podés entrenar?", key: "dias", opts: [
        { t: "2 a 3 días", v: "2-3" }, { t: "4 a 5 días", v: "4-5" }, { t: "Todos los días", v: "7" },
      ] },
      { q: "¿Cuál es tu objetivo principal?", key: "objetivo", opts: [
        { t: "Perder grasa", v: "grasa" }, { t: "Ganar músculo", v: "musculo" }, { t: "Los dos", v: "ambos" },
      ] },
    ],
    NIVEL_BY_EXPERIENCIA: { none: "principiante", beginner: "principiante", intermediate: "intermedio", advanced: "avanzado" },

    BONOS: [
      { n: 1, type: "PDF IMPORTADO", title: "Bebidas Quema Grasa", desc: "Biblioteca interactiva de recetas termogénicas" },
      { n: 2, type: "INTERACTIVO", title: "Plan de Progreso", desc: "Herramienta interactiva de seguimiento" },
      { n: 3, type: "INTERACTIVO", title: "Protocolo de Recuperación", desc: "Recomendaciones según tu estado físico" },
      { n: 4, type: "TRACKER", title: "Tracker de Disciplina", desc: "Registro diario de hábitos por fecha real" },
      { n: 5, type: "INTERACTIVO", title: "Protocolo del Combustible Negro", desc: "Ingeniería alimentaria táctica para máximo rendimiento" },
      { n: 6, type: "INTERACTIVO", title: "Protocolo Reinicio 72H", desc: "Reset hormonal y neural para despertar en modo combate" },
    ],

    RECIPE_CATEGORIES: [
      { v: "todas", t: "Todas" }, { v: "energia", t: "⚡ Energía" }, { v: "pre", t: "🏋️ Pre-entreno" },
      { v: "recuperacion", t: "🧊 Recuperación" }, { v: "masa", t: "💪 Masa Muscular" }, { v: "termo", t: "🔥 Termogénico Fuerte" },
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

    PROGRESO_METAS: {
      principiante: { pushups: 10, squats: 15, burpees: 5, plancha: 20 },
      intermedio: { pushups: 25, squats: 30, burpees: 12, plancha: 45 },
      avanzado: { pushups: 50, squats: 50, burpees: 25, plancha: 90 },
    },

    RECOVERY_STATES: [
      { v: "leve", t: "Dolor Muscular Leve", desc: "Molestia muscular normal post-entreno",
        bebida: "Café termogénico con cúrcuma – antiinflamatorio natural. Hidratación con agua + limón.",
        descanso: "Descanso activo: caminata de 20 minutos o yoga suave. Evitá entrenar el mismo grupo muscular.",
        estiramiento: "Estiramientos dinámicos suaves de 10 min: rotación de hombros, estiramiento de isquiotibiales, gato-vaca.",
        retomar: "Podés entrenar mañana. Enfocate en otro grupo muscular o bajá la intensidad al 60%." },
      { v: "intenso", t: "Dolor Intenso", desc: "Dolor fuerte que limita el movimiento",
        bebida: "Shake de café con proteína whey y plátano para recuperación muscular. Agua con sal y limón para electrolitos.",
        descanso: "Descanso total 48-72 horas del grupo afectado. Aplicá hielo 15 min cada 2 horas las primeras 24h. Baño caliente antes de dormir.",
        estiramiento: "Estiramientos estáticos suaves, sin forzar. Foam roller si está disponible. 15 min mínimo.",
        retomar: "Esperá 2-3 días. Retomá al 50% de intensidad. Si el dolor persiste más de 5 días, consultá a un profesional." },
      { v: "fatiga", t: "Fatiga General", desc: "Cansancio, falta de energía, agotamiento",
        bebida: "Café con guaraná + miel para energía sostenida. Smoothie de café con avena para recuperar glucógeno. Mínimo 3 litros de agua hoy.",
        descanso: "Dormí 8-9 horas esta noche. Siesta de 20 min si es posible. Evitá pantallas 1 hora antes de dormir.",
        estiramiento: "Respiración profunda 4-7-8 (inhalar 4s, sostener 7s, exhalar 8s). Estiramiento suave de cuello y espalda.",
        retomar: "Descansá hoy y mañana. Retomá en 48 horas con una sesión de baja intensidad (recuperación activa)." },
    ],

    HABITS: [
      { k: "entrene", t: "Entrené" }, { k: "bebida", t: "Tomé mi bebida" },
      { k: "dormir", t: "Dormí 7 horas" }, { k: "agua", t: "Tomé suficiente agua" },
    ],

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

    REINICIO_AUDIO_PASOS: [
      { t: "Respiración 4-4-8", min: 1, desc: "Inhalá 4s por nariz, retené 4s, exhalá 8s por la boca. Repetir." },
      { t: "Masaje cervical", min: 1, desc: "Masajeá el cuello lateral derecho con dos dedos, círculos lentos." },
      { t: "Zumbido vagal", min: 1, desc: "Cantá o zumbá en voz baja con la boca cerrada (vibración activa el nervio vago)." },
    ],
    REINICIO_HORMONAS_CHECKLIST: [
      "Última pantalla 60 min antes de dormir", "Habitación a oscuras total (o antifaz)",
      "Temperatura ambiente fresca (18–20 °C ideal)", "Ración Nocturna de Testosterona consumida",
      "Sin alcohol ni cafeína desde las 18 hs",
    ],
    REINICIO_DESPERTAR_PASOS: [
      { t: "Hidratación de Combate", min: 2, desc: "500 ml de agua fría al despertar, antes de cualquier otra cosa." },
      { t: "Activación Espinal", min: 3, desc: "Gato-vaca x10, rotaciones de cadera x10 por lado, plancha 30 segundos." },
      { t: "Encendido Mental", min: 1, desc: "30 segundos de respiración rápida (Wim Hof básico). Luego en voz alta: \"El sistema está activo.\"" },
    ],

    INFO_RECOMENDACIONES: [
      "Entrená a la misma hora todos los días", "Usá ropa cómoda y un espacio libre", "Hidratate antes, durante y después",
      "Descansá al menos 7 horas por noche", "No te saltes días – la constancia es clave", "Escuchá tu cuerpo, no fuerces al dolor",
    ],
    INFO_QUOTE: "La disciplina es el puente entre tus metas y tus resultados.",

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
  },

  en: {
    BRAND: "Calistenia Pro",
    BRAND_SHORT: "Calistenia Pro",
    TAGLINE: "63 days · 3 phases",
    SUPPORT_EMAIL: "plenitudsaludable@gmail.com",
    QUIZ_URL: "https://calisteniapro.up.railway.app",
    LANGUAGES: [
      { code: "es", label: "Español", flag: "🇪🇸" },
      { code: "en", label: "English", flag: "🇺🇸" },
      { code: "pt", label: "Português", flag: "🇧🇷" },
      { code: "zh", label: "中文", flag: "🇨🇳" },
      { code: "ja", label: "日本語", flag: "🇯🇵" },
    ],
    ABOUT_TEXT: "Calistenia Pro is a 21-day military calisthenics program designed to build real strength, extreme endurance and discipline. You train with your own bodyweight — no gym, no excuses.",
    PLACEHOLDER_VIDEO_ID: "ouFzwHY9dmo",
    PLACEHOLDER_VIDEO_THUMB: "https://i.ytimg.com/vi/ouFzwHY9dmo/hqdefault.jpg",
    MOTIVATIONAL_QUOTE: "Strength isn't born in a gym. It's born in your discipline.",
    COPYRIGHT_FOOTER: "Calistenia Pro. Personal use only.",

    DAY_TEMPLATE: [
      { t: "Total Strength Routine", min: 15, desc: "Full bodyweight strength workout." },
      { t: "Endurance & Power", min: 11, desc: "Muscular endurance and explosive power circuit." },
      { t: "Tactical Cardio", min: 7, desc: "High-intensity cardio, military-training style." },
      { t: "Iron Core", min: 10, desc: "Complete core work to armor your midsection." },
      { t: "Explosive Lower Body", min: 10, desc: "Legs and glutes with a focus on explosive power." },
      { t: "Functional Strength", min: 10, desc: "Functional movements that build real strength, not gym strength." },
      { t: "Active Recovery", min: 15, desc: "Mobility and active recovery to lower the load without stopping." },
    ],

    PHASES: [
      { name: "Foundations Pro", desc: "Build the base of your strength and discipline with fundamental movements.", weekStart: 1, weekEnd: 3 },
      { name: "Intensification", desc: "Increase the intensity and push your limits with more demanding workouts.", weekStart: 4, weekEnd: 6 },
      { name: "Mastery Pro", desc: "Master every exercise and lock in your definitive transformation.", weekStart: 7, weekEnd: 9 },
    ],

    QUIZ: [
      { q: "How long have you been training?", key: "experiencia", opts: [
        { t: "Never trained", v: "none" }, { t: "Less than 3 months", v: "beginner" },
        { t: "3 to 12 months", v: "intermediate" }, { t: "More than 1 year", v: "advanced" },
      ] },
      { q: "How many days a week can you train?", key: "dias", opts: [
        { t: "2 to 3 days", v: "2-3" }, { t: "4 to 5 days", v: "4-5" }, { t: "Every day", v: "7" },
      ] },
      { q: "What's your main goal?", key: "objetivo", opts: [
        { t: "Lose fat", v: "grasa" }, { t: "Gain muscle", v: "musculo" }, { t: "Both", v: "ambos" },
      ] },
    ],
    NIVEL_BY_EXPERIENCIA: { none: "principiante", beginner: "principiante", intermediate: "intermedio", advanced: "avanzado" },

    BONOS: [
      { n: 1, type: "IMPORTED PDF", title: "Fat-Burning Drinks", desc: "Interactive library of thermogenic recipes" },
      { n: 2, type: "INTERACTIVE", title: "Progress Plan", desc: "Interactive tracking tool" },
      { n: 3, type: "INTERACTIVE", title: "Recovery Protocol", desc: "Recommendations based on your physical state" },
      { n: 4, type: "TRACKER", title: "Discipline Tracker", desc: "Daily habit log by real date" },
      { n: 5, type: "INTERACTIVE", title: "Black Fuel Protocol", desc: "Tactical food engineering for maximum performance" },
      { n: 6, type: "INTERACTIVE", title: "72H Reset Protocol", desc: "Hormonal and neural reset to wake up in combat mode" },
    ],

    RECIPE_CATEGORIES: [
      { v: "todas", t: "All" }, { v: "energia", t: "⚡ Energy" }, { v: "pre", t: "🏋️ Pre-Workout" },
      { v: "recuperacion", t: "🧊 Recovery" }, { v: "masa", t: "💪 Muscle Mass" }, { v: "termo", t: "🔥 Strong Thermogenic" },
    ],
    RECIPES: [
      { cat: "energia", name: "Coffee with Guarana Powder", ing: ["1 cup ground coffee", "1 tablespoon guarana powder", "1/2 teaspoon cinnamon sweetener (optional)"], prep: "Brew a cup of coffee and add the guarana powder. Sweetener optional. You can also add cinnamon for flavor." },
      { cat: "termo", name: "Thermogenic Coffee with Ice Water", ing: ["1 cup cold water", "1/2 teaspoon ground coffee", "Sweetener to taste (optional)", "Ice cubes"], prep: "Add the ground coffee to the bottom of the cup. Pour cold water and stir until dissolved. Sweeten to taste and top with ice cubes." },
      { cat: "termo", name: "Thermogenic Coffee with Basil", ing: ["1 cup black coffee", "1/2 teaspoon ground basil", "Sweetener (optional)"], prep: "Brew 1 cup of black coffee. Add 1/2 teaspoon ground basil and sweetener if desired. Stir well to combine." },
      { cat: "termo", name: "Fat-Burning Coffee with Ginger and Cinnamon", ing: ["1 cup coffee", "1/2 teaspoon fresh grated ginger", "1/4 teaspoon cinnamon", "1 tablespoon honey", "1/2 cup water", "1/4 cup raw brown rice"], prep: "Combine the coffee, ginger, cinnamon, honey and a cup of water in a saucepan over medium heat. Bring to a boil and cook for 5 minutes. Add the brown rice and remaining water. Bring to a boil again and cook for 20 minutes." },
      { cat: "recuperacion", name: "Thermogenic Coffee with Lemon Balm", ing: ["1 cup strong coffee", "1 tablespoon coconut oil", "1 teaspoon honey", "1/2 teaspoon ground ginger", "Fresh lemon balm leaves (optional)"], prep: "Brew a cup of strong coffee and let it cool slightly. In a blender, combine the coffee, coconut oil, honey and ground ginger. Blend until smooth. Serve cold or over ice." },
      { cat: "termo", name: "Thermogenic Coffee with Cocoa Powder", ing: ["100g instant coffee powder", "100g coconut milk powder", "50g cocoa powder", "50g ground cinnamon", "50g matcha powder", "50g ground turmeric", "10g cayenne pepper powder", "25g ginger powder", "50g maca powder", "100g tribulus terrestris powder"], prep: "Sift all the ingredients into a large bowl. Mix everything well. Sift again and repeat at least once more until uniform. Store in a covered container. To prepare: boil 150-200ml of water and mix with 1 tablespoon of the blend and 1 teaspoon of coconut oil." },
      { cat: "energia", name: "Thermogenic Coffee with Cinnamon", ing: ["1 teaspoon cinnamon", "1 cup coffee", "1 tablespoon honey", "Milk or cream (optional)"], prep: "Add cinnamon to the coffee before brewing. Sweeten with honey. You can also add milk or cream if you prefer a richer drink." },
      { cat: "pre", name: "Thermogenic Coffee with Chestnuts", ing: ["1 cup coffee", "1 tablespoon coconut oil or MCT oil", "1 teaspoon cinnamon", "1/2 teaspoon ginger", "Sweetener (optional)", "1/4 cup roasted chestnuts"], prep: "Preheat the oven to 350°F. Roast the chestnuts for 10-12 minutes. Heat the coconut oil, add coffee, cinnamon, ginger and sweetener. Pour into the blender with the roasted chestnuts and blend on high for 30 seconds." },
      { cat: "masa", name: "Thermogenic Coffee with Egg White", ing: ["1 cup coffee", "1/2 banana", "1/4 teaspoon vanilla extract", "1 tablespoon honey", "1 egg white"], prep: "Blend all the ingredients until smooth. Enjoy immediately." },
      { cat: "termo", name: "Thermogenic Coffee with Clove", ing: ["1 cup black coffee", "1 teaspoon ground clove", "1/2 teaspoon ground cinnamon", "Sweetener to taste"], prep: "Brew black coffee. Add ground clove, cinnamon and sweetener. Stir well and enjoy." },
      { cat: "pre", name: "Thermogenic Coffee with Oat Flakes", ing: ["1 cup strong coffee", "1/2 cup oat flakes", "1 teaspoon honey", "1/4 teaspoon ground cinnamon", "A pinch of salt"], prep: "Brew a cup of strong coffee. In a bowl, combine the oats, honey, cinnamon and salt. Pour the coffee into a large cup. Top with the oat mixture and stir well." },
      { cat: "recuperacion", name: "Thermogenic Coffee with Turmeric", ing: ["1 cup coffee", "1/2 teaspoon turmeric powder", "1 teaspoon coconut oil or butter", "1 tablespoon honey"], prep: "Brew your coffee as usual. Add the turmeric and any desired spices. Heat the coconut oil until melted. Pour the coffee into a cup and add the coconut oil. Sweeten with honey to taste." },
      { cat: "termo", name: "Thermogenic Coffee with Ginger Powder", ing: ["200g traditional instant coffee", "60g ground cinnamon", "20g ginger powder", "10g cayenne pepper", "Powdered sweetener to taste", "1 teaspoon coconut oil (to serve)"], prep: "Mix the dry ingredients in a bowl. Be careful with the pepper. Transfer to a glass jar. To prepare: boil 150-200ml of water and mix with 1 tablespoon of the blend and coconut oil." },
      { cat: "energia", name: "Thermogenic Coffee with Yerba Mate", ing: ["1 cup coffee", "1 teaspoon yerba mate", "Hot water"], prep: "Brew a cup of coffee. Prepare the mate by pouring hot water over 1 teaspoon of yerba mate. Let it steep 10 minutes and strain. Add to the coffee and stir. Drink immediately." },
      { cat: "recuperacion", name: "Thermogenic Coffee with Mint", ing: ["1 cup black coffee", "1/2 teaspoon mint extract", "Sweetener to taste"], prep: "Brew the coffee as usual. Add the mint extract and sweetener. Pour over ice and enjoy." },
      { cat: "masa", name: "Thermogenic Coffee with Avocado", ing: ["1/4 pitted avocado", "1 cup coffee", "1 tablespoon unsweetened cocoa powder", "1 teaspoon honey"], prep: "Make coffee with your preferred method. Add the avocado, cocoa powder and honey to a blender and blend until smooth. Pour into a glass and drink immediately." },
      { cat: "recuperacion", name: "Thermogenic Coffee with Parsley", ing: ["1 cup hot coffee", "1 tablespoon fresh chopped parsley", "1 teaspoon honey", "1/2 teaspoon grated ginger"], prep: "Add fresh chopped parsley to the hot coffee. Add the honey and grated ginger." },
      { cat: "termo", name: "Thermogenic Coffee with Pepper", ing: ["1 cup black coffee", "1/2 teaspoon cayenne pepper", "1 teaspoon honey or maple syrup", "A pinch of cinnamon (optional)"], prep: "Combine all the ingredients in a saucepan and heat over medium heat, stirring until fully warmed." },
      { cat: "recuperacion", name: "Thermogenic Coffee with Boldo Tea", ing: ["1 cup coffee", "1/2 teaspoon boldo tea leaves", "1/4 teaspoon ground cinnamon", "1 tablespoon honey"], prep: "Brew the coffee. Steep the boldo tea leaves in hot water for 5 minutes. Mix honey and cinnamon into the coffee." },
      { cat: "energia", name: "Thermogenic Coffee with Green Tea", ing: ["1 cup ground coffee", "1 teaspoon green tea leaves", "Sweetener (optional)", "Milk or cream (optional)"], prep: "Brew a cup of coffee. Steep the green tea leaves in hot water for 3 minutes before pouring over the coffee. Sweeten to taste." },
      { cat: "termo", name: "Thermogenic Coffee with Apple Cider Vinegar", ing: ["Coffee of your choice", "Apple cider vinegar", "Ground cinnamon", "Nutmeg", "A pinch of cayenne pepper (optional)"], prep: "Add the coffee and apple cider vinegar to the blender and blend. Heat over medium heat. Add the honey, cinnamon, nutmeg and pepper. Serve hot with foam on top." },
      { cat: "recuperacion", name: "Thermogenic Coffee with Horsetail", ing: ["1 cup coffee", "1 cup water", "1 teaspoon alfalfa"], prep: "Bring the water to a boil and let the alfalfa tea simmer for 5-7 minutes. Pour the hot water over the ground coffee and let it steep 3-5 minutes. Strain and serve hot." },
      { cat: "masa", name: "Fat-Burning Coffee with Protein", ing: ["1 cup coffee", "1 tablespoon coconut oil", "1 tablespoon butter", "1 teaspoon cinnamon", "1 tablespoon chocolate whey protein"], prep: "Blend all the ingredients and serve. Coconut oil is made up of medium-chain fatty acids that convert into energy." },
      { cat: "pre", name: "Coffee Shake", ing: ["150ml iced coffee (4 ice cubes with filtered coffee)", "30g chocolate protein", "1 tablespoon unsweetened peanut butter", "1 teaspoon organic cocoa", "1 teaspoon ground cinnamon", "100ml water"], prep: "Combine all the ingredients and blend for 30 seconds or until smooth." },
      { cat: "masa", name: "Coffee Smoothie with Whey", ing: ["4 teaspoons instant coffee", "2 tablespoons chocolate whey", "3 teaspoons cocoa powder", "2 cups skim milk", "1 tablespoon flaxseed", "Cinnamon, sweetener and ice cubes to taste"], prep: "Blend all the ingredients in a blender until smooth." },
    ],

    PROGRESO_METAS: {
      principiante: { pushups: 10, squats: 15, burpees: 5, plancha: 20 },
      intermedio: { pushups: 25, squats: 30, burpees: 12, plancha: 45 },
      avanzado: { pushups: 50, squats: 50, burpees: 25, plancha: 90 },
    },

    RECOVERY_STATES: [
      { v: "leve", t: "Mild Muscle Soreness", desc: "Normal muscle soreness after training",
        bebida: "Thermogenic coffee with turmeric – natural anti-inflammatory. Hydration with water + lemon.",
        descanso: "Active recovery: 20-minute walk or gentle yoga. Avoid training the same muscle group.",
        estiramiento: "Gentle dynamic stretches for 10 min: shoulder rolls, hamstring stretch, cat-cow.",
        retomar: "You can train tomorrow. Focus on a different muscle group or drop the intensity to 60%." },
      { v: "intenso", t: "Intense Pain", desc: "Strong pain that limits movement",
        bebida: "Coffee shake with whey protein and banana for muscle recovery. Water with salt and lemon for electrolytes.",
        descanso: "Full 48-72 hour rest for the affected group. Apply ice 15 min every 2 hours for the first 24h. Hot bath before bed.",
        estiramiento: "Gentle static stretches, no forcing. Foam roller if available. 15 min minimum.",
        retomar: "Wait 2-3 days. Resume at 50% intensity. If pain lasts more than 5 days, consult a professional." },
      { v: "fatiga", t: "General Fatigue", desc: "Tiredness, low energy, exhaustion",
        bebida: "Coffee with guarana + honey for sustained energy. Coffee smoothie with oats to restore glycogen. At least 3 liters of water today.",
        descanso: "Sleep 8-9 hours tonight. 20-min nap if possible. Avoid screens 1 hour before bed.",
        estiramiento: "Deep 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s). Gentle neck and back stretch.",
        retomar: "Rest today and tomorrow. Resume in 48 hours with a low-intensity session (active recovery)." },
    ],

    HABITS: [
      { k: "entrene", t: "Trained" }, { k: "bebida", t: "Had my drink" },
      { k: "dormir", t: "Slept 7 hours" }, { k: "agua", t: "Drank enough water" },
    ],

    COMBUSTIBLE_ALIMENTOS: [
      { ic: "🍠", name: "Sweet Potato", benefit: "Sustained glycogen" },
      { ic: "🥩", name: "Cooked Beef Liver", benefit: "Hormonal density" },
      { ic: "🐟", name: "Canned Sardines", benefit: "Testosterone + anti-inflammatory" },
      { ic: "🌾", name: "Cooked Whole Oats", benefit: "Pre-workout fuel" },
      { ic: "🧄", name: "Chopped Garlic (rested 5 min)", benefit: "Natural vasodilator" },
    ],
    COMBUSTIBLE_COMPRAS: [
      "Pure unsweetened cocoa: 59.5g", "Fresh ginger: 1 medium root", "Sea salt: 1 small pack",
      "Eggs: 14", "Bananas: 7", "Pure honey: 1 small jar", "Sweet potato: 500g",
      "Beef liver: 300g", "Canned sardines: 3 cans", "Whole oats: 500g", "Garlic: 1 head",
    ],
    COMBUSTIBLE_NOCTURNO: {
      grasa: { label: "Night Cut", ing: ["Hard-boiled eggs — 2", "Banana — 1", "Pure honey — 1 teaspoon"], tag: "Your body burns abdominal fat while you sleep." },
      musculo: { label: "Night Build", ing: ["Hard-boiled eggs — 3", "Banana — 1", "Cooked whole oats — 50g", "Pure honey — 1 teaspoon"], tag: "Your body builds muscle while you sleep." },
      ambos: { label: "Night Balance", ing: ["Hard-boiled eggs — 2", "Banana — 1", "Pure honey — 1 teaspoon"], tag: "Perfect balance between burning and building." },
    },
    COMBUSTIBLE_MENTAL_FASES: [
      { t: "Physical Ignition", min: 2, desc: "20 squats + 10 push-ups + 30 seconds of jumping jacks. Do it now, before you think." },
      { t: "Combat Breathing", min: 3, desc: "4-4-8 breathing x 6 cycles: inhale 4s, hold 4s, exhale 8s. Lower your heart rate and take control." },
      { t: "Affirmation & Focus", min: 2, desc: "Repeat out loud 3 times: \"The system is active. Today I train no matter what.\" Visualize today's first exercise." },
    ],

    REINICIO_AUDIO_PASOS: [
      { t: "4-4-8 Breathing", min: 1, desc: "Inhale 4s through your nose, hold 4s, exhale 8s through your mouth. Repeat." },
      { t: "Neck Massage", min: 1, desc: "Massage the right side of your neck with two fingers, slow circles." },
      { t: "Vagal Hum", min: 1, desc: "Sing or hum quietly with your mouth closed (the vibration activates the vagus nerve)." },
    ],
    REINICIO_HORMONAS_CHECKLIST: [
      "Last screen 60 min before bed", "Room in complete darkness (or sleep mask)",
      "Cool room temperature (64–68°F ideal)", "Night Testosterone Ration consumed",
      "No alcohol or caffeine after 6 PM",
    ],
    REINICIO_DESPERTAR_PASOS: [
      { t: "Combat Hydration", min: 2, desc: "500 ml of cold water upon waking, before anything else." },
      { t: "Spinal Activation", min: 3, desc: "Cat-cow x10, hip rotations x10 per side, plank 30 seconds." },
      { t: "Mental Ignition", min: 1, desc: "30 seconds of rapid breathing (basic Wim Hof). Then say out loud: \"The system is active.\"" },
    ],

    INFO_RECOMENDACIONES: [
      "Train at the same time every day", "Wear comfortable clothes and use an open space", "Hydrate before, during and after",
      "Rest at least 7 hours a night", "Don't skip days – consistency is key", "Listen to your body, don't push through pain",
    ],
    INFO_QUOTE: "Discipline is the bridge between your goals and your results.",

    ACHIEVEMENTS: [
      { id: "primer_dia", icon: "🎖️", title: "First Step", desc: "You completed your first day of training.", type: "totalDone", value: 1 },
      { id: "primera_semana", icon: "🥉", title: "First Week", desc: "7 days of training completed.", type: "totalDone", value: 7 },
      { id: "racha_7", icon: "🔥", title: "Fire Streak", desc: "7 days in a row without missing.", type: "streakBest", value: 7 },
      { id: "fase1_superada", icon: "⚔️", title: "Phase 1 Cleared", desc: "You completed all of Phase 1: Foundations Pro.", type: "totalDone", value: 21 },
      { id: "mitad_camino", icon: "🥈", title: "Halfway There", desc: "32 of 63 days completed. You're halfway.", type: "totalDone", value: 32 },
      { id: "transformacion", icon: "📸", title: "Transformation Logged", desc: "You uploaded at least one progress photo.", type: "photo", value: 1 },
      { id: "racha_30", icon: "🌋", title: "Iron Discipline", desc: "30 days in a row without missing.", type: "streakBest", value: 30 },
      { id: "mision_cumplida", icon: "🏆", title: "Mission Accomplished", desc: "You completed all 63 days of the program.", type: "totalDone", value: 63 },
    ],
  },

};

// Idioma activo al cargar la página: el que se guardó en localStorage
// (forja_lang), o "es" por default. app.js puede cambiarlo en caliente
// con setLanguage() sin necesidad de recargar.
(function () {
  var lang = 'es';
  try {
    var raw = localStorage.getItem('forja_lang');
    if (raw) { var parsed = JSON.parse(raw); if (window.CONTENT[parsed]) lang = parsed; }
  } catch (e) {}
  window.CONFIG = window.CONTENT[lang];
})();
