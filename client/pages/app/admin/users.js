import React from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/users.module.css';

const Users = () => {
    return (
        <LayoutAdmin>
            <div className={styles.usersContainer}>
                <h1>Alumnos</h1>
            </div>
        </LayoutAdmin>
    )
}

export default Users;