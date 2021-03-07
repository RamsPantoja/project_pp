import React, { useState } from 'react';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import styles from './styles/EditAccount.module.css';
import useFormValidationAccountPassword from './hooks/handleEditAccountFormPasswordHook';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_ACCOUNT } from '../apollo/mutations';
import { useSnackbar } from 'notistack';


const EditPasswordAccount = ({validationSchema, disableSchema, user, stateSchema}) => {
    const {enqueueSnackbar} = useSnackbar();
    const [state, handleOnChange, disable] = useFormValidationAccountPassword(stateSchema, validationSchema, disableSchema);
    const {currentPassword, newPassword, confirmNewPassword} = state;
    const [isDisableErrorAlert, setIsDisableErrorAlert] = useState(false);

    const [resetPassword, {data, error, loading}] = useMutation(RESET_PASSWORD_ACCOUNT, {
        variables: {
            email: user,
            currentPassword: currentPassword.value,
            newPassword: newPassword.value
        },
        onCompleted: (data) => {
            enqueueSnackbar(data.resetPassword, {variant: 'success', anchorOrigin: {vertical: 'bottom', horizontal: 'left'}});
        },
        onError: (error) => {
            enqueueSnackbar(error.message, {variant: 'error', anchorOrigin: {vertical: 'bottom', horizontal: 'left'}});
        }
    })

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (disable.status) {
            setIsDisableErrorAlert(true)
        } else {
            setIsDisableErrorAlert(false)
            resetPassword();
        }
    }

    const disableErrorAlert = isDisableErrorAlert && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;
    const errorAlertPassword = isDisableErrorAlert && newPassword.error ? <span className={styles.disableErrorAlert}>{newPassword.error}</span> : null;
    const isLoadingMutation = loading ? <div className={styles.centerCircularProgress}><CircularProgress/></div> : <Button size='small' type='submit' variant='contained' style={{backgroundColor: '#15639d', color: '#ffffff'}}>Restablecer contraseña</Button>

    return (
        <form onSubmit={(e) => {handleOnSubmit(e)}} className={styles.gridForm}>
            {disableErrorAlert || errorAlertPassword}
            <TextField type='password' variant='outlined' value={currentPassword.value} error={currentPassword.errorfield} label='Contraseña actual' size='small' name='currentPassword' onChange={(e) => {handleOnChange(e)}}/>
            <TextField type='password' variant='outlined' value={newPassword.value} error={newPassword.errorfield} label='Nueva contraseña' size='small' name='newPassword' onChange={(e) => {handleOnChange(e)}}/>
            <TextField type='password' variant='outlined' value={confirmNewPassword.value} error={confirmNewPassword.errorfield} label='Confirmar nueva contraseña' size='small' name='confirmNewPassword' onChange={(e) => {handleOnChange(e)}}/>
            {isLoadingMutation}
        </form>
    )
}

export default EditPasswordAccount;