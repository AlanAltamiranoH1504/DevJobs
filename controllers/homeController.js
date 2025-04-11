//Rutas del home controller
import Vacante from "../models/Vacante.js";

const home = async  (req, res) => {
    const vacantes = await Vacante.find().lean();
    res.render('home', {
        nombrePagina: "DevJobs",
        tagline: "Encuentra y publica trabajos para desarrolladores web",
        barra: true,
        boton: true,
        vacantes
    });
}
export {
    home
}