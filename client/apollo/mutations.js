import { gql } from '@apollo/client'

export const CREATE_USER = gql `
    mutation CreateUserForm($input: inputUser) {
        createUser(input: $input)
    }
`;

export const USER_AUTH = gql `
    mutation UserAuth($email: String!, $password: String!) {
        userAuth(email: $email, password: $password) {
            token
        }
    }
`