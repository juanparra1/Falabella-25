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

            Direcciones.addDireccion(direccionCompleta, () => {
                // Opcional: renderiza la lista si estás en perfil
                if (window.location.pathname.includes('perfil')) {
                    Direcciones.renderDireccionesLista('lista-direcciones');
                }
            });

            // Cierra el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('agregarDireccionModal'));
            modal.hide();
            form.reset();
        });
    }
});