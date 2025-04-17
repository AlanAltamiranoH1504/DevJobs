import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import {emailConfirmacion} from "../helpers/Emails.js";
import {tokenDb, tokenJWT} from "../helpers/Tokens.js";
import Vacante from "../models/Vacante.js";

const formCrearCuenta = (req, res) => {
    res.render("usuarios/crear-cuenta", {
        nombrePagina: "Crea tu Cuenta en DevJobs",
        tagline: "Comienza a publicar tus vacantes gratis, solo debes registrarte.",
        barra: true
    });
}

const saveUsuario = async (req, res) => {
    const {nombre, email, password, confirmar_password} = req.body;
    //Validacion de nombre
    if (nombre.trim() === "" || nombre == null){
        res.render("/usuarios/crear-cuenta", {
            nombrePagina: "Crea tu Cuenta en DevJobs",
            tagline: "Comienza a publicar tus vacantes gratis, solo debes registrarte.",
            barra: true,
            error: true,
            success: false,
            msg: "Campo de nombre de usuario vacio"
        });
        return;
    }

    //Validacion de email
    if (email.trim() === "" || email == null){
        res.render("usuarios/crear-cuenta", {
            nombrePagina: "Crea tu Cuenta en DevJobs",
            tagline: "Comienza a publicar tus vacantes gratis, solo debes registrarte.",
            barra: true,
            error: true,
            success: false,
            msg: "Campo de nombre de usuario vacio"
        });
        return;
    }
    const usuarios = await Usuario.find({email: email});
    if (usuarios.length > 0){
        res.render("usuarios/crear-cuenta", {
            nombrePagina: "Crea tu Cuenta en DevJobs",
            tagline: "Comienza a publicar tus vacantes gratis, solo debes registrarte.",
            barra: true,
            error: true,
            success: false,
            msg: "Email ya registrado a un usuario"
        });
        return;
    }

    //Validacion de passwords
    if (password.trim() === "" || password == null){
        res.render("usuarios/crear-cuenta", {
            nombrePagina: "Crea tu Cuenta en DevJobs",
            tagline: "Comienza a publicar tus vacantes gratis, solo debes registrarte.",
            barra: true,
            error: true,
            success: false,
            msg: "Campo de password vacio"
        });
        return;
    }
    if (confirmar_password.trim() === "" || confirmar_password == null) {
        res.render("usuarios/crear-cuenta", {
            nombrePagina: "Crea tu Cuenta en DevJobs",
            tagline: "Comienza a publicar tus vacantes gratis, solo debes registrarte.",
            barra: true,
            error: true,
            success: false,
            msg: "Campo de confirmacion de password vacio"
        });
        return;
    }
    if (confirmar_password !== password || password.length < 5){
        res.render("usuarios/crear-cuenta", {
            nombrePagina: "Crea tu Cuenta en DevJobs",
            tagline: "Comienza a publicar tus vacantes gratis, solo debes registrarte.",
            barra: true,
            error: true,
            success: false,
            msg: "Las passwords no coinciden o es muy corta la contraseña"
        });
        return;
    }

    //Almacenamos usuario
    try {
        const contraseñaHash = await bcrypt.hash(password, 10);
        const token = tokenDb();
        const usuarioSave = await Usuario.create({
            nombre,
            email,
            password: contraseñaHash,
            token
        });
        emailConfirmacion(usuarioSave);

        res.render("usuarios/crear-cuenta", {
            nombrePagina: "Crea tu Cuenta en DevJobs",
            tagline: "Comienza a publicar tus vacantes gratis, solo debes registrarte.",
            barra: true,
            error: false,
            success: true,
            msg: "Usuario registrado correctamente"
        });
    }catch (e){
        console.log("Error en registro de usuario");
        console.log(e.message);
    }
}

const vistaConfirmarCuenta = (req, res) => {
    const token = req.params.token;
    res.render("usuarios/confirmacion-cuenta", {
        nombrePagina:"Confirmación de Cuenta para Nuevo Usuario",
        tagline: "Confirma tu cuenta e inicia sesion",
        barra: true,
        token
    });
}

const confirmacionToken = async (req, res) => {
    const {token} = req.body;
    //Buscamos usuario con ese token
    const usuario = await Usuario.findOne({
        token: token
    });
    //Validacion de usuario con ese token
    if (!usuario){
        console.log("Token no valido");
    }
    try {
        usuario.token = null;
        await usuario.save();
        const vacantes = await Vacante.find().lean();
        res.render("usuarios/iniciar_sesion", {
            nombrePagina: "DevJobs",
            tagline: "Inicia Sesión y Publica tus Vacantes",
            barra: true,
            error:false,
            success: false,
            msg: ""
        });
    }catch (e){
        console.log("Error en la actualizacion del usuario");
        console.log(e.message);
    }
}

const formInicarSesion = (req, res) => {
    res.render("usuarios/iniciar_sesion", {
        nombrePagina: "DevJobs",
        tagline: "Inicia Sesión y Publica tus Vacantes",
        barra: true,
        error:false,
        success: false,
        msg: ""
    });
}

const inicioSesion = async (req, res) => {
    const {email, password} = req.body;
    const usuario = await Usuario.findOne({email: email});

    //Agregar validacion que no sean vacios los campos
    if (!usuario){
        res.render("usuarios/iniciar_sesion", {
            nombrePagina: "DevJobs",
            tagline: "Inicia Sesión y Publica tus Vacantes",
            barra: true,
            error:true,
            success: false,
            msg: "No hay un usuario registrado con ese email"
        });
        return;
    }

    if (usuario.token != null){
        res.render("usuarios/iniciar_sesion", {
            nombrePagina: "DevJobs",
            tagline: "Inicia Sesión y Publica tus Vacantes",
            barra: true,
            error:true,
            success: false,
            msg: "No has confirmado tu cuenta para iniciar sesion"
        });
        return;
    }

    const passwordDB = usuario.password;
    const equalsPasswords = await bcrypt.compare(password, passwordDB);
    //Comparamos passwords
    if (!equalsPasswords){
        res.render("usuarios/iniciar_sesion", {
            nombrePagina: "DevJobs",
            tagline: "Inicia Sesión y Publica tus Vacantes",
            barra: true,
            error:true,
            success: false,
            msg: "Contraseña incorrecta, vuelve a intentarlo"
        });
        return;
    }
    // console.log("Iniciando session correctamente");
    const tokenUsuario = await tokenJWT(usuario._id, usuario.email);
    res.cookie("token", tokenUsuario, {
      httpOnly: true,
      secure: true,
      maxAge: 1000*60*60
    }).redirect("/devjobs/administracion");
}

export {
    formCrearCuenta,
    saveUsuario,
    vistaConfirmarCuenta,
    confirmacionToken,
    formInicarSesion,
    inicioSesion
}