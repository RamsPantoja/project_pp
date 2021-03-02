import React from 'react'
import styles from '../styles/confirmation_success.module.css';
import Link from 'next/link'

const ConfirmationSuccess = () => {
    return (
        <div className={styles.sucessContainer}>
            <div className={styles.successCard}>
                <h2>Success!</h2>
                <p>Gracias por confirmar tu cuenta de PROFEPACO, haz click aqui para iniciar sesión: </p>
                <Link href='/app/signin'><a className={styles.linkToSignIn}>Iniciar sesión</a></Link>
            </div>
        </div>
    )
}

export default ConfirmationSuccess;