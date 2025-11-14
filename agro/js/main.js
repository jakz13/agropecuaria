// Funcionalidades principales
document.addEventListener('DOMContentLoaded', function () {
    // Cargar la barra de navegación si existe el contenedor (compatibilidad con versiones anteriores)
    function cargarNavbar() {
        const navbarContainer = document.getElementById('BarraNavegacion');
        if (!navbarContainer) return;

        fetch('complementos/navbar.html')
            .then(response => {
                if (!response.ok) throw new Error('No se pudo cargar la navbar');
                return response.text();
            })
            .then(html => {
                navbarContainer.innerHTML = html;
                // Después de inyectar la navbar, inicializamos la navegación y ajustamos la altura
                requestAnimationFrame(() => {
                    if (window.inicializarNavegacion) window.inicializarNavegacion();
                    ajustarAlturaNavbar();
                    agregarListenersCollapse();
                });
            })
            .catch(err => {
                console.error('Error al cargar la barra de navegación:', err);
                navbarContainer.innerHTML = '<p>Error cargando la navegación</p>';
            });
    }

    // Calcula y aplica la altura de la navbar
    function ajustarAlturaNavbar() {
        const nav = document.querySelector('.navbar-moderna');
        const altura = nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
        document.documentElement.style.setProperty('--navbar-height', altura + 'px');
        document.body.style.paddingTop = altura + 'px';
    }

    // Agregar listeners al collapse para recalcular cuando cambie su estado
    function agregarListenersCollapse() {
        const collapseEl = document.getElementById('BarraNavegacionCollapse');
        if (!collapseEl) return;

        // Eventos de Bootstrap 5: shown.bs.collapse / hidden.bs.collapse
        collapseEl.addEventListener('shown.bs.collapse', () => setTimeout(ajustarAlturaNavbar, 50));
        collapseEl.addEventListener('hidden.bs.collapse', () => setTimeout(ajustarAlturaNavbar, 50));

        // También recalcular si se hace click en el toggler (por seguridad)
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.addEventListener('click', () => setTimeout(ajustarAlturaNavbar, 200));
    }

    // Inicializar carrusel (si existe)
    function inicializarCarrusel() {
        const miCarrusel = document.querySelector('#carruselHero');
        if (miCarrusel && window.bootstrap && typeof bootstrap.Carousel === 'function') {
            new bootstrap.Carousel(miCarrusel, { interval: 5000, wrap: true });
        }
    }

    // Calcular años de la empresa
    function calcularAniosEmpresa() {
        const anioFundacion = 1915;
        return new Date().getFullYear() - anioFundacion;
    }

    function actualizarAniversario() {
        document.querySelectorAll('[data-aniversario]').forEach(el => {
            el.textContent = `${calcularAniosEmpresa()} años fomentando el agro`;
        });
    }

    function configurarWhatsApp() {
        const boton = document.querySelector('.whatsapp-float');
        if (!boton) return;
        boton.addEventListener('click', () => console.log('Usuario hizo clic en WhatsApp'));
    }

    // CARRUSEL DE CATEGORÍAS - VERSIÓN CON EFECTO "GIRAR" SUAVE
    function inicializarCarruselCategorias() {
        const items = document.querySelectorAll('.cat-item');
        if (items.length === 0) return;

        let current = 0;
        let autoRotate = true;
        let rotationInterval;
        let isAnimating = false;

        // Función para calcular índices circularmente
        function getCircularIndex(index, total) {
            return (index + total) % total;
        }

        // Función para actualizar el carrusel con animaciones mejoradas
        function updateCarousel(direction = 1) {
            if (isAnimating) return;
            isAnimating = true;

            const total = items.length;
            const prevIndex = getCircularIndex(current - 1, total);
            const nextIndex = getCircularIndex(current + 1, total);

            // Aplicar efecto de salida suave primero
            items.forEach(item => {
                item.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });

            // Pequeño delay para que el navegador procese los cambios
            setTimeout(() => {
                // Remover clases anteriores
                items.forEach(item => {
                    item.classList.remove('active', 'prev', 'next');
                });

                // Aplicar nuevas clases con efecto de "girar"
                items[prevIndex].classList.add('prev');
                items[current].classList.add('active');
                items[nextIndex].classList.add('next');

                // Permitir siguiente animación después de que termine la transición
                setTimeout(() => {
                    isAnimating = false;
                }, 800); // Coincide con la duración de la transición CSS
            }, 50);
        }

        // Navegación mejorada
        function navigate(direction) {
            if (isAnimating) return;

            current = getCircularIndex(current + direction, items.length);
            updateCarousel(direction);
            resetAutoRotation();
        }

        // Event listeners con feedback táctil mejorado
        const nextBtn = document.getElementById("cat-next");
        const prevBtn = document.getElementById("cat-prev");

        if (nextBtn) {
            nextBtn.addEventListener("click", () => navigate(1));
            // Efecto de click en las flechas
            nextBtn.addEventListener('mousedown', () => nextBtn.style.transform = 'translateY(-50%) scale(0.95)');
            nextBtn.addEventListener('mouseup', () => nextBtn.style.transform = 'translateY(-50%) scale(1.1)');
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => navigate(-1));
            // Efecto de click en las flechas
            prevBtn.addEventListener('mousedown', () => prevBtn.style.transform = 'translateY(-50%) scale(0.95)');
            prevBtn.addEventListener('mouseup', () => prevBtn.style.transform = 'translateY(-50%) scale(1.1)');
        }

        // Rotación automática mejorada
        function startAutoRotation() {
            rotationInterval = setInterval(() => {
                if (autoRotate && !isAnimating) {
                    navigate(1);
                }
            }, 5000); // Mantener 5 segundos
        }

        function resetAutoRotation() {
            clearInterval(rotationInterval);
            startAutoRotation();
        }

        // Control de hover mejorado
        const carouselContainer = document.querySelector('.cat-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                autoRotate = false;
                // Pausar sutilmente la rotación
                clearInterval(rotationInterval);
            });

            carouselContainer.addEventListener('mouseleave', () => {
                autoRotate = true;
                // Reanudar después de un pequeño delay
                setTimeout(startAutoRotation, 1000);
            });
        }

        // Inicializar
        startAutoRotation();
        updateCarousel();

        // Soporte para touch devices
        let touchStartX = 0;
        let touchEndX = 0;

        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });

            carouselContainer.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    navigate(1); // Swipe izquierda -> siguiente
                } else {
                    navigate(-1); // Swipe derecha -> anterior
                }
            }
        }
    }

    // Inicialización principal
    cargarNavbar();

    // Si la navbar ya está incluida directamente en el HTML (caso actual), inicializarla también
    if (document.querySelector('.navbar-moderna')) {
        if (window.inicializarNavegacion) window.inicializarNavegacion();
        ajustarAlturaNavbar();
        agregarListenersCollapse();
    }

    inicializarCarrusel();
    inicializarCarruselCategorias(); // ← AQUÍ SE INICIALIZA EL NUEVO CARRUSEL
    actualizarAniversario();
    configurarWhatsApp();

    // Recalcular altura al redimensionar (debounce)
    window.addEventListener('resize', () => {
        clearTimeout(window.__aj_nav_timeout);
        window.__aj_nav_timeout = setTimeout(ajustarAlturaNavbar, 120);
    });
});