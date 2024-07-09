import * as CryptoJS from 'crypto-js';

// Declare this key and iv values in declaration
const private_key = CryptoJS.enc.Utf8.parse('4512631236589784');
const private_iv = CryptoJS.enc.Utf8.parse('4512631236589784');

// Methods for the encrypt and decrypt Using AES
export const encryptUsingAES256 = (text: string) => {
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(text)), private_key, {
        keySize: 128 / 8,
        iv: private_iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

export const decryptUsingAES256 = (decString: string) => {
    var decrypted = CryptoJS.AES.decrypt(decString, private_key, {
        keySize: 128 / 8,
        iv: private_iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);

}