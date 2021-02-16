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