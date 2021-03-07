import React from 'react';
import Link from 'next/link';
import styles from './styles/LayoutAccount.module.css';
import FaceIcon from '@material-ui/icons/Face';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import ActiveLink from './ActiveLink';

const LayoutAccount = ({children, userName}) => {

    return (
        <div className={styles.accountContainer}>
            <div className={styles.account}>
                <div className={styles.headerAccount}>
                    <h2>Hola @{userName}</h2>
                </div>
                <div className={styles.contentAccount}>
                    <nav className={styles.sidebarAccount}>
                        <Link href='/account/profile' passHref><ActiveLink name={'Perfil'}><FaceIcon style={{padding: '0 0.5em'}}/></ActiveLink></Link>
                        <Link href='/account/account' passHref><ActiveLink name={'Cuenta'}><AccountCircleIcon style={{padding: '0 0.5em'}}/></ActiveLink></Link>
                        <Link href='/account/courses' passHref><ActiveLink name={'Tus cursos'}><ListRoundedIcon style={{padding: '0 0.5em'}}/></ActiveLink></Link>
                    </nav>
                    <div className={styles.infAccount}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LayoutAccount;