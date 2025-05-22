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

document.addEventListener('DOMContentLoaded', function() {
    // Cuando quieras abrir el modal de selección:
    Direcciones.abrirModalSeleccionarDireccion(function(direccionSeleccionada) {
        // Haz lo que necesites con la dirección seleccionada
        document.getElementById('direccion-actual').textContent = direccionSeleccionada;
    });
});