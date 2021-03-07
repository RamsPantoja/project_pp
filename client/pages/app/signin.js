import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/sign_in.module.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LoginForm from '../../components/LoginForm';
import { useRouter } from 'next/router';
import useAuthFormValidation, { authUserSchema, disableSchema, validationSchema } from '../../components/hooks/handleAuthUserHook';
import { csrfToken, getSession } from 'next-auth/client'
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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
                <title>Sign In | Profe Paco</title>
            </Head>
            <div className={styles.sign_in}>
                <div className={styles.buttonToBack}>
                    <Button style={{color: '#ffffff'}} startIcon={<ArrowBackIosIcon/>} onClick={() => router.back()}>Volver</Button>
                </div>
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
                        <span className={styles.linkToRecoveryPassword}>Olvidaste tu contraseña? <Link href='/app/recovery_password'><a className={styles.linkToCreateAccount}>Click aquí</a></Link></span>
                    </div>
                </div>
            </div>  
        </Fragment>
    )
}

export async function getServerSideProps (context) {
    const session = await getSession({req: context.req});
    if(session && !context.req) {
        Router.replace('/');
    }

    if(session && context.req) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props:{
            csrfToken: await csrfToken(context)
        }
    }
}

export default SignIn;