import React from 'react';
import styles from './styles/LoginForm.module.css';
import Link  from 'next/link';

const LoginForm = ({state, handleOnChange, disable}) => {
    const {email, password} = state;

    return (
        <form className={styles.loginForm}>
            <input className={styles.loginForm_input} type='text' placeholder='Email' name='email' value={email.value} onChange={handleOnChange}/>
            <input className={styles.loginForm_input} type='password' placeholder='Contraseña' name='password' value={password.value} onChange={handleOnChange}/>
            <button type='submit'>Iniciar sesión</button>
            <span>Aun no tienes una cuenta? <Link href='/app/sign_up'><a className={styles.linkToCreateAccount}>Crear cuenta</a></Link></span>
        </form>
    )
}

export default LoginForm;