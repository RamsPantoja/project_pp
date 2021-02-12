import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import dbConnect from '../../../lib/dbConnect';
import Users from '../../../models/Users';
import bcrypt from 'bcrypt';
import { signIn } from 'next-auth/client';

const getUser = async (credentials) => {
    await dbConnect();
    const user = await Users.findOne({email: credentials.email});
                       
    if(!user) {
        throw new Error('Email or password is invalid');
    }
        
    const userPassword = await bcrypt.compare(credentials.password, user.password);
        
    if(!userPassword) {
        throw new Error('Email or password is invalid');
    }
    
    return user;
}

const options = {
    providers: [
        Providers.Credentials({
            name: 'Cuenta Usuario',
            credentials: {
                email: {type: 'text', placeholder: 'Email'},
                password: {type: 'password', placeholder: 'Contraseña'}
            },
            authorize: async (credentials) => {
                const user = await getUser(credentials);

                if (user) {
                    return Promise.resolve(user);
                } else {
                    return Promise.resolve(null);
                }
            }
        }),
    ],
    pages: {
        signIn: '../../app/signin',
        error: '../../app/signin'
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    }
}

export default (req, res) => NextAuth(req, res, options);