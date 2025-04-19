import Vacante from "../models/Vacante.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {protegerRuta} from "../helpers/Middlewares.js";
import Usuario from "../models/Usuario.js";
dotenv.config();

//Rutas del vacanteController
const formNuevaVacante = (req, res) => {
    res.render("vacantes/formNuevaVacante", {
        nombrePagina: "Nueva Vacante",
        tagline: "Llena el formulario y publica tu vacante",
        cerrarSesion: true,
        error: false,
        sucess: false,
    });
}

const saveVacante = async (req, res) => {
    //Usuario en sesion
    const tokenSesion = req.cookies.token;
    const contenidoToken = await jwt.verify(tokenSesion, process.env.JWT_SECRET);
    const {id} = contenidoToken;
    const usuarioSesion = await Usuario.findById(id);

    const {titulo, empresa, ubicacion, salario, contrato, descripcion, skills} = req.body;
    if (titulo.trim() === "" || titulo == null) {
        res.render("vacantes/formNuevaVacante", {
            nombrePagina: "Nueva Vacante",
            tagline: "Llena el formulario y publica tu vacante",
            error: true,
            sucess: false,
            msg: "Titulo de vacante incompleto"
        });
        return;
    }
    if (ubicacion.trim() === "" || ubicacion == null) {
        res.render("vacantes/formNuevaVacante", {
            nombrePagina: "Nueva Vacante",
            tagline: "Llena el formulario y publica tu vacante",
            error: true,
            sucess: false,
            msg: "Ubicacion de vacante incompleta"
        });
        return;
    }
    if (contrato.trim() === "" || contrato == null) {
        res.render("vacantes/formNuevaVacante", {
            nombrePagina: "Nueva Vacante",
            tagline: "Llena el formulario y publica tu vacante",
            error: true,
            sucess: false,
            msg: "Tipo de contrato impleto para la vacante"
        });
        return;
    }
    if (descripcion.trim() === "" || descripcion == null) {
        res.render("vacantes/formNuevaVacante", {
            nombrePagina: "Nueva Vacante",
            tagline: "Llena el formulario y publica tu vacante",
            error: true,
            sucess: false,
            msg: "Descripcion de vacante incompleta"
        });
        return;
    }
    if (skills == null) {
        res.render("vacantes/formNuevaVacante", {
            nombrePagina: "Nueva Vacante",
            tagline: "Llena el formulario y publica tu vacante",
            error: true,
            sucess: false,
            msg: "SkillS de vacante incompleta"
        });
        return;
    }

    //Guardamos vacante en la db
    const vacanteNew = new Vacante({
        titulo: titulo,
        empresa: empresa,
        ubicacion,
        salario,
        contrato,
        descripcion,
        skills,
        autor: usuarioSesion._id
    });
    try{
        await vacanteNew.save().then(() => {
            // console.log("Vacante guardada de manera correcta");
            // console.log(vacanteNew);
        }).catch((error) => {
            console.log("Error al guardar la vacante");
            console.log("ERROR: " + error);
        });
    }catch (e){
        console.log("Error");
        console.log(e)
    }
    res.render("vacantes/formNuevaVacante", {
        nombrePagina: "Nueva Vacante",
        tagline: "Llena el formulario y publica tu vacante",
        error: false,
        sucess: true,
        cerrarSesion:true,
        msg: "Vacante Registrada Correctamente"
    });
}

const mostrarVacante = async (req, res) => {
    const id = req.params.id;
    const bandera = req.params.bandera;
    const findVacante = await Vacante.findById(id);
    const autorVacante = await Usuario.findById(findVacante.autor[0]);
    const pathImgAutorVacante = autorVacante._id + "_" + autorVacante.imagen;
    // console.log("Se pasa la vacante a la vista");
    res.render("vacantes/mostrarVacante", {
        vacante: findVacante.toObject(),
        barra:true,
        bandera,
        nombrePagina: findVacante.titulo,
        tagline: `RECLUTADOR: ${autorVacante.nombre}`,
        imagen: pathImgAutorVacante
    });
}

const editarVacanteForm = async (req, res) => {
    const id = req.params.id;
    try {
        const findVacante = await Vacante.findById(id);
        if (!findVacante){
            res.redirect("/devjobs");
            return;
        }
        res.render("vacantes/editarVacanteForm", {
            vacante: findVacante.toObject(),
            cerrarSesion:true,
            nombrePagina: `Editar Vacante - ${findVacante.titulo}`
        })
    } catch (e) {
        console.log("Error en la edicion de vacante");
        console.log(e.message);
    }
}

const saveEdicionVacante = async (req, res) =>{
    const {_id, titulo, empresa, ubicacion, salario, contrato, descripcion, skills} = req.body;
    try{
        const actualizacionVacante = await Vacante.updateOne({_id}, {
            $set:  {
                titulo,
                empresa,
                ubicacion,
                salario,
                contrato,
                descripcion,
                skills
            }
        });
        if (actualizacionVacante){
            res.redirect(`/devjobs/vacante/${_id}/1`);
        }
    }catch (e){
        console.log("ERORR EN LA EDICION DE LA VACANTE");
        console.log(e.message);
    }
}

const deleteVacante = async (req, res) => {
    const tokenCookie = req.cookies.token;
    const contenidoToken = await jwt.verify(tokenCookie, process.env.JWT_SECRET);
    const {id} = contenidoToken;
    const id_form = req.body._id;

    //Buscamos usuario en sesion y vacante a eliminar
    const usuarioActivo = await Usuario.findById(id);
    const vacantePorEliminar = await Vacante.findById(id_form);

    if (!vacantePorEliminar.autor[0].equals(usuarioActivo._id)){
        res.redirect("/devjobs/administracion");
    }
    const vacanteDelete = await Vacante.deleteOne({
        _id: id_form
    });
    const vacantes = await Vacante.find().lean();
    res.redirect("/devjobs/administracion");
}

export {
    formNuevaVacante,
    saveVacante,
    mostrarVacante,
    editarVacanteForm,
    saveEdicionVacante,
    deleteVacante
}