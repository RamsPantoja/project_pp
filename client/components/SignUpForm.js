import React, { Fragment, useEffect, useState } from 'react';
import styles from './styles/SignUpForm.module.css';
import cn from 'classnames';
import { CircularProgress } from '@material-ui/core';

const SignUpForm = ({state, handleOnChange, disable, passwordNoMatch, createUser, error, loading}) => {
    const {firstname, lastname, email, password, confirmpassword} = state;
    const isPasswordMatch = passwordNoMatch || confirmpassword.errorfield === 'SignUpForm_inputError' ? 'SignUpForm_inputError' : 'SignUpForm_input';
    const [disableErrorAlert, setDisableErrorAlert] = useState(false);

    useEffect(() => {
        if (confirmpassword.value !== password.value) {
            confirmpassword.error = 'La contraseña no coincide';
        } else {
            confirmpassword.error = '';
        }
    },[confirmpassword, password]);

    const handleOnSubmit = (e, createUser) => {
        e.preventDefault();
        if (disable.status) {
            setDisableErrorAlert(true)
        } else {
            setDisableErrorAlert(false);
            createUser();
        }
    }

    const isDisableErrorAlert = disableErrorAlert && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;
    const isMinimumLenghtPassword = password.error ? <span className={styles.disableErrorAlert}>{password.error}</span> : null;
    const anyApolloError = error ? <span className={styles.disableErrorAlert}>{error.message}</span> : null;
    const isMutationLoading = loading ? <CircularProgress/> : <button type='submit'>Crear</button>
    
    return (
        <Fragment>
            <form className={styles.SignUpForm}
                onSubmit={(e) => {
                    handleOnSubmit(e, createUser)
                }}>
                    {isDisableErrorAlert || anyApolloError}
                <input className={
                    cn({
                        [styles.SignUpForm_input]: firstname.errorfield === 'SignUpForm_input',
                        [styles.SignUpForm_inputError]: firstname.errorfield === 'SignUpForm_inputError'
                    })
                } type='text' placeholder='Nombre' name='firstname' onChange={handleOnChange} value={firstname.value}/>
                <input className={
                    cn({
                        [styles.SignUpForm_input]: lastname.errorfield === 'SignUpForm_input',
                        [styles.SignUpForm_inputError]: lastname.errorfield === 'SignUpForm_inputError'
                    })
                } type='text' placeholder='Apellidos' name='lastname' onChange={handleOnChange} value={lastname.value}/>
                <input className={
                    cn({
                        [styles.SignUpForm_input]: email.errorfield === 'SignUpForm_input',
                        [styles.SignUpForm_inputError]: email.errorfield === 'SignUpForm_inputError'
                    })
                } type='email' placeholder='Email' name='email' onChange={handleOnChange} value={email.value}/>
                <input className={
                    cn({
                        [styles.SignUpForm_input]: password.errorfield === 'SignUpForm_input',
                        [styles.SignUpForm_inputError]: password.errorfield === 'SignUpForm_inputError'
                    })
                } type='password' placeholder='Contraseña: minimo 6 dig.' name='password' onChange={handleOnChange} value={password.value}/>
                {isMinimumLenghtPassword}
                <input className={
                    cn({
                        [styles.SignUpForm_inputError]: isPasswordMatch === 'SignUpForm_inputError',
                        [styles.SignUpForm_input]: isPasswordMatch === 'SignUpForm_input'
                    })
                } type='password' placeholder='Confirmar contraseña' name='confirmpassword' onChange={handleOnChange} value={confirmpassword.value}/>
                {isMutationLoading}
            </form>
        </Fragment>
    )
}

export default SignUpForm;