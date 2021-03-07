import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './styles/CourseCard.module.css';
import { Fragment } from 'react';
import CourseFormDelete from './CourseFormDelete';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Image from 'next/image';
import EditIcon from '@material-ui/icons/Edit';

const CourseCard = ({baseUrl, deleteCourseComponent, title, teacher, id, enrollmentLimit, enrollmentUsers, urlImg, filename, editCourseComponent, baseUrlToEditCourse}) => {
    const router = useRouter();
    const [isCourseFormDelete, setIsCourseFormDelete] = useState(false);

    //Redirige a la ruta especificado con el id como objeto query.
    const handleOnClickCard = (e, id) => {
        e.preventDefault();
        router.push(`${baseUrl}`+`${id}`)
    }

    //Muestra el modal DeleteCourseComponent para eliminar el curso.
    const handleOnClickToDeleteCourse = () => {
        if(isCourseFormDelete) {
            setIsCourseFormDelete(false)
        } else {
            setIsCourseFormDelete(true)
        }
    }
    
    //Redirige a la ruta especificado con el id como objeto query.
    const handleOnClickButtonToEditCourse = (e, id) => {
        e.preventDefault();
        router.push(`${baseUrlToEditCourse}`+`${id}`);
    }

    
    const courseFormDelete = isCourseFormDelete ? <CourseFormDelete title={title} id={id} handleOnClickToDeleteCourse={handleOnClickToDeleteCourse}/> : null;
    const buttonToDeleteCourse = deleteCourseComponent ? <Button style={{background: '#ff5555', color: '#ffffff'}}  variant='contained' onClick={(e) => {handleOnClickToDeleteCourse(e)}}><DeleteIcon/></Button> : null;
    const buttonToEditCourse = editCourseComponent ? <Button variant='contained' style={{background: '#15639d', color: '#ffffff'}} onClick={(e) => {handleOnClickButtonToEditCourse(e, id)}}><EditIcon/></Button> : null;
    return (
        <Fragment>
            {courseFormDelete}
            <div className={styles.courseCard}>
                <div className={styles.imgContainer}>
                    <Image className={styles.imgBorderRadius} src={urlImg} alt={filename} quality={100} layout='fill' objectFit='cover' objectPosition='50 50'/>
                </div>
                <div className={styles.courseCard_inf} onClick={(e) => {handleOnClickCard(e, id)}}>
                    <h3>{title}</h3>
                    <p>{teacher}</p>
                </div>
                <div className={styles.courseCardButton}>
                    <p>Integrantes: {enrollmentUsers}/{enrollmentLimit}</p>
                    {buttonToDeleteCourse}
                    {buttonToEditCourse}
                </div>
            </div>       
        </Fragment>
    )
}

export default CourseCard;