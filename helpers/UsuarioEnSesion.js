import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Usuario from "../models/Usuario.js";
dotenv.config();

const usuarioEnSesion = async (datos) => {
    const contenidoToken = jwt.verify(datos, process.env.JWT_SECRET);
    const {id} = contenidoToken;
    try {
        const usuarioEnSesion = await Usuario.findById(id).lean();
        return usuarioEnSesion;
    }catch (error){
        console.log("Error en la busqueda de usuario");
        console.log(error.message);
    }
}

export {
    usuarioEnSesion
}