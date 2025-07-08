import CryptoJS from 'crypto-js';

/**
 * Hook/función para encriptar texto o JSON (solo valores) en AES-256-CBC, salida Base64.
 * @param {string} textToEncrypt - Texto o JSON a encriptar
 * @param {string} encryptionKey - Clave en hexadecimal
 * @param {string} initVector - IV en hexadecimal
 * @returns {string} Texto cifrado (Base64) o JSON con valores cifrados
 */
export function encryptAESCBC(textToEncrypt, encryptionKey, initVector) {
    const keyWordArray = CryptoJS.enc.Hex.parse(encryptionKey);
    const ivWordArray = CryptoJS.enc.Hex.parse(initVector);
    if (!textToEncrypt) throw new Error('El texto a encriptar no puede estar vacío');
    // Si es JSON válido, encriptar solo los valores
    try {
        const obj = JSON.parse(textToEncrypt);
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
            const encryptedObj = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    if (typeof value === 'boolean' || typeof value === 'number') {
                        encryptedObj[key] = value;
                    } else {
                        const encrypted = CryptoJS.AES.encrypt(
                            CryptoJS.enc.Utf8.parse(String(value)),
                            keyWordArray,
                            {
                                iv: ivWordArray,
                                mode: CryptoJS.mode.CBC,
                                padding: CryptoJS.pad.Pkcs7
                            }
                        );
                        encryptedObj[key] = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
                        console.log(`[ENCRYPT CBC] Clave: ${key}, Valor original: ${value}, Valor cifrado: ${encryptedObj[key]}`);
                    }
                }
            }
            console.log('[ENCRYPT CBC] Resultado final JSON:', encryptedObj);
            return JSON.stringify(encryptedObj, null, 2);
        }
    } catch (e) {
        // No es JSON, encriptar como texto plano
    }
    // Encriptar texto plano
    const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(textToEncrypt),
        keyWordArray,
        {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    const result = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    console.log('[ENCRYPT CBC] Texto plano:', textToEncrypt, 'Cifrado:', result);
    return result;
}
