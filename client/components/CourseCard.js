import React, { Fragment } from 'react';
import {GET_COURSES} from '../apollo/querys';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './styles/CourseCard.module.css';

const CourseCard = () => {
    const {data, error, loading} = useQuery(GET_COURSES);

    const router = useRouter();

    const handleOnClickCard = (e, id) => {
        e.preventDefault();
        router.push(`/courses/${id}`)
    }
    
    if (loading) {
        return <CircularProgress/>
    }

    return (
        <div className={styles.coursesList}>
            { data.getCourses.map((item) => {
                return (
                <div key={item.id}className={styles.courseCard} onClick={(e) => {handleOnClickCard(e, item.id)}}>
                    <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                    <div className={styles.courseCard_inf}>
                        <h3>{item.title}</h3>
                        <p>{item.teacher}</p>
                    </div>
                    <p>Integrantes: 0/{item.enrollmentLimit}</p>
                </div>
                )
            })}            
        </div>
    )
}

export default CourseCard;