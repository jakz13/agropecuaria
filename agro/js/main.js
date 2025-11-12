// Funcionalidades principales
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel
    const miCarrusel = document.querySelector('#carruselHero');
    if(miCarrusel) {
        const carrusel = new bootstrap.Carousel(miCarrusel, {
            interval: 5000,
            wrap: true
        });
    }

    // Manejar el año de aniversario
    function calcularAniosEmpresa() {
        const anioFundacion = 1913; // Cambiar según el año real de fundación
        const anioActual = new Date().getFullYear();
        return anioActual - anioFundacion;
    }

    // Actualizar el texto de los 110 años
    const elementosAniversario = document.querySelectorAll('[data-aniversario]');
    elementosAniversario.forEach(elemento => {
        elemento.textContent = `${calcularAniosEmpresa()} años fomentando el agro`;
    });

    // Funcionalidad para el botón de WhatsApp
    const botonWhatsApp = document.querySelector('.whatsapp-float');
    if(botonWhatsApp) {
        botonWhatsApp.addEventListener('click', function(e) {
            // Aquí podrías agregar tracking de analytics si es necesario
            console.log('Usuario hizo clic en WhatsApp');
        });
    }
});