import { gql } from '@apollo/client';

export const typeDefs = gql `
    scalar Upload

    type User {
        id: ID
        firstname: String
        lastname: String
        email: String
        password: String
        img: String
        isAdmin: Boolean
        isConfirmated: Boolean
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
        coverImg: CoverImg
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

    type PaginationInf {
        users: [User]!
        totalUsers: Int
    }

    type CoverImg {
        filename: String
        mimetype: String
        url: String
    }
    
    type Query {
        getUsers(limit: Int!, after: ID): PaginationInf!
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
        createUser(input: inputUser!) : String
        addCourse(input: inputCourse!, img: Upload!) : String
        insertUserInCourse(email: String!, id: ID!): String
        deleteCourseByTitle(title: String!, id: ID!): String
        deleteUserInCourse(id: ID!, userEmail: String!): String
        deleteUserByEmail(userEmail: String!): String
        createPreferenceMercadoPago(title: String!, price: Int!, firstname: String!, lastname: String!, email: String!, coverImg: String!): String
        sendEmailConfirmation(email: String!): String
        resetPassword(email: String!, currentPassword: String!, newPassword: String!): String
        updateUserProfile(id: ID!, email: String!, firstname: String!, lastname: String!): String
        updateCourse(input: inputCourse!, id: ID!): String
        recoveryPassword(email: String!): String
        resetPasswordRecovery(id: ID!, newPassword: String!): String
    }
`