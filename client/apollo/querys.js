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
    query getCourseById($id: ID) {
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
    query getAllUsers {
        getUsers {
            id
            firstname
            lastname
            email
        }
    }
`