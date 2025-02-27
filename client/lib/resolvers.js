import dbConnect from './dbConnect';
import Users from '../models/Users';
import Courses from '../models/Courses';
import mercadopago from 'mercadopago';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { createEmailConfirmationToken, createEmailRecoveryPasswordToken } from './handleSenderEmails';
//Configuracion de mercado pago para conectarse a su API.
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP
});

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
            return new Promise((resolve, rejects) => {
                Courses.find((err, courses) => {
                    if (err) {
                        rejects(new Error('Something went wrong!'));
                    } else {
                        resolve(courses)
                    }
                })
            });
        },
        
        //Obtiene el curso por ID
        getCourseById: async (parent, args) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                Courses.findOne({_id: args.id}, (err, course) => {
                    if (err) {
                        rejects(new Error('Something went wrong!'))
                    } else if (!course) {
                        rejects(new Error('Curso no found'))
                    } else {
                        resolve(course);
                    }
                })
            });
        },
        
        //Obtiene el usuario por Email.
        getUserByEmail: async (parent, {email}) => {
            await dbConnect();
            return new Promise((resolve, rejects) => {
                Users.findOne({email: email}, (err, user) => {
                    if(err || !user) rejects(new Error('Usuario no encontrado'));
                    else resolve(user)
                })
            })
        },
        //Obtiene los cursos a los que se ha suscrito o comprado un usuario.
        getCoursesByUser: async (parent, {userEmail}) => {
            await dbConnect();
            return new Promise((resolve, rejects) => {
                Courses.find({'enrollmentUsers.email': userEmail},(error, courses) => {
                    if(error) {
                        rejects(new Error('Something went wrong!'))
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
                                },
                                modeSuscription: {
                                    isActivated: course.modeSuscription.isActivated,
                                    amountMonths: course.modeSuscription.amountMonths
                                }
                            }
                        })
                        resolve(coursesFiltered);
                    }
                })
            });
        },

        //Obtiene todos los usuarios suscritos a una suscripcion especificada con el preapproval_plan_id.
        getUsersInSuscription: async (parent, {limit, offset, preapproval_plan_id}, {dataSources}) => {
            const data = await dataSources.mercadoPagoAPI.getUsersInSuscription(limit, offset, preapproval_plan_id);
            return new Promise((resolve, rejects) => {
                if (data) {
                    const usersInSuscription = data.results.map((user) => {
                        return {
                            payer_email: user.payer_email,
                            reason: user.reason,
                            last_charged_date: user.summarized.last_charged_date,
                            status: user.status,
                            next_payment_date: user.next_payment_date,
                            last_modified: user.last_modified,
                            charged_quantity: user.summarized.charged_quantity,
                            date_created: user.date_created,
                            end_date: user.auto_recurring.end_date,
                            quotas: user.summarized.quotas,
                            charged_amount: user.summarized.charged_amount,
                            preapproval_id: user.id
                        }
                    });

                    resolve(usersInSuscription.reverse());
                } else {
                    rejects(new Error('No se encuentran los usuarios :('));
                }
            })
        },

        //Obtiene una suscription de un usuario con el id de la suscripcion y el email.
        getPreapproval: async (parent, {preapproval_id, email}, {dataSources}) => {
            const data = await dataSources.mercadoPagoAPI.getPreapproval(preapproval_id, email);
            return new Promise((resolve, rejects) => {
                if (data) {
                    const preapproval = data.results.map((preapproval) => {
                        return {
                            payer_email: preapproval.payer_email,
                            reason: preapproval.reason,
                            last_charged_date: preapproval.summarized.last_charged_date,
                            status: preapproval.status,
                            next_payment_date: preapproval.next_payment_date,
                            last_modified: preapproval.last_modified,
                            charged_quantity: preapproval.summarized.charged_quantity,
                            date_created: preapproval.date_created,
                            end_date: preapproval.auto_recurring.end_date,
                            quotas: preapproval.summarized.quotas,
                            charged_amount: preapproval.summarized.charged_amount
                        }
                    });
                    resolve(preapproval);
                } else {
                    rejects(new Error('No se encuentra la suscripción'));
                }
            });
        },
        //Este query obtiene el usuario ya registrado en el curso una vez el pago ha sido acreditado, esto en base al preapproval_id retornado por el query getUsersInSuscription.
        getUserInCourseSuscriptionType: async (parent, {title, preapproval_id}) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                Courses.findOne({title: title, 'enrollmentUsers.preapproval_id': preapproval_id}, { 'enrollmentUsers.$': 1 }, (err, userData) => {
                    if (err) {
                        rejects(new Error('Something went wrong!'));
                    } else if (!userData) {
                        resolve({
                            id: null,
                            firstname: null,
                            lastname: null,
                            email: null
                        })
                    } else {
                        const user = userData.enrollmentUsers.map((enrollmentUser) => {
                            return {
                                id: enrollmentUser.id,
                                firstname: enrollmentUser.firstname,
                                lastname: enrollmentUser.lastname,
                                email: enrollmentUser.email
                            }
                        });
                        resolve(user[0]);
                    }
                });
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
            await createEmailConfirmationToken(newUser, process.env.SECRET_EMAIL_TOKEN, '1d', sgMail, 'https://profepaco.com/api/confirmation_email/', 'Confirmation email PROFE PACO');

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
                back_url:"https://profepaco.com/success_suscription",
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

            //Crea el plan de suscripcion para el curso tipo suscripcion y retorna el objeto preapproval_plan.
            const getPreapprovalPlan = (preapprovalPreference) => {
                return dataSources.mercadoPagoAPI.createPreapprovalPlan(preapprovalPreference)
                    .then((result) => {
                        if (result) {
                            return result;
                        }
                    }).catch((error) => {
                        if (error) {
                            throw new Error('No se puede crear el plan de suscripción para el curso.')
                        }
                    });
            }

            if(input.modeSuscription.isActivated === true) {
                preapprovalPlan = await getPreapprovalPlan(preapprovalPreference);
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
                    preapproval_plan_id: preapprovalPlan.id !== '' ? preapprovalPlan.id : ''
                },
                onePay: input.onePay
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
        deleteCourseByTitle: async (parent, {title, id, preapproval_plan_id, modeSuscription}, {dataSources}) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                Courses.findOneAndRemove({title: title, _id: id}, (error, doc) => {
                    if(error || !doc) {
                        rejects(new Error('No se puede eliminar o no se encuentra el curso.'));
                    } else if (modeSuscription) {
                        //Cancela el plan de suscripcion para el curso eliminado..
                        dataSources.mercadoPagoAPI.cancelPreapprovalPlan(preapproval_plan_id).then((result) => {
                            resolve('Se eliminó correctamente');
                        }).catch((err) => {
                            if(err) {
                                rejects(new Error('No se puede eliminar la suscripción asociada al curso.'))
                            }
                        });
                    } else {
                        resolve('Se eliminó correctamente.');
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
        createPreferenceMercadoPago: async (parent, {title, price, firstname, lastname, email, coverImg, id}) => {
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
                        id: id,
                        title: title,
                        unit_price: parseFloat(price),
                        quantity: 1,
                        category_id: 'learnings',
                        currency_id: 'MXN',
                        picture_url: coverImg
                    }
                ],
                payer: payer,
                payment_methods: {
                    installments: 1
                },
                notification_url: 'https://profepaco.com/api/ipn',
                statement_descriptor: 'PROFEPACO',
                back_urls: {
                    success: "https://profepaco.com/success_payment"
                },
                auto_return: 'approved',
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
                        const result = createEmailConfirmationToken(user, process.env.SECRET_EMAIL_TOKEN, '1d', sgMail, 'https://profepaco.com/api/confirmation_email/', 'Confirmation email PROFE PACO');
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
                        const result = createEmailRecoveryPasswordToken(user, process.env.SECRET_EMAIL_TOKEN, '1h', sgMail, 'https://profepaco.com/app/recovery_password/', 'Reset password PROFE PACO');
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
                    frequency_type: "days",
                    start_date: mercadopago.utils.date.now().toString(),
                    end_date: mercadopago.utils.date.now().add(2).toString()
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
        },

        //Cancela la suscripcion especifica del usuario.
        cancelPreapproval: async (parent, {preapproval_id}) => {
            await dbConnect();
            return new Promise((resolve, rejects) => {
                mercadopago.preapproval.cancel(preapproval_id).then((response) => {
                    const preapproval = response.body;
                    Courses.findOneAndUpdate({title: preapproval.reason, 'enrollmentUsers.email': preapproval.payer_email},
                    {$set: { 'enrollmentUsers.$.status': preapproval.status}}, (err, data) => {
                        if (data) {
                            resolve('Se ha cancelado la suscripción correctamente.');
                        } else if (err) {
                            rejects('No se pudo actualizar el status.')
                        }
                    });
                }).catch((error) => {
                    rejects('Error al cancelar la suscripción.');
                })
            })
        }
    }
}
