import { useState, useEffect } from 'react';
import ModalCsv from '../Components/ModalsCSV';
import useRequest from '../Handlers/Handler_request';
import ApiTestResults from '../Components/ApiTestResults';

function ApiPage({ csvContent, setCsvContent, clearCsvCache }) {
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastLoaded, setLastLoaded] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [isTestRunning, setIsTestRunning] = useState(false);
    const { handleRequest, respuesta, error, statusCode } = useRequest();

    useEffect(() => {
        // Recuperar nombre de archivo y fecha de carga cuando se monta el componente
        const savedFileName = localStorage.getItem('qa-tools-csv-filename');
        const savedLoadDate = localStorage.getItem('qa-tools-csv-loaddate');

        if (savedFileName && csvContent) {
            setFileName(savedFileName);
        }

        if (savedLoadDate && csvContent) {
            setLastLoaded(savedLoadDate);
        }
    }, [csvContent]);

    const handleCsvUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsLoading(true);
            setFileName(file.name);

            // Guardar el nombre de archivo y la fecha de carga en localStorage
            localStorage.setItem('qa-tools-csv-filename', file.name);

            const currentDate = new Date().toLocaleString('es-ES');
            localStorage.setItem('qa-tools-csv-loaddate', currentDate);
            setLastLoaded(currentDate);

            const reader = new FileReader();
            reader.onload = (e) => {
                setCsvContent(e.target.result);
                setIsLoading(false);
            };
            reader.onerror = () => {
                setIsLoading(false);
                alert('Error al leer el archivo');
            };
            reader.readAsText(file);
        }
    };

    const runApiTests = async (csvData) => {
        if (!csvData) return;

        setIsTestRunning(true);
        const rows = csvData.split('\n').map(row => row.split(','));
        const headers = rows[0];

        // Encontrar índices de las columnas según la nueva estructura
        const nombreIndex = headers.findIndex(h => h === 'Nombre');
        const codigoEsperadoIndex = headers.findIndex(h => h === 'Codigo esperado');
        const bodyEsperadoIndex = headers.findIndex(h => h === 'Body esperado');
        const bodyRequestIndex = headers.findIndex(h => h === 'body request');
        const tipoIndex = headers.findIndex(h => h === 'Tipo');
        const headersIndex = headers.findIndex(h => h === 'Headers');
        const rutaIndex = headers.findIndex(h => h === 'Ruta');
        const descripcionIndex = headers.findIndex(h => h === 'Descripcion');

        const results = [];

        // Ejecutar las pruebas para cada fila
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row[rutaIndex]) continue; // Saltar filas vacías

            try {
                const requestHeaders = row[headersIndex] && row[headersIndex].trim() !== ''
                    ? JSON.parse(row[headersIndex])
                    : {};

                const requestBody = row[bodyRequestIndex] && row[bodyRequestIndex].trim() !== ''
                    ? JSON.parse(row[bodyRequestIndex])
                    : null;

                await handleRequest({
                    url: row[rutaIndex],
                    method: row[tipoIndex],
                    headers: requestHeaders,
                    body: requestBody
                });

                const expectedBody = row[bodyEsperadoIndex] && row[bodyEsperadoIndex].trim() !== ''
                    ? JSON.parse(row[bodyEsperadoIndex])
                    : null;

                const expectedCode = parseInt(row[codigoEsperadoIndex]) || null;
                const bodyMatches = JSON.stringify(respuesta) === JSON.stringify(expectedBody);
                const codeMatches = expectedCode === statusCode;

                results.push({
                    nombre: row[nombreIndex],
                    descripcion: row[descripcionIndex],
                    ruta: row[rutaIndex],
                    tipo: row[tipoIndex],
                    codigoEsperado: expectedCode,
                    codigoRecibido: statusCode,
                    bodyRecibido: respuesta,
                    bodyEsperado: expectedBody,
                    coincideBody: bodyMatches,
                    coindiceCodigo: codeMatches,
                    error: null
                });
            } catch (err) {
                results.push({
                    nombre: row[nombreIndex],
                    descripcion: row[descripcionIndex],
                    ruta: row[rutaIndex],
                    tipo: row[tipoIndex],
                    error: err.message,
                    coincideBody: false,
                    coindiceCodigo: false
                });
            }
        }

        setTestResults(results);
        setIsTestRunning(false);
    };

    return (<div className="w-full h-full flex flex-col items-center p-6 bg-gray-700 text-white">
        <h1 className="text-3xl mb-8 text-center font-bold text-white">Herramientas API</h1>

        <div className="flex flex-wrap gap-4 mb-4">
            <input
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                id="csvInput"
                onChange={handleCsvUpload}
            />
            <button
                type="button"
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
                onClick={() => document.getElementById('csvInput').click()}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cargando...
                    </>
                ) : 'Cargar CSV'}
            </button>
            <button
                type="button"
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => runApiTests(csvContent)}
                disabled={isTestRunning}
            >
                {isTestRunning ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Ejecutando pruebas...
                    </>
                ) : 'Ejecutar Pruebas API'}
            </button>
            {csvContent && (
                <button
                    type="button"
                    className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={clearCsvCache}
                >
                    Borrar CSV
                </button>
            )}
        </div>
        {fileName && csvContent && (
            <div className="w-full bg-gray-800 p-2 rounded mb-4 flex justify-between items-center flex-wrap gap-y-2">
                <div className="flex flex-col">
                    <span className="text-sm">
                        <span className="text-gray-400">Archivo cargado:</span> {fileName}
                    </span>
                    {lastLoaded && (
                        <span className="text-xs text-gray-400">
                            Cargado: {lastLoaded}
                        </span>
                    )}
                </div>
                <span className="text-xs text-green-500">✓ En cache</span>
            </div>
        )}        {testResults.length > 0 && (
            <div className="w-full mb-6">
                <ApiTestResults results={testResults} />
            </div>
        )}

        <div className="w-full">
            <ModalCsv
                content={csvContent}
            />
        </div>
    </div>
    );
}

export default ApiPage;