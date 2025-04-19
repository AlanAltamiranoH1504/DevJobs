import mongoose from "mongoose";
const {Schema} = mongoose;
import slug from "slug";
import shortid from "shortid";

//Definimos el schema de mongoose
const vacanteSchema = new Schema({
    titulo: {
        type: String,
        required: "El nombre de la vacante es obligatorio",
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String,
        required: "La ubicación es obligatoria",
        trim: true,
    },
    salario: {
        type: String,
        default: 0,
        trim: true
    },
    contrato: {
        type: String,
        trim: true,
        required: true
    },
    descripcion: {
        type:String,
        trim: true,
        required: true
    },
    url : {
        type: String,
        lowercase: true,
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }],
    //Relacion de una Vacante con un Usuario
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

//Generamos url antes de guardar en la db
vacanteSchema.pre("save", function(next){
    //Creamos url
    const url = slug(this.titulo);
    this.url = `${url}-${shortid.generate()}`;
    next();
});

//Exportamos el modelo
const Vacante = mongoose.model("Vacante", vacanteSchema);
export default Vacante;