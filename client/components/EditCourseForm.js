import React, { memo, useState } from 'react';
import styles from '../pages/app/admin/styles/courses_form.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FormAddConcept from './FormAddConcept';
import useHandleFormCourse, { disableSchemaCourse, stateSchemaInfCourse, validationSchemaCourseEdit } from './hooks/handleCreateCourseHook';
import { useMutation } from '@apollo/client';
import { ADD_COURSE, UPDATE_COURSE } from '../apollo/mutations';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import UpdateIcon from '@material-ui/icons/Update';

const EditCourseForm = memo(({courseData, id}) => {
    const { enqueueSnackbar } = useSnackbar();
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
    ] = useHandleFormCourse(stateSchemaInfCourse, validationSchemaCourseEdit, disableSchemaCourse, courseData);

    const { title, description, teacher, price, enrollmentLimit, objectives, conceptList} = state;

    //Retorna un array con los valores del item que se encuentra en el array objectives[].
    const objectivesValue = objectives.map((item, i) => {
        if (item.value !== 'undefined') return item.value;
    });
    
    //Retorna un Array de objetos donde el valor de concept es igual al item.concept.value mapeado del objeto conceptList y SubconceptList es igual al item.subConceptList.map(item),
    //mapeado del objecto conceptList.
    const conceptListValue = conceptList.map((item, i) => {
        return {
            ...item,
            concept: item.concept.value,
            subConceptList: item.subConceptList.map((item, i)  => (item.value))
        }
    });

    //Transforma los strings capturados a tipo Number de los campos price & enrollmentLimit.
    const priceValue = parseFloat(price.value);
    const enrollmentValue = parseInt(enrollmentLimit.value);

    const [updateCourse, {data, error, loading}] = useMutation(UPDATE_COURSE, {
        variables: {
            input: {
                title: title.value,
                description: description.value,
                teacher: teacher.value,
                price: priceValue,
                enrollmentLimit: enrollmentValue,
                objectives: objectivesValue,
                conceptList: conceptListValue,
                modeSuscription: {
                    isActivated: courseData.modeSuscription.isActivated,
                    amountMonths: courseData.modeSuscription.amountMonths
                }
            },
            id: id
        },
        onCompleted: async (data) => {
            enqueueSnackbar(data.updateCourse, {variant: 'success', anchorOrigin: {vertical: 'top', horizontal: 'center'}})
            router.push('http://localhost:3000/app/admin/courses');
        },
        onError: (error) => {
            enqueueSnackbar(error.message, {variant: 'error', anchorOrigin: {vertical: 'top', horizontal: 'center'}})
        }
    })


    //Si los objetivos agregados son igual a 6, desactiva el boton de agregar objetivos
    const isDisableButtonToAddObjectives = state.objectives.length === 6 ? true : false;
    
    //Ejecuta el Mutation addCourse o muestra si falta algun campo abligatorio.
    const handleUpdateCourse = (e) => {
        e.preventDefault();
        if (disable.status) {
            setMessageError(true);
            if(img.file === '' || img.file === undefined) {
                img.errorfield = true;
            }
        } else {
            setMessageError(false)
            updateCourse();
        }
    }

    const isMessageAlertError = messageError && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;
    const anyApolloError = error ? <span className={styles.disableErrorAlert}>{error.message}</span> : null;
    const isLoadingMutation = loading ? <CircularProgress/> : <Button onClick={(e) => {handleUpdateCourse(e)}} style={{background: '#15639d', color:'#ffffff'}} variant='contained' startIcon={<UpdateIcon/>}>Actualizar</Button>

    return (
        <div className={styles.coursesFormLayout}>
            <div className={styles.coursesFormContainer}>
                <form className={styles.formFlex}>
                    <div className={styles.formFirstInputs}>
                        <h2>Editar curso</h2>
                        <TextField label='Nombre del curso' size='small' error={state.title.errorfield} variant='outlined' name='title' value={state.title.value} onChange={(e) => {handleOnChange(e)}}/>
                        <TextField label='Descripción' size='small' error={state.description.errorfield} rowsMax={5} variant='outlined' multiline={true} name='description' value={state.description.value} onChange={(e) => {handleOnChange(e)}}/>
                        <TextField label='Profesor' size='small' error={state.teacher.errorfield} variant='outlined' name='teacher' value={state.teacher.value} onChange={(e) => {handleOnChange(e)}}/>
                        <TextField placeholder='Precio' type='number' size='small' error={state.price.errorfield} variant='outlined' name='price' value={state.price.value} onChange={(e) => {handleOnChange(e)}} InputProps={{startAdornment: (<InputAdornment position="start"><AttachMoneyIcon/></InputAdornment>)}}/>
                        <TextField label='Limit de alumnos' type='number' error={state.enrollmentLimit.errorfield} size='small' variant='outlined' name='enrollmentLimit' value={state.enrollmentLimit.value} onChange={(e) => {handleOnChange(e)}}/>
                        <p>Objetivos(Mínimo:1):</p>
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
                    </div>
                    <div className={styles.formConceptInputs}>
                        <p>Temario(Mínimo:1):</p>
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
                        <div className={styles.formAddConcept}>
                            <Button onClick={(e) => {handleAddConcept(e)}} size='small' style={{background: '#15639d', color:'#ffffff'}} variant='contained' startIcon={<AddCircleIcon/>}>Agregar tema</Button>
                        </div>
                        <div className={styles.mutationLoading}>
                            {isMessageAlertError || anyApolloError}
                            {isLoadingMutation}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
});


export default EditCourseForm;