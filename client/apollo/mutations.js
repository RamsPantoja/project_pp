import { gql } from '@apollo/client'

export const CREATE_USER = gql `
    mutation CreateUserForm($input: inputUser) {
        createUser(input: $input)
    }
`;

export const INSERT_USER_IN_COURSE = gql `
    mutation InsertUserInCourse($email: String!, $id: ID!) {
        insertUserInCourse(email: $email, id: $id)
    }
`

export const ADD_COURSE = gql `
    mutation createCourse($input: inputCourse) {
        addCourse(input: $input)
    }
`

export const DELETE_COURSE = gql `
    mutation DeleteCourseByTitle($title: String!) {
        deleteCourseByTitle(title: $title)
    }
`

export const DELETE_USER_IN_COURSE = gql `
    mutation DeleteUserInCourse($id: ID!, $userEmail: String!) {
        deleteUserInCourse(id: $id, userEmail: $userEmail)
    }
`

export const DELETE_USER_BY_EMAIL = gql `
    mutation DeleteUserByEmail($userEmail: String!) {
        deleteUserByEmail(userEmail: $userEmail)
    }
`
