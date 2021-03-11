import React, { createRef, useState } from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/courses_form.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FormAddConcept from '../../../components/FormAddConcept';
import useHandleFormCourse, { disableSchemaCourse, stateSchemaInfCourse, validationSchemaCourseAdd } from '../../../components/hooks/handleCreateCourseHook';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { useMutation } from '@apollo/client';
import { ADD_COURSE } from '../../../apollo/mutations';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import ImageIcon from '@material-ui/icons/Image';
import { useSnackbar } from 'notistack';
import Head from 'next/head';
import firebase from '../../../lib/firebaseInit';

const CoursesForm = ({courseData}) => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter()
    const ref = createRef();
    const [messageError, setMessageError] = useState(false);
    const [isLoadingImg, setIsLoadingImg] = useState(false)

    const [
        state, 
        disable, 
        handleOnChange, 
        handleOnChangeObjectiveInput, 
        handleAddObjetive, 
        handleAddConcept, 
        handleOnChangeConceptInput,
        handleAddSubConcept,
        handleOnChangeSubConceptInput,
        handleDeleteObjective,
        handleDeleteConcept,
        handleDeleteSubConcept,
        handleOnChangeImg
    ] = useHandleFormCourse(stateSchemaInfCourse, validationSchemaCourseAdd, disableSchemaCourse, courseData);

    const { title, description, teacher, price, enrollmentLimit, objectives, conceptList, img} = state;

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
            enqueueSnackbar(data.addCourse, {variant: 'success', anchorOrigin: {vertical: 'top', horizontal: 'center'}})
            router.push('http://localhost:3000/app/admin/courses');
        },
        onError: (error) => {
            enqueueSnackbar(error.message, {variant: 'error', anchorOrigin: {vertical: 'top', horizontal: 'center'}})
        }
    })
    
    //Si los objetivos agregados son igual a 6, desactiva el boton de agregar objetivos
    const isDisableButtonToAddObjectives = state.objectives.length === 6 ? true : false;

    //Estas funcion sube la imagen seleccionado por el usuario al bucket de firebase storage.
    const uploadImgToFirebaseStorage = (img) => {
        const storage = firebase.storage();
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`images/${img.file.name}`);

        return new Promise((resolve, rejects) => {
            const uploadTask = fileRef.put(img.file);
            uploadTask.on('state_changed', (snapshot) => {
                if(snapshot.state === 'running') {
                    setIsLoadingImg(true);
                }
            }, (error) => {rejects(error)}, () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    const file = {
                        filename: img.file.name,
                        mimetype: img.file.type,
                        url: downloadURL
                    }

                    resolve(file);
                })
            })
        });
    }
    
    //Ejecuta el Mutation addCourse o muestra si falta algun campo abligatorio.
    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (disable.status) {
            setMessageError(true);
            if(img.file === '' || img.file === undefined) {
                img.errorfield = true;
            }
        } else {
            setMessageError(false)
            const file = await uploadImgToFirebaseStorage(img);
            addCourse({
                variables: {
                    img: file
                }
            });
        }
    }

    //Abre el explorador de archivos para seleccionar una imagen.
    const handleOnClickSelectFile = (e) => {
        e.preventDefault();
        const inputFile = ref.current;
        inputFile.click();
    }



    const isMessageAlertError = messageError && disable.status ? <span className={styles.disableErrorAlert}>{disable.error}</span> : null;
    const anyApolloError = error ? <span className={styles.disableErrorAlert}>{error.message}</span> : null;
    const isLoadingMutation = loading || isLoadingImg ? <CircularProgress/> : <Button onClick={(e) => {handleAddCourse(e)}} style={{background: '#15639d', color:'#ffffff'}} variant='contained' startIcon={<PostAddIcon/>}>Crear curso</Button>

    return (
        <LayoutAdmin>
            <Head>
                <title>Crear curso | Profe Paco</title>
            </Head>
            <div className={styles.coursesFormLayout}>
                <div className={styles.coursesFormContainer}>
                    <form className={styles.formFlex}>
                       <div className={styles.formFirstInputs}>
                            <h2>Crear curso</h2>
                            <TextField label='Nombre del curso' size='small' error={state.title.errorfield} variant='outlined' name='title' value={state.title.value} onChange={handleOnChange}/>
                            <TextField label='Descripción' size='small' error={state.description.errorfield} rowsMax={5} variant='outlined' multiline={true} name='description' value={state.description.value} onChange={handleOnChange}/>
                            <TextField label='Profesor' size='small' error={state.teacher.errorfield} variant='outlined' name='teacher' value={state.teacher.value} onChange={handleOnChange}/>
                            <TextField placeholder='Precio' type='number' size='small' error={state.price.errorfield} variant='outlined' name='price' value={state.price.value} onChange={handleOnChange} InputProps={{startAdornment: (<InputAdornment position="start"><AttachMoneyIcon/></InputAdornment>)}}/>
                            <TextField label='Limit de alumnos' type='number' error={state.enrollmentLimit.errorfield} size='small' variant='outlined' name='enrollmentLimit' value={state.enrollmentLimit.value} onChange={handleOnChange}/>
                            <div className={styles.buttonToUpload}>
                                <Button startIcon={<ImageIcon/>} onClick={(e) => {handleOnClickSelectFile(e)}} component='span'>Seleccionar imagen</Button>
                                <TextField variant='standard' placeholder='Imagen no seleccionada' value={img.filename} error={img.errorfield}/>
                            </div>
                            <input ref={ref} name='img' id='contained-button-file' type='file' hidden onChange={(e) => {handleOnChangeImg(e)}}/>
                            <p>Objetivos(Mínimo:1):</p>
                            { state.objectives.map((item, index) => {
                                return (
                                    <div key={index} className={styles.objectiveContainer}>
                                        <TextField label='Objetivo' variant='outlined' error={item.errorfield} size='small' name='objective' value={item.value} fullWidth onChange={(e) => {handleOnChangeObjectiveInput(e, index)}}/>
                                        <Button onClick={(e) => {handleDeleteObjective(e, index)}} size='small' style={{color:'#ff5555'}}><DeleteIcon/></Button>
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
        </LayoutAdmin>

    )
}

export async function getServerSideProps({req}) {
    const session = await getSession({req});

    if ((!session || session.user.isAdmin !== true) && req) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default CoursesForm;