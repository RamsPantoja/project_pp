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
            coverImg {
                filename
                url
            }
            modeSuscription {
                isActivated
                amountMonths
                preapproval_plan_id
            }
            onePay
        }
    }
`

export const GET_COURSE_BY_ID = gql `
    query getCourseById($id: ID!) {
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
            enrollmentLimit
            enrollmentUsers {
                firstname
                lastname
                email
                payment
            }
            coverImg {
                filename
                url
            }
            modeSuscription {
                isActivated
                amountMonths
                paymentUrl
                preapproval_plan_id
            }
            onePay
        }
    }
`

export const GET_ALL_USERS = gql `
    query getAllUsers($limit: Int!, $after: ID) {
        getUsers(limit: $limit, after: $after) {
            users {
                id
                firstname
                lastname
                email
            }
            totalUsers
        }
    }
`

export const GET_USER_BY_EMAIL = gql `
    query GetUserByEmail($email: String!) {
        getUserByEmail(email: $email) {
            id
            email
            firstname
            lastname
            isConfirmated
        }
    }
`

export const GET_COURSES_BY_USER = gql `
    query GetCoursesByUser($userEmail: String!) {
        getCoursesByUser(userEmail: $userEmail) {
            id
            title
            teacher
            price
            enrollmentUsers {
              payment
              firstname
              lastname
              email
              preapproval_id
              status
            }
            coverImg {
                filename
                url
            }
            modeSuscription {
                isActivated
                amountMonths
            }
        }
    }
`

export const GET_USERS_IN_SUSCRIPTION = gql `
    query GetUsersInSuscription($limit: Int!, $offset: Int!, $preapproval_plan_id: String!) {
        getUsersInSuscription(limit: $limit, offset: $offset, preapproval_plan_id: $preapproval_plan_id) {
            payer_email
            status
            reason
            last_modified
            last_charged_date
            next_payment_date
            charged_quantity
            date_created
            end_date
            quotas
            charged_amount
            preapproval_id
        }
    }
`

export const GET_PREAPPROVAL = gql `
    query GetPreapproval($preapproval_id: String!, $email: String!) {
        getPreapproval(preapproval_id: $preapproval_id, email: $email) {
            payer_email
            status
            reason
            last_modified
            last_charged_date
            next_payment_date
            charged_quantity
            date_created
            end_date
            quotas
            charged_amount
        }
    }
`

export const GET_USER_IN_COURSE_SUCRIPTION_TYPE = gql `
    query GetUserInCourseSucriptionType($title: String!, $preapproval_id: String!) {
        getUserInCourseSuscriptionType(title: $title, preapproval_id: $preapproval_id) {
            firstname
            lastname
            email
        }
    }
`