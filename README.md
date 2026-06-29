# Guidox — prototipo comercial

Prototipo estático para presentar una solución de Digital Match Global a un comercio de productos frescos con una línea de abastecimiento a restaurantes.

## Deploy en Vercel

El proyecto no necesita compilación ni dependencias: Vercel sirve directamente los archivos HTML, CSS y JavaScript.

1. En Vercel, elegir **Add New → Project**.
2. Importar `DigitalMatchGlobal/Guidox`.
3. Vercel leerá `vercel.json`: framework `Other`, sin build y con la raíz como directorio de salida.
4. Elegir **Deploy**.

Cada push a `main` generará un nuevo deployment. En producción, `cleanUrls` expone `login.html` como `/login`, `dashboard.html` como `/dashboard` y `lista/restaurantes.html` como `/lista/restaurantes`.

## Recorrido local

1. Abrir `index.html` para ver la landing pública.
2. Elegir **Ingresar**.
3. Usar `demo@guidox.uy` / `demo123`.
4. Recorrer el panel desde la navegación lateral.
5. Abrir la lista pública para restaurantes desde la landing o desde el panel.

## Funciones demostradas

- Catálogo central con búsqueda, filtros y alta de productos.
- Punto de venta, medios de pago, ticket y cierre de caja.
- Cambio de precios con persistencia local en el navegador.
- Actualización rápida para caja, balanza y lista mayorista.
- Stock y regla conceptual para evitar ventas duplicadas al imprimir etiquetas.
- Exportación CSV de productos para una futura integración con la balanza.
- Generador visual de etiquetas.
- Lista online para restaurantes y pedidos.
- Catálogo público mayorista con búsqueda, categorías y armado de pedido dummy.
- Usuarios y permisos para incorporar empleados.
- Diseño adaptable a celular y escritorio.

## Antes de publicar

- Sustituir `Guidox` por el nombre comercial definitivo.
- Reemplazar `59800000000` en los enlaces de WhatsApp.
- Confirmar precios, productos, horarios, reparto y zonas de cobertura.
- Confirmar el modelo y formato de importación de la balanza/impresora.
- Implementar backend, autenticación y base de datos. El login actual es demostrativo.
