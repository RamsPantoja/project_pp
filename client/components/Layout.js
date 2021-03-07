import React from 'react';
import styles from './styles/Layout.module.css'
import Link from 'next/link';
import DropDownUser from './dropdownUser';
import ButtonsInUp from './ButtonsInUp';
import { useSession } from 'next-auth/client';
import ActiveLinkLayout from './ActiveLinkLayout';

const Layout = ({children}) => {
    const [session, loading] = useSession();
    const isMenu = session ? <DropDownUser userAuthEmail={session.user.email}/> : <ButtonsInUp/>

    return (
        <div className={styles.app_container}>
            <header className={styles.header}>
                <div className={styles.header_site}>
                    <h1 className={styles.logo_fit}><Link href='/'><a>|Profe/Paco|</a></Link></h1>
                    <div className={styles.header_links}>
                        <Link href='/courses' passHref><ActiveLinkLayout name={'Cursos'}/></Link>
                        <Link href='/about' passHref><ActiveLinkLayout name={'Sobre nosotros'}/></Link>
                        <Link href='/contact' passHref><ActiveLinkLayout name={'Contacto'}/></Link>
                        <p>|</p>
                        <div className={`${(!session && loading) ? styles.loading : styles.loaded}`}>
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
