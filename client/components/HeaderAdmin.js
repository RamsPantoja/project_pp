import React from 'react';
import styles from './styles/HeaderAdmin.module.css';
import DropDownUser from './dropdownUser';

const HeaderAdmin = () => {
    return (
        <div className={styles.headerAdminContainer}>
            <h2>Panel de control</h2>
            <DropDownUser/>
        </div>
    )
}

export default HeaderAdmin;