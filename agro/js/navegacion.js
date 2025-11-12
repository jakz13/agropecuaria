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

    window.addEventListener('scroll', resaltarEnlaceActivo);
});