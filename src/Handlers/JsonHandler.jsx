/**
 * Formatea un texto JSON para una mejor legibilidad
 * @param {string} jsonString - Texto JSON a formatear
 * @returns {string} JSON formateado o el texto original si no es un JSON válido
 */
export const formatJSON = (jsonString) => {
    if (!jsonString) return '';

    try {
        // Verificar si es un JSON válido
        if (jsonString.trim().startsWith('{') || jsonString.trim().startsWith('[')) {
            const obj = JSON.parse(jsonString);
            return JSON.stringify(obj, null, 2);
        }
        return jsonString;
    } catch (e) {
        // Si hay error al parsear, devolvemos el string original
        return jsonString;
    }
};

/**
 * Valida si un texto es un JSON válido
 * @param {string} jsonString - Texto a validar
 * @returns {boolean} true si es un JSON válido, false en caso contrario
 */
export const isValidJSON = (jsonString) => {
    if (!jsonString || typeof jsonString !== 'string') return false;

    try {
        // Verificar si parece JSON (comienza con { o [)
        if (!(jsonString.trim().startsWith('{') || jsonString.trim().startsWith('['))) {
            return false;
        }

        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Genera un resumen del contenido de un JSON para mostrar en la interfaz
 * @param {string} jsonString - El string JSON a analizar
 * @returns {string} Un resumen descriptivo del JSON
 */
export const getJsonSummary = (jsonString) => {
    if (!jsonString) return '';

    try {
        const obj = JSON.parse(jsonString);

        if (Array.isArray(obj)) {
            return `Array con ${obj.length} elemento${obj.length === 1 ? '' : 's'}`;
        } else if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            return `Objeto con ${keys.length} propiedad${keys.length === 1 ? '' : 'es'}`;
        } else {
            return `Valor simple: ${typeof obj}`;
        }
    } catch (e) {
        return 'JSON inválido';
    }
};
