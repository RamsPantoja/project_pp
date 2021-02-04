import React, { Fragment } from 'react';
import Head from 'next/head';
import styles from '../styles/sign_in.module.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LoginForm from '../../components/LoginForm';
import { useRouter } from 'next/router';
import useAuthFormValidation, { authUserSchema, disableSchema, validationSchema } from '../../components/hooks/handleAuthUserHook'
import { USER_AUTH } from '../../apollo/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { CURRENT_USER } from '../../apollo/querys';

const SignIn = () => {
    const router = useRouter();
    const {data: userData, error: userError, loading: userLoading, refetch: userRefetch} = useQuery(CURRENT_USER);
    const [state, handleOnChange, disable] = useAuthFormValidation(authUserSchema, validationSchema, disableSchema);
    const {email, password} = state;
    const [userAuth, {data, error, loading}] = useMutation(USER_AUTH, {
        variables: {
            email: email.value,
            password: password.value
        },
        onCompleted: async (data) => {
            localStorage.setItem('token', data.userAuth.token);
            await userRefetch();
            router.push('/')
        }
    })

    return (
        <Fragment>
            <Head>
                <title>Sign in</title>
            </Head>
            <div className={styles.sign_in}>
                <div className={styles.sign_in_center}>
                    <div className={styles.sign_in_card}>
                        <div className={styles.sign_inTitle}>
                            <AccountCircleIcon style={{fontSize:100}}/>
                            <p>Cuenta Usuario</p>
                        </div>
                        <div className={styles.sign_in_form}>
                            <LoginForm
                            state={state}
                            handleOnChange={handleOnChange}
                            disable={disable}
                            userAuth={userAuth}
                            error={error}/>
                        </div>
                    </div>
                </div>
            </div>  
        </Fragment>

    )
}

export default SignIn;