document.addEventListener('DOMContentLoaded', function() {
    // Manejar el envío del formulario de recuperación por SMS
    const smsRecoveryForm = document.getElementById('smsRecoveryForm');
    if (smsRecoveryForm) {
        smsRecoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phoneNumber = this.querySelector('input[type="tel"]').value;

            if (phoneNumber && phoneNumber.length >= 10) {
                // Aquí iría la lógica para enviar el código por SMS
                alert('Se ha enviado un código de verificación a tu número de teléfono');

                // Cambiar el contenido del modal para ingresar el código
                const modalBody = this.closest('.modal-body');
                modalBody.innerHTML = `
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <h4 class="text-label mb-3">Verificación</h4>
                                <p class="text-muted mb-4">Ingresa el código de verificación enviado a tu teléfono</p>
                                
                                <form id="smsVerificationForm">
                                    <div class="mb-3">
                                        <label class="form-label">Código de verificación</label>
                                        <input type="text" 
                                            class="form-control border-0 border-bottom rounded-0"
                                            placeholder="Ingresa el código"
                                            style="box-shadow: none; background: transparent;"
                                            maxlength="6"
                                            required>
                                    </div>

                                    <button type="submit" 
                                            class="btn rounded-pill w-100 mb-3" 
                                            style="background-color: #000; color: #fff;">
                                        Verificar
                                    </button>
                                    
                                    <div class="text-center mt-3">
                                        <a href="#" class="text-decoration-underline" id="resendSmsCode">
                                            Reenviar código
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                alert('Por favor, ingresa un número de teléfono válido');
            }
        });
    }
});