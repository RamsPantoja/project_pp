import mongoose from 'mongoose';
import { Courses, Users } from './db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({path: 'variables.env'});

const createUserToken = (entity, SECRET, expiresIn) => {
    const {email} = entity

    return jwt.sign({email}, SECRET, {expiresIn});
}

export const resolvers = {
    Query: {
        getUsers: (parent) => {
            return Users.find({});
        },
        getUserAuth: async (parent, args, context) => {
            if(!context.getUserEmail){
                return null
            }

            const user = await Users.findOne({email: context.getUserEmail.email});
            return user;
        },
        getCourses: (parent) => {
            return Courses.find({});
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
        userAuth: async (parent, {email, password}) => {
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

            return {token: createUserToken(user, process.env.SECRET, '1h')}
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
        }
    }
}