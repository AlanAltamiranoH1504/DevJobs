import mongoose from 'mongoose';

const {Schema} = mongoose;
const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
        require: false
    },
    expira: {
        type: Date
    },
    imagen: {
        type: String,
        required: false
    }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;