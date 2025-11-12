// Navegación suave entre secciones y manejo del navbar
document.addEventListener('DOMContentLoaded', function() {
    const enlacesNavegacion = document.querySelectorAll('a.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Cerrar navbar en móvil al hacer clic en un enlace
    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            // Cerrar navbar en dispositivos móviles
            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }

            // Navegación suave para enlaces internos
            if(this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const destino = document.querySelector(this.getAttribute('href'));
                if(destino) {
                    const offsetTop = destino.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Manejar estado activo de los enlaces del navbar
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

    // Prevenir que el navbar se cierre al hacer clic dentro de él en móviles
    document.querySelector('.navbar-collapse').addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
            e.stopPropagation();
        }
    });
});