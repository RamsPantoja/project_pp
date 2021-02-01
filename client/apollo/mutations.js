import { gql } from '@apollo/client'

export const CREATE_USER = gql `
    mutation CreateUserForm($input: inputUser) {
        createUser(input: $input)
    }
`;