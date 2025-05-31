import { useState, useEffect } from 'react';
import useCsvParser from '../Hooks/useCsvParser.jsx';

function ModalCsv({ content }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const rowsPerPage = 10;

    // Reiniciar la página cuando cambia el contenido
    useEffect(() => {
        setCurrentPage(1);
        setSearchTerm('');
    }, [content]);

    // Función para exportar los datos filtrados
    const handleExport = () => {
        let dataToExport = allProducts;

        // Si hay un término de búsqueda, aplicar filtro
        if (searchTerm.trim() !== '') {
            dataToExport = allProducts.filter(row =>
                row.some(cell =>
                    cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Crear el contenido CSV
        const csvContent = [
            headers.join(','),
            ...dataToExport.map(row => row.join(','))
        ].join('\n');

        // Crear un blob y link para descarga
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'datos_exportados.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const { rows: allRows, totalPages, allProducts, headers, error } = useCsvParser(content, rowsPerPage, currentPage);

    // Aplicar filtro de búsqueda si es necesario
    const filteredProducts = searchTerm.trim() !== ''
        ? allProducts.filter(row =>
            row.some(cell =>
                cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        : allProducts;

    // Recalcular paginación con filtro aplicado
    const filteredTotalPages = Math.max(1, Math.ceil(filteredProducts.length / rowsPerPage));
    const safeCurrentPage = Math.min(currentPage, filteredTotalPages);
    const startIndex = (safeCurrentPage - 1) * rowsPerPage;
    const rows = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

    if (!content) {
        return (
            <div className="w-full bg-gray-800 p-8 rounded-lg shadow-lg text-white mt-8 text-center">
                <p className="text-xl">No hay archivo CSV cargado</p>
                <p className="text-sm mt-2 text-gray-400">Usa el botón "Cargar CSV" para visualizar datos</p>
            </div>
        );
    } if (error) {
        return (
            <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg text-white mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Error al procesar CSV</h2>
                </div>
                <div className="p-4 bg-red-900/30 border border-red-500 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg overflow-auto text-white mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Datos CSV</h2>
            </div>
            <div className="mb-4">
                <h3 className="font-semibold text-white">Información del archivo</h3>
                <p>Total de registros: {allProducts.length}</p>
            </div>
            <div className="border-4 border-gray-600 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600 bg-gray-700 border-separate border-spacing-2">
                    <thead className="bg-gray-600">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-2 border-gray-500 bg-gray-600"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>                        </thead>
                    <tbody className="bg-gray-700">
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-600">
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-white text-center border-2 border-gray-500 bg-gray-700"
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>            </div>                <div>
                <p className="text-white">Página actual: {safeCurrentPage} de {filteredTotalPages}</p>
            </div>

            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={safeCurrentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-500"
                >
                    Anterior
                </button>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(filteredTotalPages, prev + 1))}
                    disabled={safeCurrentPage === filteredTotalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-500"                >
                    Siguiente
                </button>
            </div>

            <div className="mt-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar en los datos..."
                    className="px-4 py-2 w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex justify-end gap-4 mt-4">
                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Exportar CSV
                </button>
            </div>
        </div>
    );
}

export default ModalCsv;