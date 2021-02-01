import { gql } from 'apollo-server-express';

export const typeDefs = gql `
    type User {
        id: ID
        firstname: String
        lastname: String
        email: String
        password: String
        img: String
    }

    input inputUser {
        id: ID
        firstname: String!
        lastname: String!
        email: String!
        password: String!
        img: String
    }

    type Query {
        getUsers: [User]
    }

    type Mutation {
        createUser(input: inputUser) : String
    }
`