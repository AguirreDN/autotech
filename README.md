# AutoTech

Autos con enfoque en la marca Subaru y su modelo estrella Impreza. El catálogo lista los modelos de Subaru y resalta el Impreza.

# API utilizada

- NHTSA vPIC (`GetModelsForMake/subaru`): lista de modelos. Pública, gratuita y sin clave.
- Wikipedia REST (`page/summary`): imagen de cada modelo. Pública y sin clave.

No es necesario usar claves en las APIs.

# Funcionalidad

- Landing con hero, descripcion del tema y boton al catalogo.
- Catálogo con grilla de tarjetas (imagen, nombre y código NHTSA).
- Estados de "cargando" y "error".
- Búsqueda por texto, orden A->Z / Z->A y estado "sin resultados".
- Responsive (Flexbos, Grid y media query).
- Build con dos páginas (`index.html` y `catalogo.html`) y `base: "./"`.

# Cómo ejecutarlo

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # genera dist/
npm run preview   # prueba el build
```
