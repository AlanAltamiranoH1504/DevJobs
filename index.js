/**
 * → ARCHIVO BASE DE CONFIGURACION
 * DevJobs: Plataforma de busqueda y publicacion de trabajos para desarrolladores
 * Autor: Altamirano Hernández Alan - 04 de abril de 2025
 */
import conexion from './config/db.js'
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import {engine} from 'express-handlebars';
import router from "./routes/index.js";
import * as helpers from './helpers/handlebars.js';
import {fileURLToPath} from "url"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as path from "node:path";
import createHttpError from "http-errors";
import dotenv from "dotenv";
dotenv.config();

//Lavantamiento servidor
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log("Servidor corriendo en puerto 3000");
});

//Habilitacion de handlebaers
app.engine("handlebars", engine({
    helpers: helpers
}));
app.set("view engine", "handlebars");

//Habilitamos acceso a archivos publicos
app.use(express.static(path.join(__dirname, "public")));
//Habilitacion de Bootstrap
app.use('/static', express.static(path.join(__dirname, 'node_modules')));

//Habilitacion de sesion para la conexion a la base de datos
app.use(cookieParser());

//Habilitacion JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Uso de Routers
app.use("/devjobs", router)
//Error 404 pagina no existente
app.use((req, res, next) => {
    next(createHttpError(404, "Recurso no encontrado"));
});
//Administracion de errores
app.use((error, req, res, next) => {
    const errorVista = error.message;
    const status = error.status || 500;
    //Mandamos vista de error
    res.render("error", {
        errorVista,
        status
    })
});


