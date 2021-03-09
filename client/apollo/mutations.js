import { gql } from '@apollo/client'

export const CREATE_USER = gql `
    mutation CreateUserForm($input: inputUser!) {
        createUser(input: $input)
    }
`;

export const INSERT_USER_IN_COURSE = gql `
    mutation InsertUserInCourse($email: String!, $id: ID!) {
        insertUserInCourse(email: $email, id: $id)
    }
`

export const ADD_COURSE = gql `
    mutation createCourse($input: inputCourse!, $img: Upload!) {
        addCourse(input: $input, img: $img)
    }
`

export const DELETE_COURSE = gql `
    mutation DeleteCourseByTitle($title: String!, $id: ID!) {
        deleteCourseByTitle(title: $title, id: $id)
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

export const CREATE_PREFERENCE_MERCADO_PAGO = gql `
    mutation CreatePreferenceMercadoPago($title: String!, $price: Int!, $firstname: String!, $lastname: String!, $email: String!, $coverImg: String!) {
        createPreferenceMercadoPago(title: $title, price: $price, firstname: $firstname, lastname: $lastname, email: $email, coverImg: $coverImg)
    }
`

export const SEND_EMAIL_CONFIRMATION = gql `
    mutation SendEmailConfirmation($email: String!) {
        sendEmailConfirmation(email: $email)
    }
`

export const RESET_PASSWORD_ACCOUNT = gql `
    mutation ResetPasswordAccount($email: String!, $currentPassword: String!, $newPassword: String!) {
        resetPassword(email: $email, currentPassword: $currentPassword, newPassword: $newPassword)
    }
`

export const UPDATE_USER_PROFILE = gql `
    mutation UpdateUserProfile($id: ID!, $email: String!, $firstname: String!, $lastname: String!) {
        updateUserProfile(id: $id, email: $email, firstname: $firstname, lastname: $lastname)
    }
`

export const UPDATE_COURSE = gql `
    mutation UpdateCourse($input: inputCourse!, $id: ID!) {
        updateCourse(input: $input, id: $id)
    }
`

export const RECOVERY_PASSWORD = gql `
    mutation RecoveryPassword($email: String!) {
        recoveryPassword(email: $email)
    }
`

export const RESET_PASSWORD_RECOVERY = gql `
    mutation ResetPasswordRecovery($id: ID!, $newPassword: String!) {
        resetPasswordRecovery(id: $id, newPassword: $newPassword)
    }
`