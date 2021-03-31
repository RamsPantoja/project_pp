import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import useFormValidationResetPassword, { disableSchema, stateSchemaPassword, validationSchemaPassword } from '../../../components/hooks/handleResetPasswordHook';
import styles from '../../styles/recovery_password.module.css';
import jwt from 'jsonwebtoken';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_RECOVERY } from '../../../apollo/mutations';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import BackIn from '../../../components/BackIn';

const resetPasswordRecovery = ({userId}) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [state, handleOnChange, disable] = useFormValidationResetPassword(stateSchemaPassword, validationSchemaPassword, disableSchema);
    const [isDisableErrorAlert, setIsDisableErrorAlert] = useState(false);
    const [isBackIn, setIsBackIn] = useState(false);

    //Resetea la contraseña con la nueva contraseña proporcionada por el usuario.
    const [resetPasswordRecovery, {data, error, loading}] = useMutation(RESET_PASSWORD_RECOVERY, {
        variables: {
            id: userId,
            newPassword: state.newPassword.value
        },
        onCompleted: (data) => {
            enqueueSnackbar(data.resetPasswordRecovery, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center'}});
            setIsBackIn(true)
        },
        onError: (error) => {
            enqueueSnackbar(error.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center'}});
        }
    });

    //Ejecuta el mutation resetPasswordRecovery()
    const handleOnSubmit = (e) => {
        e.preventDefault();
        if(disable.status) {
            setIsDisableErrorAlert(true)
        } else {
            setIsDisableErrorAlert(false)
            resetPasswordRecovery();
        }
    }


    const disableErrorAlert = isDisableErrorAlert && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;
    const backIn = isBackIn ? <BackIn/> : null;
    const buttonToReset = isBackIn ? null : <Button type='submit' variant='contained' style={{background: '#15639d', color: '#ffffff'}}>Restablecer</Button>
    return (
        <div className={styles.recoveryPasswordContainer}>
            <div className={styles.recoveryPasswordCard}>
                <h3>Restablecer contraseña</h3>
                <form className={styles.form} onSubmit={(e) => {handleOnSubmit(e)}}>
                    <p>Introduce tu nueva contraseña (Mínimo 6 dígitos sin caracteres especiales).</p>
                    {disableErrorAlert}
                    <TextField name='newPassword' value={state.newPassword.value} error={state.newPassword.errorfield} size='small' label='Nueva contraseña' type='password' variant='outlined' onChange={(e) => {handleOnChange(e)}}/>
                    <TextField name='confirmNewPassword' value={state.confirmNewPassword.value} error={state.confirmNewPassword.errorfield} size='small' label='Confirmar contraseña' type='password' variant='outlined' onChange={(e) => {handleOnChange(e)}}/>
                    {buttonToReset}
                </form>
                {backIn}
            </div>
        </div>
    )
}

export async function getServerSideProps({query}) {
    const token = query.token;

    const user =  jwt.verify(token, process.env.SECRET_EMAIL_TOKEN, (err, decoded) => {
        if (err) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        } else if (decoded) {
            return {
                props: {
                    userId: decoded._id
                }
            }
        }
    });

    return user;
}

export default resetPasswordRecovery;