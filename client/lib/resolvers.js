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
            const users = await Users.find({});
            return users.filter((user) =>  user.isAdmin === false);

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
            }).save();

            return `Gracias por registrarte ${input.firstname}, ya puedes iniciar sesion con tu nueva cuenta.`
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
                enrollmentUers: [],
                price: input.price
            }).save();

            return newCourse;
        }
    }
}