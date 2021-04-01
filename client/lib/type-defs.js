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
        preapproval_id: String
        status: String
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
        paymentUrl: String
        preapproval_plan_id: String
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
    
    type userInSuscription {
        payer_email: String
        reason: String
        last_charged_date: String
        status: String
        last_modified: String
        next_payment_date: String
        date_created: String,
        end_date: String,
        quotas: String,
        charged_quantity: Int,
        charged_amount: Float,
        preapproval_id: String
    }

    type enrollmentUserForSuscription {
        id: ID
        firstname: String
        lastname: String
        email: String
    }

    type Query {
        getUsers(limit: Int!, after: ID): PaginationInf!
        getCourses: [Course]
        getCourseById(id: ID!): Course
        getUserByEmail(email: String!): User
        getCoursesByUser(userEmail: String!): [Course]
        getUsersInSuscription(limit: Int!, offset: Int!, preapproval_plan_id: String!): [userInSuscription]
        getPreapproval(preapproval_id: String!, email: String!): [userInSuscription]
        getUserInCourseSuscriptionType(title: String!, preapproval_id: String!): enrollmentUserForSuscription
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
        amountMonths: Int!
    }

    type Mutation {
        createUser(input: inputUser!) : String
        addCourse(input: inputCourse!, img: inputImg!) : String
        insertUserInCourse(email: String!, id: ID!): String
        deleteCourseByTitle(title: String!, id: ID!, preapproval_plan_id: String!, modeSuscription: Boolean!): String
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
        cancelPreapproval(preapproval_id: String!): String
    }
`