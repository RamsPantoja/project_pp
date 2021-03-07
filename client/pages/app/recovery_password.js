import { useMutation } from '@apollo/client';
import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { RECOVERY_PASSWORD } from '../../apollo/mutations';
import styles from '../styles/recovery_password.module.css';
import { useSnackbar } from 'notistack';
import { getSession } from 'next-auth/client';
import { ArrowBackIos } from '@material-ui/icons';
import { useRouter } from 'next/router';

const RecoveryPassword = () => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        email: {value: '', errorfield: false, required: true},
        status: true
    })

    const [recoveryPassword, {data, error, loading}] = useMutation(RECOVERY_PASSWORD, {
        variables: {
            email: state.email.value
        },
        onCompleted: (data) => {
            enqueueSnackbar(data.recoveryPassword, {variant: 'success', anchorOrigin: {vertical: 'top', horizontal: 'center'}})
        },
        onError: (error) => {
            enqueueSnackbar(error.message, { variant: 'error', anchorOrigin: {vertical: 'top', horizontal: 'center'}});
        }
    })

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let errorfield = false;
        let status = true;

        if(state[name].required) {
            if(!value) {
                errorfield = true;
                status = true;
            } else {
                errorfield = false;
                status = false
            }
        }
        
        setState((prevState) => ({
            ...prevState,
            [name]: {value, errorfield, required: true},
            status: status
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if(state.status) {
            setState((prevState) => ({
                ...prevState,
                email: {value: '', errorfield: true, required: true},
                status: true
            }))
        } else {
            recoveryPassword();
        }
    }

    return (
        <div className={styles.recoveryPasswordContainer}>
            <div className={styles.buttonToBack}>
                <Button style={{color: '#ffffff'}} startIcon={<ArrowBackIos/>} onClick={() => router.back()}>Volver</Button>
            </div>
            <div className={styles.recoveryPasswordCard}>
                <h3>Recuperación de contraseña</h3>
                <form className={styles.form} onSubmit={(e) => {handleOnSubmit(e)}}>
                    <p>Se te enviará un correo a tu cuenta de correo electrónico para recuperar tu contraseña.</p>
                    <p>Introduce el email con el cual tienes asociada tu cuenta de PROFE PACO.</p>
                    <TextField name='email' value={state.email.value} error={state.email.errorfield} size='small' label='Email' type='email' variant='outlined' onChange={(e) => {handleOnChange(e)}}/>
                    <Button type='submit' variant='contained' style={{background: '#15639d', color: '#ffffff'}}>Enviar</Button>
                </form>
            </div>
        </div>
    )
}

export async function getServerSideProps({req}) {
    const session = await getSession({req});

    if(session && req) {
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

export default RecoveryPassword;