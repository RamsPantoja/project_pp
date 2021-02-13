import React from 'react';
import styles from './styles/Sidebar.module.css';
import Link from 'next/link'

const Sidebar = () => {
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebarContainer_header}>
                <h1>|Profe/Paco|</h1>
            </div>
            <nav className={styles.navBar}>
                <ul className={styles.navBarList}>
                    <Link href='/app/admin/notifications'><a className={styles.navBarLink}>Notificaciones</a></Link>
                    <Link href='/app/admin/courses'><a className={styles.navBarLink}>Cursos</a></Link>
                    <Link href='/app/admin/users'><a className={styles.navBarLink}>Alumnos</a></Link>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar;