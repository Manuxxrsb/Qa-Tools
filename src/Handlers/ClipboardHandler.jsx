/**
 * Copia el texto proporcionado al portapapeles
 * @param {string} text - Texto a copiar
 * @param {Function} [callback] - Función a ejecutar después de copiar (opcional)
 */
export const copyToClipboard = (text, callback) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            if (callback) callback();
        })
        .catch(err => {
            console.error('Error al copiar al portapapeles:', err);
            alert('No se pudo copiar al portapapeles: ' + err.message);
        });
};

/**
 * Muestra un mensaje de éxito después de copiar al portapapeles
 */
export const showCopySuccess = () => {
    alert('¡Copiado al portapapeles!');
};
