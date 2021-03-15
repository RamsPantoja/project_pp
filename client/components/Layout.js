import React from 'react';
import styles from './styles/Layout.module.css'
import Link from 'next/link';
import DropDownUser from './dropdownUser';
import ButtonsInUp from './ButtonsInUp';
import { useSession } from 'next-auth/client';
import ActiveLinkLayout from './ActiveLinkLayout';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Layout = ({children}) => {
    const router = useRouter();
    const [session, loading] = useSession();
    const isMenu = session && !loading ? <DropDownUser userAuthEmail={session.user.email}/> : <ButtonsInUp session={session} loading={loading}/>

    return (
        <div className={styles.app_container}>
            <header className={styles.header}>
                <div className={styles.header_site}>
                    <div className={styles.logoContainer} onClick={() => router.push('/')}>
                        <Image src='/fav.png' alt='logotipo_profepaco' width={50} height={50} />
                    </div>
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
