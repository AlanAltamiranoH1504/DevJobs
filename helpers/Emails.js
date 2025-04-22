import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {tokenDb, tokenJWT} from "./Tokens.js";

dotenv.config();

const emailConfirmacion = async (datos) => {
    const {email, nombre, token} = datos;

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
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="color: #333333;">Hola ${nombre},</h2>
        <p style="font-size: 16px; color: #555555;">
          Gracias por registrarte en <strong>DevJobs</strong>. Tu cuenta ya está casi lista.
        </p>
        <p style="font-size: 16px; color: #555555;">
          Solo necesitas confirmar tu cuenta haciendo clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.BACKEND_URL}/confirmar/${token}" style="background-color: #28a745; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Confirmar Cuenta
          </a>
        </div>
        <p style="font-size: 14px; color: #999999;">
          Si tú no creaste esta cuenta, puedes ignorar este mensaje.
        </p>
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 40px 0;">
        <p style="font-size: 12px; color: #bbbbbb; text-align: center;">
          © ${new Date().getFullYear()} DevJobs. Todos los derechos reservados.
        </p>
      </div>
    </div>
    `
    });
}

const recuperacionPasswordEmail = async (datos) => {
    const {_id, nombre, email} = datos;
    const token = await tokenJWT(_id, email);
    const tokenBasico = tokenDb();
    const transport = nodemailer.createTransport({
        host: process.env.HOST_MAILTRAP,
        port: process.env.PORT_MAILTRAP,
        auth: {
            user: process.env.USER_MAILTRAP,
            pass: process.env.PASSWORD_MAILTRAP
        }
    });

    await transport.sendMail({
        from: "DevJobs",
        to: email,
        subject: "RECUPERA TU PASSWORD",
        text: "RECUPERA TU PASSWORD",
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h2 style="color: #333333;">Hola ${nombre},</h2>
                <p style="font-size: 16px; color: #555555;">
                  Has solicitado recuperar tu contraseña en tu cuenta de <strong>DevJobs</strong>.
                </p>
                <p style="font-size: 16px; color: #555555;">
                  Haz clic en el siguiente botón para restablecer tu contraseña:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.BACKEND_URL}/recuperacion/${token}" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Recuperar Password
                  </a>
                </div>
                <p style="font-size: 14px; color: #999999;">
                  Si tú no solicitaste este cambio, puedes ignorar este mensaje.
                </p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 40px 0;">
                <p style="font-size: 12px; color: #bbbbbb; text-align: center;">
                  © ${new Date().getFullYear()} DevJobs. Todos los derechos reservados.
                </p>
              </div>
            </div>
        `
    });
}

export {
    emailConfirmacion,
    recuperacionPasswordEmail
}