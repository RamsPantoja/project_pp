import React from 'react';
import LayoutAdmin from '../../../../components/LayoutAdmin';
import styles from '../styles/coursesbyid.module.css';
import UserCard from '../../../../components/UserCard';
import { useQuery } from '@apollo/client';
import { GET_COURSE_BY_ID } from '../../../../apollo/querys';
import CircularProgress from '@material-ui/core/CircularProgress';

const CoursesById = () => {
    const {data, error, loading} = useQuery(GET_COURSE_BY_ID,{variables:{id: '601dec8278bdde0e48d7355d'}});

    const circularProgress = !data && loading ? <CircularProgress/> : data.getCourseById.enrollmentUsers.map((item) => { return (<UserCard key={item} firstname={item.firstname} lastname={item.lastname} email={item.email}/>)});
 

    return (
        <LayoutAdmin>
            <div className={styles.layoutCoursesById}>
                <div className={styles.courseInf}>
                    <img src='https://static.platzi.com/media/achievements/badge-basico-python-bdcc67b3-031d-4dce-8e78-5699fb243149.png'></img>
                    <h2>Curso Básico de Python</h2>
                    <p>Inicia en el mundo de la programación con el lenguaje de mayor crecimiento en el planeta: Python. Descubre qué es un algoritmo, y cómo se construye uno. Domina las variables, funciones, estructuras de datos, los condicionales y ciclos.</p>
                    <span>Bertha Alicia Naranjo</span>
                </div>
                <div className={styles.courseEnrollmentList}>
                    <h3>Alumnos inscritros:</h3>
                    <div className={styles.courseEnrollmentGrid}>
                        {circularProgress}
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}

export default CoursesById;