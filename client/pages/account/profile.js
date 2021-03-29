import React from 'react';
import Layout from '../../components/Layout';
import LayoutAccount from '../../components/LayoutAccount';
import styles from './styles/profile.module.css';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_EMAIL } from '../../apollo/querys';
import EditProfile from '../../components/EditProfile';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router'
import Head from 'next/head';
import { CircularProgress } from '@material-ui/core';

const stateSchema = {
    firstname: { value: '', errorfield: false},
    lastname: { value: '', errorfield: false},
    email: { value: '', errorfield: false}
}

const disableSchema = {
    status: true,
    error: ''
}

const validationSchema = {
    firstname: { required: true},
    lastname: { required: true},
    email: { required: true},
}

const Profile = ({userEmail}) => {
    const {data, loading, error} = useQuery(GET_USER_BY_EMAIL, {
        variables: {
            email: userEmail
        }
    })

    if(loading) {
        return (
            <Layout>
                <Head>
                    <title>Perfil | Profe Paco</title>
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
                <title>Perfil | Profe Paco</title>
            </Head>
            <LayoutAccount userName={firstname}>
                <div className={styles.profileContainer}>
                    <h3>Perfil</h3>
                    <p>Tu información de perfil, es la información que verán los administradores para identificarte.</p>
                    <p style={{color: '#ff9800'}}>Nota: Al actualizar tu perfil, se cerrará la sesión actual en 3 segundos.</p>
                    <EditProfile
                    validationSchema={validationSchema}
                    disableSchema={disableSchema}
                    user={data.getUserByEmail}
                    stateSchema={stateSchema}/>
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
                destination: '/',
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

export default Profile;