// Navegación suave entre secciones
document.addEventListener('DOMContentLoaded', function() {
    const enlacesNavegacion = document.querySelectorAll('a.nav-link');

    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            // Solo aplica a enlaces que apuntan a secciones dentro de la misma página
            if(this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const destino = document.querySelector(this.getAttribute('href'));
                if(destino) {
                    window.scrollTo({
                        top: destino.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Resaltar enlace activo en la navegación
    function resaltarEnlaceActivo() {
        const secciones = document.querySelectorAll('section');
        const enlaces = document.querySelectorAll('.navbar-nav .nav-link');

        let seccionActiva = '';

        secciones.forEach(seccion => {
            const rect = seccion.getBoundingClientRect();
            if(rect.top <= 100 && rect.bottom >= 100) {
                seccionActiva = seccion.getAttribute('id');
            }
        });

        enlaces.forEach(enlace => {
            enlace.classList.remove('active');
            if(enlace.getAttribute('href') === `#${seccionActiva}`) {
                enlace.classList.add('active');
            }
        });
    }

    // Manejar estado activo de los enlaces del navbar
    document.addEventListener('DOMContentLoaded', function() {
        function actualizarEnlaceActivo() {
            const enlaces = document.querySelectorAll('.navbar-moderna .nav-link');
            const paginaActual = window.location.pathname.split('/').pop() || 'index.html';

            enlaces.forEach(enlace => {
                const href = enlace.getAttribute('href');
                if (href === paginaActual) {
                    enlace.classList.add('active');
                } else {
                    enlace.classList.remove('active');
                }
            });
        }

        // Actualizar al cargar y al cambiar de página
        actualizarEnlaceActivo();

        // También actualizar cuando se hace clic en un enlace
        document.querySelectorAll('.navbar-moderna .nav-link').forEach(enlace => {
            enlace.addEventListener('click', function() {
                document.querySelectorAll('.navbar-moderna .nav-link').forEach(nav => {
                    nav.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    });

    window.addEventListener('scroll', resaltarEnlaceActivo);
});