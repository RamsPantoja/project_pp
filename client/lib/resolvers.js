import dbConnect from './dbConnect';
import Users from '../models/Users';
import Courses from '../models/Courses';
import mercadopago from 'mercadopago';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';


mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createEmailToken = (user, SECRET, expiresIn, sgMail) => {
    const {_id, email, firstname} = user;
    jwt.sign({_id}, SECRET, {expiresIn}, (err, emailToken) => {
        if (emailToken) {
            const url = `http://localhost:3000/api/confirmation_email/${emailToken}`;
            const msg = {
                to: email,
                from: 'worddraco1@gmail.com',
                subject: 'Confirmation email PROFEPACO',
                text: `Hola ${firstname}, haz click en el siguiente enlace para confirmar tu cuenta de PROFEPACO, gracias.`,
                html: `Por favor, haz click aqui para confirmar tu cuenta: <a href="${url}">${url}</a> `
            }
            sgMail.send(msg)
            .then(() => {
                return 'Email sent'
            })
            .catch((error) => {
                return error;
            })
        }
    });
}

const paginateResults = ({
    after: cursor,
    limit,
    results,
    getCursor = () => null,
}) => {

    if(limit < 1) return [];

    if(!cursor) return results.slice(0, limit);

    const cursorIndex = results.findIndex(item => {
        let itemCursor = item.id ? item.id : getCursor(item);

        return itemCursor ? cursor === itemCursor : false;

    });


    return cursorIndex >= 0 
        ? cursorIndex === results.length -1
            ? []
            : results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + limit))
        : results.slice(0, limit)
}




export const resolvers = {
    Query: {
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
        
        getUserByEmail: async (parent, {email}) => {
            await dbConnect();
            return new Promise((resolve, rejects) => {
                Users.findOne({email: email}, (err, user) => {
                    if(err || !user) rejects('No se encuentra el usuario');
                    else resolve(user)
                })
            })
        }
    },
    Mutation: {
        createUser: async (parent, {input}) => {
            await dbConnect();
            
            const emailAlreadyExist = await Users.findOne({
                email: input.email
            });

            if (emailAlreadyExist) {
                throw new Error('El email ya existe!')
            }

            const newUser = await new Users({
                firstname: input.firstname,
                lastname: input.lastname,
                email: input.email,
                password: input.password,
                img: '',
                isAdmin: false,
                isConfirmated: false
            }).save();

            createEmailToken(newUser, process.env.SECRET_EMAIL_TOKEN, '1d', sgMail);

            return `Gracias por registrarte ${input.firstname}, se te ha enviado un correo de confirmación para que actives tu cuenta de PROFEPACO.`;
        },
        
        addCourse: async (parent, {input}) => {
            await dbConnect();
            
            const newCourse = await new Courses({
                title: input.title,
                teacher: input.teacher,
                description: input.description,
                objectives: input.objectives,
                conceptList: input.conceptList,
                enrollmentLimit: input.enrollmentLimit,
                enrollmentUsers: [],
                price: input.price
            }).save();

            return 'Curso creado!';
        },

        insertUserInCourse: async (parent, {email, id}) => {
            await dbConnect();

            const user = await Users.findOne({email: email});

            if(!user) {
                throw new Error('User no found')
            }

            const course = await Courses.findOne({_id: id}, (err, data) => {
                try {
                    if (data) {
                        return data
                    }
                } catch (error) {
                    return error;
                }
            })

            course.enrollmentUsers.push(user);
            course.save();

            return 'Document updated'
        },

        deleteCourseByTitle: async (parent, {title}) => {
            await dbConnect();
            
            return new Promise((resolve, rejects) => {
                Courses.findOneAndRemove({title: title}, (error, doc) => {
                    if(error || !doc) {
                        rejects('No se puede eliminar ó no se encuentra el curso');
                    } else {
                        resolve('Se eliminó correctamente')
                    }
                });
            });
        },

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

        deleteUserByEmail: async (parent, {userEmail}) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                Users.findOneAndRemove({email: userEmail}, (error, user) => {
                    if(error || !user) rejects('No se cuentra el usuario');
                    else resolve('Se eliminó correctamente')
                })
            })

        },

        createPreferenceMercadoPago: async (parent, {title, price, firstname, lastname, email}) => {
            let payer = {
                name: firstname,
                surname: lastname,
                email: email
            }

            let preference = {
                items: [
                    {
                        title: title,
                        unit_price: parseInt(price),
                        quantity: 1,
                        category_id: 'learnings',
                        currency_id: 'MXN'
                    }
                ],
                payer: payer,
                payment_methods: {
                    installments: 3
                },
                notification_url: 'http://localhost:3000/api/webhook',
                statement_descriptor: 'PROFEPACO',
            }

            const preferenceItem = await mercadopago.preferences.create(preference, payer)
            .then(function(response) {
                return response.body.init_point
            }).catch(function(error) {
                return error
            })

            return (preferenceItem);

        }
    }
}
