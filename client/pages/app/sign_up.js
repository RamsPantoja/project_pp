import React, { Fragment, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/sign_up.module.css';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SignUpForm from '../../components/SignUpForm';
import useFormValidation from '../../components/hooks/handleAddUserHook';
import { stateSchemaInfUser, validationSchema, disableSchema } from '../../components/hooks/handleAddUserHook';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../../apollo/mutations';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useRouter } from 'next/router';

const SignUp = () => {
    const router = useRouter();
    const [state, disable, handleOnChange, passwordNoMatch] = useFormValidation(stateSchemaInfUser, validationSchema, disableSchema);
    const { firstname, lastname, email, password } = state;
    const [hasUserBeenCreated, setHasUserBeenCreated] = useState(false);
    const [createUser, {data, error, loading }] = useMutation(CREATE_USER, {
        variables: { input: {
            firstname: firstname.value,
            lastname: lastname.value,
            email: email.value,
            password: password.value
            }
        },
        onCompleted: (data) => {
            setHasUserBeenCreated(true);
        }

    })
    
    if (hasUserBeenCreated && data) {
        return (
            <Fragment>
                <Head>
                    <title>Sign Up</title>
                </Head>
                <div className={styles.signUp}>
                    <div className={styles.signUp_userCreated}>
                        <div className={styles.signUp_card}>
                            <p>{data.createUser}</p>
                            <Link href='/'><a className={styles.linkToHome}>Home</a></Link>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Head>
                <title>Sign Up</title>
            </Head>
            <div className={styles.signUp}>
                <div className={styles.buttonToBack}>
                    <Button style={{color: '#ffffff'}} startIcon={<ArrowBackIosIcon/>} onClick={() => router.back()}>Volver</Button>
                </div>
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
                            error={error}
                            loading={loading}/>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SignUp;