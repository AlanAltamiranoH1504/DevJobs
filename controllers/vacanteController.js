import Vacante from "../models/Vacante.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import {usuarioEnSesion} from "../helpers/UsuarioEnSesion.js";
import path from "path";
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const findVacante = await Vacante.findById(id).populate("autor");
    const pathImgAutorVacante = findVacante.autor._id + "_" + findVacante.autor.imagen;
    const cookieToken = req.cookies.token;

    //Si no hay una cookie pedimos inicar sesion para contactar a recluutador
    if (cookieToken === undefined || cookieToken == null){
        res.render("vacantes/mostrarVacante", {
            vacante: findVacante.toObject(),
            barra:true,
            bandera,
            nombrePagina: findVacante.titulo,
            tagline: `RECLUTADOR: ${findVacante.autor.nombre}`,
            imagen: pathImgAutorVacante,
            iniciarSesion : true
        });
    } else{
        //Si hay sesion, idenitificamos si el de la sesion es el dueño de la vacante
        const contenidoToken = await jwt.verify(cookieToken, process.env.JWT_SECRET);
        const {id} = contenidoToken;
        if (id.toString() === findVacante.autor._id.toString()){
            res.render("vacantes/mostrarVacante", {
                vacante: findVacante.toObject(),
                barra:true,
                bandera,
                nombrePagina: findVacante.titulo,
                tagline: `RECLUTADOR: ${findVacante.autor.nombre}`,
                imagen: pathImgAutorVacante,
                botones: true
            });
        }else{
            const usuarioEnSesion = await Usuario.findById({_id: id}).lean();
            res.render("vacantes/mostrarVacante", {
                vacante: findVacante.toObject(),
                barra:true,
                bandera,
                nombrePagina: findVacante.titulo,
                tagline: `RECLUTADOR: ${findVacante.autor.nombre}`,
                imagen: pathImgAutorVacante,
                fromCV: true,
                usuario: usuarioEnSesion
            });
        }
    }
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

    if (!vacantePorEliminar.autor.equals(usuarioActivo._id)){
        res.redirect("/devjobs/administracion");
    }
    const vacanteDelete = await Vacante.deleteOne({
        _id: id_form
    });
    const vacantes = await Vacante.find().lean();
    res.redirect("/devjobs/administracion");
}

const savePostulaciones = async (req, res) => {
    const {user_id, vacante_id, nombre, email} = req.body;
    const namePDF = user_id + "_" + req.file.originalname;

    //Creamos el objeto candidato
    const candidato = {
        nombre,
        email,
        cv: namePDF
    }

    try {
        //Buscamos la vacante y le agregamos el objeto candidato al atributo array de candidatos
        const vacantePorActualizar = await Vacante.findById(vacante_id);
        vacantePorActualizar.candidatos.push(candidato);
        await vacantePorActualizar.save();

        //Redirigimos
        const findVacante = await Vacante.findById(vacante_id).populate("autor");
        const pathImgAutorVacante = findVacante.autor._id + "_" + findVacante.autor.imagen;
        res.render("vacantes/mostrarVacante", {
            vacante: findVacante.toObject(),
            nombrePagina: findVacante.titulo,
            success: true,
            tagline: `RECLUTADOR: ${findVacante.autor.nombre}`,
            imagen: pathImgAutorVacante,
            fromCV: true,
        });
    }catch (e) {
        console.log("ERROR AL AGREGAR CANDIDATO");
        console.log(e.message);
    }
}

const listarCandidatos = async (req, res) => {
    const {id} = req.body;
    const vacante = await Vacante.findById(id);
    const arrayCandidatos = vacante.candidatos;
    res.render("vacantes/listadoCandidatos", {
        candidatos: arrayCandidatos.toObject(),
        nombrePagina: "Listado de Candidatos",
        tagline: "Candidatos postulados",
        cerrarSesion: true
    });
}

const buscarCV = (req, res) => {
    const {nombre_cv} = req.body;
    const ruta = path.join(__dirname, "../public/uploads/cv", nombre_cv);
    res.sendFile(ruta);
}

const buscarVacante = async (req, res) => {
    const query = req.body.q;
    const vacantes = await Vacante.find({
        $text: {
            $search: query
        }
    }).lean();
    res.render("home", {
        nombrePagina: "DevJobs",
        tagline: `Resultados para la busqueda: ${query}`,
        barra: true,
        boton: true,
        vacantes
    });
}

export {
    formNuevaVacante,
    saveVacante,
    mostrarVacante,
    editarVacanteForm,
    saveEdicionVacante,
    deleteVacante,
    savePostulaciones,
    listarCandidatos,
    buscarCV,
    buscarVacante
}