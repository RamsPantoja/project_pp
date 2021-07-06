import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

//Configuracion del SMTP para enviar los emails con nodemailer.
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
        user: 'worddraco1@gmail.com',
        pass: 'RdASpFTI5jaXtLCQ'
    }
});


//Crea un token que sera enviado por email al usuario que se ha registrado ó para confirmar el email en la sección /account/acoount del lado del cliente.
export const createEmailConfirmationToken = async (user, SECRET, expiresIn, sgMail, baseUrl, subject) => {
    const {_id, email, firstname} = user;
    //Se firma el token.
    const emailToken = jwt.sign({_id}, SECRET, {expiresIn});
    //Si el token existe, se crear el constructor con los datos del email que sera enviado al usuario registrado.
    if (emailToken) {
        const url = `${baseUrl}${emailToken}`;
        const msg = {
            to: email,
            from: 'profepaco@profepaco.com',
            subject: subject,
            html: `
                <div>
                    <div style='
                        padding:2em;
                    '>  
                        <h1>Profe Paco | Confirmación de cuenta</h1>
                        <p>Hola ${firstname}, gracias por registrarte en profepaco.com</p>
                        <p>Con esta nueva cuenta de PROFEPACO podrá comprar o suscribirse a los cursos disponibles. ¡IMPORTANTE! Debes de tener una cuenta validada antes de proceder a comprar o suscribirse a un curso.</p>
                        <p>Haz click en el siguiente botón para validar tu cuenta:</p>
                        <a style='
                        text-decoration: none;
                        padding:1em;
                        background-color:#15639d;
                        color:#ffffff;
                        font-weight:bold;
                        border-radius:0.2em;
                        text-align:center' href="${url}">CONFIRMAR CUENTA</a>
                    </div>              
                </div>
            `
        }
        
        try {
            await transporter.sendMail(msg);
            return 'Se te ha enviado un correo de confirmación.'
        } catch (error) {
            return error
        }
    }
}

export const createEmailRecoveryPasswordToken = async (user, SECRET, expiresIn, sgMail, baseUrl, subject) => {
    const {_id, email, firstname} = user;
    //Se firma el token.
    const emailToken = jwt.sign({_id}, SECRET, {expiresIn});
    //Si el token existe, se crear el constructor con los datos del email que sera enviado al usuario registrado.
    if (emailToken) {
        const url = `${baseUrl}${emailToken}`;
        const msg = {
            to: email,
            from: 'profepaco@profepaco.com',
            subject: subject,
            html: `
                <div>
                    <div style='
                        padding:2em;
                    '>  
                        <h1>Profe Paco | Recuperación de contraseña</h1>
                        <p>Hola ${firstname}, haz solicitado una recuperación de contraseña.</p>
                        <p>Haz click en el siguiente botón para recuperar tu contraseña:</p>
                        <a style='
                        text-decoration: none;
                        padding:1em;
                        background-color:#15639d;
                        color:#ffffff;
                        font-weight:bold;
                        border-radius:0.2em;
                        text-align:center' href="${url}">RECUPERAR CONTRASEÑA</a>
                    </div>              
                </div>
            `
        }
        
        try {
            await transporter.sendMail(msg);
            return 'Se te ha enviado un correo de confirmación.'
        } catch (error) {
            return error
        }
    }
}