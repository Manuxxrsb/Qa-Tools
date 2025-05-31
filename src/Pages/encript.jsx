import { useState } from 'react';
import useEncryption from '../Hooks/useEncryption';
import { copyToClipboard, showCopySuccess } from '../Handlers/ClipboardHandler';
import { formatJSON, getJsonSummary } from '../Handlers/JsonHandler';
import Sidebar from '../Components/Sidebar';

function Encript() {
    const {
        text,
        setText,
        key,
        setKey,
        iv,
        setIv,
        result,
        mode,
        setMode,
        error,
        isJsonInput,
        handleProcess
    } = useEncryption();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    // Ancho de la sidebar: 4rem (colapsada) o 16rem (expandida)
    const sidebarWidth = isSidebarCollapsed ? '4rem' : '16rem';

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-700 overflow-auto">
            <h1 className="text-3xl mb-8 text-center font-bold text-white">Encriptación / Desencriptación</h1>
            <div className="flex flex-col items-center w-full">
                <div className="w-full max-w-3xl flex flex-col gap-6 items-center pb-12">
                    {/* Botones para seleccionar modo */}
                    <div className="flex justify-center space-x-4 mb-2">
                        <button
                            className={`px-4 py-2 rounded ${mode === 'encrypt' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
                            onClick={() => setMode('encrypt')}
                        >
                            Encriptar
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${mode === 'decrypt' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
                            onClick={() => setMode('decrypt')}
                        >
                            Desencriptar
                        </button>
                    </div>

                    {/* Inputs de Key e IV alineados a la derecha */}
                    <div className="flex flex-row justify-end gap-6 mb-4 w-full"> {/* Más espacio entre inputs, ocupa todo el ancho */}
                        <div className="flex flex-col items-end">
                            <label className="block text-white text-sm font -bold mb-1 text-center w-full" htmlFor="key-input">
                                Clave de encriptación (Key):
                            </label>
                            <input
                                id="key-input"
                                className="w-64 p-2 border border-gray-500 rounded bg-gray-800 text-white"
                                placeholder="Clave secreta..."
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                            />
                            <p className="text-xs text-gray-400 mt-1 text-center w-full">La clave debe ser segura y recordable (16 o 32 caracteres)</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <label className="block text-white text-sm font-bold mb-1 text-center w-full" htmlFor="iv-input">
                                Vector de Inicialización (IV):
                            </label>
                            <input
                                id="iv-input"
                                className="w-52 p-2 border border-gray-500 rounded bg-gray-800 text-white"
                                placeholder="Vector de inicialización (16 o 32)"
                                value={iv}
                                onChange={(e) => setIv(e.target.value)}
                            />
                            <p className="text-xs text-gray-400 mt-1 text-center w-full">Debe tener 16 o 32 caracteres</p>
                        </div>
                    </div>

                    {/* Área de texto y resultado al desencriptar */}
                    <div className="flex flex-row w-full gap-6 items-start justify-center"> {/* Centrado horizontal */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-white text-sm font-bold" htmlFor="text-input">
                                    {mode === 'encrypt' ? 'Texto a encriptar:' : 'Texto a desencriptar:'}
                                </label>
                                {isJsonInput && (
                                    <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full">
                                        JSON Detectado
                                    </span>
                                )}
                            </div>
                            <textarea
                                id="text-input"
                                className={`w-full p-2 border rounded mb-1 bg-gray-800 text-white ${isJsonInput ? 'border-green-500' : 'border-gray-500'
                                    }`}
                                rows="4"
                                placeholder={mode === 'encrypt' ? "Texto a encriptar..." : "Texto a desencriptar..."}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            ></textarea>
                            {isJsonInput && (
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs text-green-400">
                                        Se ha detectado un JSON válido. Se mantendrá el formato al {mode === 'encrypt' ? 'desencriptar' : 'mostrar'}.
                                    </p>
                                    <button
                                        onClick={() => setText(formatJSON(text))}
                                        className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                        type="button"
                                    >
                                        Formatear JSON
                                    </button>
                                </div>
                            )}
                        </div>
                        {(result && !error && (mode === 'decrypt' || mode === 'encrypt')) && (
                            <div className="w-96 min-h-[180px] max-h-[400px] overflow-auto ml-2 p-4 bg-gray-800 border border-gray-600 rounded text-xs text-white whitespace-pre-wrap flex flex-col items-stretch">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-white text-sm font-bold">
                                        Resultado:
                                    </label>
                                </div>
                                <div className="flex-1 overflow-auto mb-2">
                                    {result}
                                </div>
                                <button
                                    className="mt-auto px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs w-full self-end"
                                    onClick={() => copyToClipboard(result, showCopySuccess)}
                                    type="button"
                                >
                                    Copiar resultado
                                </button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-900 text-white rounded w-full">
                            {error}
                        </div>
                    )}
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors mt-4 mb-2"
                        onClick={handleProcess}
                    >
                        {mode === 'encrypt' ? 'Encriptar' : 'Desencriptar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Encript;