import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import styles from './styles/courses.module.css';
import CourseCard from '../components/CourseCard';

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
                    <CourseCard/>
                </div>
            </div>
        </Layout>
    )
}

export default Courses;