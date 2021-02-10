import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from './dbConnect';
import Users from '../models/Users';
import Courses from '../models/Courses';
import Admins from '../models/Admins';
import {serialize, parse} from 'cookie';


//Crea el token para enviarlo a las headers atraves de la cookie.
const createUserToken = (entity, SECRET, expiresIn) => {
    const createdAt = Date.now();
    const {email} = entity
    const obj = {email, createdAt, maxAge: 3600}
    return jwt.sign(obj, SECRET, {expiresIn});
}

export const parseCookies = (req) => {
    if(req.cookies) return req.cookies

    const cookie = req.headers?.cookie
    return parse(cookie || '');
}

export const getTokenCookie = (req) => {
    const cookies = parseCookies(req);
    return cookies['authToken']
}

export const resolvers = {
    Query: {
        getUsers: async (parent) => {
            await dbConnect();
            return Users.find({});
        },

        getUserAuth: async (parent, args, context) => {
            
            const token = await getTokenCookie(context.req);

            if (!token) return null;

            const userSession = await jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if(!err && decoded) {
                    return decoded
                }
            });

            const expiresAt = userSession.createdAt + userSession.maxAge * 1000; 

            if (Date.now() > expiresAt) {
                throw new Error('Session expired');
            }

            const user = await Users.findOne({email: userSession.email}, (err, data) => {
                if(err) {
                    throw new Error('Usuario no encontrado')
                }

                return data;
            });

            return user;

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
        }
    },
    Mutation: {
        createUser: async (parent, {input}) => {
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
                img: ''
            }).save();

            return `Gracias por registrarte ${input.firstname}, ya puedes iniciar sesion con tu nueva cuenta.`
        },

        userAuth: async (parent, {email, password}, context) => {
            await dbConnect();
            const user = await Users.findOne({email: email});

            if(!user) {
                throw new Error('El email o contraseña son incorrectos');
            } else if (user.isconfirmated === false) {
                throw new Error('El usuario no ha sido confirmado');
            }

            const userPassword = await bcrypt.compare(password, user.password);

            if (!userPassword) {
                throw new Error('El email o contraseña son incorrectos')
            }

            const token = await createUserToken(user, process.env.SECRET, '1h');

            const cookie = await serialize('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 3600,
                path: '/'
            });

            context.res.setHeader('Set-Cookie', cookie);

            return 'The token has been setup'
        },

        addCourse: async (parent, {input}) => {
            const newCourse = await new Courses({
                title: input.title,
                teacher: input.teacher,
                description: input.description,
                objectives: input.objectives,
                conceptList: input.conceptList,
                enrollmentLimit: input.enrollmentLimit,
                enrollmentUers: [],
                price: input.price
            }).save();

            return newCourse;
        },

        adminAuth: async (parent, {email, password}) => {
            const user = await Admins.findOne({email: email});

            if(!user) {
                throw new Error('El email ó contraseña son incorrectos')
            } else if (!user.isAdmin) {
                throw new Error('No tienes los permisos para acceder')
            }

            if (password !== user.password) {
                throw new Error('El email ó contraseña son incorrectos');
            }

            return {token: createUserToken(user, process.env.SECRET, '1h')}
        }
    }
}