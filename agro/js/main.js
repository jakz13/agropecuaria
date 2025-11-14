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
    // CARRUSEL DE CATEGORÍAS - VERSIÓN LINEAL CON requestAnimationFrame
    function inicializarCarruselCategorias() {
        const contenedorCarrusel = document.querySelector('.cat-carousel');
        const elementos = document.querySelectorAll('.cat-item');
        if (elementos.length === 0) return;

        let indiceActual = 0;
        let estaAnimando = false;
        let rotacionAutomatica = true;
        let intervaloRotacion;
        let toqueInicioX = 0;
        let toqueFinX = 0;

        // Configuración inicial
        function inicializarCarrusel() {
            // Mostrar solo los primeros 3 elementos
            elementos.forEach((elemento, indice) => {
                if (indice < 3) {
                    elemento.style.display = 'block';
                    elemento.classList.remove('active', 'prev', 'next');

                    if (indice === 0) elemento.classList.add('prev');
                    if (indice === 1) elemento.classList.add('active');
                    if (indice === 2) elemento.classList.add('next');
                } else {
                    elemento.style.display = 'none';
                }
            });

            // Forzar reflow para asegurar transiciones
            contenedorCarrusel.offsetHeight;
        }

        // Función de easing para suavidad
        function easingEntradaSalida(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        // Animación suave usando requestAnimationFrame
        function animarTransicion(direccion) {
            return new Promise((resolver) => {
                if (estaAnimando) return resolver();
                estaAnimando = true;

                const duracion = 600;
                const tiempoInicio = performance.now();
                const elementosVisibles = Array.from(elementos).filter(elemento => elemento.style.display !== 'none');

                function animar(tiempoActual) {
                    const tiempoTranscurrido = tiempoActual - tiempoInicio;
                    const progreso = Math.min(tiempoTranscurrido / duracion, 1);

                    // Aplicar easing para suavidad
                    const progresoSuavizado = easingEntradaSalida(progreso);

                    // Aplicar transformación según dirección
                    elementosVisibles.forEach((elemento) => {
                        if (direccion === 1) {
                            // Movimiento hacia izquierda
                            elemento.style.transform = `translateX(${-progresoSuavizado * 100}%)`;
                        } else {
                            // Movimiento hacia derecha
                            elemento.style.transform = `translateX(${progresoSuavizado * 100}%)`;
                        }
                    });

                    if (progreso < 1) {
                        requestAnimationFrame(animar);
                    } else {
                        // Animación completada
                        finalizarTransicion(direccion);
                        estaAnimando = false;
                        resolver();
                    }
                }

                requestAnimationFrame(animar);
            });
        }

        // Finalizar transición y actualizar visibilidad
        function finalizarTransicion(direccion) {
            // Calcular nuevo índice
            if (direccion === 1) {
                indiceActual = (indiceActual + 1) % elementos.length;
            } else {
                indiceActual = (indiceActual - 1 + elementos.length) % elementos.length;
            }

            // Ocultar todos primero
            elementos.forEach(elemento => {
                elemento.style.display = 'none';
                elemento.style.transform = 'translateX(0)';
                elemento.classList.remove('active', 'prev', 'next');
            });

            // Mostrar nuevos 3 elementos
            const indices = [
                (indiceActual - 1 + elementos.length) % elementos.length,
                indiceActual,
                (indiceActual + 1) % elementos.length
            ];

            indices.forEach((indice, posicion) => {
                const elemento = elementos[indice];
                elemento.style.display = 'block';

                if (posicion === 0) elemento.classList.add('prev');
                if (posicion === 1) elemento.classList.add('active');
                if (posicion === 2) elemento.classList.add('next');
            });

            // Forzar reflow
            contenedorCarrusel.offsetHeight;
        }

        // Navegación principal
        async function navegar(direccion) {
            if (estaAnimando) return;

            await animarTransicion(direccion);
            reiniciarRotacionAutomatica();
        }

        // Rotación automática
        function iniciarRotacionAutomatica() {
            intervaloRotacion = setInterval(() => {
                if (rotacionAutomatica && !estaAnimando) {
                    navegar(1);
                }
            }, 5000);
        }

        function reiniciarRotacionAutomatica() {
            clearInterval(intervaloRotacion);
            if (rotacionAutomatica) {
                iniciarRotacionAutomatica();
            }
        }

        // Configurar event listeners
        function configurarEventos() {
            const botonSiguiente = document.getElementById("cat-next");
            const botonAnterior = document.getElementById("cat-prev");

            if (botonSiguiente) {
                botonSiguiente.addEventListener("click", () => navegar(1));
            }

            if (botonAnterior) {
                botonAnterior.addEventListener("click", () => navegar(-1));
            }

            // Control de hover
            if (contenedorCarrusel) {
                contenedorCarrusel.addEventListener('mouseenter', () => {
                    rotacionAutomatica = false;
                    clearInterval(intervaloRotacion);
                });

                contenedorCarrusel.addEventListener('mouseleave', () => {
                    rotacionAutomatica = true;
                    iniciarRotacionAutomatica();
                });
            }

            // Configurar eventos táctiles
            configurarEventosTactiles();
        }

        // Eventos táctiles para móvil
        function configurarEventosTactiles() {
            if (!contenedorCarrusel) return;

            contenedorCarrusel.addEventListener('touchstart', (e) => {
                toqueInicioX = e.changedTouches[0].screenX;
                rotacionAutomatica = false;
                clearInterval(intervaloRotacion);
            }, { passive: true });

            contenedorCarrusel.addEventListener('touchend', (e) => {
                toqueFinX = e.changedTouches[0].screenX;
                manejarDeslizamiento();

                // Reanudar auto-rotación después de un tiempo
                setTimeout(() => {
                    rotacionAutomatica = true;
                    iniciarRotacionAutomatica();
                }, 3000);
            }, { passive: true });
        }

        function manejarDeslizamiento() {
            const umbralDeslizamiento = 50;
            const diferencia = toqueInicioX - toqueFinX;

            if (Math.abs(diferencia) > umbralDeslizamiento) {
                if (diferencia > 0) {
                    navegar(1); // Deslizar izquierda -> siguiente
                } else {
                    navegar(-1); // Deslizar derecha -> anterior
                }
            }
        }

        // Inicialización
        function iniciar() {
            inicializarCarrusel();
            configurarEventos();
            iniciarRotacionAutomatica();
        }
        
        iniciar();
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