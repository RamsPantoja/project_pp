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
                        <div className={styles.courseCard}>1</div>
                        <div className={styles.courseCard}>2</div>
                        <div className={styles.courseCard}>3</div>
                        <div className={styles.courseCard}>4</div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Courses;