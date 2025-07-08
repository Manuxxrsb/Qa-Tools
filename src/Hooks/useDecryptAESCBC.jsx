import CryptoJS from 'crypto-js';

/**
 * Hook/función para desencriptar texto o JSON (solo valores) en AES-256-CBC, entrada Base64.
 * @param {string} textToDecrypt - Texto cifrado o JSON con valores cifrados
 * @param {string} encryptionKey - Clave en hexadecimal
 * @param {string} initVector - IV en hexadecimal
 * @returns {string|object} Texto desencriptado o JSON con valores desencriptados
 */
export function decryptAESCBC(textToDecrypt, encryptionKey, initVector) {
    const keyWordArray = CryptoJS.enc.Hex.parse(encryptionKey);
    const ivWordArray = CryptoJS.enc.Hex.parse(initVector);
    console.log('---[DECRYPT CBC]---');
    console.log('Texto a desencriptar:', textToDecrypt);
    console.log('Key:', encryptionKey);
    console.log('IV:', initVector);
    console.log('KeyWordArray:', keyWordArray.toString());
    console.log('IVWordArray:', ivWordArray.toString());
    // Si es JSON válido, desencriptar solo los valores
    try {
        const parsedJson = JSON.parse(textToDecrypt);
        if (typeof parsedJson === 'object' && !Array.isArray(parsedJson)) {
            const decryptedObj = {};
            for (const key in parsedJson) {
                if (Object.prototype.hasOwnProperty.call(parsedJson, key)) {
                    const value = parsedJson[key];
                    if (typeof value === 'boolean' || typeof value === 'number') {
                        decryptedObj[key] = value;
                    } else {
                        try {
                            console.log(`[DECRYPT CBC] Clave: ${key}, Valor cifrado: ${value}`);
                            const decrypted = CryptoJS.AES.decrypt(
                                { ciphertext: CryptoJS.enc.Base64.parse(value) },
                                keyWordArray,
                                {
                                    iv: ivWordArray,
                                    mode: CryptoJS.mode.CBC,
                                    padding: CryptoJS.pad.Pkcs7
                                }
                            );
                            const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
                            console.log(`[DECRYPT CBC] Clave: ${key}, Valor desencriptado: ${decryptedStr}`);
                            decryptedObj[key] = decryptedStr;
                        } catch (e) {
                            console.log(`[DECRYPT CBC] Error desencriptando clave: ${key}`, e);
                            decryptedObj[key] = value;
                        }
                    }
                }
            }
            console.log('[DECRYPT CBC] Resultado final JSON:', decryptedObj);
            return decryptedObj;
        }
    } catch (e) {
        console.log('[DECRYPT CBC] No es JSON válido, desencriptando como texto plano');
    }
    // Desencriptar texto plano
    console.log('[DECRYPT CBC] Desencriptando como texto plano...');
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(textToDecrypt) },
        keyWordArray,
        {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    console.log('[DECRYPT CBC] Resultado final texto plano:', result);
    return result;
}
