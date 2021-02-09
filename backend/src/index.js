import "@babel/polyfill";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './data/resolvers';
import { typeDefs } from './data/schema';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Courses } from "./data/db";
import cors from 'cors';
import bodyParser from 'body-parser';


dotenv.config({path: 'variables.env'});

const app = express();

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true // <-- REQUIRED backend setting
};

app.use(cors(corsOptions));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req, res}) => {
        console.log(req.headers.authorization)
    }
});

server.applyMiddleware({app});

app.get('/', (req, res) => {
    res.status(200).send('Hello Ramir0');
})

app.get('/courses', async (req, res) => {
    await Courses.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let courses = [];

            data.map((item) => {
                const courseId = {
                    id: item._id,
                    title: item.title
                }

                courses.push(courseId)
            });

            return res.status(200).send(courses);
        }
    })
})


app.listen({port:4200}, () => console.log(`🚀 Server is running`));