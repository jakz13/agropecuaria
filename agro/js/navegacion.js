// Navegación suave entre secciones y manejo del navbar
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar navbar en móvil al hacer clic en un enlace
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
            const target = e.target;
            if (target.classList.contains('nav-link') || target.classList.contains('btn-acceso')) {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        }
    });

    // Manejar estado activo de los enlaces
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

    // Actualizar enlace activo
    actualizarEnlaceActivo();
    });


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