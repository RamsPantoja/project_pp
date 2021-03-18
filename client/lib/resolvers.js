import dbConnect from './dbConnect';
import Users from '../models/Users';
import Courses from '../models/Courses';
import mercadopago, { preapproval } from 'mercadopago';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import moment from 'moment';

//Configuracion de mercado pago para conectarse a su API.
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP
});

//Configuracion de SendGrid para conectarse a su API.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//Crea un token que sera enviado por email al usuario que se ha registrado ó para confirmar el email en la sección /account/acoount del lado del cliente.
const createEmailToken = async (user, SECRET, expiresIn, sgMail, baseUrl, message) => {
    const {_id, email, firstname} = user;
    //Se firma el token.
    const emailToken = jwt.sign({_id}, SECRET, {expiresIn});

    //Si el token existe, se crear el constructor con los datos del email que sera enviado al usuario registrado.
    if (emailToken) {
        const url = `${baseUrl}${emailToken}`;
        const msg = {
            to: email,
            from: 'worddraco1@gmail.com',
            subject: 'Confirmation email PROFEPACO',
            text: `Hola ${firstname}, haz click en el siguiente enlace para confirmar tu cuenta de PROFEPACO, gracias.`,
            html: `Por favor, haz click aqui para ${message}: <a href="${url}">${url}</a> `
        }
        
        try {
            await sgMail.send(msg);
            return 'Se te ha enviado un correo de confirmación.'
        } catch (error) {
            return error
        }
    }
}


//Pagina los resultados del query getUsers en base al cursor(ID) proporcionado por prop del lado del cliente y limit.
const paginateResults = ({
    after: cursor,
    limit,
    results,
    getCursor = () => null,
}) => {

    if(limit < 1) return [];

    if(!cursor) return results.slice(0, limit);

    //Encuentra el index de los resultados devueltos de la base de datos que hace match con el cursor(ID) proporcionado y lo retorna.
    const cursorIndex = results.findIndex(item => {
        let itemCursor = item.id ? item.id : getCursor(item);

        return itemCursor ? cursor === itemCursor : false;

    });

    //Pagina los resultados...
    return cursorIndex >= 0 
        ? cursorIndex === results.length -1
            ? []
            : results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + limit))
        : results.slice(0, limit)
}

