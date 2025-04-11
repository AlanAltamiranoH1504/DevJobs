//Definicion de router general
import express from "express";
import {
    home
} from "../controllers/homeController.js";
import {
    formNuevaVacante,
    saveVacante,
    mostrarVacante
} from "../controllers/vacanteController.js";

const router = express.Router();

//Rutas de area publica
router.get("/", home);
//Rutas para crear vacantes
router.get("/vacantes/nueva", formNuevaVacante);
router.post("/vacantes/nueva", saveVacante)
//Rutas para mostrar vacantes
router.get("/vacante/:id", mostrarVacante);

export default router;
