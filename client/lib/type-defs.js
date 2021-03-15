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
        isConfirmated: Boolean
        payment: Int
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
        price: Float
        coverImg: CoverImg,
        modeSuscription: modeSuscription
    }

    type modeSuscription {
        isActivated: Boolean
        amountMonths: Int
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
        getCoursesByUser(userEmail: String!): [Course]
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
        price: Float!
        modeSuscription: inputSuscription!
    }

    input inputSuscription {
        isActivated: Boolean
        amountMonths: Int
    }

    input inputImg {
        filename: String!
        mimetype: String!
        url: String!
    }

    input inputPreapproval {
        title: String!
        price: Float!
        email: String!
    }

    type Mutation {
        createUser(input: inputUser!) : String
        addCourse(input: inputCourse!, img: inputImg!) : String
        insertUserInCourse(email: String!, id: ID!): String
        deleteCourseByTitle(title: String!, id: ID!): String
        deleteUserInCourse(id: ID!, userEmail: String!): String
        deleteUserByEmail(userEmail: String!): String
        createPreferenceMercadoPago(title: String!, price: Float!, firstname: String!, lastname: String!, email: String!, coverImg: String!): String
        sendEmailConfirmation(email: String!): String
        resetPassword(email: String!, currentPassword: String!, newPassword: String!): String
        updateUserProfile(id: ID!, email: String!, firstname: String!, lastname: String!): String
        updateCourse(input: inputCourse!, id: ID!): String
        recoveryPassword(email: String!): String
        resetPasswordRecovery(id: ID!, newPassword: String!): String
        createPreapprovalPreferenceMercadoPago(input: inputPreapproval!): String
    }
`