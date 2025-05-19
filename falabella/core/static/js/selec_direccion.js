document.addEventListener('DOMContentLoaded', function() {
    // Mostrar modal al hacer click en "Cambiar"
    document.getElementById('cambiar-direccion-link').addEventListener('click', function(e) {
        e.preventDefault();
        renderDirecciones();
        const modal = new bootstrap.Modal(document.getElementById('selecDireccionModal'));
        modal.show();
    });

    // Agregar nueva dirección: cerrar este modal y abrir el de agregar
    document.getElementById('agregar-direccion').addEventListener('click', function() {
        const modalSeleccion = bootstrap.Modal.getInstance(document.getElementById('selecDireccionModal'));
        if (modalSeleccion) modalSeleccion.hide();
        setTimeout(() => {
            const modalAgregar = new bootstrap.Modal(document.getElementById('agregarDireccionModal'));
            modalAgregar.show();
        }, 400);
    });

    // Seleccionar dirección
    document.getElementById('seleccionar-direccion').addEventListener('click', function() {
        const seleccionada = document.querySelector('input[name="direccion-radio"]:checked');
        if (seleccionada) {
            document.getElementById('direccion-actual').textContent = seleccionada.value;
            const modal = bootstrap.Modal.getInstance(document.getElementById('selecDireccionModal'));
            modal.hide();
        }
    });
});

// Renderiza la lista de direcciones
function renderDirecciones() {
    const lista = document.getElementById('direccion-lista');
    lista.innerHTML = '';
    let direcciones = JSON.parse(localStorage.getItem('direcciones')) || [];
    direcciones.forEach((dir, idx) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <input type="radio" name="direccion-radio" value="${dir}" id="dir${idx}" ${idx === 0 ? 'checked' : ''}>
                <label for="dir${idx}" class="ms-2">${dir}</label>
            </div>
            <button class="btn btn-link text-danger p-0 eliminar-direccion" data-idx="${idx}">Eliminar</button>
        `;
        lista.appendChild(li);
    });

    // Eliminar dirección
    lista.querySelectorAll('.eliminar-direccion').forEach(btn => {
        btn.addEventListener('click', function() {
            let direcciones = JSON.parse(localStorage.getItem('direcciones')) || [];
            direcciones.splice(this.dataset.idx, 1);
            localStorage.setItem('direcciones', JSON.stringify(direcciones));
            renderDirecciones();
        });
    });
}