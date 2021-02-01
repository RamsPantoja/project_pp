import React, { Fragment } from 'react';
import Head from 'next/head';
import styles from '../styles/sign_in.module.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LoginForm from '../../components/LoginForm';

const SignIn = () => {
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
                            <LoginForm/>
                        </div>
                    </div>
                </div>
            </div>  
        </Fragment>

    )
}

export default SignIn;