/**
 * → ARCHIVO BASE DE CONFIGURACION
 * DevJobs: Plataforma de busqueda y publicacion de trabajos para desarrolladores
 * Autor: Altamirano Hernández Alan - 04 de abril de 2025
 */
import express from 'express';
import {engine} from 'express-handlebars';
import router from "./routes/index.js";
import {fileURLToPath} from "url"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as path from "node:path";

//Lavantamiento servidor
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log("Servidor corriendo en puerto 3000");
});

//Habilitacion de handlebaers
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//Habilitamos archivos publicos
app.use(express.static(path.join(__dirname, "public")));

//Uso de Routers
app.use("/devjobs", router)



