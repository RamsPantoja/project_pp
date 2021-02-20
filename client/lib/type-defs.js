import { gql } from '@apollo/client';

export const typeDefs = gql `
    type User {
        id: ID
        firstname: String
        lastname: String
        email: String
        password: String
        img: String
        isAdmin: Boolean
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

    type Query {
        getUsers(limit: Int!, after: ID): [User!]
        getCourses: [Course]
        getCourseById(id: ID!): Course
        getUserByEmail(email: String!): User
    }

    input inputConcept {
        concept: String!
        subConceptList: [String]!
    }

    input inputCourse {
        id: ID
        title: String!
        teacher: String!
        description: String!
        objectives: [String]!
        conceptList: [inputConcept]!
        enrollmentLimit: Int!
        price: Int!
    }

    type Mutation {
        createUser(input: inputUser) : String
        addCourse(input: inputCourse) : String
        insertUserInCourse(email: String!, id: ID!): String
        deleteCourseByTitle(title: String!): String
        deleteUserInCourse(id: ID!, userEmail: String!): String
        deleteUserByEmail(userEmail: String!): String
    }
`