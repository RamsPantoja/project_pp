import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './styles/CourseCard.module.css';
import { Fragment } from 'react';
import CourseFormDelete from './CourseFormDelete';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const CourseCard = ({baseUrl, deleteCourseComponent, title, teacher, id, enrollmentLimit, enrollmentUsers}) => {
    const router = useRouter();
    const [isCourseFormDelete, setIsCourseFormDelete] = useState(false);

    const handleOnClickCard = (e, id) => {
        e.preventDefault();
        router.push(`${baseUrl}`+`${id}`)
    }

    const handleOnClickToDeleteCourse = () => {
        if(isCourseFormDelete) {
            setIsCourseFormDelete(false)
        } else {
            setIsCourseFormDelete(true)
        }
    } 

    
    const courseFormDelete = isCourseFormDelete ? <CourseFormDelete title={title} handleOnClickToDeleteCourse={handleOnClickToDeleteCourse}/> : null;
    const buttonToDeleteCourse = deleteCourseComponent ? <Button style={{background: '#ff5555', color: '#ffffff'}}  variant='contained' onClick={(e) => {handleOnClickToDeleteCourse(e)}}><DeleteIcon/></Button> : null;

    return (
        <Fragment>
            {courseFormDelete}
            <div className={styles.courseCard}>
                <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                <div className={styles.courseCard_inf} onClick={(e) => {handleOnClickCard(e, id)}}>
                    <h3>{title}</h3>
                    <p>{teacher}</p>
                </div>
                <div className={styles.courseCardButton}>
                    <p>Integrantes: {enrollmentUsers}/{enrollmentLimit}</p>
                    {buttonToDeleteCourse}
                </div>
            </div>       
        </Fragment>
    )
}

export default CourseCard;