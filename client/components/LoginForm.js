import React from 'react';
import styles from './styles/LoginForm.module.css';
import Link  from 'next/link';

const LoginForm = () => {
    return (
        <form className={styles.loginForm}>
            <input className={styles.loginForm_input} type='text' placeholder='Email' name='email'/>
            <input className={styles.loginForm_input} type='password' placeholder='Contraseña' name='password'/>
            <button type='submit'>Iniciar sesión</button>
            <span>Aun no tienes una cuenta? <Link href='/app/sign_up'><a className={styles.linkToCreateAccount}>Crear cuenta</a></Link></span>
        </form>
    )
}

export default LoginForm;