import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import styles from './styles/courses.module.css';
import CourseCard from '../components/CourseCard';
import { GET_COURSES } from '../apollo/querys';
import { useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';

const Courses = () => {
    const {data, error, loading} = useQuery(GET_COURSES, {fetchPolicy: 'cache-and-network'});

    if (loading) {
        return (
            <Layout>
                <Head>
                    <title>Cursos | Profe Paco</title>
                </Head>                
                <div className={styles.centerCircularProgress}><CircularProgress/></div>
            </Layout>
        )
    }

    if (error) {
        return <span className={styles.errorMessageApollo}>{error.message}</span>
    }


    return (
        <Layout>
            <Head>
                <title>Cursos | Profe Paco</title>
            </Head>
            <div className={styles.coursesContainer}>
                <div className={styles.coursesHeader}>
                    <h1>Nuestros Cursos</h1>
                </div>
                <div className={styles.flexContent}>
                    <div className={styles.centerContent}>
                        <div className={styles.coursesContent}>
                            { data.getCourses.map((course) => {
                                return (
                                    <CourseCard key={course.id}
                                    baseUrl={'/courses/course?id='}
                                    title={course.title}
                                    teacher={course.teacher}
                                    id={course.id}
                                    deleteCourseComponent={false}
                                    enrollmentLimit={course.enrollmentLimit}
                                    enrollmentUsers={course.enrollmentUsers.length}
                                    urlImg={course.coverImg.url}
                                    filename={course.coverImg.filename}/>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Courses;