export const resolvers = {
    Query: {
        //Obtiene todos los usuarios y los pagina en base a las props Limit y After.
        getUsers: async (parent, {limit, after}) => {
            await dbConnect();
            const allUsers = await Users.find({isAdmin: false});
            allUsers.reverse();
            const users = paginateResults({
                after,
                limit: limit,
                results: allUsers
            })

            const paginationInf = {
                users,
                totalUsers: allUsers.length
            }

            return paginationInf;
        },

        //Obtiene todos los cursos.
        getCourses: async (parent) => {
            await dbConnect();
            const courses = await Courses.find((err, data) => {
                if(err) {
                    throw new Error(err)
                } else {
                    return data;
                }
            })

            return courses
        },
        
        //Obtiene el curso por ID
        getCourseById: async (parent, args) => {
            await dbConnect();
            const course = await Courses.findOne({_id: args.id}, (err, data) => {
                if(err) {
                    throw new Error(err);
                } else {
                    return data
                }
            });

            return course;
        },
        
        //Obtiene el usuario por Email.
        getUserByEmail: async (parent, {email}) => {
            await dbConnect();
            return new Promise((resolve, rejects) => {
                Users.findOne({email: email}, (err, user) => {
                    if(err || !user) rejects('No se encuentra el usuario');
                    else resolve(user)
                })
            })
        },

        getCoursesByUser: async (parent, {userEmail}) => {
            await dbConnect();
            return new Promise((resolve, rejects) => {
                Courses.find({'enrollmentUsers.email': userEmail},(error, courses) => {
                    if(error) {
                        rejects(error)
                    } else {
                        const coursesFiltered = courses.map((course) => {
                            return {
                                id: course.id,
                                title: course.title,
                                teacher: course.teacher,
                                price: course.price,
                                enrollmentUsers: course.enrollmentUsers.filter((enrollmentUser) => enrollmentUser.email === userEmail),
                                coverImg: {
                                    url: course.coverImg.url
                                }
                            }
                        })
                        resolve(coursesFiltered);
                    }
                })
            });
        }
    },

    Mutation: {
        //Crea un Usuario en base al input proporcionado desde el lado del cliente.
        createUser: async (parent, {input}) => {
            //Esta funcion hace la conexion a la base de datos...
            await dbConnect();
            
            //Busca en la base de datos si el email ya existe.
            const emailAlreadyExist = await Users.findOne({
                email: input.email
            });

            if (emailAlreadyExist) {
                throw new Error('El email ya existe!')
            }

            //Crea un nuevo objeto User y lo guarda en la coleccion Users de la base de datos.
            const newUser = await new Users({
                firstname: input.firstname,
                lastname: input.lastname,
                email: input.email,
                password: input.password,
                img: '',
                isAdmin: false,
                isConfirmated: false
            }).save();

            //Se crea el token con el email que sera enviado al usuario registrado por correo.
            createEmailToken(newUser, process.env.SECRET_EMAIL_TOKEN, '1d', sgMail, 'https://profepaco.vercel.app/api/confirmation_email/', 'confirmar tu cuenta de PROFEPACO.');

            return `Gracias por registrarte ${input.firstname}, se te ha enviado un correo de confirmación para que actives tu cuenta de PROFEPACO.`;
        },
        
        //Agrega un curso.
        addCourse: async (parent, {input, img}, {dataSources}) => {
            const mimeTypes = ['image/jpeg', 'image/png', 'image/svg', 'image/gif']
            const {filename, mimetype, url} = await img;
            await dbConnect();
            const courseAlreadyExist = await Courses.findOne({title: input.title});

            if(courseAlreadyExist) {
                throw new Error('El curso ya existe');
            }

            if(!mimeTypes.includes(mimetype)) {
                throw new Error('La imagen debe ser .jpg/.png/.svg/.gif');
            }

            const preapprovalPreference = {
                back_url:"https://www.mercadopago.com.mx",
                reason: input.title,
                auto_recurring:{
                    frequency:"1",
                    frequency_type:"months",
                    transaction_amount: input.price,
                    currency_id:"MXN",
                    repetitions: input.modeSuscription.amountMonths
                }   
            }

            let preapprovalPlan = {
                init_point: '',
                id: ''
            };

            if(input.modeSuscription.isActivated === true) {
                preapprovalPlan = await dataSources.mercadoPagoAPI.createPreapprovalPlan(preapprovalPreference)
            }
            
            const newCourse = await new Courses({
                title: input.title,
                teacher: input.teacher,
                description: input.description,
                objectives: input.objectives,
                conceptList: input.conceptList,
                enrollmentLimit: input.enrollmentLimit,
                enrollmentUsers: [],
                price: input.price,
                coverImg: {
                    filename: filename,
                    mimetype: mimetype,
                    url: url
                },
                modeSuscription: {
                    isActivated: input.modeSuscription.isActivated,
                    amountMonths: input.modeSuscription.amountMonths,
                    paymentUrl: preapprovalPlan.init_point,
                    preapproval_plan_id: preapprovalPlan.id
                }
            });

            return new Promise((resolve, rejects) => {
                if(newCourse) {
                    newCourse.save();
                    resolve('Se ha creado el curso correctamente.')
                } else {
                    rejects('No se puede crear el curso, revise los datos.')
                }
            })
        
        },

        //Elimina un curso con el titulo del curso especificado.
        deleteCourseByTitle: async (parent, {title, id}) => {
            await dbConnect();
            
            return new Promise((resolve, rejects) => {
                Courses.findOneAndRemove({title: title, _id: id}, (error, doc) => {
                    if(error || !doc) {
                        rejects('No se puede eliminar ó no se encuentra el curso');
                    } else {
                        resolve('Se eliminó correctamente')
                    }
                });
            });
        },

        //Elimina el usuario del curso especificado.
        deleteUserInCourse: async (parent, {id, userEmail}) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                Courses.findOneAndUpdate({_id: id}, {$pull: {enrollmentUsers: {email: userEmail}}}, (err, doc) => {
                    if(err) {
                        rejects(err)
                    } else if(!doc) {
                        rejects('No se encuentra el usuario')
                    } else {
                        resolve('Usuario Eliminadó');
                    }
                })
            })
        },

        //Elimina un Usuario por Email
        deleteUserByEmail: async (parent, {userEmail}) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                Users.findOneAndRemove({email: userEmail}, (error, user) => {
                    if(error || !user) rejects('No se cuentra el usuario');
                    else resolve('Se eliminó correctamente')
                })
            })

        },

        //Este resolver se encarga de crear una preferencia de mercado pago en base a los datos proporcionados por el cliente.
        createPreferenceMercadoPago: async (parent, {title, price, firstname, lastname, email, coverImg}) => {
            //Datos del comprador del curso
            const payer = {
                name: firstname,
                surname: lastname,
                email: email
            }

            //La preferencia del curso a vender
            let preference = {
                items: [
                    {
                        title: title,
                        unit_price: parseFloat(price),
                        quantity: 1,
                        category_id: 'learnings',
                        currency_id: 'MXN',
                        picture_url: `https://profepaco.vercel.app${coverImg}`
                    }
                ],
                payer: payer,
                payment_methods: {
                    installments: 1
                },
                statement_descriptor: 'PROFEPACO',
                back_urls: {

                }
            }

            //Se creo un item con todos los datos de la preferencia necesarios para proceder con el pago.
            const preferenceItem = await mercadopago.preferences.create(preference)
            .then(function(response) {
                //Retorna el link para pagar hacia el cliente.
                return response.body.init_point
            }).catch(function(error) {
                return error
            })
            
            return (preferenceItem);
        },

        //Envia un correo de confirmacion al Usuario para que valide su cuenta de profepaco.
        sendEmailConfirmation: async (parent, {email}) => {
            await dbConnect();
            
            return new Promise((resolve, rejects) => {
                Users.findOne({email: email}, (err, user) => {
                    if (err || !user) {
                        rejects('Verifica el correo ingresado.')
                    } else {
                        const result = createEmailToken(user, process.env.SECRET_EMAIL_TOKEN, '1d', sgMail, 'https://profepaco.vercel.app/api/confirmation_email/', 'confirmar tu cuenta de PROFEPACO');
                        resolve(result);
                    }
                })
            })
        },

        //Este resolver se encargara de actualizar la contraseña proporcionada por el cliente en /account/account.
        resetPassword: async (parent, {email, currentPassword, newPassword}) => {
            await dbConnect();

            const user = await Users.findOne({email: email});

            if (!user) {
                throw new Error('Error, revise sus datos.');
            }

            const newPasswordHash = await bcrypt.hash(newPassword, 10);
            
            if(!newPasswordHash) {
                throw new Error('Algo salio mal al actualizar la contraseña.')
            }

            return new Promise((resolve, rejects) => {
                bcrypt.compare(currentPassword, user.password).then((result) => {
                    if (result) {
                        Users.findOneAndUpdate({email: email}, {password: newPasswordHash}, (err, user) => {
                            if(err || !user) {
                                rejects('Algo no salió mal al actualizar la contraseña.');
                            } else {
                                resolve('Se actualizo correctamente la contraseña.')
                            }
                        })
                    } else {
                        rejects('Contraseña actual: incorrecta.')
                    }
                })
            })
        },

        //Actualiza la informacion de perfil del Usuario
        updateUserProfile: async (parent, {email, firstname, lastname, id}) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                Users.findOneAndUpdate({_id: id}, {
                    email: email,
                    firstname: firstname,
                    lastname: lastname
                }, (err, user) => {
                    if(err || !user) {
                        rejects('Algo salió mal al actualizar el perfil.')
                    } else {
                        resolve('Se actualizó correctamente el perfil.');
                    }
                })
            })
        },

        //Actualiza el curso que se desea editar desde el cliente.
        updateCourse: async (parent, {input, id}) => {
            return new Promise((resolve, rejects) => {
                Courses.findOneAndUpdate({_id: id}, input, (err, course) => {
                    if(err || !course) {
                        rejects('Hubo un error al actualizar el curso.');
                    } else {
                        resolve('Se actualizó correctamente.')
                    }
                })
            })
        },

        //Envia un email al email proporcionado por el usuario que desea recuperar su contraseña.
        recoveryPassword: async (parent, {email}) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                Users.findOne({email: email}, (err, user) => {
                    if( err || !user) {
                        rejects('Hubo un error al enviar el email');
                    } else {
                        const result = createEmailToken(user, process.env.SECRET_EMAIL_TOKEN, '1h', sgMail, 'https://profepaco.vercel.app/app/recovery_password/', 'restablecer tu contraseña');
                        resolve(result)
                    }
                })
            })
        },

        //Resetea la contraseña que el usuario proporciona, cuando inicio el flujo de recuperacion de contraseña.
        resetPasswordRecovery: async (parent, {id, newPassword}) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                bcrypt.hash(newPassword, 10).then((hash) => {
                    if (hash) {
                        Users.findOneAndUpdate({_id: id}, {password: hash}, (err, user) => {
                            if(err || !user) {
                                rejects('No se puede resetear la contraseña, intentalo de nuevo.');
                            } else {
                                resolve('Se ha restablecido la contraseña correctamente.');
                            }
                        })
                    } else {
                        rejects ('No se puede resetear la contraseña, intentalo de nuevo.')
                    }
                })
            })
        },

        //Crea una suscripcion pendiente de pago. Este resolver solo se difinira aqui para futuras implementaciones de suscripcion.
        createPreapprovalPreferenceMercadoPago: async (parent, {input}) => {

            const payload = {
                auto_recurring: {
                    currency_id: "MXN",
                    transaction_amount: input.price,
                    frequency: 1,
                    frequency_type: "months",
                    start_date: input.start_date,
                    end_date: input.end_date
                  },
                  back_url: "https://www.mercadopago.com.mx/",
                  payer_email: input.email,
                  reason: input.title,
                  status: "pending"
            }

            return new Promise((resolve, rejects) => {
                mercadopago.preapproval.create(payload).then((data) => {
                    if(data) {
                        resolve(data.body.init_point);
                    } else {
                        rejects(end_date);
                    }
                })
            })
        }
    }
}
