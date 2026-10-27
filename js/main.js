// ================================================
// 1. CONFIGURACIÓN INICIAL
// ================================================

// Clave que utilizaremos para guardar los productos
// en el almacenamiento local del navegador.

const CLAVE_STORAGE = "essentialMenProductos";


// ================================================
// 2. CLASE PRODUCTO
// ================================================

// Creamos una clase para representar cada producto
// de nuestro catálogo.

class Producto {
    constructor(id, nombre, precio, categoria, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }
}


// ================================================
// 3. PRODUCTOS INICIALES
// ================================================

// Estos productos se mostrarán la primera vez que
// se abra la aplicación y todavía no haya datos guardados.
//
// Si el usuario vacía el catálogo, no volverán a cargarse
// automáticamente, porque guardaremos un array vacío.

const productosIniciales = [
    new Producto(1, "Reloj Tressa", 85000, "Relojes", 10),
    new Producto(2, "Gafas de sol", 35000, "Gafas", 15),
    new Producto(3, "Remera básica", 22000, "Remeras", 20),
    new Producto(4, "Short deportivo", 28000, "Shorts", 0)
];


// ================================================
// 4. CARGAR PRODUCTOS DESDE LOCALSTORAGE
// ================================================

// Intentamos recuperar los productos guardados.
//
// JSON.parse() convierte el texto almacenado en datos
// de JavaScript.
//
// El operador ?? permite utilizar "null" cuando
// localStorage.getItem() devuelve null.
//
// Si todavía no hay datos guardados, utilizamos
// los productos iniciales.
//
// Si existe un array vacío [], lo respetamos.

function cargarProductos() {
    try {
        const datosGuardados = JSON.parse(
            localStorage.getItem(CLAVE_STORAGE) ?? "null"
        );

        // Si todavía no existe información guardada,
        // comenzamos con los productos iniciales.

        if (datosGuardados === null) {
            return productosIniciales.map(producto => {
                return new Producto(
                    producto.id,
                    producto.nombre,
                    producto.precio,
                    producto.categoria,
                    producto.stock
                );
            });
        }

        // Comprobamos que los datos recuperados
        // sean un array.

        if (!Array.isArray(datosGuardados)) {
            return productosIniciales.map(producto => {
                return new Producto(
                    producto.id,
                    producto.nombre,
                    producto.precio,
                    producto.categoria,
                    producto.stock
                );
            });
        }

        // Reconstruimos los objetos como instancias
        // de la clase Producto.

        return datosGuardados.map(producto => {
            return new Producto(
                producto.id,
                producto.nombre,
                producto.precio,
                producto.categoria,
                producto.stock
            );
        });

    } catch (error) {
        console.error("Error al cargar los productos:", error);

        // Si los datos guardados están dañados o no se
        // pueden interpretar, usamos los productos iniciales.

        return productosIniciales.map(producto => {
            return new Producto(
                producto.id,
                producto.nombre,
                producto.precio,
                producto.categoria,
                producto.stock
            );
        });
    }
}


// ================================================
// 5. ESTADO INICIAL DE LA APLICACIÓN
// ================================================

// Recuperamos los productos guardados.
// Este array será nuestra fuente principal de datos.

let productos = cargarProductos();


// Calculamos el próximo ID disponible.
//
// Math.max() encuentra el ID más alto.
// El operador ?? utiliza 0 si no hay ningún ID.

let siguienteId =
    Math.max(0, ...productos.map(producto => producto.id ?? 0)) + 1;


// ================================================
// 6. SELECCIÓN DE ELEMENTOS DEL DOM
// ================================================

// Obtenemos los elementos HTML que necesitamos
// manipular desde JavaScript.

const formulario = document.getElementById("formulario-producto");

const inputNombre = document.getElementById("nombre");

const inputCategoria = document.getElementById("categoria");

const inputPrecio = document.getElementById("precio");

const inputStock = document.getElementById("stock");

const inputBusqueda = document.getElementById("busqueda");

const listaProductos = document.getElementById("lista-productos");

const mensaje = document.getElementById("mensaje");

const contador = document.getElementById("contador");

const botonVaciar = document.getElementById("vaciar-catalogo");


// ================================================
// 7. GUARDAR PRODUCTOS EN LOCALSTORAGE
// ================================================

