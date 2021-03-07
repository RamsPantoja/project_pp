import React, { useState } from 'react';
import useFormValidationProfile from './hooks/handleEditProfileFormHook';
import { Button, TextField } from '@material-ui/core';
import { Fragment } from 'react';
import styles from './styles/EditAccount.module.css';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '../apollo/mutations';
import { useSnackbar } from 'notistack';
import { signOut } from 'next-auth/client';


const EditProfile = ({validationSchema, disableSchema, user, stateSchema}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [state, handleOnChange, disable] = useFormValidationProfile(stateSchema, validationSchema, disableSchema, user);
    const { firstname, lastname, email} = state;
    const { id } = user; 
    const [isDisableErrorAlert, setIsDisableErrorAlert] = useState(false);

    const [updateUserProfile, {data, error, loading}] = useMutation(UPDATE_USER_PROFILE, {
        variables: {
            id: id,
            email: email.value,
            firstname: firstname.value,
            lastname: lastname.value
        },
        onCompleted: (data) => {
            enqueueSnackbar(data.updateUserProfile, {variant: 'success', anchorOrigin: {vertical: 'bottom', horizontal: 'left'}});
            setTimeout(() => {
                signOut();
            }, 3000)
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
            updateUserProfile();
        }
    }

    const disableErrorAlert = isDisableErrorAlert && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;

    return (
        <Fragment>
            {disableErrorAlert}
            <form onSubmit={(e) => {handleOnSubmit(e)}}>
                <TextField size='small' value={firstname.value} error={firstname.errorfield} variant='outlined' label='Nombre' name='firstname' onChange={handleOnChange}/>
                <TextField size='small' value={lastname.value} error={lastname.errorfield} variant='outlined' label='Apellido' name='lastname' onChange={handleOnChange}/>
                <TextField type='email' value={email.value} error={email.errorfield} size='small' variant='outlined' label='Email' name='email' onChange={handleOnChange}/>
                <Button type='submit' variant='contained' type='submit' style={{backgroundColor: '#15639d', color: '#ffffff'}}>Guardar informacion del perfil</Button>
            </form>
        </Fragment>
    )
}

export default EditProfile;