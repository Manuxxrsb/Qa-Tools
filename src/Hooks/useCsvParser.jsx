import { useMemo } from 'react';

/**
 * Hook personalizado para parsear datos CSV
 * @param {string} content - Contenido del archivo CSV
 * @param {number} rowsPerPage - Número de filas por página
 * @param {number} currentPage - Página actual
 * @returns {Object} Objeto con las filas paginadas, total de páginas, todos los productos y headers
 */
const useCsvParser = (content, rowsPerPage = 10, currentPage = 1) => {
    return useMemo(() => {
        if (!content) return { rows: [], totalPages: 0, allProducts: [], headers: [], error: null };

        try {
            // Separar las líneas y limpiarlas
            const lines = content.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0 && !line.startsWith('//'));  // Ignorar líneas de comentario

            if (lines.length === 0) return {
                rows: [],
                totalPages: 0,
                allProducts: [],
                headers: [],
                error: 'El archivo está vacío o no contiene datos válidos'
            };

            // Obtener los headers (primera línea)
            const headers = lines[0].split(',').map(header => header.trim());

            // Procesar el resto de las líneas (datos)
            const dataLines = lines.slice(1).map(line => {
                // Manejar valores que puedan contener comas dentro de comillas
                const values = [];
                let currentValue = '';
                let insideQuotes = false;

                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                        insideQuotes = !insideQuotes;
                    } else if (char === ',' && !insideQuotes) {
                        values.push(currentValue.trim());
                        currentValue = '';
                    } else {
                        currentValue += char;
                    }
                }
                values.push(currentValue.trim());

                // Remover comillas si existen
                return values.map(value => value.replace(/^"|"$/g, ''));
            });

            const totalPages = Math.max(1, Math.ceil(dataLines.length / rowsPerPage));
            const adjustedCurrentPage = Math.min(currentPage, totalPages);
            const startIndex = (adjustedCurrentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const currentRows = dataLines.slice(startIndex, endIndex);

            return {
                rows: currentRows,
                totalPages,
                allProducts: dataLines,
                headers,
                error: null
            };
        } catch (error) {
            console.error('Error parsing CSV:', error);
            return {
                rows: [],
                totalPages: 0,
                allProducts: [],
                headers: [],
                error: 'Error al procesar el archivo CSV: ' + error.message
            };
        }
    }, [content, rowsPerPage, currentPage]);
};

export default useCsvParser;
