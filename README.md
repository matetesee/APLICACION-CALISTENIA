# Sistema Forja — App de Calistenia Militar

Clon funcional de Sistema Titanio: app de 63 días (3 fases) + 6 bonos interactivos,
reconstruida como código propio (vanilla JS, sin frameworks) manteniendo el mismo
contenido, textos, recetas y mecánica.

## Estructura
- `index.html` — shell de la app (header, nav inferior, contenedor de vista).
- `config.js` — **todo el contenido** vive acá (días, fases, recetas, bonos, info).
- `app.js` — el motor: router de las 4 pestañas + toda la lógica interactiva.
- `server.js` — servidor estático con fallback de SPA (para que `/programa`,
  `/tu-plan`, `/info` funcionen al entrar directo o recargar).
- `manifest.json` + `icon.svg` — PWA instalable ("Agregar a inicio").

## Correr en local
```bash
npm start
```
Abrí `http://localhost:3000`.

## Diferencias a propósito vs. el original (arregladas)
El original (Sistema Titanio) tenía dos bugs reales que acá quedaron **arreglados**:
1. **Test Inicial:** en el original, los pasos 2/3 del quiz mostraban la misma
   pregunta que el paso 1 y el radio no respondía (quedaba trabado para siempre).
   Acá armé 2 preguntas nuevas y reales (días por semana, objetivo) para que el
   test funcione de punta a punta.
2. **Marcar como completado:** en el original el botón no persistía el progreso
   (`completedDays` quedaba vacío siempre). Acá sí guarda, actualiza el % y
   desbloquea el día siguiente.

## Pendiente antes de lanzar de verdad
- **Videos reales de cada día:** los 63 días usan el mismo video placeholder de
  YouTube (`CONFIG.PLACEHOLDER_VIDEO_ID` en `config.js`), igual que en el
  original ahora mismo. Cuando tengas los 63 videos reales, sumá un campo
  `videoId` a cada día en el array `DAYS` (ver `buildDays()` en `app.js`) o al
  `DAY_TEMPLATE`.
- **Email de soporte:** `CONFIG.SUPPORT_EMAIL` en `config.js` está en
  `soporte@sistemaforja.com` como placeholder — cambialo por el real.
- **"Progreso estimado" (Bono 2):** el original mostraba un % que no pude
  reconstruir con exactitud (los mismos inputs daban valores distintos en
  distintas pruebas). Acá usé una fórmula propia razonable basada en la
  distancia entre peso actual y objetivo — ajustable en `renderBono2()`.
- **Protocolo Mental del Toro (Bono 5), fases 2 y 3:** solo pude ver el
  contenido de la Fase 1 en el original (las fases 2/3 requieren esperar el
  timer real). El texto de esas dos fases es una aproximación razonable mía,
  no una copia exacta — revisalo si tenés acceso al contenido real.
- **BCL / VTurb:** todavía no está conectado (dijiste que primero hay que crear
  la cuenta). Cuando la tengas, pasame el snippet de embed de tu video.

## Deploy en Railway
1. `railway.app` → **New Project** → **Deploy from GitHub repo**.
2. Elegí `matetesee/APLICACION-CALISTENIA`.
3. Railway detecta Node (via `package.json`) y corre `npm start`.
