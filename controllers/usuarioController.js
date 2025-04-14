import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";

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
        const usuarioSave = await Usuario.create({
            nombre,
            email,
            password: contraseñaHash
        });
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

export {
    formCrearCuenta,
    saveUsuario
}