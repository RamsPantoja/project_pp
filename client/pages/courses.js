import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import styles from './styles/courses.module.css';

const Courses = () => {
    return (
        <Layout>
            <Head>
                <title>Profe Paco</title>
            </Head>
            <div className={styles.coursesContainer}>
                <div className={styles.coursesHeader}>
                    <h1>Nuestros Cursos</h1>
                </div>
                <div className={styles.coursesContent}>
                    <div className={styles.coursesList}>
                        <div className={styles.courseCard}>
                            <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                            <div className={styles.courseCard_inf}>
                                <h3>Nombre del curso</h3>
                                <p>Nombre del profesor</p>
                            </div>
                            <p>Integrantes: 5/30</p>
                        </div>
                        <div className={styles.courseCard}>
                            <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                            <div className={styles.courseCard_inf}>
                                <h3>Nombre del curso</h3>
                                <p>Nombre del profesor</p>
                            </div>
                            <p>Integrantes: 5/30</p>
                        </div>
                        <div className={styles.courseCard}>
                            <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                            <div className={styles.courseCard_inf}>
                                <h3>Nombre del curso</h3>
                                <p>Nombre del profesor</p>
                            </div>
                            <p>Integrantes: 5/30</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Courses;