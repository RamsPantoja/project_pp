import React, { Fragment } from 'react';
import Head from 'next/head';
import styles from './styles/sign_up.module.css';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SignUpForm from '../components/SignUpForm';
import useFormValidation from '../components/hooks/handleAddUserHook';
import { stateSchemaInfUser, validationSchema, disableSchema } from '../components/hooks/handleAddUserHook';

const SignUp = () => {
    const [state, disable, handleOnChange, passwordNoMatch] = useFormValidation(stateSchemaInfUser, validationSchema, disableSchema);
    
    return (
        <Fragment>
            <Head>
                <title>Sign Up</title>
            </Head>
            <div className={styles.signUp}>
                <div className={styles.signUp_center}>
                    <div className={styles.signUp_card}>
                        <div className={styles.signUp_title}>
                            <PersonAddIcon style={{fontSize:100}}/>
                            <p>Crear Cuenta</p>
                        </div>
                        <div className={styles.signUp_form}>
                            <SignUpForm 
                            handleOnChange={handleOnChange}
                            state={state}
                            disable={disable}
                            passwordNoMatch={passwordNoMatch}/>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SignUp;