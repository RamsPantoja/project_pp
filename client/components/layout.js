import React, { Fragment } from 'react';
import styles from './styles/Layout.module.css'
import Link from 'next/link';

const Layout = ({children}) => {
    return (
        <div className={styles.app_container}>
            <header className={styles.header}>
                <div className={styles.header_site}>
                    <h1 className={styles.logo_fit}><Link href='/'><a>|Profe/Paco|</a></Link></h1>
                    <div className={styles.header_links}>
                        <Link href='/courses'><a className={styles.header_linkInf}>Cursos</a></Link>
                        <Link href='/about'><a className={styles.header_linkInf}>Sobre nosotros</a></Link>
                        <Link href='/contact'><a className={styles.header_linkInf}>Contacto</a></Link>
                        <p>|</p>
                        <Link href='/app/sign_up'><a className={styles.header_link}>Crear cuenta</a></Link>
                        <Link href='/app/sign_in'><a className={styles.header_link}>Iniciar sesión</a></Link>
                    </div>
                </div>
            </header>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}

export default Layout;