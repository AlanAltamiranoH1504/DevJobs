import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Usuario from "../models/Usuario.js";
dotenv.config();

const proterRuta = async (req, res, next) => {
    const tokenSesion = req.cookies.token;
    if (!tokenSesion) {
        console.log("Sin sesion autenticada");
        res.redirect("/devjobs/iniciar-sesion");
        return;
    }

    try{
        //Tratamos el JWT
        const contenidoToken = jwt.verify(tokenSesion, process.env.JWT_SECRET);
        const {id} = contenidoToken;
        if (!id){
            console.log("JWT Corrupto");
            res.redirect("/devjobs/iniciar-sesion");
            return;
        }

        //Verificamos el usuario en sesion
        const usuarioActivo = await Usuario.findById(id);
        next();
    }catch (e) {
        console.log("Error autorizacion de middleware");
        console.log(e.message);
    }
}

export {
    proterRuta
}