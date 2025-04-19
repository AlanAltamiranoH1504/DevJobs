import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import Usuario from "../models/Usuario.js";
import Vacante from "../models/Vacante.js";
import {usuarioEnSesion} from "../helpers/UsuarioEnSesion.js";

dotenv.config();

const mostrarPanel = async (req, res) => {
    //Usuario en sesion
    const cookieToken = req.cookies.token;
    const contenidoToken = await jwt.verify(cookieToken, process.env.JWT_SECRET);
    const {id} = contenidoToken;

    //Vacantes del usuario
    const usuarioSesion = await Usuario.findById(id);
    const imgPerfil = usuarioSesion._id + "_" + usuarioSesion.imagen;
    if (!usuarioSesion) {
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
        nombre: usuarioSesion.nombre,
        imagen:imgPerfil
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
        error: false,
        success: false,
        msg: "",
        tagline: "Actualiza tus datos de reclutador",
        usuario: usuarioEnSesion
    });
}

const updatePerfilReclutador = async (req, res) => {
    const {_id, nombre, email, password, confirmar_password} = req.body;
    const imagenRequest = req.file;

    //Validamos los datos
    if (nombre.trim() === "" || nombre == null) {
        const usuarioSesion = await usuarioEnSesion(req.cookies.token);

        res.render("auth/edicionPerfil", {
            nombrePagina: "Edita tu perfil de Reclutador",
            cerrarSesion: true,
            error: true,
            success: false,
            msg: "El nombre no puede ser vacio",
            tagline: "Actualiza tus datos de reclutador",
            usuario: usuarioSesion
        });
        return;
    }

    if (email.trim() === "" || email == null) {
        const usuarioSesion = await usuarioEnSesion(req.cookies.token);

        res.render("auth/edicionPerfil", {
            nombrePagina: "Edita tu perfil de Reclutador",
            cerrarSesion: true,
            error: true,
            success: false,
            msg: "El email no puede ser vacio",
            tagline: "Actualiza tus datos de reclutador",
            usuario: usuarioSesion
        });
        return;
    }

    if (password.trim() === "" || password == null) {
        const usuarioSesion = await usuarioEnSesion(req.cookies.token);

        res.render("auth/edicionPerfil", {
            nombrePagina: "Edita tu perfil de Reclutador",
            cerrarSesion: true,
            error: true,
            success: false,
            msg: "La password no puede ser vacia",
            tagline: "Actualiza tus datos de reclutador",
            usuario: usuarioSesion
        });
        return;
    }

    if (confirmar_password.trim() === "" || confirmar_password == null) {
        const usuarioSesion = await usuarioEnSesion(req.cookies.token);

        res.render("auth/edicionPerfil", {
            nombrePagina: "Edita tu perfil de Reclutador",
            cerrarSesion: true,
            error: true,
            success: false,
            msg: "La confirmacion de password no puede ser vacia",
            tagline: "Actualiza tus datos de reclutador",
            usuario: usuarioSesion
        });
        return;
    }

    if (password !== confirmar_password) {
        const usuarioSesion = await usuarioEnSesion(req.cookies.token);

        res.render("auth/edicionPerfil", {
            nombrePagina: "Edita tu perfil de Reclutador",
            cerrarSesion: true,
            error: true,
            success: false,
            msg: "Las passwords no coinciden",
            tagline: "Actualiza tus datos de reclutador",
            usuario: usuarioSesion
        });
        return;

    }

    try {
        const usuarioActualizar = await Usuario.updateOne({_id}, {
            $set: {
                nombre,
                email,
                password,
                imagen: imagenRequest.originalname
            }
        });
        if (!usuarioActualizar) {
            return;
        }
        const usuarioSesion = await usuarioEnSesion(req.cookies.token);
        res.render("auth/edicionPerfil", {
            nombrePagina: "Edita tu perfil de Reclutador",
            cerrarSesion: true,
            error: false,
            success: true,
            msg: "Actualizacion de datos correcta",
            tagline: "Actualiza tus datos de reclutador",
            usuario: usuarioSesion
        });
    } catch (e) {
        console.log("Error en actualizacion de perfil de usuario");
        console.log(e.message);
    }
}

const cerrarSesion = (req, res) => {
    res.clearCookie("token");
    res.redirect("/devjobs");
}

export {
    mostrarPanel,
    editarPerfilForm,
    updatePerfilReclutador,
    cerrarSesion,
}