import { useState } from 'react';
import { downloadHtmlReport } from '../Handlers/HtmlGeneratorHandler';

/**
 * Hook personalizado para manejar la generación de reportes HTML
 * @param {Array} results - Resultados de las pruebas API
 * @returns {Object} Estado y función para generar el reporte
 */
const useHtmlReport = (results) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateReport = async () => {
        setIsGenerating(true);
        try {
            await downloadHtmlReport(results);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        isGenerating,
        generateReport
    };
};

export default useHtmlReport;
