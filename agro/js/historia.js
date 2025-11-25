// js/historia.js
class HistoriaCarrusel {
    constructor() {
        this.slides = document.querySelectorAll('.historia-slide');
        this.indicadores = document.querySelectorAll('.indicador');
        this.botonesNav = document.querySelectorAll('.nav-suceso');
        this.btnPrev = document.getElementById('btnPrev');
        this.btnNext = document.getElementById('btnNext');
        this.slidesWrapper = document.getElementById('slidesWrapper');

        this.slideActual = 0;
        this.totalSlides = this.slides.length;

        this.init();
    }

    init() {
        // Event listeners
        this.btnPrev.addEventListener('click', () => this.anteriorSlide());
        this.btnNext.addEventListener('click', () => this.siguienteSlide());

        // Indicadores
        this.indicadores.forEach((ind, index) => {
            ind.addEventListener('click', () => this.irASlide(index));
        });

        // Botones de sucesos
        this.botonesNav.forEach((btn, index) => {
            btn.addEventListener('click', () => this.irASlide(index));
        });

        // Teclado
        document.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowLeft') this.anteriorSlide();
            if(e.key === 'ArrowRight') this.siguienteSlide();
        });

        // Touch/swipe para móvil
        this.addTouchSupport();

        // Actualizar estado inicial
        this.actualizarCarrusel();
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;

        this.slidesWrapper.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        });

        this.slidesWrapper.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            this.handleSwipe(startX, endX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.siguienteSlide();
            } else {
                this.anteriorSlide();
            }
        }
    }

    irASlide(index) {
        if(index < 0) index = this.totalSlides - 1;
        if(index >= this.totalSlides) index = 0;

        this.slideActual = index;
        this.actualizarCarrusel();
    }

    siguienteSlide() {
        this.irASlide(this.slideActual + 1);
    }

    anteriorSlide() {
        this.irASlide(this.slideActual - 1);
    }

    actualizarCarrusel() {
        // Mover el wrapper
        this.slidesWrapper.style.transform = `translateX(-${this.slideActual * 100}%)`;

        // Actualizar indicadores
        this.indicadores.forEach((ind, index) => {
            ind.classList.toggle('active', index === this.slideActual);
        });

        // Actualizar botones de sucesos
        this.botonesNav.forEach((btn, index) => {
            btn.classList.toggle('active', index === this.slideActual);
        });
    }
}

// Inicializar cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new HistoriaCarrusel();
});