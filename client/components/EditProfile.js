import React, { useState } from 'react';
import useFormValidation from './hooks/handleFormHook';
import { Button, TextField } from '@material-ui/core';
import { Fragment } from 'react';


const EditProfile = ({validationSchema, disableSchema, user, stateSchema}) => {
    const [state, handleOnChange, disable] = useFormValidation(stateSchema, validationSchema, disableSchema, user);
    const { firstname, lastname, email} = state;
    const [isDisableErrorAlert, setIsDisableErrorAlert] = useState(false);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (isDisableErrorAlert) {
            setIsDisableErrorAlert(false)
        } else {
            setIsDisableErrorAlert(true)
        }
    }

    const disableErrorAlert = isDisableErrorAlert && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;

    return (
        <Fragment>
            {disableErrorAlert}
            <form>
                <TextField size='small' value={firstname.value} error={firstname.errorfield} variant='outlined' label='Nombre' name='firstname' onChange={(e) => handleOnChange(e)}/>
                <TextField size='small' value={lastname.value} error={lastname.errorfield} variant='outlined' label='Apellido' name='lastname' onChange={(e) => handleOnChange(e)}/>
                <TextField type='email' value={email.value} error={email.errorfield} size='small' variant='outlined' label='Email' name='email' onChange={(e) => handleOnChange(e)}/>
                <Button onClick={(e) => {handleOnSubmit(e)}} variant='contained' type='submit' style={{backgroundColor: '#15639d', color: '#ffffff'}}>Guardar informacion del perfil</Button>
            </form>
        </Fragment>
    )
}

export default EditProfile;