import React, { useState } from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/courses_form.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add'
import FormAddConcept from '../../../components/FormAddConcept';
import useHandleFormCourse, { disableSchemaCourse, stateSchemaInfCourse, validationSchemaCourse } from '../../../components/hooks/handleCreateCourseHook';

const CoursesForm = () => {
    const [
        state, 
        disable, 
        handleOnChange, 
        handleOnChangeObjetiveInput, 
        handleAddObjetive, 
        handleAddConcept, 
        handleOnChangeConceptInput,
        handleAddSubConcept] = useHandleFormCourse(stateSchemaInfCourse, validationSchemaCourse, disableSchemaCourse)

    return (
        <LayoutAdmin>
            <div className={styles.coursesFormLayout}>
                <div className={styles.coursesFormContainer}>
                    <form className={styles.formFlex}>
                       <div className={styles.formFirstInputs}>
                            <TextField label='Nombre del curso' variant='outlined' name='title' onChange={(e) => {handleOnChange(e)}}/>
                            <TextField label='Descripción' rowsMax={5} variant='outlined' multiline={true} name='description' onChange={(e) => {handleOnChange(e)}}/>
                            <TextField label='Profesor' variant='outlined' name='teacher' onChange={(e) => {handleOnChange(e)}}/>
                            <hr></hr>
                            <p>Objetivos(Minimo:1):</p>
                            { state.objectives.map((item, index) => {
                                return (
                                    <TextField key={index} label='Objetivo' variant='outlined' size='small' name='objective' onChange={(e) => {handleOnChangeObjetiveInput(e, index)}}/>
                                )
                            })}
                            <Button onClick={(e) => {handleAddObjetive(e)}} color='primary' variant='outlined' startIcon={<AddIcon/>}>Agregar Objetivo</Button>
                        </div>
                        <div className={styles.formConceptInputs}>
                            <p>Temario(Minimo:1):</p>
                            { state.conceptList.map((item, index) => {
                                return (
                                    <FormAddConcept key={index} handleOnChangeConceptInput={handleOnChangeConceptInput} index={index} handleAddSubConcept={handleAddSubConcept}/>
                                )
                            })}
                            <Button onClick={(e) => {handleAddConcept(e)}} color='primary' variant='outlined' startIcon={<AddIcon/>}>Agregar tema</Button>
                        </div>
                    </form>
                </div>
            </div>
        </LayoutAdmin>

    )
}

export default CoursesForm;