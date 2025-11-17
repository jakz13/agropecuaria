// Funcionalidades principales
document.addEventListener('DOMContentLoaded', function () {
    // Cargar la barra de navegación si existe el contenedor
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

    // Agregar listeners al collapse
    function agregarListenersCollapse() {
        const collapseEl = document.getElementById('BarraNavegacionCollapse');
        if (!collapseEl) return;

        collapseEl.addEventListener('shown.bs.collapse', () => setTimeout(ajustarAlturaNavbar, 50));
        collapseEl.addEventListener('hidden.bs.collapse', () => setTimeout(ajustarAlturaNavbar, 50));

        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.addEventListener('click', () => setTimeout(ajustarAlturaNavbar, 200));
    }

    // Inicializar carrusel
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

    function inicializarCarruselCiclico() {
        const carrusel = document.getElementById('carruselCiclico');
        const indicadores = document.getElementById('indicadoresCarrusel');
        const tarjetas = document.querySelectorAll('.tarjeta-categoria');
        const puntos = document.querySelectorAll('.indicador');

        if (!carrusel || tarjetas.length === 0) return;

        let indiceActual = 0;
        const totalTarjetas = tarjetas.length;
        let intervaloAuto;

        function actualizarCarrusel() {
            // Ocultar todas las tarjetas
            tarjetas.forEach(tarjeta => {
                tarjeta.classList.remove('activa');
            });

            // Mostrar solo la tarjeta activa
            tarjetas[indiceActual].classList.add('activa');

            // Actualizar indicadores
            puntos.forEach((punto, index) => {
                punto.classList.toggle('activo', index === indiceActual);
            });

            // Calcular desplazamiento
            const desplazamiento = -indiceActual * 305; // 280px tarjeta + 25px gap
            carrusel.style.transform = `translateX(${desplazamiento}px)`;
        }

        function moverAIndice(nuevoIndice) {
            indiceActual = nuevoIndice; // CORRECCIÓN: era "nuevoIndex"

            // Ciclo infinito
            if (indiceActual >= totalTarjetas) {
                indiceActual = 0;
            } else if (indiceActual < 0) {
                indiceActual = totalTarjetas - 1;
            }

            actualizarCarrusel();
            reiniciarAutoPlay();
        }

        window.moverCarrusel = function(direccion) {
            moverAIndice(indiceActual + direccion);
        };

        // Navegación por indicadores
        puntos.forEach((punto, index) => {
            punto.addEventListener('click', () => {
                moverAIndice(index);
            });
        });

        // Auto-play
        function iniciarAutoPlay() {
            intervaloAuto = setInterval(() => {
                moverAIndice(indiceActual + 1);
            }, 5000); // Cambia cada 5 segundos
        }

        function reiniciarAutoPlay() {
            clearInterval(intervaloAuto);
            iniciarAutoPlay();
        }

        // Pausar auto-play al hacer hover
        carrusel.addEventListener('mouseenter', () => {
            clearInterval(intervaloAuto);
        });

        carrusel.addEventListener('mouseleave', () => {
            iniciarAutoPlay();
        });

        // Inicializar
        actualizarCarrusel();
        iniciarAutoPlay();
    }

    // Inicialización principal
    cargarNavbar();

    if (document.querySelector('.navbar-moderna')) {
        if (window.inicializarNavegacion) window.inicializarNavegacion();
        ajustarAlturaNavbar();
        agregarListenersCollapse();
    }

    inicializarCarrusel();
    actualizarAniversario();
    configurarWhatsApp();
    inicializarCarruselCiclico();

    // Recalcular altura al redimensionar
    window.addEventListener('resize', () => {
        clearTimeout(window.__aj_nav_timeout);
        window.__aj_nav_timeout = setTimeout(ajustarAlturaNavbar, 120);
    });
});