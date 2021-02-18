import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import styles from './styles/courses.module.css';
import CourseCard from '../components/CourseCard';
import { GET_COURSES } from '../apollo/querys';
import { useQuery } from '@apollo/client';

const Courses = () => {
    const {data, error, loading} = useQuery(GET_COURSES, {fetchPolicy: 'cache-and-network'})
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
                    <CourseCard baseUrl={'/courses/'} data={data} error={error} loading={loading}/>
                </div>
            </div>
        </Layout>
    )
}

export default Courses;