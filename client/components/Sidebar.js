import React from 'react';
import styles from './styles/Sidebar.module.css';
import Link from 'next/link'
import ActiveLink from './ActiveLink';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import PeopleIcon from '@material-ui/icons/People';

const Sidebar = () => {
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebarContainer_header}>
                <h1>|Profe/Paco|</h1>
            </div>
            <nav className={styles.navBar}>
                <ul className={styles.navBarList}>
                    <Link href='/app/admin/notifications' passHref><ActiveLink name={'Notificaciones'}/></Link>
                    <Link href='/app/admin/courses' passHref><ActiveLink name={'Cursos'}/></Link>
                    <Link href='/app/admin/users' passHref><ActiveLink name={'Alumnos'}/></Link>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar;