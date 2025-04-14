
const formCrearCuenta = (req, res) => {
    res.render("usuarios/crear-cuenta", {
        nombrePagina: "Crea tu Cuenta en DevJobs",
        tagline: "Comienza a publicar tus vacantes gratis, solo debes registrarte.",
        barra: true
    });
}

export {
    formCrearCuenta
}