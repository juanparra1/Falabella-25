document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-direccion');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Toma los valores de los campos
            const departamento = document.getElementById('departamento').value.trim();
            const ciudad = document.getElementById('ciudad').value.trim();
            const barrio = document.getElementById('barrio').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const detalle = document.getElementById('detalle').value.trim();

            // Puedes personalizar el formato de la dirección aquí
            const direccionCompleta = `${direccion}${detalle ? ', ' + detalle : ''}${barrio ? ', ' + barrio : ''}${ciudad ? ', ' + ciudad : ''}${departamento ? ', ' + departamento : ''}`;

            // Guarda en localStorage
            let direcciones = JSON.parse(localStorage.getItem('direcciones')) || [];
            direcciones.push(direccionCompleta);
            localStorage.setItem('direcciones', JSON.stringify(direcciones));

            // Cierra este modal y abre el de selección
            const modalAgregar = bootstrap.Modal.getInstance(document.getElementById('agregarDireccionModal'));
            modalAgregar.hide();

            // Espera a que se cierre y luego muestra el de selección
            setTimeout(() => {
                if (window.renderDirecciones) renderDirecciones();
                const modalSeleccion = new bootstrap.Modal(document.getElementById('selecDireccionModal'));
                modalSeleccion.show();
            }, 400);
        });
    }
});