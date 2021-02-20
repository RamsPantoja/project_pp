import { gql } from '@apollo/client'

export const GET_COURSES = gql `
    query getCourses {
        getCourses {
            id
            title
            price
            enrollmentLimit
            teacher
            enrollmentUsers {
                id
            }
        }
    }
`

export const GET_COURSE_BY_ID = gql `
    query getCourseById($id: ID!) {
        getCourseById(id: $id) {
            title
            teacher
            description
            objectives
            conceptList {
                concept
                subConceptList
            }
            price
            enrollmentUsers {
                firstname
                lastname
                email
            }
        }
    }
`

export const GET_ALL_USERS = gql `
    query getAllUsers($limit: Int!, $after: ID) {
        getUsers(limit: $limit, after: $after) {
            id
            firstname
            lastname
            email
        }
    }
`

export const GET_USER_BY_EMAIL = gql `
    query GetUserByEmail($email: String!) {
        getUserByEmail(email: $email) {
            id
            email
            firstname
            lastname
        }
    }
`