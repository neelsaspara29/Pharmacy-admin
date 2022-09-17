import CryptoJS from 'crypto-js';

export const AesEncrypt = (data) => {
    // console.log("000000000000000000", data);
    let key = 'BODY-U1-N!0|RO|$^&@-enc-kEY_LEAD';
    let iv = '7777777a72ddc2f1';
    let cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    // console.log("0.0.0.0.0.0.0.0.", cipher.toString());
    return cipher.toString()
}


export const AesDEncrypt = (data) => {
    let key = 'BODY-U1-N!0|RO|$^&@-enc-kEY_LEAD';
    let iv = '7777777a72ddc2f1';
    let cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    // console.log("AesDEncrypt", cipher.toString(CryptoJS.enc.Utf8));
    return cipher.toString(CryptoJS.enc.Utf8)
}