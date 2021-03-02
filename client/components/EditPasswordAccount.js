import React, { useState } from 'react';
import useFormValidation from './hooks/handleFormHook';
import { Button, TextField } from '@material-ui/core';
import { Fragment } from 'react';
import styles from './styles/DisableErrorAlert.module.css';


const EditPasswordAccount = ({validationSchema, disableSchema, user, stateSchema}) => {
    const [state, handleOnChange, disable] = useFormValidation(stateSchema, validationSchema, disableSchema, user);
    const {currentPassword, newPassword, confirmNewPassword} = state;
    const [isDisableErrorAlert, setIsDisableErrorAlert] = useState(false);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (disable.status) {
            setIsDisableErrorAlert(true)
        } else {
            setIsDisableErrorAlert(false)
        }
    }

    const disableErrorAlert = isDisableErrorAlert && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;

    return (
        <Fragment>
            {disableErrorAlert}
            <TextField variant='outlined' value={currentPassword.value} error={currentPassword.errorfield} label='Contraseña anterior' size='small' name='currentPassword' onChange={(e) => {handleOnChange(e)}}/>
            <TextField variant='outlined' value={newPassword.value} error={newPassword.errorfield} label='Nueva contraseña' size='small' name='newPassword' onChange={(e) => {handleOnChange(e)}}/>
            <TextField variant='outlined' value={confirmNewPassword.value} error={confirmNewPassword.errorfield} label='Confirmar nueva contraseña' size='small' name='confirmNewPassword' onChange={(e) => {handleOnChange(e)}}/>
            <Button size='small' variant='contained' style={{backgroundColor: '#15639d', color: '#ffffff'}} onClick={(e) => {handleOnSubmit(e)}}>Restablecer contraseña</Button>
        </Fragment>
    )
}

export default EditPasswordAccount;