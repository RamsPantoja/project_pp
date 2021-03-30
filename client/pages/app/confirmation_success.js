import React, { useEffect } from 'react'
import styles from '../styles/confirmation_success.module.css';
import Link from 'next/link'
import { Fragment } from 'react';
import Head from 'next/head';
import { signOut } from 'next-auth/client';

const ConfirmationSuccess = ({token}) => {

    if (token &&  typeof window !== 'undefined') {
        signOut({redirect: false});
    }

    return (
        <Fragment>
            <Head>
                <title>Confirmation success | Profe Paco</title>
            </Head>
            <div className={styles.sucessContainer}>
                <div className={styles.successCard}>
                    <h2>¡Success!</h2>
                    <p>Gracias por confirmar tu cuenta de PROFEPACO, cierra la ventana o haz click aquí para ir a la página de inicio:</p>
                    <Link href='/'><a className={styles.linkToSignIn}>Ir a inicio</a></Link>
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
        props: {
            token: token
        }
    }
}

export default ConfirmationSuccess;