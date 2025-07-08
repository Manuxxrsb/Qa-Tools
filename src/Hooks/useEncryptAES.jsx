import CryptoJS from 'crypto-js';

/**
 * Hook para encriptar usando AES-256 (ECB)
 * @returns {function} encryptAES
 */
const useEncryptAES = () => {
    /**
     * Encripta texto o JSON (solo valores) usando AES-256 (ECB)
     * @param {string} text - Texto o JSON a encriptar
     * @param {string} key - Clave de 32 caracteres
     * @returns {string} Base64
     */
    const encryptAES = (text, key) => {
        console.debug('[AES-ECB][ENCRYPT] Texto recibido:', text);
        console.debug('[AES-ECB][ENCRYPT] Key:', key);
        if (!key || (key.length !== 32 && key.length !== 16)) {
            throw new Error('La clave debe tener 16 o 32 caracteres');
        }
        const keyWordArray = CryptoJS.enc.Utf8.parse(key);
        // Si es JSON válido, encriptar solo los valores
        try {
            const obj = JSON.parse(text);
            if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                const encryptedObj = {};
                for (const k in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, k)) {
                        const value = obj[k];
                        if (typeof value === 'boolean' || typeof value === 'number') {
                            encryptedObj[k] = value;
                        } else {
                            const encrypted = CryptoJS.AES.encrypt(
                                String(value),
                                keyWordArray,
                                {
                                    mode: CryptoJS.mode.ECB,
                                    padding: CryptoJS.pad.Pkcs7
                                }
                            );
                            encryptedObj[k] = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
                        }
                    }
                }
                console.debug('[AES-ECB][ENCRYPT] Resultado JSON:', encryptedObj);
                return JSON.stringify(encryptedObj, null, 2);
            }
        } catch (e) {
            // No es JSON, encriptar como texto plano
        }
        const encrypted = CryptoJS.AES.encrypt(
            text,
            keyWordArray,
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        const result = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
        console.debug('[AES-ECB][ENCRYPT] Resultado texto plano:', result);
        return result;
    };
    return encryptAES;
};

export default useEncryptAES;
