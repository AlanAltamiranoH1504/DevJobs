//Rutas del vacanteController
const formNuevaVacante = (req, res) => {
    res.render("vacantes/formNuevaVacante", {
        nombrePagina: "Nueva Vacante",
        tagline: "Llena el formulario y publica tu vacante",
    })
}

const saveVacante = (req, res) =>{
    res.send("Guardado la vacante")
    // console.log(req.body.titulo);
}

export {
    formNuevaVacante,
    saveVacante
}