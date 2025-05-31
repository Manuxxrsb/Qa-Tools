import { useState } from 'react';

function Encript() {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');
    const [mode, setMode] = useState('encrypt'); // encrypt or decrypt

    const handleEncryptDecrypt = () => {
        if (!text) return;

        // Simple Base64 encryption/decryption for demonstration
        if (mode === 'encrypt') {
            setResult(btoa(text));
        } else {
            try {
                setResult(atob(text));
            } catch (e) {
                setResult('Error: No se pudo desencriptar. Formato inválido.');
            }
        }
    }; return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-700">
            <h1 className="text-3xl mb-8 text-center font-bold text-white">Encriptación / Desencriptación</h1>

            <div className="w-full max-w-md">                <div className="mb-4">
                <div className="flex justify-center space-x-4 mb-4">
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
                </div>                    <textarea
                    className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-800 text-white"
                    rows="4"
                    placeholder={mode === 'encrypt' ? "Texto a encriptar..." : "Texto a desencriptar..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>

                <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
                    onClick={handleEncryptDecrypt}
                >
                    {mode === 'encrypt' ? 'Encriptar' : 'Desencriptar'}
                </button>
            </div>

                {result && (<div className="mt-6">
                    <h3 className="text-lg font-medium mb-2 text-white">Resultado:</h3>
                    <div className="p-3 bg-gray-800 rounded border border-gray-600 break-all text-white">
                        {result}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

export default Encript;