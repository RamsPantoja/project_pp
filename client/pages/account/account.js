import { Button, TextField } from '@material-ui/core';
import { getSession } from 'next-auth/client';
import React from 'react';
import Layout from '../../components/Layout';
import LayoutAccount from '../../components/LayoutAccount';
import styles from './styles/account.module.css';

const Account = ({userEmail}) => {
    return (
        <Layout>
            <LayoutAccount>
                <div className={styles.accountContainer}>
                    <div className={styles.confirmationEmailAccount}>
                        <h4>Confirmación de email</h4>
                        <p>Al presionar el boton de "Confirmar email", se te enviara un correo a tu dirección de correo electronico, con el link para confirmar tu correo.</p>
                        <TextField size='small' variant='outlined' label='Email' name='email'/>
                        <Button size='small' variant='contained' style={{backgroundColor: '#15639d', color: '#ffffff'}}>Confirmar email</Button>
                    </div>
                    <div className={styles.resetPassword}>
                        <h4>Restablecer contraseña</h4>
                        <p>Al restablecer tu contraseña, tendras que iniciar sesión con tu nueva contraseña, por lo tanto, no olvides tu nueva contraseña.</p>
                        <TextField variant='outlined' label='Contraseña anterior' size='small' name='current_password'/>
                        <TextField variant='outlined' label='Nueva contraseña' size='small' name='new_password'/>
                        <TextField variant='outlined' label='Confirmar nueva contraseña' size='small' name='confirm_password'/>
                        <Button size='small' variant='contained' style={{backgroundColor: '#15639d', color: '#ffffff'}}>Restablecer contraseña</Button>
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