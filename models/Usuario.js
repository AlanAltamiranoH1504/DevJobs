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
        type: String
    },
    expira: {
        type: Date
    }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;