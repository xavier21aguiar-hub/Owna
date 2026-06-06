# OWNA - Sistema de carrito abandonado

## Resumen

Esta implementacion agrega un funnel funcional:

- Producto -> Carrito -> Checkout -> Confirmacion
- Analytics del embudo
- Deteccion de carrito abandonado a los 60 minutos
- Secuencia de 3 correos de recuperacion
- Panel administrativo para evidencia academica

## Archivos principales modificados

- `src/App.jsx`
- `src/main.jsx`
- `src/styles.css`
- `src/data/products.js`
- `src/components/Navbar.jsx`
- `src/components/ProductCard.jsx`
- `src/pages/Home.jsx`
- `src/pages/Categories.jsx`

## Archivos nuevos principales

- `src/context/ShopContext.jsx`
- `src/components/ClarityProvider.jsx`
- `src/components/FunnelInsights.jsx`
- `src/pages/ProductDetail.jsx`
- `src/pages/Cart.jsx`
- `src/pages/Checkout.jsx`
- `src/pages/Confirmation.jsx`
- `src/pages/AdminDashboard.jsx`
- `src/pages/About.jsx`
- `src/lib/storage.js`
- `src/lib/shop-utils.js`
- `.env.example`

## Configuracion de Microsoft Clarity

1. Crear un proyecto en Microsoft Clarity.
2. Copiar el `Project ID`.
3. Crear un archivo `.env` basado en `.env.example`.
4. Definir:

```bash
VITE_CLARITY_PROJECT_ID=tu_project_id
```

5. Reiniciar el servidor local o volver a desplegar en Vercel.

## Donde consultar la evidencia en Clarity

- `Project ID`: dentro de la configuracion del proyecto en Clarity.
- `Heatmaps`: seccion de heatmaps del proyecto.
- `Recordings`: seccion de recordings o session recordings.
- `Clicks y scroll`: dentro de heatmaps y analytics visuales de cada pagina.
- Referencias oficiales:
  - https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
  - https://learn.microsoft.com/en-us/clarity/heatmaps/heatmaps-overview
  - https://learn.microsoft.com/en-us/clarity/session-recordings/recordings-overview

## Como probar la funcionalidad

1. Entrar a `/shop` o a una pagina de producto.
2. Abrir un producto y agregarlo al carrito.
3. Ir a `/cart`.
4. Completar nombre y correo para habilitar recuperacion por email.
5. Continuar a `/checkout`.
6. Completar envio y pago para probar compra finalizada.
7. Ir a `/admin` para revisar el funnel.

## Como simular carrito abandonado

Opciones:

1. Agregar un producto al carrito, dejar nombre y correo, y esperar 60 minutos.
2. Usar el boton `Simular abandono` en `/admin`.
3. Usar el boton `Acelerar emails` para disparar la secuencia de 1h, 12h y 24h sin esperar.

Cuando el sistema detecta abandono:

- crea un registro `AbandonedCart`
- guarda email, nombre, productos, total y fecha
- programa Email 1, Email 2 y Email 3 segun el tiempo transcurrido

## Evidencia sugerida para el reporte academico

Capturas recomendadas:

1. Funnel en `/admin`
2. Tabla `AbandonedCart`
3. Secuencia de emails dentro de `/admin`
4. Heatmap de Clarity con clics y scroll
5. Session recording de un abandono del checkout

## Limitaciones de esta demo

- Usa `localStorage` como base de datos local.
- La apertura de emails se simula desde el panel admin.
- Para un entorno real se recomienda conectar backend, base de datos y proveedor SMTP o transactional email.
