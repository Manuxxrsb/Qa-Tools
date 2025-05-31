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
        generateRandomIV,
        handleProcess
    } = useEncryption(); return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-700">
            <h1 className="text-3xl mb-8 text-center font-bold text-white">Encriptación / Desencriptación</h1>

            <div className="w-full max-w-md">                <div className="mb-4">                <div className="flex justify-center space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${mode === 'encrypt' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
                    onClick={() => setMode('encrypt')}
                >
                    Encriptar
                </button>                        <button
                    className={`px-4 py-2 rounded ${mode === 'decrypt' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
                    onClick={() => setMode('decrypt')}
                >
                    Desencriptar
                </button>
            </div>

                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="key-input">
                        Clave de encriptación (Key):
                    </label>
                    <input
                        id="key-input"
                        className="w-full p-2 border border-gray-500 rounded bg-gray-800 text-white"
                        placeholder="Clave secreta..."
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">La clave debe ser segura y recordable</p>
                </div>

                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="iv-input">
                        Vector de Inicialización (IV):
                    </label>                    <div className="flex gap-2">
                        <input
                            id="iv-input"
                            className="flex-1 p-2 border border-gray-500 rounded bg-gray-800 text-white"
                            placeholder="Vector de inicialización (16 caracteres mínimo)..."
                            value={iv}
                            onChange={(e) => setIv(e.target.value)}
                        />
                        <button
                            onClick={generateRandomIV}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                            type="button"
                        >
                            Generar IV
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Debe tener al menos 16 caracteres</p>
                </div>                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-white text-sm font-bold" htmlFor="text-input">
                            {mode === 'encrypt' ? 'Texto a encriptar:' : 'Texto a desencriptar:'}
                        </label>
                        {isJsonInput && mode === 'encrypt' && (
                            <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full">
                                JSON Detectado
                            </span>
                        )}
                    </div>
                    <textarea
                        id="text-input"
                        className={`w-full p-2 border rounded mb-1 bg-gray-800 text-white ${isJsonInput && mode === 'encrypt' ? 'border-green-500' : 'border-gray-500'
                            }`}
                        rows="4"
                        placeholder={mode === 'encrypt' ? "Texto a encriptar..." : "Texto a desencriptar..."}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>                    {isJsonInput && mode === 'encrypt' && (
                        <div className="mb-4">
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-green-400">
                                    Se ha detectado un JSON válido. Se mantendrá el formato al desencriptar.
                                </p>
                                <button
                                    onClick={() => setText(formatJSON(text))}
                                    className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                    type="button"
                                >
                                    Formatear JSON
                                </button>
                            </div>
                            <div className="mt-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300">
                                <span className="font-bold">Resumen JSON:</span> {getJsonSummary(text)}
                            </div>
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
            </div>                {result && (<div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-white">Resultado:</h3>
                    <button
                        onClick={() => copyToClipboard(result, showCopySuccess)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        type="button"
                    >
                        Copiar
                    </button>
                </div>
                <div className="p-3 bg-gray-800 rounded border border-gray-600 break-all text-white overflow-auto max-h-60">
                    {result}
                </div>
            </div>
            )}
            </div>
        </div>
    );
}

export default Encript;