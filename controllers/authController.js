import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import Usuario from "../models/Usuario.js";
import Vacante from "../models/Vacante.js";
import {usuarioEnSesion} from "../helpers/UsuarioEnSesion.js";
import {recuperacionPasswordEmail} from "../helpers/Emails.js";
import bcrypt from "bcrypt";

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
        const datosActualizar = {
            nombre,
            email,
            password: await bcrypt.hash(password, 10)
        }
        if (imagenRequest !== undefined){
            datosActualizar.imagen = imagenRequest.originalname;
        }
        const usuarioPorActualizar = await Usuario.updateOne({_id}, {$set: datosActualizar});
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

const formOlvidePassword = (req, res) => {
    res.render("usuarios/formOlvidePassword", {
        nombrePagina: "Reestablece Tu Password",
        tagline: "Recupera tu cuenta y empieza a publicar tus vacantes",
        barra:true
    });
}

const recuperacionPassword = async (req, res) => {
    const {email} = req.body;

    const usuarioRegistrado = await Usuario.findOne({email: email});
    if (!usuarioRegistrado){
        res.render("usuarios/formOlvidePassword", {
            nombrePagina: "Restablece Tu Password",
            tagline: "Recupera tu cuenta y empieza a publicar tus vacantes",
            barra: true,
            error: true,
            msg: "No hay un usuario registrado con ese email"
        });
        return;
    }

    //Envio de email a traves de MailTrap
    try{
        recuperacionPasswordEmail(usuarioRegistrado);
        res.render("usuarios/formOlvidePassword", {
            nombrePagina: "Restablece Tu Password",
            tagline: "Recupera tu cuenta y empieza a publicar tus vacantes",
            barra: true,
            success: true,
            msg: "Verifica tu email para la recuperacion de tu password"
        });
    }catch (e){
        console.log("ERROR EN EL ENVIO DE EMAIL PARA RECUPERACION DE PASSWORD");
        console.log(e.messsage);
    }
}

const formCambioPassword = async (req, res) => {
    try{
        const token = req.params.token;
        const contenidoToken = await jwt.verify(token, process.env.JWT_SECRET);
        const {id, email} = contenidoToken;

        if (!id || !email){
            res.render("usuarios/formOlvidePassword", {
                nombrePagina: "Restablece Tu Password",
                tagline: "Recupera tu cuenta y empieza a publicar tus vacantes",
                barra: true,
                error: true,
                msg: "Token Expirado. Solicita Nuevamente la Recuperacion de tu Password"
            });
            return;
        }
        res.render("usuarios/formCambioPassword", {
            nombrePagina: "Restablece Tu Password",
            tagline: "Recupera tu cuenta y empieza a publicar vacantes",
            barra: true,
            email
        });
    }catch (e) {
        res.render("usuarios/formOlvidePassword", {
            nombrePagina: "Restablece Tu Password",
            tagline: "Recupera tu cuenta y empieza a publicar tus vacantes",
            barra: true,
            error: true,
            msg: "Token Expirado. Solicita Nuevamente la Recuperacion de tu Password"
        });
    }
}

const cambioPasswordDB = async (req, res) => {
    const {email, password, confirmPassword} = req.body;

    if (password !== confirmPassword) {
        res.render("usuarios/formOlvidePassword", {
            nombrePagina: "Restablece Tu Password",
            tagline: "Recupera tu cuenta y empieza a publicar tus vacantes",
            barra: true,
            error: true,
            msg: "Las contraseñas no coiciden, vuelve a intentarlo"
        });
    }

    const passwordHasheada = await bcrypt.hash(password, 10);
    const usuarioPorActualizar = await Usuario.updateOne({email: email}, {
        $set: {
            password: passwordHasheada
        }
    });
    res.render("usuarios/formOlvidePassword", {
        nombrePagina: "Restablece Tu Password",
        tagline: "Recupera tu cuenta y empieza a publicar tus vacantes",
        barra: true,
        success: true,
        msg: "Actualizacion de Password Correcta"
    });
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
    formOlvidePassword,
    recuperacionPassword,
    formCambioPassword,
    cambioPasswordDB
}