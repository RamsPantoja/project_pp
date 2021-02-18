import React, { useState } from 'react';
import styles from './styles/LoginForm.module.css';
import cn from 'classnames';
import { signIn } from 'next-auth/client';
import { CircularProgress } from '@material-ui/core';

const LoginForm = ({state, handleOnChange, disable, csrfToken}) => {
    const {email, password} = state;
    const [disableErrorAlert, setDisableErrorAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const handleOnSubmit = (e) => {
        if (disable.status) {
            e.preventDefault();
            setDisableErrorAlert(true)
        } else {
            setDisableErrorAlert(false);
            signIn('credentials', {callbackUrl: null, redirect: false}).then((error, ok) => {
                if (!ok) {
                    setIsLoading(true)
                } else {
                    setIsLoading(false);
                }
            })
        }
    }

    const isDisableErrorAlert = disableErrorAlert && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;
    const isLoginLoading = isLoading ? <CircularProgress/> : <button type='submit'>Iniciar sesión</button>

    return (
        <form method='post' className={styles.loginForm} action='/api/auth/callback/credentials' onSubmit={(e) => {handleOnSubmit(e)}}>
            <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
            {isDisableErrorAlert}
            <input className={
                cn({
                    [styles.loginForm_input]: email.errorfield === 'loginForm_input',
                    [styles.loginForm_inputError]: email.errorfield === 'loginForm_inputError'
                })
            } type='text' placeholder='Email' name='email' value={email.value} onChange={handleOnChange}/>
            <input className={
                cn({
                    [styles.loginForm_input]: password.errorfield === 'loginForm_input',
                    [styles.loginForm_inputError]: password.errorfield === 'loginForm_inputError',
                })
            } type='password' placeholder='Contraseña' name='password' value={password.value} onChange={handleOnChange}/>
            {isLoginLoading}
        </form>
    )
}

export default LoginForm;