// JSON.stringify() transforma el array de productos
// en texto JSON.
//
// localStorage.setItem() guarda ese texto en el navegador.

function guardarProductos() {
    try {
        localStorage.setItem(
            CLAVE_STORAGE,
            JSON.stringify(productos)
        );

        return true;

    } catch (error) {
        console.error("Error al guardar los productos:", error);

        mostrarMensaje(
            "No se pudieron guardar los cambios en el navegador.",
            "error"
        );

        return false;
    }
}


// ================================================
// 8. MOSTRAR MENSAJES AL USUARIO
// ================================================

// Esta función muestra mensajes de éxito o error
// dentro de la página.

function mostrarMensaje(texto, tipo = "exito") {
    mensaje.textContent = texto;

    mensaje.className = "mensaje";

    mensaje.classList.add(
        tipo === "error" ? "mensaje-error" : "mensaje-exito"
    );
}


// ================================================
// 9. PROTEGER EL CONTENIDO HTML
// ================================================

// Escapamos caracteres especiales para evitar que
// los nombres de los productos se interpreten como HTML.

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => {
        const caracteresHTML = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return caracteresHTML[caracter];
    });
}


// ================================================
// 10. FORMATEAR PRECIOS
// ================================================

// Mostramos los precios en formato monetario argentino.

function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 2
    }).format(precio);
}


// ================================================
// 11. ACTUALIZAR EL CONTADOR
// ================================================

// El contador muestra cuántos productos hay
// almacenados en el catálogo.

function actualizarContador() {
    const cantidad = productos.length;

    // Operador ternario:
    // Si hay un producto, mostramos "producto".
    // En caso contrario, mostramos "productos".

    contador.textContent =
        `${cantidad} ${cantidad === 1 ? "producto" : "productos"}`;
}


// ================================================
// 12. RENDERIZAR EL CATÁLOGO
// ================================================

// Esta función dibuja las tarjetas de productos
// dentro del HTML.
//
// Recibe un array como parámetro para poder mostrar
// todos los productos o solamente los resultados
// de una búsqueda.

function renderizarProductos(productosAMostrar = productos) {

    // Actualizamos el contador general.

    actualizarContador();

    // Si no hay productos para mostrar,
    // presentamos un mensaje en el catálogo.

    if (productosAMostrar.length === 0) {
        listaProductos.innerHTML = `
            <div class="catalogo-vacio">
                <p>No hay productos para mostrar.</p>
                <p>Podés agregar productos usando el formulario.</p>
            </div>
        `;

        return;
    }

    // Recorremos el array y generamos una tarjeta
    // HTML para cada producto.

    listaProductos.innerHTML = productosAMostrar.map(producto => {

        // Destructuring:
        // Extraemos las propiedades del objeto Producto.

        const {
            id,
            nombre,
            precio,
            categoria,
            stock
        } = producto;

        // Operador ternario:
        // Si el stock es mayor a cero, está disponible.
        // Si no, se encuentra agotado.

        const estadoStock = stock > 0
            ? `<span class="stock-disponible">Disponible</span>`
            : `<span class="stock-agotado">Agotado</span>`;

        return `
            <article class="tarjeta">

                <h3>${escaparHTML(nombre)}</h3>

                <span class="categoria-producto">
                    ${escaparHTML(categoria)}
                </span>

                <p class="precio-producto">
                    ${formatearPrecio(precio)}
                </p>

                <p class="stock-producto">
                    Stock: <strong>${stock}</strong>
                    <br>
                    Estado: ${estadoStock}
                </p>

                <div class="control-stock">

                    <label for="stock-${id}">
                        Actualizar cantidad
                    </label>

                    <input
                        type="number"
                        id="stock-${id}"
                        class="input-stock"
                        data-id="${id}"
                        min="0"
                        step="1"
                        value="${stock}"
                        required
                    >

                    <button
                        type="button"
                        class="boton boton-principal"
                        data-accion="actualizar-stock"
                        data-id="${id}"
                    >
                        Actualizar stock
                    </button>

                </div>

                <button
                    type="button"
                    class="boton boton-eliminar"
                    data-accion="eliminar"
                    data-id="${id}"
                >
                    Eliminar producto
                </button>

            </article>
        `;

    }).join("");
}


