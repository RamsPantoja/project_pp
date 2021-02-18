import React from 'react';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './styles/CourseCard.module.css';

const CourseCard = ({baseUrl, data, error, loading}) => {
    const router = useRouter();

    const handleOnClickCard = (e, id) => {
        e.preventDefault();
        router.push(`${baseUrl}`+`${id}`)
    }
    


    if (loading) {
        return <CircularProgress/>
    }

    if (error) {
        return <span className={styles.errorMessageApollo}>{error.message}</span>
    }

    return (
        <div className={styles.coursesList} >
            { data.getCourses.map((item) => {
                return (
                <div key={item.id} className={styles.courseCard} onClick={(e) => {handleOnClickCard(e, item.id)}}>
                    <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                    <div className={styles.courseCard_inf}>
                        <h3>{item.title}</h3>
                        <p>{item.teacher}</p>
                    </div>
                    <p>Integrantes: {item.enrollmentUsers.length}/{item.enrollmentLimit}</p>
                </div>
                )
            })}            
        </div>
    )
}

export default CourseCard;