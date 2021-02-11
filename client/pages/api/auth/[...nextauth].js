import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import dbConnect from '../../../lib/dbConnect';
import Users from '../../../models/Users';
import bcrypt from 'bcrypt';

const getUser = async (credentials) => {
    await dbConnect();
    const user = await Users.findOne({email: credentials.email});
                       
    if(!user) {
        throw new Error('El email ó contraseña son incorrectos')
    }
    
    const userPassword = await bcrypt.compare(credentials.password, user.password);
    
    if(!userPassword) {
        throw new Error('El email ó contraseña son incorrectos.')
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
                    return user;
                } else {
                    throw new Error ('El email ó contraseña son incorrectos')
                }
            }
        }),
    ],
}

export default (req, res) => NextAuth(req, res, options);