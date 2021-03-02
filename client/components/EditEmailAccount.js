import React, { useState } from 'react';
import useFormValidation from './hooks/handleFormHook';
import { Button, TextField } from '@material-ui/core';
import { Fragment } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_EMAIL_CONFIRMATION } from '../apollo/mutations';
import styles from './styles/DisableErrorAlert.module.css';
import { useSnackbar } from 'notistack';

const EditEmailAccount = ({validationSchema, disableSchema, user, stateSchema}) => {
    const { enqueueSnackbar } = useSnackbar();

    //Este useFormValidationHook valida el campo email en la pagina account/account para despues enviarlo a travez de un useMutation y este envie un correo de confirmacion para la cuenta del usuario.
    const [state, handleOnChange, disable] = useFormValidation(stateSchema, validationSchema, disableSchema, user);
    const {email} = state;
    const [isDisableErrorAlert, setIsDisableErrorAlert] = useState(false);

    const [sendEmailConfirmation, {data, error, loading}] = useMutation(SEND_EMAIL_CONFIRMATION, {
        variables: {
            email: email.value
        },
        onCompleted: (data) => {
            //Despliega un snackbar para notificar al usuario que se ha enviado el correo de confirmacion a su correo.
            enqueueSnackbar(data.sendEmailConfirmation, { variant:'success', anchorOrigin: { vertical: 'top', horizontal: 'center'}})
        },
        onError: (error) => {
            //Despliega un snackbar para notificar al usuario que algo ha salido mal con el envio del correo.
            enqueueSnackbar(error.message, { variant: 'error', anchorOrigin: {vertical: 'top', horizontal: 'center'}});
        }
    });

    //Ejecuta el useMutation y muestra si falta algun campo del formulario.
    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (disable.status) {
            setIsDisableErrorAlert(true)
        } else {
            setIsDisableErrorAlert(false)
            sendEmailConfirmation();
        }
    }

    const disableErrorAlert = isDisableErrorAlert && disable.status ? <span className={styles.disableErrorAlert}>{email.error}</span> : null;


    return (
        <Fragment>
            {disableErrorAlert}
            <TextField size='small' value={email.value} error={email.errorfield} variant='outlined' label='Email' name='email' onChange={(e) => {handleOnChange(e)}}/>
            <Button size='small' variant='contained' style={{backgroundColor: '#15639d', color: '#ffffff'}} onClick={(e) => {handleOnSubmit(e)}}>Confirmar email</Button>
        </Fragment>
    )
}

export default EditEmailAccount;