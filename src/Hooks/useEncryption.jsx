import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { encryptAESCBC } from './useEncryptAESCBC';
import { decryptAESCBC } from './useDecryptAESCBC';
import useEncryptAES from './useEncryptAES';
import useDecryptAES from './useDecryptAES';

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
    const [encryptionMode, setEncryptionMode] = useState('aes'); // 'aes' o 'aes-cbc'

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
    // Elimina funciones legacy y lógica duplicada de CBC/ECB

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
    };    /**
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
        if (encryptionMode === 'aes-cbc') {
            if (!iv) {
                setError('El vector de inicialización (IV) es obligatorio');
                return false;
            }
            // Para AES-256-CBC, validar que sean valores hexadecimales válidos
            const hexRegex = /^[0-9A-Fa-f]+$/;
            if (!hexRegex.test(key)) {
                setError('La clave debe ser un valor hexadecimal válido para AES-256-CBC');
                return false;
            }
            if (!hexRegex.test(iv)) {
                setError('El IV debe ser un valor hexadecimal válido para AES-256-CBC');
                return false;
            }
        } else {
            // Para AES-ECB, validar longitud de caracteres
            if (!(key.length === 16 || key.length === 32)) {
                setError('La clave debe tener 16 o 32 caracteres (bytes)');
                return false;
            }
        }
        return true;
    };

    /**
     * Encripta un texto utilizando el modo seleccionado
     */
    const encrypt = (textToEncrypt, encryptionKey, initVector) => {
        if (encryptionMode === 'aes-cbc') {
            return encryptAESCBC(textToEncrypt, encryptionKey, initVector);
        } else {
            // AES-ECB (sin IV)
            return encryptAES(textToEncrypt, encryptionKey);
        }
    };
    /**
     * Desencripta un texto utilizando el modo seleccionado
     */
    const decrypt = (textToDecrypt, encryptionKey, initVector) => {
        if (encryptionMode === 'aes-cbc') {
            return decryptAESCBC(textToDecrypt, encryptionKey, initVector);
        } else {
            // AES-ECB (sin IV)
            return decryptAES(textToDecrypt, encryptionKey);
        }
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
        handleProcess,
        encryptionMode,
        setEncryptionMode
    };
};

export default useEncryption;
