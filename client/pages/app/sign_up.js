import React, { Fragment } from 'react';
import Head from 'next/head';
import styles from '../styles/sign_up.module.css';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SignUpForm from '../../components/SignUpForm';
import useFormValidation from '../../components/hooks/handleAddUserHook';
import { stateSchemaInfUser, validationSchema, disableSchema } from '../../components/hooks/handleAddUserHook';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER } from '../../apollo/mutations';
import { CURRENT_USER } from '../../apollo/querys';

const SignUp = () => {
    const {data: userData, error: userError, loading: userLoading} = useQuery(CURRENT_USER);
    const [state, disable, handleOnChange, passwordNoMatch] = useFormValidation(stateSchemaInfUser, validationSchema, disableSchema);
    const { firstname, lastname, email, password } = state;
    const [createUser, {data, error, loading }] = useMutation(CREATE_USER, {
        variables: { input: {
            firstname: firstname.value,
            lastname: lastname.value,
            email: email.value,
            password: password.value
        }}
    })
    

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
                            passwordNoMatch={passwordNoMatch}
                            createUser={createUser}
                            error={error}/>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SignUp;