/* ============================================== */
/* FORMULARIO DE CONTACTO - MAILTO MEJORADO     */
/* ============================================== */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) {
        console.warn('Formulario de contacto no encontrado');
        return;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar que el checkbox esté marcado
        const aceptoTerminos = document.getElementById('aceptoTerminos');
        if (!aceptoTerminos.checked) {
            mostrarMensaje('error', 'Debes aceptar la política de privacidad para continuar');
            return;
        }

        // Obtener datos del formulario
        const formData = obtenerDatosFormulario();

        // Validar datos básicos
        if (!validarDatos(formData)) {
            return;
        }

        // Construir y enviar email
        enviarEmailMailto(formData);
    });
});

/**
 * Obtiene todos los datos del formulario
 */
function obtenerDatosFormulario() {
    return {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim() || 'No proporcionado',
        asunto: document.getElementById('asunto').value,
        asuntoTexto: document.getElementById('asunto').options[document.getElementById('asunto').selectedIndex].text,
        mensaje: document.getElementById('mensaje').value.trim()
    };
}

/**
 * Valida que los datos sean correctos
 */
function validarDatos(datos) {
    if (!datos.nombre || !datos.email || !datos.asunto || !datos.mensaje) {
        mostrarMensaje('error', 'Por favor completa todos los campos requeridos');
        return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
        mostrarMensaje('error', 'Por favor ingresa un email válido');
        return false;
    }

    return true;
}

/**
 * Construye el cuerpo del email con formato profesional
 */
function construirCuerpoEmail(datos) {
    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString('es-UY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const horaFormateada = fecha.toLocaleTimeString('es-UY', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
Hola, soy ${datos.nombre} y me contacto desde el sitio web de Fomento Colonia Suiza.

═══════════════════════════════════
DATOS DE CONTACTO
═══════════════════════════════════
📧 Email: ${datos.email}
📱 Teléfono: ${datos.telefono}
📋 Asunto: ${datos.asuntoTexto}

═══════════════════════════════════
MENSAJE
═══════════════════════════════════

${datos.mensaje}

═══════════════════════════════════
Este mensaje fue enviado desde el formulario de contacto web
Fecha: ${fechaFormateada} - ${horaFormateada}
    `.trim();
}

/**
 * Envía el email usando mailto
 */
function enviarEmailMailto(datos) {
    // Email destino - HACER TESTEO CON EL NUESTRO
    const EMAIL_DESTINO = 'felipe.bernardi@estudiantes.utec.edu.uy';

    // Construir el cuerpo del email
    const cuerpoEmail = construirCuerpoEmail(datos);

    // Construir el asunto
    const asuntoEmail = `Contacto Web: ${datos.asuntoTexto}`;

    // Construir el mailto con encoding correcto
    const mailtoLink = `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent(asuntoEmail)}&body=${encodeURIComponent(cuerpoEmail)}`;

    // Mostrar mensaje de confirmación
    mostrarMensaje('info', `
        <strong>Abriendo tu cliente de correo...</strong><br>
        Si no se abre automáticamente, puedes copiar esta información y enviarla a: <strong>${EMAIL_DESTINO}</strong>
    `);

    // Abrir mailto
    try {
        window.location.href = mailtoLink;

        // Limpiar formulario después de 2 segundos
        setTimeout(() => {
            document.getElementById('contactForm').reset();
            mostrarMensaje('success', '¡Formulario preparado correctamente! Gracias por contactarnos.');

            // Ocultar mensaje después de 3 segundos más
            setTimeout(() => {
                ocultarMensaje();
            }, 3000);
        }, 2000);

    } catch (error) {
        console.error('Error al abrir mailto:', error);
        mostrarMensaje('error', `
            No se pudo abrir el cliente de correo automáticamente.<br>
            Por favor envía un email a: <strong>${EMAIL_DESTINO}</strong>
        `);
    }
}

/**
 * Muestra un mensaje al usuario
 * @param {string} tipo - 'success', 'error', 'info'
 * @param {string} mensaje - El mensaje a mostrar
 */
function mostrarMensaje(tipo, mensaje) {
    const formMessage = document.getElementById('formMessage');

    if (!formMessage) {
        alert(mensaje);
        return;
    }

    // Definir iconos y clases según el tipo
    const config = {
        success: {
            clase: 'alert-success',
            icono: 'fa-check-circle'
        },
        error: {
            clase: 'alert-danger',
            icono: 'fa-exclamation-circle'
        },
        info: {
            clase: 'alert-info',
            icono: 'fa-info-circle'
        }
    };

    const tipoConfig = config[tipo] || config.info;

    formMessage.className = `alert ${tipoConfig.clase} mt-4`;
    formMessage.style.display = 'block';
    formMessage.innerHTML = `<i class="fas ${tipoConfig.icono} me-2"></i>${mensaje}`;

    // Scroll suave al mensaje
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Oculta el mensaje
 */
function ocultarMensaje() {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.style.display = 'none';
    }
}

// Log para confirmar que el script se cargó
console.log('📧 Formulario de contacto cargado correctamente');