import mongoose from 'mongoose';
import { Users } from './db';

export const resolvers = {
    Query: {
        getUsers: (parent) => {
            return Users.find({});
        }
    },
    Mutation: {
        createUser: async (root, {input}) => {
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
                img: input.email
            }).save();

            return `Gracias por registrarte ${input.firstname}, ya puedes iniciar sesion con tu nueva cuenta.`
        }
    }
}