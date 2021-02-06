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

    type Course {
        id: ID
        title: String
        teacher: String
        description: String
        objectives: [String]
        conceptList: [Concept]
        enrollmentLimit: Int
        enrollmentUsers: [User]
        price: Int
    }

    type Concept {
        concept: String
        subConceptList: [String]
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
        getCourses: [Course]
    }

    input inputConcept {
        concept: String!
        subConceptList: [String!]
    }

    input inputCourse {
        id: ID
        title: String!
        teacher: String!
        description: String!
        objectives: [String!]
        conceptList: [inputConcept!]
        enrollmentLimit: Int!
        price: Int!
    }

    type Mutation {
        createUser(input: inputUser) : String
        userAuth(email: String!, password: String!) : Token
        addCourse(input: inputCourse) : Course
    }
`