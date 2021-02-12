import React, { Fragment } from 'react';
import Link from 'next/link';
import styles from './styles/ButtonsInUp.module.css';
import { signIn } from 'next-auth/client';

const ButtonsInUp = () => {
    return (
        <Fragment>
            <Link href='/app/sign_up'><a className={styles.header_link}>Crear cuenta</a></Link>
            <a onClick={() => signIn()} className={styles.header_link}>Iniciar sesión</a>
        </Fragment>
    )
}

export default ButtonsInUp;