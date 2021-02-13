import React from 'react';
import styles from './styles/HeaderAdmin.module.css';
import DropDownUser from './dropdownUser';
import { useSession } from 'next-auth/client';

const HeaderAdmin = () => {
    const [session, loading] = useSession();
    const isDropDown = session ? <DropDownUser userAuthEmail={session.user.email}/> : null;
    return (
        <div className={styles.headerAdminContainer}>
            <h2>Panel de control</h2>
            <div className={`nojs-show ${(!session && loading) ? styles.loading : styles.loaded}`}>
                {isDropDown}
            </div>
        </div>
    )
}

export default HeaderAdmin;