import "./styles.css";

const API_AUTOS =
  "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/subaru?format=json";
const API_IMAGENES = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const SIN_IMAGEN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#dfe5f1"/><text x="160" y="108" font-family="sans-serif" font-size="18" text-anchor="middle" fill="#6b7a99">Sin imagen</text></svg>`,
  );

const grilla = document.querySelector("#grilla");
const estado = document.querySelector("#estado");
const formulario = document.querySelector("#controles");
const busqueda = document.querySelector("#busqueda");
const orden = document.querySelector("#orden");

let autos = [];

function mostrarEstado(tipo, mensaje) {
  estado.hidden = false;
  estado.className = `estado estado--${tipo}`;
  estado.textContent = mensaje;
}

function ocultarEstado() {
  estado.hidden = true;
}

async function obtenerAutos() {
  const response = await fetch(API_AUTOS);
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }
  const datos = await response.json();
  if (!Array.isArray(datos.Results) || datos.Results.length === 0) {
    throw new Error("La API no devolvió modelos");
  }
  return datos.Results.map((item) => ({
    id: item.Model_ID,
    nombre: item.Model_Name,
    marca: item.Make_Name,
    imagen: null,
  }));
}

async function cargarImagen(auto) {
  try {
    const titulo = encodeURIComponent(
      `Subaru ${auto.nombre}`.replaceAll(" ", "_"),
    );
    const response = await fetch(`${API_IMAGENES}${titulo}`);
    if (!response.ok) {
      return;
    }
    const datos = await response.json();
    const fuente = datos.thumbnail?.source;
    if (fuente) {
      auto.imagen = fuente;
      const img = grilla.querySelector(`img[data-id="${auto.id}"]`);
      if (img) {
        img.src = fuente;
      }
    }
  } catch (error) {
    console.warn(`Sin imagen para ${auto.nombre}:`, error);
  }
}

function crearTarjeta(auto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta";
  if (auto.nombre.toLowerCase().includes("impreza")) {
    tarjeta.classList.add("tarjeta--destacada");
  }

  const img = document.createElement("img");
  img.src = auto.imagen ?? SIN_IMAGEN;
  img.alt = `${auto.marca} ${auto.nombre}`;
  img.loading = "lazy";
  img.dataset.id = auto.id;
  img.addEventListener(
    "error",
    () => {
      img.src = SIN_IMAGEN;
    },
    { once: true },
  );

  const titulo = document.createElement("h2");
  titulo.textContent = auto.nombre;

  const dato = document.createElement("p");
  dato.textContent = `${auto.marca} · Código NHTSA: ${auto.id}`;

  tarjeta.append(img, titulo, dato);
  return tarjeta;
}

function obtenerVisibles() {
  const texto = busqueda.value.trim().toLowerCase();
  const visibles = autos.filter((auto) =>
    auto.nombre.toLowerCase().includes(texto),
  );
  visibles.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  if (orden.value === "za") {
    visibles.reverse();
  }
  return visibles;
}

function mostrarAutos() {
  if (autos.length === 0) {
    return;
  }
  const visibles = obtenerVisibles();
  if (visibles.length === 0) {
    grilla.replaceChildren();
    mostrarEstado("vacio", "No hay modelos que coincidan con tu busqueda.");
    return;
  }
  ocultarEstado();
  grilla.replaceChildren(...visibles.map(crearTarjeta));
}

async function iniciar() {
  mostrarEstado("cargando", "Cardango modelos...");
  try {
    autos = await obtenerAutos();
    mostrarAutos();
    autos.forEach(cargarImagen);
  } catch (error) {
    console.error(error);
    grilla.replaceChildren();
    mostrarEstado(
      "error",
      "No pudimos cargar los modelos. Revisá tu conexión e intenta de nuevo.",
    );
  }
}

busqueda.addEventListener("input", mostrarAutos);
orden.addEventListener("change", mostrarAutos);
formulario.addEventListener("submit", (evento) => evento.preventDefault());
iniciar();
