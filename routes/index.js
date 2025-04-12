//Definicion de router general
import express from "express";
import {
    home
} from "../controllers/homeController.js";
import {
    formNuevaVacante,
    saveVacante,
    mostrarVacante,
    editarVacanteForm,
    saveEdicionVacante,
    deleteVacante
} from "../controllers/vacanteController.js";

const router = express.Router();

//Rutas de area publica
router.get("/", home);
//Rutas para crear vacantes
router.get("/vacantes/nueva", formNuevaVacante);
router.post("/vacantes/nueva", saveVacante)
//Rutas para mostrar vacante
router.get("/vacante/:id", mostrarVacante);
router.get("/vacante/:id/:bandera", mostrarVacante);
//Rutas para editar vacante
router.get("/vacante-edicion/:id", editarVacanteForm)
router.post("/vacante/save-edicion", saveEdicionVacante);
//Rutas para eliminar vacante
router.post("/vacante/delete", deleteVacante);

export default router;
