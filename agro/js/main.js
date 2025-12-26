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

    // Cargar el footer si existe el contenedor
    function cargarFooter() {
        const footerContainer = document.getElementById('FooterContainer');
        if (!footerContainer) return;

        fetch('complementos/footer.html')
            .then(response => {
                if (!response.ok) throw new Error('No se pudo cargar el footer');
                return response.text();
            })
            .then(html => {
                footerContainer.innerHTML = html;
                // Actualizar el año automáticamente
                actualizarAnioFooter();
            })
            .catch(err => {
                console.error('Error al cargar el footer:', err);
                footerContainer.innerHTML = '<p>Error cargando el footer</p>';
            });
    }

    // Actualizar el año del copyright automáticamente
    function actualizarAnioFooter() {
        const anioActual = new Date().getFullYear();
        const copyrightElements = document.querySelectorAll('footer p');

        copyrightElements.forEach(element => {
            if (element.textContent.includes('©')) {
                // Reemplazar cualquier año de 4 dígitos después de © con el año actual
                element.textContent = element.textContent.replace(/©\s*\d{4}/, `© ${anioActual}`);
            }
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
        // Aplica a todos los botones por si hay más de uno
        document.querySelectorAll('.whatsapp-float').forEach(boton => {
            try {
                // Asegurar href correcto
                const url = getWaUrlWithMessage(__WHATSAPP.number, __WHATSAPP.message);
                boton.setAttribute('href', url);
                boton.setAttribute('target', '_blank');
                boton.setAttribute('rel', 'noopener noreferrer');
            } catch (e) {
                // no crítico
            }

            // Manejar click para abrir la URL construida (garantiza que el texto se pase correctamente)
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                const url = getWaUrlWithMessage(__WHATSAPP.number, __WHATSAPP.message);
                try {
                    window.open(url, '_blank');
                } catch (err) {
                    // fallback a location.href
                    window.location.href = url;
                }
            });
        });
    }

    // Normaliza un número manteniendo + y dígitos
    function normalizeNumber(num) {
        return ('' + num).replace(/[^+\d]/g, '');
    }

    // Inicialización principal
    cargarNavbar();
    cargarFooter(); // ← NUEVO: Cargar el footer

    if (document.querySelector('.navbar-moderna')) {
        if (window.inicializarNavegacion) window.inicializarNavegacion();
        ajustarAlturaNavbar();
        agregarListenersCollapse();
    }

    // Cargar y configurar el botón de WhatsApp como fragmento reutilizable
    function crearWhatsAppFallback() {
        // Crea el botón directamente si el fetch no funciona (útil en file:// o entornos sin servidor)
        if (document.querySelector('.whatsapp-float')) return;
        const a = document.createElement('a');
        a.className = 'whatsapp-float';
        a.href = getWaUrlWithMessage(__WHATSAPP.number, __WHATSAPP.message);
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', 'Enviar mensaje por WhatsApp');
        a.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="30">';
        document.body.appendChild(a);
        console.log('Botón WhatsApp creado por fallback.');
        configurarWhatsApp();
        updateExistingWaLinks();
    }

    function cargarWhatsApp() {
        // Evitar duplicados
        if (document.querySelector('.whatsapp-float')) return;
        // Intentar cargar como fragmento relativo desde la carpeta complementos
        const ruta = './complementos/whatsapp.html';
        fetch(ruta)
            .then(resp => {
                if (!resp.ok) throw new Error('No se pudo cargar WhatsApp: ' + resp.status);
                return resp.text();
            })
            .then(html => {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const elemento = temp.querySelector('.whatsapp-float') || temp.firstElementChild;
                if (elemento) {
                    // Asegurar que el fragmento tenga el href con mensaje centralizado
                    try { elemento.setAttribute('href', getWaUrlWithMessage(__WHATSAPP.number, __WHATSAPP.message)); } catch (e) {}
                    document.body.appendChild(elemento);
                    console.log('Fragmento WhatsApp inyectado correctamente.');
                } else {
                    console.warn('Fragmento WhatsApp cargado pero no se encontró el elemento esperado. HTML recibido:', html);
                    crearWhatsAppFallback();
                }
                configurarWhatsApp();
                updateExistingWaLinks();
            })
            .catch(err => {
                console.warn('Fragmento WhatsApp no cargado (fallback):', err);
                crearWhatsAppFallback();
            });
    }

    function getWaUrl(num) {
        const normalized = normalizeNumber(num);
        // quitar + para la URL si está presente, wa.me acepta con o sin + pero usamos sin +
        return 'https://wa.me/' + normalized.replace(/^\+/, '');
    }

    // Nueva versión que acepta mensaje opcional
    function getWaUrlWithMessage(num, message) {
        // Normalizamos el número sin el signo + para usar en la query
        const normalized = (('' + num).replace(/[^+\d]/g, '')).replace(/^\+/, '');
        if (!message) {
            // Cuando no hay mensaje usamos la forma corta wa.me
            return 'https://wa.me/' + normalized;
        }
        try {
            const encoded = encodeURIComponent(message);
            // Usamos api.whatsapp.com/send?phone=...&text=... que suele respetar mejor el texto
            return 'https://api.whatsapp.com/send?phone=' + normalized + '&text=' + encoded;
        } catch (e) {
            return 'https://wa.me/' + normalized;
        }
    }

    function updateExistingWaLinks() {
        try {
            const waUrl = getWaUrlWithMessage(__WHATSAPP.number, __WHATSAPP.message);
            // Actualizar cualquier enlace que apunte a wa.me o whatsapp
            document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="whatsapp:"]').forEach(a => {
                a.setAttribute('href', waUrl);
            });
            // También actualizar enlaces con la clase contacto-link para mostrar el número legible
            document.querySelectorAll('a.contacto-link').forEach(a => {
                if (__WHATSAPP.display) a.textContent = __WHATSAPP.display;
            });
        } catch (e) {
            console.warn('No se pudieron actualizar enlaces de WhatsApp:', e);
        }
    }

    inicializarCarrusel();
    actualizarAniversario();
    configurarWhatsApp();

    cargarWhatsApp();

    // Recalcular altura al redimensionar
    window.addEventListener('resize', () => {
        clearTimeout(window.__aj_nav_timeout);
        window.__aj_nav_timeout = setTimeout(ajustarAlturaNavbar, 120);
    });
});