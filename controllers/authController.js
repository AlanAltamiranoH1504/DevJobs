import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import Vacante from "../models/Vacante.js";
dotenv.config();

const mostrarPanel = async (req, res) => {
    //Usuario en sesion
    const cookieToken = req.cookies.token;
    const contenidoToken = await jwt.verify(cookieToken, process.env.JWT_SECRET);
    const {id} = contenidoToken;

    //Vacantes del usuario
    const usuarioSesion = await Usuario.findById(id);
    if (!usuarioSesion){
        return;
    }
    const vacantesDeUsuario = await Vacante.find({
        autor: id
    }).lean();

    res.render("auth/administracion", {
        nombrePagina: `¡Bienvenido ${usuarioSesion.nombre}!`,
        tagline: "Crea y Administra tus Vacantes desde Aqui",
        vacantes: vacantesDeUsuario,
        cerrarSesion: true,
        nombre: usuarioSesion.nombre
    })
}

const editarPerfilForm = async (req, res) => {
    const cookieToken = req.cookies.token;
    const contenidoToken = jwt.verify(cookieToken, process.env.JWT_SECRET);
    const {id} = contenidoToken;
    const usuarioEnSesion = await Usuario.findById(id).lean();

    res.render("auth/edicionPerfil", {
        nombrePagina: "Edita tu perfil de Reclutador",
        cerrarSesion: true,
        tagline: "Actualiza tus datos de reclutador",
        usuario: usuarioEnSesion
    });
}

const updatePerfilReclutador = async (req, res) => {
    const {_id, nombre, email, password, confirmar_password} = req.body;


    const usuarioActualizar = await Usuario.updateOne({_id}, {
        $set: {
            nombre,
            email,
            password
        }
    });
    res.redirect("/devjobs/administracion");
}

const cerrarSesion = (req, res) => {
    res.clearCookie("token");
    res.redirect("/devjobs");
}

export {
    mostrarPanel,
    editarPerfilForm,
    updatePerfilReclutador,
    cerrarSesion
}