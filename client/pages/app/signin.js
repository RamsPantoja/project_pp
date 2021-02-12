import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/sign_in.module.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LoginForm from '../../components/LoginForm';
import { useRouter } from 'next/router';
import useAuthFormValidation, { authUserSchema, disableSchema, validationSchema } from '../../components/hooks/handleAuthUserHook';
import { csrfToken } from 'next-auth/client'

const SignIn = ({csrfToken}) => {
    const [state, handleOnChange, disable] = useAuthFormValidation(authUserSchema, validationSchema, disableSchema);
    const router = useRouter();
    const [matchError, setMatchError] = useState('');
    const [isMatchErrorAlertActived, setIsMatchErrorAlertActived] = useState(false)

    useEffect(() => {
        const queryError = router.query.error;
        if(queryError) {
            setMatchError(queryError);
            setIsMatchErrorAlertActived(true)
        } else {
            setMatchError('');
            setIsMatchErrorAlertActived(false);
        }

    },[router]);

    const matchErrorAlert = isMatchErrorAlertActived ? <span className={styles.matchError}>{matchError}</span> : null;

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
                        {matchErrorAlert}
                        <div className={styles.sign_in_form}>
                            <LoginForm
                            state={state}
                            handleOnChange={handleOnChange}
                            disable={disable}
                            csrfToken={csrfToken}/>
                        </div>
                        <span className={styles.linkToSignUp}>Aun no tienes una cuenta? <Link href='/app/sign_up'><a className={styles.linkToCreateAccount}>Crear cuenta</a></Link></span>
                    </div>
                </div>
            </div>  
        </Fragment>
    )
}

SignIn.getInitialProps = async (context) => {
    return {
      csrfToken: await csrfToken(context)
    }
}

export default SignIn;