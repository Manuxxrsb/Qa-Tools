import { useState } from 'react';
import CryptoJS from 'crypto-js';

/**
 * Hook personalizado para manejar operaciones de encriptación y desencriptación AES-256
 * @returns {Object} Objeto con estados y funciones para manejar la encriptación
 */
const useEncryption = () => {
    const [text, setTextInternal] = useState('');
    const [key, setKey] = useState('');
    const [iv, setIv] = useState('');
    const [result, setResult] = useState('');
    const [mode, setMode] = useState('encrypt'); // encrypt or decrypt
    const [error, setError] = useState('');
    const [isJsonInput, setIsJsonInput] = useState(false);

    /**
     * Verifica si el texto es un JSON válido
     * @param {string} textToCheck - Texto a verificar
     * @returns {boolean} Indica si el texto es un JSON válido
     */
    const checkIfJson = (textToCheck) => {
        if (!textToCheck || typeof textToCheck !== 'string') return false;

        // Verifica si parece JSON (comienza con { o [)
        if (!(textToCheck.trim().startsWith('{') || textToCheck.trim().startsWith('['))) {
            return false;
        }

        try {
            JSON.parse(textToCheck);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Función personalizada para establecer el texto y verificar si es JSON
    const setText = (newText) => {
        setTextInternal(newText);
        setIsJsonInput(checkIfJson(newText));
    };

    /**
     * Genera un vector de inicialización (IV) aleatorio
     */
    const generateRandomIV = () => {
        const randomBytes = CryptoJS.lib.WordArray.random(16);
        setIv(randomBytes.toString(CryptoJS.enc.Hex));
    };

    /**
     * Normaliza la clave o IV a WordArray si es de 16 o 32 bytes
     * @param {string} str - Key o IV
     * @returns {CryptoJS.lib.WordArray}
     */
    const normalizeKeyOrIv = (str) => {
        if (typeof str !== 'string') return null;
        if (str.length === 16 || str.length === 32) {
            return CryptoJS.enc.Utf8.parse(str);
        }
        return null;
    };

    /**
     * Valida que todos los datos necesarios estén presentes
     * @returns {boolean} Indica si los datos son válidos
     */
    const validateInputs = () => {
        if (!text) {
            setError('Por favor, ingresa un texto para procesar');
            return false;
        }
        if (!key) {
            setError('La clave de encriptación es obligatoria');
            return false;
        }
        if (!iv) {
            setError('El vector de inicialización (IV) es obligatorio');
            return false;
        }
        if (!(key.length === 16 || key.length === 32)) {
            setError('La clave debe tener 16 o 32 caracteres (bytes)');
            return false;
        }
        if (!(iv.length === 16 || iv.length === 32)) {
            setError('El IV debe tener 16 o 32 caracteres (bytes)');
            return false;
        }
        return true;
    };

    /**
     * Encripta un texto utilizando AES-256
     * @param {string} textToEncrypt - Texto a encriptar
     * @param {string} encryptionKey - Clave de encriptación
     * @param {string} initVector - Vector de inicialización
     * @returns {string} Texto encriptado
     */
    const encrypt = (textToEncrypt, encryptionKey, initVector) => {
        const keyWordArray = normalizeKeyOrIv(encryptionKey);
        const ivWordArray = normalizeKeyOrIv(initVector);
        if (!keyWordArray || !ivWordArray) {
            throw new Error('Key o IV inválidos. Deben ser de 16 o 32 caracteres.');
        }
        // Si el texto es un JSON válido, encriptar solo los valores, no las claves
        if (isJsonInput && mode === 'encrypt') {
            try {
                const obj = JSON.parse(textToEncrypt);
                if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                    const encryptedObj = {};
                    for (const key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                            const value = obj[key];
                            // Encriptar solo el valor
                            const encryptedValue = CryptoJS.AES.encrypt(String(value), keyWordArray, {
                                iv: ivWordArray,
                                mode: CryptoJS.mode.CBC,
                                padding: CryptoJS.pad.Pkcs7
                            }).toString();
                            encryptedObj[key] = encryptedValue;
                        }
                    }
                    return JSON.stringify(encryptedObj);
                }
            } catch (e) {
                // Si no es un JSON válido, continuar como texto normal
            }
        }
        // Encriptar usando AES todo el texto si no es el caso especial
        const encrypted = CryptoJS.AES.encrypt(textToEncrypt, keyWordArray, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    };

    /**
     * Desencripta un texto utilizando AES-256
     * @param {string} textToDecrypt - Texto a desencriptar
     * @param {string} encryptionKey - Clave de encriptación
     * @param {string} initVector - Vector de inicialización
     * @returns {string|object} Texto desencriptado o objeto JSON
     */
    const decrypt = (textToDecrypt, encryptionKey, initVector) => {
        const keyWordArray = normalizeKeyOrIv(encryptionKey);
        const ivWordArray = normalizeKeyOrIv(initVector);
        if (!keyWordArray || !ivWordArray) {
            throw new Error('Key o IV inválidos. Deben ser de 16 o 32 caracteres.');
        }
        // Desencriptar usando AES
        const decrypted = CryptoJS.AES.decrypt(textToDecrypt, keyWordArray, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        // Intentar parsear como JSON, si falla, devolver como texto plano
        try {
            // Verificamos si parece un objeto JSON (comienza con { o [)
            if (decryptedString.trim().startsWith('{') || decryptedString.trim().startsWith('[')) {
                const jsonObject = JSON.parse(decryptedString);
                console.log('Desencriptado como JSON válido');
                return jsonObject;
            }
        } catch (e) {
            // Si hay un error al parsear como JSON, no hacemos nada y devolvemos el texto
            console.log('No es un JSON válido, devolviendo como texto plano');
        }
        return decryptedString;
    };

    /**
     * Maneja el proceso de encriptación o desencriptación según el modo actual
     */
    const handleProcess = () => {
        if (!validateInputs()) {
            return;
        }
        setError('');

        try {
            if (mode === 'encrypt') {
                // Para encriptar, podemos procesar texto directamente
                const encrypted = encrypt(text, key, iv);
                // Si el resultado es un JSON, formatear bonito
                try {
                    const parsed = JSON.parse(encrypted);
                    setResult(JSON.stringify(parsed, null, 2));
                } catch {
                    setResult(encrypted);
                }
            } else {
                // Para desencriptar, procesamos y manejamos el resultado
                const decrypted = decrypt(text, key, iv);

                // Si el resultado es un objeto, lo convertimos a string JSON formateado para mostrarlo
                if (typeof decrypted === 'object' && decrypted !== null) {
                    setResult(JSON.stringify(decrypted, null, 2));
                } else {
                    setResult(decrypted);
                }
            }
        } catch (e) {
            console.error('Error de encriptación/desencriptación:', e);
            setError(`Error: ${mode === 'encrypt' ? 'No se pudo encriptar' : 'No se pudo desencriptar'}. ${e.message}`);
        }
    }; return {
        text,
        setText,
        key,
        setKey,
        iv,
        setIv,
        result,
        setResult,
        mode,
        setMode,
        error,
        setError,
        isJsonInput,
        generateRandomIV,
        handleProcess
    };
};

export default useEncryption;
