import useEncryption from '../Hooks/useEncryption';
import { copyToClipboard, showCopySuccess } from '../Handlers/ClipboardHandler';
import { formatJSON, getJsonSummary } from '../Handlers/JsonHandler';

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
    } = useEncryption(); return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-700">
            <h1 className="text-3xl mb-8 text-center font-bold text-white">Encriptación / Desencriptación</h1>

            <div className="w-full max-w-md flex flex-col gap-4">
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
                <div className="flex flex-row justify-end gap-2 mb-2">
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
                <div className={`flex flex-row w-full gap-2`}>
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
                    {/* Mostrar resultado a la derecha solo en modo desencriptar */}
                    {mode === 'decrypt' && result && (
                        <div className="w-56 min-h-[120px] max-h-60 overflow-auto ml-2 p-2 bg-gray-800 border border-gray-600 rounded text-xs text-white whitespace-pre-wrap">
                            <span className="block font-bold text-blue-400 mb-1">Resultado:</span>
                            {result}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900 text-white rounded">
                        {error}
                    </div>
                )}                <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
                    onClick={handleProcess}
                >
                    {mode === 'encrypt' ? 'Encriptar' : 'Desencriptar'}
                </button>
            </div>
        </div>
    );
}

export default Encript;