// ================================================
// 13. BUSCAR PRODUCTOS
// ================================================

// Filtramos el catálogo según el texto ingresado
// en el buscador.
//
// Se puede buscar por nombre o por categoría.

function actualizarCatalogo() {

    // Obtenemos el texto de búsqueda y lo convertimos
    // a minúsculas para evitar diferencias entre
    // mayúsculas y minúsculas.

    const textoBusqueda = inputBusqueda.value
        .trim()
        .toLowerCase();

    // filter() crea un nuevo array con los productos
    // que cumplen la condición de búsqueda.

    const productosFiltrados = productos.filter(producto => {

        // Operador de encadenamiento opcional ?.
        // Operador de coalescencia nula ??.

        const nombre = producto.nombre?.toLowerCase() ?? "";

        const categoria = producto.categoria?.toLowerCase() ?? "";

        return nombre.includes(textoBusqueda) ||
               categoria.includes(textoBusqueda);
    });

    // Mostramos únicamente los productos encontrados.

    renderizarProductos(productosFiltrados);
}


// ================================================
// 14. AGREGAR PRODUCTOS
// ================================================

// Escuchamos el envío del formulario.

formulario.addEventListener("submit", function(evento) {

    // Evitamos que el navegador recargue la página
    // cuando se envía el formulario.

    evento.preventDefault();

    // Obtenemos y limpiamos los valores ingresados.

    const nombre = inputNombre.value.trim();

    const categoria = inputCategoria.value;

    const precio = Number(inputPrecio.value);

    const stock = Number(inputStock.value);

    // Validamos los datos antes de crear el producto.

    if (nombre === "") {
        mostrarMensaje(
            "Ingresá el nombre del producto.",
            "error"
        );

        return;
    }

    if (categoria === "") {
        mostrarMensaje(
            "Seleccioná una categoría.",
            "error"
        );

        return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
        mostrarMensaje(
            "El precio debe ser un número mayor a cero.",
            "error"
        );

        return;
    }

    if (
        !Number.isInteger(stock) ||
        stock < 0
    ) {
        mostrarMensaje(
            "El stock debe ser un número entero igual o mayor a cero.",
            "error"
        );

        return;
    }

    // Creamos una nueva instancia de Producto.

    const nuevoProducto = new Producto(
        siguienteId,
        nombre,
        precio,
        categoria,
        stock
    );

    // Agregamos el nuevo producto al array.

    productos.push(nuevoProducto);

    // Guardamos el nuevo ID antes de pasar al siguiente.

    siguienteId++;

    // Guardamos los cambios en localStorage.
    // Si falla el guardado, revertimos el alta para
    // mantener el estado en memoria coherente.

    if (!guardarProductos()) {
        productos.pop();
        siguienteId--;

        return;
    }

    // Limpiamos el formulario.

    formulario.reset();

    // Limpiamos también el buscador para que
    // el producto recién agregado pueda verse.

    inputBusqueda.value = "";

    // Actualizamos el DOM.

    actualizarCatalogo();

    // Mostramos un mensaje de confirmación.

    mostrarMensaje(
        `El producto "${nombre}" se agregó correctamente.`
    );

});


// ================================================
// 15. ELIMINAR PRODUCTOS Y ACTUALIZAR STOCK
// ================================================

// Utilizamos un único evento para escuchar los clics
// en los botones de las tarjetas.
//
// Esta técnica se conoce como delegación de eventos.
// Es útil porque las tarjetas se generan dinámicamente.

