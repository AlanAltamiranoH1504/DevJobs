/**
 * → ARCHIVO BASE DE CONFIGURACION
 * DevJobs: Plataforma de busqueda y publicacion de trabajos para desarrolladores
 * Autor: Altamirano Hernández Alan - 04 de abril de 2025
 */
import mongoose from 'mongoose'
import conexion from './config/db.js'
import express from 'express';
import cokieParser from 'cookie-parser';
import session from 'express-session';
import mongoStore from 'connect-mongo'
import {engine} from 'express-handlebars';
import router from "./routes/index.js";
import * as helpers from './helpers/handlebars.js';
import {fileURLToPath} from "url"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as path from "node:path";
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

//Habilitamos archivos publicos
app.use(express.static(path.join(__dirname, "public")));

//Habilitacion de sesion para la conexion a la base de datos
app.use(cokieParser());
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        mongoUrl: process.env.DATABASE,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60,
    })
}));

//Uso de Routers
app.use("/devjobs", router)



