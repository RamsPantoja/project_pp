import { gql } from '@apollo/client'

export const CURRENT_USER = gql `
    query getUserAuth {
        getUserAuth {
            email
        }
    }
`