// --- Utilidades de almacenamiento ---
function getDirecciones() {
    return JSON.parse(localStorage.getItem('direcciones')) || [];
}
function setDirecciones(arr) {
    localStorage.setItem('direcciones', JSON.stringify(arr));
}

// --- Renderizado de lista de direcciones ---
function renderDireccionesLista(contenedorId, onDeleteCallback) {
    const lista = document.getElementById(contenedorId);
    if (!lista) return;
    const direcciones = getDirecciones();
    if (direcciones.length === 0) {
        lista.innerHTML = `<div class="text-muted px-3 py-4">Aún no tienes direcciones guardadas.</div>`;
        return;
    }
    lista.innerHTML = direcciones.map((dir, idx) => `
        <div class="direccion-item d-flex align-items-center justify-content-between px-4 py-3 mb-2" style="background:#fafafa; border-radius:8px;">
            <div class="d-flex align-items-center gap-2">
                <i class="bi bi-star" style="color:#bbb; font-size:1.3rem;"></i>
                <span style="color:#223; font-size:1.08rem;">${dir}</span>
            </div>
            <button class="btn btn-link text-danger p-0 ms-2 btn-borrar-direccion" data-idx="${idx}" title="Eliminar">
                <i class="bi bi-trash" style="font-size:1.2rem;"></i>
            </button>
        </div>
    `).join('');
    // Evento borrar
    lista.querySelectorAll('.btn-borrar-direccion').forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            const arr = getDirecciones();
            arr.splice(idx, 1);
            setDirecciones(arr);
            renderDireccionesLista(contenedorId, onDeleteCallback);
            if (onDeleteCallback) onDeleteCallback();
        };
    });
}

// --- Agregar dirección ---
function addDireccion(direccion, callback) {
    const arr = getDirecciones();
    arr.push(direccion);
    setDirecciones(arr);
    if (callback) callback();
}

// --- Modal agregar dirección (reutilizable) ---
function abrirModalAgregarDireccion(onAddCallback) {
    const modal = new bootstrap.Modal(document.getElementById('agregarDireccionModal'));
    modal.show();
    // Cuando se envía el formulario
    const form = document.getElementById('form-direccion');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const dir = form.querySelector('input[name="direccion"]').value.trim();
            if (dir) {
                addDireccion(dir, onAddCallback);
                modal.hide();
                form.reset();
            }
        };
    }
}

// --- Modal seleccionar dirección (para entrega) ---
function abrirModalSeleccionarDireccion(onSelectCallback) {
    const modal = new bootstrap.Modal(document.getElementById('selecDireccionModal'));
    modal.show();
    // Renderiza lista y permite seleccionar
    const lista = document.getElementById('lista-direcciones-seleccion');
    if (lista) {
        const direcciones = getDirecciones();
        lista.innerHTML = direcciones.map((dir, idx) => `
            <div class="direccion-item-select d-flex align-items-center justify-content-between px-4 py-3 mb-2" style="background:#fafafa; border-radius:8px; cursor:pointer;" data-idx="${idx}">
                <span style="color:#223; font-size:1.08rem;">${dir}</span>
            </div>
        `).join('');
        lista.querySelectorAll('.direccion-item-select').forEach(item => {
            item.onclick = function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                if (onSelectCallback) onSelectCallback(getDirecciones()[idx]);
                modal.hide();
            };
        });
    }
}

// --- Exportar funciones globalmente ---
window.Direcciones = {
    getDirecciones,
    setDirecciones,
    renderDireccionesLista,
    addDireccion,
    abrirModalAgregarDireccion,
    abrirModalSeleccionarDireccion
};