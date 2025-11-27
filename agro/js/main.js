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
        // Solo aplicar padding si NO estamos en la página de inicio
        if (!document.querySelector('#hero')) {
            document.body.style.paddingTop = altura + 'px';
        } else {
            document.body.style.paddingTop = '0px';
        }
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

    // Inicializar carrusel con transición ultra suave
    function inicializarCarrusel() {
        const miCarrusel = document.querySelector('#carruselHero');
        if (miCarrusel && window.bootstrap && typeof bootstrap.Carousel === 'function') {
            new bootstrap.Carousel(miCarrusel, {
                interval: 6000,  // Cambia cada 6 segundos
                wrap: true,      // Vuelve al inicio
                pause: false,    // No se pausa al hover
                touch: false     // Deshabilita swipe para evitar transiciones bruscas
            });
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

    // FUNCIÓN DEL CARRUSEL CÍCLICO ELIMINADA
    // Ya no es necesaria porque ahora las categorías son estáticas

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

    // Recalcular altura al redimensionar
    window.addEventListener('resize', () => {
        clearTimeout(window.__aj_nav_timeout);
        window.__aj_nav_timeout = setTimeout(ajustarAlturaNavbar, 120);
    });
});