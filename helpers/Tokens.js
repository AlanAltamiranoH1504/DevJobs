import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

const tokenDb = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
}

const tokenJWT = (id, email) => {
    const token = jwt.sign({
        id: id,
        email: email
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    return token;
}

export {
    tokenDb,
    tokenJWT
}