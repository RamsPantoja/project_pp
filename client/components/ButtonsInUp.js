import React, { Fragment } from 'react';
import Link from 'next/link';
import styles from './styles/ButtonsInUp.module.css';

const ButtonsInUp = () => {
    return (
        <Fragment>
            <Link href='/app/sign_up'><a className={styles.header_link}>Crear cuenta</a></Link>
            <Link href='/app/sign_in'><a className={styles.header_link}>Iniciar sesión</a></Link>
        </Fragment>
    )
}

export default ButtonsInUp;