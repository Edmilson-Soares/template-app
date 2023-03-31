import bcrypt from 'bcrypt-nodejs'
import crypto from 'node:crypto';

// Difining algorithm
const algorithm = 'aes-256-cbc';

// Defining key
const key = crypto.randomBytes(32);

// Defining iv
const iv = crypto.randomBytes(16);

export default (env) => ({

    password(password) {
        return bcrypt.hashSync(password)
    },
    compare(password, hash) {
        return bcrypt.compareSync(password, hash)
    }


})