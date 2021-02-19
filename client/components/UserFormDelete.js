import React, { useState, useEffect } from 'react'
import styles from './styles/CourseFormDelete.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import { Fragment } from 'react';


const UserFormDelete = ({handleOnClickDeleteUserInCourse, emailToDelete, mutation, id, error}) => {
    const [state, setState] = useState({
        email: {value: '', errorfield: false, required: true}
    });

    const [disable, setDisable] = useState(true);

    useEffect(() => {
        if (state.email.value !== emailToDelete) {
            setDisable(true)
        } else {
            setDisable(false)
        }
    }, [state, emailToDelete])

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let errorfield = false;

        if(state[name].required) {
            if(!value) {
                errorfield = true;
            }
        }

        setState((prevState) => ({
            ...prevState,
            [name]: {value, errorfield, required:true}
        }))
    }

    const handleDeleteUser = (e) => {
        e.preventDefault();
        mutation({
            variables: {
                id: id,
                userEmail: state.email.value
            }
        })
    }

    const anyApolloError = error ? <span className={styles.disableErrorAlert}>{error.message}</span> : null;

    return (
        <Fragment>
            <div className={styles.backgroundContainer}></div>
            <div className={styles.displayForm}>
                <form className={styles.form}>
                    {anyApolloError}
                    <span className={styles.userEmailToConfirm}>{emailToDelete}</span>
                    <TextField label='Confirma el e-mail' fullWidth={true} size='small' name='email' error={state.email.errorfield} value={state.email.value} variant='outlined' onChange={(e) => {handleOnChange(e)}}/>
                    <div>
                        <Button variant='contained' color='secondary' disabled={disable} startIcon={<DeleteIcon/>} onClick={(e) => {handleDeleteUser(e)}}>Eliminar</Button>
                        <Button color='default' variant='outlined' startIcon={<CancelIcon/>} onClick={(e) => {handleOnClickDeleteUserInCourse(e)}}>Cancelar</Button>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}

export default UserFormDelete;