import CryptoJS from 'crypto-js';

/**
 * Hook para desencriptar usando AES-256 (ECB)
 * @returns {function} decryptAES
 */
const useDecryptAES = () => {
    /**
     * Desencripta texto o JSON (solo valores) usando AES-256 (ECB)
     * @param {string} encryptedText - Texto o JSON encriptado (Base64)
     * @param {string} key - Clave de 16 o 32 caracteres
     * @returns {string} Texto desencriptado o JSON
     */
    const decryptAES = (encryptedText, key) => {
        console.debug('[AES-ECB][DECRYPT] Texto recibido:', encryptedText);
        console.debug('[AES-ECB][DECRYPT] Key:', key);
        if (!key || (key.length !== 32 && key.length !== 16)) {
            throw new Error('La clave debe tener 16 o 32 caracteres');
        }
        const keyWordArray = CryptoJS.enc.Utf8.parse(key);
        // Si es JSON válido, desencriptar solo los valores
        try {
            const obj = JSON.parse(encryptedText);
            if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                const decryptedObj = {};
                for (const k in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, k)) {
                        const value = obj[k];
                        if (typeof value === 'boolean' || typeof value === 'number') {
                            decryptedObj[k] = value;
                        } else {
                            const cipherParams = CryptoJS.lib.CipherParams.create({
                                ciphertext: CryptoJS.enc.Base64.parse(value)
                            });
                            const decrypted = CryptoJS.AES.decrypt(
                                cipherParams,
                                keyWordArray,
                                {
                                    mode: CryptoJS.mode.ECB,
                                    padding: CryptoJS.pad.Pkcs7
                                }
                            );
                            decryptedObj[k] = decrypted.toString(CryptoJS.enc.Utf8);
                        }
                    }
                }
                console.debug('[AES-ECB][DECRYPT] Resultado JSON:', decryptedObj);
                return JSON.stringify(decryptedObj, null, 2);
            }
        } catch (e) {
            // No es JSON, desencriptar como texto plano
        }
        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(encryptedText)
        });
        const decrypted = CryptoJS.AES.decrypt(
            cipherParams,
            keyWordArray,
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        console.debug('[AES-ECB][DECRYPT] Resultado texto plano:', result);
        return result;
    };
    return decryptAES;
};

export default useDecryptAES;
