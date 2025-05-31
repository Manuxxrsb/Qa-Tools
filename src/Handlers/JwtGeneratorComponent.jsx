import CryptoJS from 'crypto-js';

function base64url(source) {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);
    encodedSource = encodedSource.replace(/=+$/, '');
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');
    return encodedSource;
}

export function generateJwt() {
    const clientId = import.meta.env.VITE_clientIdQa;
    const clientSecret = import.meta.env.VITE_clientSecret;
    if (!clientId || !clientSecret) {
        throw new Error('Variables de entorno no definidas. Verifica VITE_clientIdQa y VITE_clientSecret.');
    }
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const payload = {
        iss: clientId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 5)
    };
    const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    const encodedHeader = base64url(stringifiedHeader);
    const stringifiedPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
    const encodedPayload = base64url(stringifiedPayload);
    const token = `${encodedHeader}.${encodedPayload}`;
    const signature = CryptoJS.HmacSHA256(token, clientSecret);
    const encodedSignature = base64url(signature);
    const jwtToken = `${token}.${encodedSignature}`;
    return jwtToken;
}
