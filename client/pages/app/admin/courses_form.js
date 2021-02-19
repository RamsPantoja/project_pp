import React, { useState } from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/courses_form.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FormAddConcept from '../../../components/FormAddConcept';
import useHandleFormCourse, { disableSchemaCourse, stateSchemaInfCourse, validationSchemaCourse } from '../../../components/hooks/handleCreateCourseHook';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { useMutation } from '@apollo/client';
import { ADD_COURSE } from '../../../apollo/mutations';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from 'next/router';

const CoursesForm = () => {
    const router = useRouter()
    const [messageError, setMessageError] = useState(false);
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

    const { title, description, teacher, price, enrollmentLimit, objectives, conceptList} = state;

    const objectivesValue = objectives.map((item, i) => {
        if (item.value !== 'undefined') return item.value;
    });
    
    const conceptListValue = conceptList.map((item, i) => {
        return {
            ...item,
            concept: item.concept.value,
            subConceptList: item.subConceptList.map((item, i)  => (item.value))
        }
    });

    const priceValue = parseFloat(price.value);
    const enrollmentValue = parseInt(enrollmentLimit.value);

    const [addCourse, {data, error, loading}] = useMutation(ADD_COURSE, {
        variables: {
            input: {
                title: title.value,
                description: description.value,
                teacher: teacher.value,
                price: priceValue,
                enrollmentLimit: enrollmentValue,
                objectives: objectivesValue,
                conceptList: conceptListValue
            }
        },
        onCompleted: async (data) => {
            router.push('http://localhost:3000/app/admin/courses');
        }
    })
    
    const isDisableButtonToAddObjectives = state.objectives.length === 6 ? true : false;
    
    const handleAddCourse = (e) => {
        e.preventDefault();
        if (disable.status) {
            setMessageError(true);
        } else {
            setMessageError(false)
            addCourse();
        }
    }

    const isMessageAlertError = messageError && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;
    const anyApolloError = error ? <span className={styles.disableErrorAlert}>{error.message}</span> : null;
    const isLoadingMutation = loading ? <CircularProgress/> : <Button onClick={(e) => {handleAddCourse(e)}} style={{background: '#15639d', color:'#ffffff'}} variant='contained' startIcon={<PostAddIcon/>}>Crear curso</Button>

    return (
        <LayoutAdmin>
            <div className={styles.coursesFormLayout}>
                <div className={styles.coursesFormContainer}>
                    <form className={styles.formFlex}>
                       <div className={styles.formFirstInputs}>
                            <TextField label='Nombre del curso' size='small' error={state.title.errorfield} variant='outlined' name='title' value={state.title.value} onChange={(e) => {handleOnChange(e)}}/>
                            <TextField label='Descripción' size='small' error={state.description.errorfield} rowsMax={5} variant='outlined' multiline={true} name='description' value={state.description.value} onChange={(e) => {handleOnChange(e)}}/>
                            <TextField label='Profesor' size='small' error={state.teacher.errorfield} variant='outlined' name='teacher' value={state.teacher.value} onChange={(e) => {handleOnChange(e)}}/>
                            <TextField placeholder='Precio' type='number' size='small' error={state.price.errorfield} variant='outlined' name='price' value={state.price.value} onChange={(e) => {handleOnChange(e)}} InputProps={{startAdornment: (<InputAdornment position="start"><AttachMoneyIcon/></InputAdornment>)}}/>
                            <TextField label='Limit de alumnos' type='number' error={state.enrollmentLimit.errorfield} size='small' variant='outlined' name='enrollmentLimit' value={state.enrollmentLimit.value} onChange={(e) => {handleOnChange(e)}}/>
                            <p>Objetivos(Minimo:1):</p>
                            { state.objectives.map((item, index) => {
                                return (
                                    <div key={index} className={styles.objectiveContainer}>
                                        <TextField label='Objetivo' variant='outlined' error={item.errorfield} size='small' name='objective' value={item.value} fullWidth onChange={(e) => {handleOnChangeObjetiveInput(e, index)}}/>
                                        <Button onClick={(e) => {handleDeleteObjetive(e, index)}} size='small' style={{color:'#ff5555'}}><DeleteIcon/></Button>
                                    </div>
                                )
                            })}
                            <div className={styles.formFirstIcons}>
                                <Button onClick={(e) => {handleAddObjetive(e)}} size='small' color='primary' variant='outlined' disabled={isDisableButtonToAddObjectives} startIcon={<AddCircleIcon/>}>Agregar objetivo</Button>
                            </div>
                            {isMessageAlertError || anyApolloError}
                            <div className={styles.mutationLoading}>
                                {isLoadingMutation}
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
                                <Button onClick={(e) => {handleAddConcept(e)}} size='small' style={{background: '#15639d', color:'#ffffff'}} variant='contained' startIcon={<AddCircleIcon/>}>Agregar tema</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </LayoutAdmin>

    )
}

export default CoursesForm;