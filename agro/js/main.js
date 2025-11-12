// Funcionalidades principales
document.addEventListener('DOMContentLoaded', function() {
    // Cargar la barra de navegación
    function cargarNavbar() {
        const navbarContainer = document.getElementById('BarraNavegacion');
        if (navbarContainer) {
            fetch('complementos/navbar.html')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudo cargar la navbar');
                    }
                    return response.text();
                })
                .then(data => {
                    navbarContainer.innerHTML = data;
                    inicializarNavegacion();
                })
                .catch(error => {
                    console.error('Error al cargar la barra de navegación:', error);
                    // Fallback: mostrar un mensaje de error
                    navbarContainer.innerHTML = '<p>Error cargando la navegación</p>';
                });
        }
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

    function inicializarNavegacion() {
        console.log('Navegación inicializada');
    }

    function inicializarCarrusel() {
        const miCarrusel = document.querySelector('#carruselHero');
        if(miCarrusel) {
            const carrusel = new bootstrap.Carousel(miCarrusel, {
                interval: 5000,
                wrap: true
            });
        }
    }

    function calcularAniosEmpresa() {
        const anioFundacion = 1913;
        const anioActual = new Date().getFullYear();
        return anioActual - anioFundacion;
    }

    function actualizarAniversario() {
        const elementosAniversario = document.querySelectorAll('[data-aniversario]');
        elementosAniversario.forEach(elemento => {
            elemento.textContent = `${calcularAniosEmpresa()} años fomentando el agro`;
        });
    }

    function configurarWhatsApp() {
        const botonWhatsApp = document.querySelector('.whatsapp-float');
        if(botonWhatsApp) {
            botonWhatsApp.addEventListener('click', function(e) {
                console.log('Usuario hizo clic en WhatsApp');
            });
        }
    }

    // Inicializar todas las funcionalidades
    cargarNavbar();
    inicializarCarrusel();
    actualizarAniversario();
    configurarWhatsApp();
});
