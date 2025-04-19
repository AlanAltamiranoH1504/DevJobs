// Cofiguracion de Multer
import multer from "multer";
import path from "node:path";
import {usuarioEnSesion} from "../helpers/UsuarioEnSesion.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/cv"); //Carpeta destino de archivos
    },
    filename: async (req, file, cb) => {
        const usuarioSesion = await usuarioEnSesion(req.cookies.token);
        const nombreArchivo = usuarioSesion._id + "_" + file.originalname;
        cb(null, nombreArchivo);
    }
});


//Validaciones para Multer
const fileFilter = (req, file, cb) => {
    //Se aceptan solo imagenes
    const tiposPermitidos = /pdf/;
    const extensiones = tiposPermitidos.test(path.extname(file.originalname).toLocaleLowerCase());
    const mime = tiposPermitidos.test(file.mimetype);

    if (extensiones && mime){
        cb(null, true);
    }else{
        cb(new Error("Solo se permiten archivos PDF"));
    }
}

//Configuracion de limites para Multer
const uploadPDF = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: fileFilter
});

export {
    uploadPDF
}