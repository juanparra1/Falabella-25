document.addEventListener('DOMContentLoaded', function() {
    // Mostrar modal al hacer click en "Cambiar"
    document.getElementById('cambiar-direccion-link').addEventListener('click', function(e) {
        e.preventDefault();
        Direcciones.abrirModalSeleccionarDireccion(function(direccionSeleccionada) {
            document.getElementById('direccion-actual').textContent = direccionSeleccionada;
        });
    });

    // Agregar nueva dirección: cerrar este modal y abrir el de agregar
    document.getElementById('agregar-direccion').addEventListener('click', function() {
        const modalSeleccion = bootstrap.Modal.getInstance(document.getElementById('selecDireccionModal'));
        if (modalSeleccion) modalSeleccion.hide();
        setTimeout(() => {
            Direcciones.abrirModalAgregarDireccion(() => {
                // Al agregar, vuelve a abrir el modal de selección actualizado
                Direcciones.abrirModalSeleccionarDireccion(function(direccionSeleccionada) {
                    document.getElementById('direccion-actual').textContent = direccionSeleccionada;
                });
            });
        }, 400);
    });

    // Seleccionar dirección (si usas radios, ajusta aquí)
    document.getElementById('seleccionar-direccion').addEventListener('click', function() {
        const seleccionada = document.querySelector('input[name="direccion-radio"]:checked');
        if (seleccionada) {
            document.getElementById('direccion-actual').textContent = seleccionada.value;
            const modal = bootstrap.Modal.getInstance(document.getElementById('selecDireccionModal'));
            modal.hide();
        }
    });
});