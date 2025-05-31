import useHtmlReport from '../Hooks/useHtmlReport';
import PropTypes from 'prop-types';

/**
 * Componente para mostrar los resultados de las pruebas de API
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.results - Resultados de las pruebas API
 */
function ApiTestResults({ results }) {
    if (!results || results.length === 0) return null;

    const { isGenerating, generateReport } = useHtmlReport(results);

    return (
        <div className="w-full mt-6 bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Resultados de las Pruebas</h2>
                <button
                    onClick={generateReport}
                    disabled={isGenerating}
                    className={`px-4 py-2 ${isGenerating ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition-colors flex items-center gap-2`}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generando reporte...
                        </>
                    ) : (
                        <>
                            <span>📄</span> Exportar reporte
                        </>
                    )}
                </button>
            </div>
            <div className="overflow-x-auto" id="resultsTable">
                <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-700">                        <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ruta</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Código</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Detalles</th>
                    </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {results.map((result, index) => (
                            <tr key={index} className={result.error ? 'bg-red-900/20' : 'hover:bg-gray-700'}>                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{result.nombre}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{result.descripcion || '-'}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{result.ruta}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{result.tipo}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                    <div className="flex flex-col">
                                        <span>Recibido: {result.codigoRecibido || '-'}</span>
                                        <span>Esperado: {result.codigoEsperado || '-'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {result.error ? (
                                        <span className="text-red-400">✗ Error</span>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <span className={result.coindiceCodigo ? 'text-green-400' : 'text-yellow-400'}>
                                                {result.coindiceCodigo ? '✓' : '⚠'} Código
                                            </span>
                                            <span className={result.coincideBody ? 'text-green-400' : 'text-yellow-400'}>
                                                {result.coincideBody ? '✓' : '⚠'} Body
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-300">
                                    {result.error ? (
                                        <div className="text-red-400">{result.error}</div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="text-xs">
                                                <span className="font-semibold">Body Recibido:</span>
                                                <pre className="mt-1 bg-gray-900 p-2 rounded overflow-x-auto">
                                                    {JSON.stringify(result.bodyRecibido, null, 2)}
                                                </pre>
                                            </div>
                                            {result.bodyEsperado && (
                                                <div className="text-xs">
                                                    <span className="font-semibold">Body Esperado:</span>
                                                    <pre className="mt-1 bg-gray-900 p-2 rounded overflow-x-auto">
                                                        {JSON.stringify(result.bodyEsperado, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ApiTestResults;

ApiTestResults.propTypes = {
    results: PropTypes.arrayOf(PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string,
        ruta: PropTypes.string.isRequired,
        tipo: PropTypes.string.isRequired,
        codigoEsperado: PropTypes.number,
        codigoRecibido: PropTypes.number,
        bodyRecibido: PropTypes.object,
        bodyEsperado: PropTypes.object,
        coindiceCodigo: PropTypes.bool,
        coincideBody: PropTypes.bool,
        error: PropTypes.string
    })).isRequired
};
