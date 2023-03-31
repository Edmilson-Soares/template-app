import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
export default (env) => ({
    token: async(data) => {
        try {
            data.microaitec = CryptoJS.AES.encrypt(process.env.CRYPTO_NAME, process.env.CRYPTO_SECRET).toString()
            let token = await jwt.sign(data, CryptoJS.AES.decrypt(process.env.PRIVATE_KEY, process.env.CRYPTO_SECRET), { algorithm: 'RS256' }, { expiresIn: env.TIME_JWT });
            return token;
        } catch (error) {
            console.log(error)
        }

    },
    verify: (token) => {
        try {
            let decoded = jwt.verify(token, CryptoJS.AES.decrypt(process.env.PUBLIC_KEY, process.env.CRYPTO_SECRET));
            let bytes = CryptoJS.AES.decrypt(decoded.microaitec, process.env.CRYPTO_SECRET);
            if (!(bytes != process.env.CRYPTO_NAME)) throw new Error('jwt não é do microaitec')
            return decoded;
        } catch (err) {
            // err
            return err
        }
    },

})