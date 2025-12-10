// Animaciones al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    const elementosParaAnimar = document.querySelectorAll('.card, h1, h2, .lead');

    function animarAlScroll() {
        elementosParaAnimar.forEach(elemento => {
            const rect = elemento.getBoundingClientRect();
            const estaEnPantalla = rect.top <= window.innerHeight * 0.8;

            if(estaEnPantalla) {
                elemento.style.opacity = '1';
                elemento.style.transform = 'translateY(0)';
            }
        });
    }

    // Configurar estado inicial
    elementosParaAnimar.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        elemento.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animarAlScroll);
    animarAlScroll(); // Ejecutar una vez al cargar

    /* ========================================
       EFECTO FLIP PARA TARJETAS DE ACCIONES
       ======================================== */

    // Seleccionar todos los contenedores de flip
    const flipContainers = document.querySelectorAll('.accion-flip-container');

    flipContainers.forEach(container => {
        const btnFlip = container.querySelector('.btn-flip');
        const btnBack = container.querySelector('.btn-flip-back');

        // Evento para voltear al frente
        if (btnFlip) {
            btnFlip.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Flip activado'); // Para debug
                container.classList.add('flipped');
            });
        }

        // Evento para volver atrás
        if (btnBack) {
            btnBack.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Volver activado'); // Para debug
                container.classList.remove('flipped');
            });
        }
    });

    // Prevenir el flip accidental al hacer scroll en móviles
    flipContainers.forEach(container => {
        container.addEventListener('touchmove', function(e) {
            if (container.classList.contains('flipped')) {
                e.stopPropagation();
            }
        }, { passive: true });
    });
});