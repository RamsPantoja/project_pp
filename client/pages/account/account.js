import { getSession } from 'next-auth/client';
import React from 'react';
import Layout from '../../components/Layout';
import LayoutAccount from '../../components/LayoutAccount';
import styles from './styles/account.module.css';
import EditEmailAccount from '../../components/EditEmailAccount';
import EditPasswordAccount from '../../components/EditPasswordAccount';
import { stateSchemaEmail, validationSchemaEmail } from '../../components/hooks/handleEditAccountFormEmailHook';
import { disableSchema, stateSchemaPassword, validationSchemaPassword } from '../../components/hooks/handleEditAccountFormPasswordHook';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_EMAIL } from '../../apollo/querys';
import Head from 'next/head';
import { CircularProgress } from '@material-ui/core';
import IsConfirmated from '../../components/IsConfirmated';

const Account = ({userEmail}) => {
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

    const {firstname, isConfirmated} = data.getUserByEmail;

    const componentIsConfirmated = isConfirmated ? <IsConfirmated/> :  <div className={styles.confirmationEmailAccount}>
                                                                            <h4>Confirmación de email</h4>
                                                                            <p>Al presionar el botón de "Confirmar email", se te enviará un correo a tu dirección de correo electrónico con el link para confirmar tu correo.</p>
                                                                            <EditEmailAccount 
                                                                            stateSchema={stateSchemaEmail}
                                                                            validationSchema={validationSchemaEmail}
                                                                            disableSchema={disableSchema}
                                                                            user={userEmail}/>
                                                                        </div>;

    return (
        <Layout>
            <Head>
                <title>Cuenta | Profe Paco</title>
            </Head>
            <LayoutAccount userName={firstname}>
                <div className={styles.accountContainer}>
                    {componentIsConfirmated}
                    <div className={styles.resetPassword}>
                        <h4>Restablecer contraseña</h4>
                        <p>Al restablecer tu contraseña, tendrás que iniciar sesión con tu nueva contraseña, por lo tanto, no olvides tu nueva contraseña.</p>
                        <EditPasswordAccount
                        stateSchema={stateSchemaPassword}
                        validationSchema={validationSchemaPassword}
                        disableSchema={disableSchema}
                        user={userEmail}/>
                    </div>
                    <div className={styles.accountEmail}>
                        <h4>Email de cuenta</h4>
                        <p>{userEmail}</p>
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

export default Account;