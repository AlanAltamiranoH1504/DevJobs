
const mostrarPanel = (req, res) => {
    res.render("auth/administracion", {
        nombrePagina: "Panel de Administracion",
        tagline: "Crea y Administra tus Vacantes desde Aqui",
        barra: true
    })
}

export {
    mostrarPanel
}