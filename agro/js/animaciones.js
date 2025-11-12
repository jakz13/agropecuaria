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
});