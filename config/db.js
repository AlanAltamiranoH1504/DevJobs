import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
//Conexion a la base de datos
mongoose.connect(process.env.DATABASE, {
}).then(() =>{
    console.log("Conexion correcta a la base de datos");
}).catch((e) => {
    console.log("Error en la conexion a la base de datos");
    console.log(e)
});
//Excepcion por error en conexion a db
mongoose.connection.on('error', (err) => {
    console.log("Error en la conexion a la base de datos");
    console.log(err);
});

//Importamos los modelos
import Vacante from "../models/Vacante.js";
import Usuario from "../models/Usuario.js";

export default mongoose;