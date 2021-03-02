import { getSession } from 'next-auth/client';
import React from 'react';
import Layout from '../../components/Layout';
import LayoutAccount from '../../components/LayoutAccount';
import styles from './styles/account.module.css';
import EditEmailAccount from '../../components/EditEmailAccount';
import EditPasswordAccount from '../../components/EditPasswordAccount';

const stateSchemaEmail = {
    email: {value: '', error: '' , errorfield: false}
}

const stateSchemaPassword = {
    currentPassword: {value: '', errorfield: false},
    newPassword: {value: '', errorfield: false},
    confirmNewPassword: {value: '', errorfield: false}
}

const validationSchemaEmail = {
    email: {required: true}
}

const validationSchemaPassword = {
    currentPassword: {required: true},
    newPassword: {required: true},
    confirmNewPassword: {required: true}
}

const disableSchema = {
    status: true,
    error: ''
}

const Account = ({userEmail}) => {
    return (
        <Layout>
            <LayoutAccount>
                <div className={styles.accountContainer}>
                    <div className={styles.confirmationEmailAccount}>
                        <h4>Confirmación de email</h4>
                        <p>Al presionar el boton de "Confirmar email", se te enviara un correo a tu dirección de correo electrónico con el link para confirmar tu correo.</p>
                        <EditEmailAccount 
                        stateSchema={stateSchemaEmail}
                        validationSchema={validationSchemaEmail}
                        disableSchema={disableSchema}
                        user={userEmail}/>
                    </div>
                    <div className={styles.resetPassword}>
                        <h4>Restablecer contraseña</h4>
                        <p>Al restablecer tu contraseña, tendras que iniciar sesión con tu nueva contraseña, por lo tanto, no olvides tu nueva contraseña.</p>
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