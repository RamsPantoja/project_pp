import React, { useState } from 'react';
import styles from './styles/CourseFormDelete.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import { Fragment } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_COURSE } from '../apollo/mutations';
import { useSnackbar } from 'notistack';

const CourseFormDelete = ({handleOnClickToDeleteCourse, title, id, preapproval_plan_id, modeSuscription}) => { 
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        title: {value: '', errorfield: false, required: true}
    });

    const [deleteCourseByTitle, {data, error, loading}] = useMutation(DELETE_COURSE, {
        variables: {
            title: state.title.value,
            id: id,
            preapproval_plan_id: preapproval_plan_id,
            modeSuscription: modeSuscription
        },
        onCompleted: async (data) => {
            handleOnClickToDeleteCourse();
            enqueueSnackbar(data.deleteCourseByTitle, {variant: 'success', anchorOrigin:{ vertical: 'top', horizontal: 'center'}})
        },
        onError: async (error) => {
            enqueueSnackbar(error.message, { variant: 'error', anchorOrigin: {vertical: 'top', horizontal: 'center'}});
        }
    })


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

    const deleteCourse = (e) => {
        e.preventDefault();
        deleteCourseByTitle();
    }

    return (
        <Fragment>
            <div className={styles.backgroundContainer}></div>
            <div className={styles.displayForm}>
                <form className={styles.form} onSubmit={(e) => {deleteCourse(e)}}>
                    <span className={styles.userEmailToConfirm}>{title}</span>
                    <TextField label='Confirma el nombre del curso' fullWidth={true} size='small' name='title' error={state.title.errorfield} variant='outlined' value={state.title.value} onChange={(e) => {handleOnChange(e)}}/>
                    <div>
                        <Button type='submit' variant='contained' style={{background: '#ff5555', color:'#ffffff'}} startIcon={<DeleteIcon/>}>Eliminar</Button>
                        <Button color='default' variant='outlined' startIcon={<CancelIcon/>} onClick={(e) => {handleOnClickToDeleteCourse(e)}}>Cancelar</Button>
                    </div>
                </form>
            </div>
        </Fragment>

    )   
}

export default CourseFormDelete;