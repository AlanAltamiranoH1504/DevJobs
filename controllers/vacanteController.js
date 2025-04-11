import Vacante from "../models/Vacante.js";
import {removeUnnecessaryItems} from "@babel/preset-env/lib/filter-items.js";
import {raw} from "express";

//Rutas del vacanteController
const formNuevaVacante = (req, res) => {
    res.render("vacantes/formNuevaVacante", {
        nombrePagina: "Nueva Vacante",
        tagline: "Llena el formulario y publica tu vacante",
        error: false,
        sucess: false,
    });
}

const saveVacante = async (req, res) => {
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
        skills
    });
    try{
        await vacanteNew.save().then(() => {
            console.log("Vacante guardada de manera correcta");
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
        msg: "Vacante Registrada Correctamente"
    });
}

const mostrarVacante = async (req, res) => {
    const id = req.params.id;
    const findVacante = await Vacante.findById(id);
    res.render("vacantes.mostrarVacante", {
        vacante: findVacante
    });
}

export {
    formNuevaVacante,
    saveVacante,
    mostrarVacante
}