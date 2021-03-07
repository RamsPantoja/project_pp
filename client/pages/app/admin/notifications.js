import { getSession } from 'next-auth/client';
import Head from 'next/head';
import React from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/notifications.module.css';

const Index = () => {
    return (
        <LayoutAdmin>
            <Head>
                <title>Notificaciones | Profe Paco</title>
            </Head>
            <div className={styles.notificationsContainer}>
                <h1>Index Notifications</h1>
            </div>
        </LayoutAdmin>
    )
}

export async function getServerSideProps({req}) {
    const session = await getSession({req});

    if ((!session || session.user.isAdmin !== true) && req) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default Index;