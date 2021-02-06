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