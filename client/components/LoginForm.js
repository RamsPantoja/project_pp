import React from 'react';
import styles from './styles/LoginForm.module.css';

const LoginForm = () => {
    return (
        <form className={styles.loginForm}>
            <input className={styles.loginForm_input} type='text' placeholder='Email' name='email'/>
            <input className={styles.loginForm_input} type='password' placeholder='Contraseña' name='password'/>
            <button type='submit'>Iniciar sesión</button>
        </form>
    )
}

export default LoginForm;