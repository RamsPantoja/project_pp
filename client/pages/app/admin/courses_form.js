import React, { useState } from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/courses_form.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
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
        handleAddSubConcept,
        handleOnChangeSubConceptInput,
        handleDeleteObjetive,
        handleDeleteConcept,
        handleDeleteSubConcept
    ] = useHandleFormCourse(stateSchemaInfCourse, validationSchemaCourse, disableSchemaCourse);
    
    
    const isDisableButtonToAddObjectives = state.objectives.length === 9 ? true : false;
    return (
        <LayoutAdmin>
            <div className={styles.coursesFormLayout}>
                <div className={styles.coursesFormContainer}>
                    <form className={styles.formFlex}>
                       <div className={styles.formFirstInputs}>
                            <TextField label='Nombre del curso' variant='outlined' name='title' value={state.title.value} onChange={(e) => {handleOnChange(e)}}/>
                            <TextField label='Descripción' rowsMax={5} variant='outlined' multiline={true} name='description' value={state.description.value} onChange={(e) => {handleOnChange(e)}}/>
                            <TextField label='Profesor' variant='outlined' name='teacher' value={state.teacher.value} onChange={(e) => {handleOnChange(e)}}/>
                            <p>Objetivos(Minimo:1):</p>
                            { state.objectives.map((item, index) => {
                                return (
                                    <div key={index} className={styles.objectiveContainer}>
                                        <TextField label='Objetivo' variant='outlined' size='small' name='objective' value={item.value} fullWidth onChange={(e) => {handleOnChangeObjetiveInput(e, index)}}/>
                                        <Button onClick={(e) => {handleDeleteObjetive(e, index)}} size='small' color='secondary'><DeleteIcon/></Button>
                                    </div>
                                )
                            })}
                            <div className={styles.formFirstIcons}>
                                <Button onClick={(e) => {handleAddObjetive(e)}} size='small' color='primary' variant='contained' disabled={isDisableButtonToAddObjectives} startIcon={<AddCircleIcon/>}>Agregar objetivo</Button>
                            </div>
                        </div>
                        <div className={styles.formConceptInputs}>
                            <p>Temario(Minimo:1):</p>
                            { state.conceptList.map((item, index) => {
                                return (
                                    <FormAddConcept 
                                    key={index} 
                                    handleOnChangeConceptInput={handleOnChangeConceptInput} 
                                    index={index} 
                                    handleAddSubConcept={handleAddSubConcept} 
                                    state={state}
                                    handleOnChangeSubConceptInput={handleOnChangeSubConceptInput}
                                    handleDeleteConcept={handleDeleteConcept}
                                    handleDeleteSubConcept={handleDeleteSubConcept}
                                    item={item.concept}/>
                                )
                            })}
                            <div className={styles.formFirstIcons}>
                                <Button onClick={(e) => {handleAddConcept(e)}} size='small'color='primary' variant='contained' startIcon={<AddCircleIcon/>}>Agregar tema</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </LayoutAdmin>

    )
}

export default CoursesForm;