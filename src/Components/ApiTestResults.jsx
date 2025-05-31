import React from 'react';

function ApiTestResults({ results }) {
    if (!results || results.length === 0) return null;

    return (
        <div className="w-full mt-6 bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-white">Resultados de las Pruebas</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-700">                        <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
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
