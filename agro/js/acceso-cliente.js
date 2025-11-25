// Funcionalidad de login y gestión del estado de cuenta
document.addEventListener('DOMContentLoaded', function() {

    // Toggle para mostrar/ocultar contraseña
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('contrasena');
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Manejo del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const usuario = document.getElementById('usuario').value.trim();
            const contrasena = document.getElementById('contrasena').value;
            const alertError = document.getElementById('alertError');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const formulario = document.getElementById('loginForm');

            // Ocultar alerta de error si estaba visible
            alertError.style.display = 'none';

            // Mostrar spinner de carga
            formulario.style.display = 'none';
            loadingSpinner.style.display = 'block';

            try {
                // Aquí iría la llamada real a tu API
                await verificarCredenciales(usuario, contrasena);

                // Si las credenciales son correctas, mostrar estado de cuenta
                mostrarEstadoCuenta(usuario);

            } catch (error) {
                // Si hay error, mostrar mensaje
                document.getElementById('errorMessage').textContent = error.message;
                alertError.style.display = 'block';
                formulario.style.display = 'block';
                loadingSpinner.style.display = 'none';
            }
        });
    }

    // Función que simula la verificación de credenciales
    // EN PRODUCCIÓN: Esta función haría una llamada real a tu API
    async function verificarCredenciales(usuario, contrasena) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // SIMULACIÓN: acepta cualquier usuario con contraseña "demo123"
                // EN PRODUCCIÓN: aquí irá la llamada real a tu API
                if (contrasena === 'demo123') {
                    resolve({
                        success: true,
                        usuario: usuario,
                        nombre: 'Juan Pérez', // Esto vendría del servidor
                        pdf_url: '/api/estado-cuenta.pdf' // URL del PDF generado
                    });
                } else {
                    reject(new Error('Usuario o contraseña incorrectos'));
                }
            }, 1500); // Simula delay de red
        });
    }

    // Función para mostrar el estado de cuenta
    function mostrarEstadoCuenta(usuario) {
        const loginContainer = document.getElementById('loginContainer');
        const estadoCuentaContainer = document.getElementById('estadoCuentaContainer');

        // Ocultar login y mostrar estado de cuenta
        loginContainer.style.display = 'none';
        estadoCuentaContainer.style.display = 'block';

        // Llenar información del cliente
        document.getElementById('clienteNombre').textContent = 'Juan Pérez'; // Vendría del servidor
        document.getElementById('clienteUsuario').textContent = usuario;

        // Fechas
        const fechaActual = new Date();
        document.getElementById('fechaActualizacion').textContent = formatearFecha(fechaActual);
        document.getElementById('fechaGeneracion').textContent = formatearFecha(fechaActual);
    }

    // Función para formatear fecha
    function formatearFecha(fecha) {
        const opciones = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return fecha.toLocaleDateString('es-UY', opciones);
    }

    // Botón de descarga
    const btnDescargar = document.getElementById('btnDescargar');
    if (btnDescargar) {
        btnDescargar.addEventListener('click', async function() {
            const btn = this;
            const originalText = btn.innerHTML;

            // Cambiar texto del botón
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generando PDF...';
            btn.disabled = true;

            try {
                // Simular descarga
                await new Promise(resolve => setTimeout(resolve, 1500));

                // EN PRODUCCIÓN: aquí harías la descarga real del PDF
                // Por ejemplo:
                // const response = await fetch('/api/descargar-estado-cuenta');
                // const blob = await response.blob();
                // const url = window.URL.createObjectURL(blob);
                // const a = document.createElement('a');
                // a.href = url;
                // a.download = 'estado-cuenta.pdf';
                // a.click();

                // Simulación: mostrar mensaje de éxito
                btn.innerHTML = '<i class="fas fa-check me-2"></i>¡Descargado!';

                // Restaurar botón después de 2 segundos
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 2000);

            } catch (error) {
                btn.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Error en descarga';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 2000);
            }
        });
    }

    // Botón de cerrar sesión
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function() {
            const loginContainer = document.getElementById('loginContainer');
            const estadoCuentaContainer = document.getElementById('estadoCuentaContainer');
            const loginForm = document.getElementById('loginForm');
            const loadingSpinner = document.getElementById('loadingSpinner');

            // Ocultar estado de cuenta y mostrar login
            estadoCuentaContainer.style.display = 'none';
            loginContainer.style.display = 'block';
            loginForm.style.display = 'block';
            loadingSpinner.style.display = 'none';

            // Limpiar formulario
            document.getElementById('loginForm').reset();
            document.getElementById('alertError').style.display = 'none';
        });
    }
});