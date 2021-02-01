import "@babel/polyfill";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './data/resolvers';
import { typeDefs } from './data/schema';

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.applyMiddleware({app});

app.get('/', (req, res) => {
    res.status(200).send('Hello world');
})


app.listen({port:4200}, () => console.log(`🚀 Server is running`));