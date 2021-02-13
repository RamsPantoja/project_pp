import React from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/notifications.module.css';

const Index = () => {
    return (
        <LayoutAdmin>
            <div className={styles.notificationsContainer}>
                <h1>Index Notifications</h1>
            </div>
        </LayoutAdmin>
    )
}

export default Index;