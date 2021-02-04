import "@babel/polyfill";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './data/resolvers';
import { typeDefs } from './data/schema';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config({path: 'variables.env'});

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        const token = req.headers.authorization || '';
        if(token !== "null") {
            try {
                const getUserEmail = await jwt.verify(token, process.env.SECRET);
                req.getUserEmail = getUserEmail;
                console.log(getUserEmail)
                return {getUserEmail}
            } catch (error) {
                console.log(error);
            }
        }
    }
});

server.applyMiddleware({app});

app.get('/', (req, res) => {
    res.status(200).send('Hello Ramir0');
})


app.listen({port:4200}, () => console.log(`🚀 Server is running`));