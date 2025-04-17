//Rutas del home controller
import Vacante from "../models/Vacante.js";
import dotenv from "dotenv";
dotenv.config();

const home = async  (req, res) => {
    const vacantes = await Vacante.find().lean();
    const tokenCookie = req.cookies.token;

    if (tokenCookie){
        res.render('home', {
            nombrePagina: "DevJobs",
            tagline: "Encuentra y publica trabajos para desarrolladores web",
            cerrarSesion:true,
            boton: true,
            vacantes
        });
    }else{
        res.render('home', {
            nombrePagina: "DevJobs",
            tagline: "Encuentra y publica trabajos para desarrolladores web",
            barra: true,
            boton: true,
            vacantes
        });
    }
}
export {
    home
}