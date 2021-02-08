import { gql } from '@apollo/client'

export const CURRENT_USER = gql `
    query getUserAuth {
        getUserAuth {
            email
        }
    }
`

export const GET_COURSES = gql `
    query getCourses {
        getCourses {
            id
            title
            price
            enrollmentLimit
            teacher
        }
    }
`

export const GET_COURSE_BY_ID = gql `
    query getCourseById($id: ID) {
        getCourseById(id: $id) {
            title
            description
            objectives
            conceptList {
                concept
                subConceptList
            }
            price
        }
    }
`