/**
 * @typedef {Object} TestResult
 * @property {string} nombre - Nombre de la prueba
 * @property {string} descripcion - Descripción de la prueba
 * @property {string} ruta - Ruta de la API
 * @property {string} tipo - Tipo de petición HTTP
 * @property {number} codigoEsperado - Código de respuesta esperado
 * @property {number} codigoRecibido - Código de respuesta recibido
 * @property {Object} bodyRecibido - Cuerpo de la respuesta recibida
 * @property {Object} bodyEsperado - Cuerpo de la respuesta esperada
 * @property {boolean} coindiceCodigo - Si el código coincide
 * @property {boolean} coincideBody - Si el body coincide
 * @property {string|null} error - Mensaje de error si existe
 */

/**
 * Genera los estilos CSS para el reporte HTML
 * @returns {string} Estilos CSS en formato string
 */
const generateHtmlStyles = () => `
    body {
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.5;
        color: #ffffff;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        background: #1a1a1a;
    }
    .header {
        text-align: center;
        margin-bottom: 2rem;
        color: #ffffff;
    }
    .summary {
        background: #2d3748;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }
    .test-results {
        background: #2d3748;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }
    .test-item {
        border-bottom: 1px solid #4a5568;
        padding: 1rem 0;
    }
    .test-item:last-child {
        border-bottom: none;
    }
    .success { color: #48bb78; }
    .error { color: #f56565; }
    .warning { color: #ed8936; }
    pre {
        background: #1a202c;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        color: #e2e8f0;
        margin: 0.5rem 0;
    }
    .details-label {
        font-weight: bold;
        margin-right: 0.5rem;
        color: #a0aec0;
    }
    .status-section {
        background: #1a202c;
        padding: 1rem;
        border-radius: 4px;
        margin: 1rem 0;
    }
    .status-section p {
        margin: 0.5rem 0;
    }
    .status-section .success,
    .status-section .warning,
    .status-section .error {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 4px;
    }
    .status-section .success {
        background: rgba(72, 187, 120, 0.1);
    }
    .status-section .warning {
        background: rgba(237, 137, 54, 0.1);
    }
    .status-section .error {
        background: rgba(245, 101, 101, 0.1);
    }
    table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin-top: 1rem;
    }
    th {
        background: #4a5568;
        color: #e2e8f0;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: uppercase;
        padding: 0.75rem 1rem;
        text-align: left;
    }
    td {
        padding: 0.75rem 1rem;
        color: #e2e8f0;
        background: #2d3748;
        border-bottom: 1px solid #4a5568;
    }
    tr:hover td {
        background: #404b60;
    }
`;

/**
 * Genera el HTML para la sección de resultados de la prueba
 * @param {TestResult} result - Resultado de la prueba
 * @returns {string} HTML con la descripción del resultado
 */
const generateResultDescriptionHtml = (result) => {
    const { coindiceCodigo, coincideBody } = result;
    return `
        <div>
            <p class="${coindiceCodigo ? 'success' : 'warning'}">
                ${coindiceCodigo ? '✓' : '⚠'} Código de respuesta: ${coindiceCodigo ? 'coincide' : 'no coincide'}
            </p>
            <p class="${coincideBody ? 'success' : 'warning'}">
                ${coincideBody ? '✓' : '⚠'} Body de respuesta: ${coincideBody ? 'coincide' : 'no coincide'}
            </p>
        </div>
    `;
};

/**
 * Genera el HTML para un elemento de prueba individual
 * @param {TestResult} result - Resultado de la prueba
 * @returns {string} HTML del elemento de prueba
 */
const generateTestItemHtml = (result) => {
    let html = `
        <div class="test-item">
            <h3>${result.nombre}</h3>
            <div class="description-section">
                <p><span class="details-label">Descripción:</span> ${result.descripcion || '-'}</p>
            </div>
            <p><span class="details-label">Ruta:</span> ${result.ruta}</p>
            <p><span class="details-label">Método:</span> ${result.tipo}</p>
            <p>
                <span class="details-label">Código:</span>
                Esperado: ${result.codigoEsperado || '-'} | 
                Recibido: ${result.codigoRecibido || '-'}
            </p>
            <div class="result-section">
                ${generateResultDescriptionHtml(result)}
            </div>
            <div class="status-section">
                <p class="details-label">Estado de la prueba:</p>
                ${result.error ?
            `<p class="error">✗ Error - ${result.error}</p>` :
            `<div>
                        <p class="${result.coindiceCodigo ? 'success' : 'warning'}">
                            ${result.coindiceCodigo ? '✓' : '⚠'} Código ${result.coindiceCodigo ? 'correcto' : 'incorrecto'}
                        </p>
                        <p class="${result.coincideBody ? 'success' : 'warning'}">
                            ${result.coincideBody ? '✓' : '⚠'} Body ${result.coincideBody ? 'correcto' : 'incorrecto'}
                        </p>
                    </div>`
        }
            </div>`;

    if (result.bodyRecibido || result.bodyEsperado) {
        if (result.bodyRecibido) {
            html += `
                <div>
                    <p class="details-label">Body Recibido:</p>
                    <pre>${JSON.stringify(result.bodyRecibido, null, 2)}</pre>
                </div>`;
        }

        if (result.bodyEsperado) {
            html += `
                <div>
                    <p class="details-label">Body Esperado:</p>
                    <pre>${JSON.stringify(result.bodyEsperado, null, 2)}</pre>
                </div>`;
        }
    }

    html += '</div>';
    return html;
};

const generateSummaryHtml = (results) => {
    const totalTests = results.length;
    const successfulTests = results.filter(r => !r.error && r.coindiceCodigo && r.coincideBody).length;
    const failedTests = totalTests - successfulTests;

    return `
        <div class="summary">
            <h2>Resumen</h2>
            <p>Total de pruebas: ${totalTests}</p>
            <p class="success">Pruebas exitosas: ${successfulTests}</p>
            <p class="error">Pruebas fallidas: ${failedTests}</p>
        </div>
    `;
};

const generateHtml = (results) => {
    const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resultados de las Pruebas de API</title>
            <style>${generateHtmlStyles()}</style>
        </head>
        <body>
            <div class="header">
                <h1>Resultados de las Pruebas de API</h1>
                <p>${new Date().toLocaleString('es-ES')}</p>
            </div>
            ${generateSummaryHtml(results)}
            <div class="test-results">
                <h2>Detalles de las pruebas</h2>
                ${results.map(result => generateTestItemHtml(result)).join('')}
            </div>
        </body>
        </html>
    `;

    return html;
};

export const downloadHtmlReport = (results) => {
    try {
        const htmlContent = generateHtml(results);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resultados-pruebas-api.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        console.error('Error al generar el reporte HTML:', error);
        throw new Error(`Error al generar el reporte HTML: ${error.message || 'Error inesperado al crear el archivo HTML'}`);
    }
};
