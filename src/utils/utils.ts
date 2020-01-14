import crypto from 'crypto';

const iv = crypto.randomBytes(16);

export function parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


interface IEncryptedData {
    iv: string,
    encryptedData: string
}


function encrypt(seed: crypto.BinaryLike, password: Buffer): IEncryptedData {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(password), iv);
    let encrypted = cipher.update(seed);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}


function decrypt(seed: IEncryptedData, password: Buffer): string {
    let iv = Buffer.from(seed.iv, 'hex');
    let encryptedText = Buffer.from(seed.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(password), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
