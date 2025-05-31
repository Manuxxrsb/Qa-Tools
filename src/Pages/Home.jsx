import { useEffect, useState } from 'react';

function HomePage({ setActiveView }) {
    const [hasCsvCache, setHasCsvCache] = useState(false);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        // Verificar si hay un CSV en caché
        const cachedCsv = localStorage.getItem('qa-tools-csv');
        const cachedFileName = localStorage.getItem('qa-tools-csv-filename');

        if (cachedCsv && cachedFileName) {
            setHasCsvCache(true);
            setFileName(cachedFileName);
        }
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-700">
            <h1 className="text-3xl mb-8 text-center font-bold text-white">Herramientas QA</h1>

            {hasCsvCache && (
                <div className="bg-gray-800 p-3 rounded-lg mb-6 flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                        <p className="text-white">CSV cargado en caché: <span className="text-gray-300">{fileName}</span></p>
                        <p className="text-sm text-gray-400">
                            Continúe a la herramienta API para verlo o cargue un nuevo archivo
                        </p>
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => setActiveView('api')}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    API
                </button>
                <button
                    type="button"
                    onClick={() => setActiveView('encript')}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Encriptar-Desencriptar
                </button>
            </div>
        </div>
    );
}

export default HomePage;