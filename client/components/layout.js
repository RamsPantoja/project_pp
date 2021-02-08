import React, { useState, useEffect } from 'react';
import styles from './styles/Layout.module.css'
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '../apollo/querys';
import DropDownUser from './DropdownUser';
import ButtonsInUp from '../components/ButtonsInUp';
import { useAuth } from './hooks/useAuth';

const Layout = ({children}) => {
    const {isUser} = useAuth();
    
    const isMenu = isUser ? <DropDownUser/> : <ButtonsInUp/>
    


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
                        {isMenu}
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