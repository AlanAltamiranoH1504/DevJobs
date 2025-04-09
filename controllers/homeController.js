//Rutas del home controller
const home =  (req, res) => {
    res.render('home', {
        nombrePagina: "DevJobs",
        tagline: "Encuentra y publica trabajos para desarrolladores web",
        barra: true,
        boton: true,
    });
}

export {
    home
}