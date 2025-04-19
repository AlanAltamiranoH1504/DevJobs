// Cofiguracion de Multer
import multer from "multer";
import path from "node:path";
import {usuarioEnSesion} from "../helpers/UsuarioEnSesion.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/perfiles"); //Carpeta destino de archivos
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
    const tiposPermitidos = /jpeg|jpg|png/;
    const extensiones = tiposPermitidos.test(path.extname(file.originalname).toLocaleLowerCase());
    const mime = tiposPermitidos.test(file.mimetype);

    if (extensiones && mime){
        cb(null, true);
    }else{
        cb(new Error("Solo se permiten imagenes JPG o PNG"));
    }
}

//Configuracion de limites para Multer
const upload = multer({
    storage: storage,
    limits: {fileSize: 2 * 1024 * 1024},
    fileFilter: fileFilter
});

export {
    upload
}