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

    type Token {
        token: String!
    }
    type Query {
        getUsers: [User]
        getUserAuth: User
    }

    type Mutation {
        createUser(input: inputUser) : String
        userAuth(email: String!, password: String!) : Token
    }
`