import React, { useState } from 'react';
import styles from './styles/LoginForm.module.css';
import Link  from 'next/link';
import cn from 'classnames';

const LoginForm = ({state, handleOnChange, disable, entityAuth, error}) => {
    const {email, password} = state;
    const [disableErrorAlert, setDisableErrorAlert] = useState(false)

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (disable.status) {
            setDisableErrorAlert(true)
        } else {
            setDisableErrorAlert(false);
            entityAuth();
        }
    }

    const isDisableErrorAlert = disableErrorAlert && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;
    const anyApolloError = error ? <span className={styles.disableErrorAlert}>{error.message}</span> : null;

    return (
        <form className={styles.loginForm} onSubmit={
            (e) => {handleOnSubmit(e)}
        }>
            {isDisableErrorAlert || anyApolloError}
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
            <button type='submit'>Iniciar sesión</button>
        </form>
    )
}

export default LoginForm;