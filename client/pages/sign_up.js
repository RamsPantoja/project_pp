import React, { Fragment } from 'react';
import Head from 'next/head';
import styles from './styles/sign_up.module.css';

const SignUp = () => {
    return (
        <Fragment>
            <Head>
                <title>Sign Up</title>
            </Head>
            <div className={styles.signUp}>
                <div></div>
            </div>
        </Fragment>
    )
}

export default SignUp;