import { gql } from '@apollo/client'

export const CREATE_USER = gql `
    mutation CreateUserForm($input: inputUser) {
        createUser(input: $input)
    }
`;

export const USER_AUTH = gql `
    mutation UserAuth($email: String!, $password: String!) {
        userAuth(email: $email, password: $password)
    }
`

export const ADMIN_AUTH = gql `
    mutation AdminAuth($email: String!, $password: String!) {
        adminAuth(email: $email, password: $password) {
            token
        }
    }
`