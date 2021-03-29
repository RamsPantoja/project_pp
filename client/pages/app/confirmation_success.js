import React from 'react'
import styles from '../styles/confirmation_success.module.css';
import Link from 'next/link'
import { Fragment } from 'react';
import Head from 'next/head';

const ConfirmationSuccess = () => {
    return (
        <Fragment>
            <Head>
                <title>Confirmation success | Profe Paco</title>
            </Head>
            <div className={styles.sucessContainer}>
                <div className={styles.successCard}>
                    <h2>¡Success!</h2>
                    <p>Gracias por confirmar tu cuenta de PROFEPACO, haz click aquí para iniciar sesión:</p>
                    <Link href='/app/signin'><a className={styles.linkToSignIn}>Iniciar sesión</a></Link>
                </div>
            </div>            
        </Fragment>
    )
}

export async function getServerSideProps({query}) {
    const token = query.token;
    if(!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}

export default ConfirmationSuccess;