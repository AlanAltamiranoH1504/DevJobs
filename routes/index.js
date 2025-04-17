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

import {
    formCrearCuenta,
    saveUsuario,
    vistaConfirmarCuenta,
    confirmacionToken,
    formInicarSesion,
    inicioSesion
} from "../controllers/usuarioController.js";
import {
    mostrarPanel,
    editarPerfilForm,
    updatePerfilReclutador,
    cerrarSesion
} from "../controllers/authController.js";
import {protegerRuta} from "../helpers/Middlewares.js";

const router = express.Router();
/**
 * RUTAS DE AREA PRIVADA (AUTENTICACION)
 */
router.get("/administracion", protegerRuta, mostrarPanel);
router.get("/vacantes/nueva", protegerRuta, formNuevaVacante);
router.post("/vacantes/nueva", protegerRuta, saveVacante);
router.get("/vacante-edicion/:id", protegerRuta, editarVacanteForm)
router.post("/vacante/save-edicion", protegerRuta, saveEdicionVacante);
router.post("/vacante/delete", protegerRuta, deleteVacante);
router.get("/editarPerfil", protegerRuta, editarPerfilForm);
router.post("/updatePerfil", protegerRuta, updatePerfilReclutador);
router.get("/cerrar-sesion", protegerRuta, cerrarSesion);

/**
 * RUTAS DE AREA PUBLICA
 */
router.get("/", home);
router.get("/crear-cuenta", formCrearCuenta);
router.post("/crear-cuenta", saveUsuario);
router.get("/iniciar-sesion", formInicarSesion);
router.post("/inicio_sesion", inicioSesion);
router.get("/confirmar/:token", vistaConfirmarCuenta);
router.post("/confirmacion_token", confirmacionToken);
router.get("/vacante/:id", mostrarVacante);
router.get("/vacante/:id/:bandera", mostrarVacante);

export default router;