listaProductos.addEventListener("click", function(evento) {

    // Buscamos el botón que se presionó.
    // closest() también permite que funcione si se hace
    // clic sobre un elemento dentro del botón.

    const boton = evento.target.closest("button[data-accion]");

    // Si el clic no corresponde a un botón válido,
    // terminamos la función.

    if (!boton) {
        return;
    }

    // Obtenemos la acción y el ID del producto.

    const accion = boton.dataset.accion;

    const id = Number(boton.dataset.id);


    // --------------------------------------------
    // 15.1 ELIMINAR PRODUCTO
    // --------------------------------------------

    if (accion === "eliminar") {

        // Buscamos la posición del producto dentro
        // del array.

        const indice = productos.findIndex(producto => {
            return producto.id === id;
        });

        // Si no encontramos el producto, terminamos.

        if (indice === -1) {
            mostrarMensaje(
                "No se encontró el producto seleccionado.",
                "error"
            );

            return;
        }

        // Guardamos el producto eliminado para poder
        // restaurarlo si falla el almacenamiento.

        const productoEliminado = productos[indice];

        // splice() elimina un elemento del array.
        // El primer parámetro es el índice.
        // El segundo indica cuántos elementos eliminar.

        productos.splice(indice, 1);

        // Persistimos el cambio.

        if (!guardarProductos()) {

            // Si no se pudo guardar, recuperamos
            // el producto en su posición original.

            productos.splice(indice, 0, productoEliminado);

            return;
        }

        // Actualizamos la interfaz.

        actualizarCatalogo();

        mostrarMensaje(
            `El producto "${productoEliminado.nombre}" fue eliminado.`
        );

        return;
    }


    // --------------------------------------------
    // 15.2 ACTUALIZAR STOCK
    // --------------------------------------------

    if (accion === "actualizar-stock") {

        // Buscamos el producto en el array.

        const producto = productos.find(producto => {
            return producto.id === id;
        });

        if (!producto) {
            mostrarMensaje(
                "No se encontró el producto seleccionado.",
                "error"
            );

            return;
        }

        // Buscamos el input asociado al producto.

        const inputStockProducto = listaProductos.querySelector(
            `input.input-stock[data-id="${id}"]`
        );

        // Obtenemos la nueva cantidad.

        const nuevoStock = Number(inputStockProducto?.value);

        // Validamos el valor ingresado.

        if (
            !inputStockProducto ||
            inputStockProducto.value.trim() === "" ||
            !Number.isInteger(nuevoStock) ||
            nuevoStock < 0
        ) {
            mostrarMensaje(
                "Ingresá un stock entero igual o mayor a cero.",
                "error"
            );

            return;
        }

        // Guardamos el stock anterior por si ocurre
        // un error al guardar los cambios.

        const stockAnterior = producto.stock;

        // Actualizamos el objeto dentro del array.

        producto.stock = nuevoStock;

        // Persistimos la actualización.

        if (!guardarProductos()) {

            // Si falla el guardado, restauramos
            // el valor anterior.

            producto.stock = stockAnterior;

            return;
        }

        // Actualizamos las tarjetas del catálogo.

        actualizarCatalogo();

        mostrarMensaje(
            `El stock de "${producto.nombre}" se actualizó correctamente.`
        );
    }

});


// ================================================
// 16. VACIAR EL CATÁLOGO
// ================================================

// Este botón elimina todos los productos del array
// y guarda el resultado en localStorage.
//
// Importante: el array vacío [] también se guarda.
// Por eso, al actualizar la página, el catálogo
// seguirá vacío y no se cargarán los productos iniciales.

botonVaciar.addEventListener("click", function() {

    // Si el catálogo ya está vacío, informamos al usuario.

    if (productos.length === 0) {
        mostrarMensaje(
            "El catálogo ya está vacío.",
            "error"
        );

        return;
    }

    // Guardamos temporalmente los productos para poder
    // recuperarlos si ocurre un error al guardar.

    const productosAnteriores = productos;

    // splice() elimina todos los elementos del array
    // sin crear una nueva referencia al array.

    productos.splice(0, productos.length);

    // Guardamos el array vacío en localStorage.

    if (!guardarProductos()) {

        // Si falla el guardado, restauramos los productos.

        productos.push(...productosAnteriores);

        return;
    }

    // Limpiamos el buscador.

    inputBusqueda.value = "";

    // Actualizamos el catálogo y el contador.

    actualizarCatalogo();

    mostrarMensaje(
        "El catálogo se vació correctamente."
    );

});


// ================================================
// 17. EVENTO DEL BUSCADOR
// ================================================

// Cada vez que el usuario escribe, actualizamos
// los resultados sin recargar la página.

inputBusqueda.addEventListener("input", function() {

    actualizarCatalogo();

});


// ================================================
// 18. INICIALIZAR LA APLICACIÓN
// ================================================

// Cuando se carga el archivo JavaScript,
// mostramos los productos disponibles.
//
// Si hay datos guardados, se recuperan.
// Si nunca se guardaron datos, se muestran
// los productos iniciales.

actualizarCatalogo();