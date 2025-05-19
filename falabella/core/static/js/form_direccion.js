const departamentosCiudades = {
    "Antioquia": ["Medellín", "Envigado", "Bello", "Itagüí"],
    "Cundinamarca": ["Bogotá", "Soacha", "Chía", "Zipaquirá"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá"],
    "Atlántico": ["Barranquilla", "Soledad", "Malambo"],
    "Risaralda": ["Pereira", "Dosquebradas", "La Virginia"],
    // Agrega más departamentos y ciudades según tu necesidad
};

document.addEventListener('DOMContentLoaded', function() {
    // Llenar departamentos
    const departamentoSelect = document.getElementById('departamento');
    const ciudadSelect = document.getElementById('ciudad');
    if (departamentoSelect && ciudadSelect) {
        Object.keys(departamentosCiudades).forEach(dep => {
            const option = document.createElement('option');
            option.value = dep;
            option.textContent = dep;
            departamentoSelect.appendChild(option);
        });

        departamentoSelect.addEventListener('change', function() {
            ciudadSelect.innerHTML = '<option value="">Selecciona una Ciudad</option>';
            const ciudades = departamentosCiudades[this.value] || [];
            ciudades.forEach(ciudad => {
                const option = document.createElement('option');
                option.value = ciudad;
                option.textContent = ciudad;
                ciudadSelect.appendChild(option);
            });
        });
    }

    const form = document.getElementById('form-direccion');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Toma los valores de los campos
            const departamento = departamentoSelect.value.trim();
            const ciudad = ciudadSelect.value.trim();
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