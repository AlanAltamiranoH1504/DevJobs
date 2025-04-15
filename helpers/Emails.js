import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const emailConfirmacion = async (datos) => {
    const {email, nombre, token} = datos;
    console.log(datos);

    const transport = nodemailer.createTransport({
        host: process.env.HOST_MAILTRAP,
        port: process.env.PORT_MAILTRAP,
        auth: {
            user: process.env.USER_MAILTRAP,
            pass: process.env.PASSWORD_MAILTRAP
        }
    });

    //Envio de email
    await transport.sendMail({
        from: "DevJobs",
        to: email,
        subject: "CONFIRMA TU CUENTA EN DEVJOBS",
        text: "CONFIRMA TU CUENTA EN DEVJOBS",
        html: `
            <p>Hola ${nombre}, confirma tu cuenta en DevJobs</p>
            <p>Tu cuenta ya se encuentra lista, solo debes confirmarla en el siguiente enlace: 
                <a href="${process.env.BACKEND_URL}/confirmar/${token}">Confirmar Cuenta</a>
            </p>
            <p>Si no has sido tú, por favor ignora este correo.</p>
        `
    })
}
export {
    emailConfirmacion
}