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
    deleteVacante,
    savePostulaciones,
    listarCandidatos,
    buscarCV,
    buscarVacante
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
    cerrarSesion,
    formOlvidePassword,
    recuperacionPassword,
    formCambioPassword,
    cambioPasswordDB
} from "../controllers/authController.js";
import {protegerRuta} from "../helpers/Middlewares.js";
import {body} from "express-validator";
import {upload} from "../Middlewares/MulterConfig.js";
import {uploadPDF} from "../Middlewares/MulterConfigPDF.js";

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
router.post("/updatePerfil", protegerRuta, upload.single("imagen"), updatePerfilReclutador);
// [
//     body("_id").trim().escape(),
//     body("nombre").trim().escape().notEmpty().withMessage("El nombre es obligatorio"),
//     body("email").trim().escape().notEmpty().withMessage("El email es obligatorio").isEmail().withMessage("Debe ser un email valido").normalizeEmail(),
//     body("password").trim().escape().notEmpty().withMessage("La password es obligatoria"),
//     body("confirmar_password").trim().escape().notEmpty().withMessage("La confirmacion de password es obligatoria")
// ],
router.get("/cerrar-sesion", protegerRuta, cerrarSesion);
router.post("/vacante/postulacion", protegerRuta, uploadPDF.single("cv"), savePostulaciones);
router.post("/listarCandidatos", protegerRuta, listarCandidatos);
router.post("/candidato", protegerRuta, buscarCV);

/**
 * RUTAS DE AREA PUBLICA
 */
router.get("/", home);
router.get("/crear-cuenta", formCrearCuenta);
router.post("/crear-cuenta", saveUsuario);
router.get("/iniciar-sesion", formInicarSesion);
router.get("/olvide-password", formOlvidePassword);
router.post("/email-recuperar-password", recuperacionPassword);
router.get("/recuperacion/:token", formCambioPassword);
router.post("/actualizacion-password", cambioPasswordDB);
router.post("/inicio_sesion", inicioSesion);
router.get("/confirmar/:token", vistaConfirmarCuenta);
router.post("/confirmacion_token", confirmacionToken);
router.get("/vacante/:id", mostrarVacante);
router.get("/vacante/:id/:bandera", mostrarVacante);
router.post("/buscador", buscarVacante);

export default router;
