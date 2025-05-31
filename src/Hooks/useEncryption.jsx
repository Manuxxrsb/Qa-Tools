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

        if (!iv || iv.length < 16) {
            setError('El vector de inicialización (IV) debe tener al menos 16 caracteres');
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
        // Convertir la clave y IV a formato utilizable por CryptoJS
        const keyHex = CryptoJS.enc.Utf8.parse(encryptionKey);
        const ivHex = CryptoJS.enc.Utf8.parse(initVector.slice(0, 16)); // Asegurar que IV tenga exactamente 16 bytes

        // Verificar si el texto parece JSON para intentar tratarlo como objeto
        let textToProcess = textToEncrypt;

        // Si comienza con { o [, intentamos parsearlo como JSON
        if (isJsonInput && mode === 'encrypt') {
            try {
                // Si es un JSON válido, lo convertimos a string para asegurarnos
                JSON.parse(textToEncrypt);
                textToProcess = textToEncrypt; // Ya es un string JSON
                console.log('Encriptando JSON válido');
            } catch (e) {
                // No es un JSON válido, continuar como texto normal
                console.log('Texto no reconocido como JSON válido, procesando como texto normal');
            }
        }

        // Encriptar usando AES
        const encrypted = CryptoJS.AES.encrypt(textToProcess, keyHex, {
            iv: ivHex,
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
        // Convertir la clave y IV a formato utilizable por CryptoJS
        const keyHex = CryptoJS.enc.Utf8.parse(encryptionKey);
        const ivHex = CryptoJS.enc.Utf8.parse(initVector.slice(0, 16)); // Asegurar que IV tenga exactamente 16 bytes

        // Desencriptar usando AES
        const decrypted = CryptoJS.AES.decrypt(textToDecrypt, keyHex, {
            iv: ivHex,
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
                setResult(encrypted);
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
