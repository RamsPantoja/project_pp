import React, {Fragment} from 'react';
import styles from '../styles/sign_in.module.css'
import Head from 'next/head'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LoginForm from '../../components/LoginForm';
import useAuthFormValidation from '../../components/hooks/handleAuthUserHook';
import {authUserSchema, validationSchema, disableSchema} from '../../components/hooks/handleAuthUserHook';
import { useMutation } from '@apollo/client';
import { ADMIN_AUTH } from '../../apollo/mutations';

const AdminSignIn = () => {
    const [state, handleOnChange, disable] = useAuthFormValidation(authUserSchema, validationSchema, disableSchema);
    const {email, password} = state;
    const [adminAuth, {data, error, loading}] = useMutation(ADMIN_AUTH,{
        variables: {
            email: email.value,
            password: password.value
        },
        onCompleted: async(data) => {
            localStorage.setItem('token', data.adminAuth.token);
        }
    });

    return (
        <Fragment>
            <Head>
                <title>Sign in Administrator</title>
            </Head>
            <div className={styles.sign_in}>
                <div className={styles.sign_in_center}>
                    <div className={styles.sign_in_card}>
                        <div className={styles.sign_inTitle}>
                            <AccountCircleIcon style={{fontSize:100}}/>
                            <p>Cuenta Admin</p>
                        </div>
                        <div className={styles.sign_in_form}>
                            <LoginForm
                            state={state}
                            handleOnChange={handleOnChange}
                            disable={disable}
                            entityAuth={adminAuth}
                            error={error}/>
                        </div>
                    </div>
                </div>
            </div>  
        </Fragment>
    )
}

export default AdminSignIn;