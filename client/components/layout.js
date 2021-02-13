import React from 'react';
import styles from './styles/Layout.module.css'
import Link from 'next/link';
import DropDownUser from './dropdownUser';
import ButtonsInUp from '../components/ButtonsInUp';
import { useSession } from 'next-auth/client';

const Layout = ({children}) => {
    const [session, loading] = useSession();
    const isMenu = session ? <DropDownUser userAuthEmail={session.user.email}/> : <ButtonsInUp/>

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
                        <div className={`nojs-show ${(!session && loading) ? styles.loading : styles.loaded}`}>
                            {isMenu}
                        </div>
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