import { useQuery } from '@apollo/client';
import { Button, CircularProgress } from '@material-ui/core';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import React from 'react';
import { GET_USER_BY_EMAIL } from '../../apollo/querys';
import Layout from '../../components/Layout';
import LayoutAccount from '../../components/LayoutAccount';
import styles from './styles/courses.module.css';

const Courses = ({userEmail}) => {
    const {data, loading, error} = useQuery(GET_USER_BY_EMAIL, {
        variables: {
            email: userEmail
        }
    })

    if(loading) {
        return (
            <Layout>
                <Head>
                    <title>Cuenta | Profe Paco</title>
                </Head>
                <div className={styles.centerCircularProgress}>
                    <CircularProgress/>
                </div>
            </Layout>
        )
    }

    const {firstname} = data.getUserByEmail;

    return (
        <Layout>
            <Head>
                <title>Tus cursos | Profe Paco</title>
            </Head>
            <LayoutAccount userName={firstname}>
                <div className={styles.coursesContainer}>
                    <h3>Tus cursos</h3>
                    <div className={styles.courseMiniCard}>
                        <h4>Curso básico de Python</h4>
                        <p>Bertha Alicia</p>
                        <p>Pagado:750/1500</p>
                        <Button variant='contained' size='small' style={{background: '#15639d', color: '#ffffff'}}>Pagar</Button>
                    </div>
                </div>
            </LayoutAccount>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const session = await getSession({req});
    if(!session && req) {
        return {
            redirect: {
                destination: '/app/signin',
                permanent: false
            }
        }
    }

    return {
        props: {
            userEmail: session.user.email
        }
    }
}

export default Courses;