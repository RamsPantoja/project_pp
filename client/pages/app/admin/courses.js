import React, { useState } from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/courses_admin.module.css';
import AddIcon from '@material-ui/icons/Add';
import CourseCard from '../../../components/CourseCard';
import { getSession } from 'next-auth/client';
import { useRouter }from 'next/router';
import { GET_COURSES } from '../../../apollo/querys';
import { useQuery } from '@apollo/client';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Head from 'next/head';

const CoursesAdmin = () => {
    const router = useRouter();
    const {data, error, loading} = useQuery(GET_COURSES, {pollInterval: 1000})

    if (loading) {
        return (
            <LayoutAdmin>
                <div className={styles.toPositionFixed}>
                    <div className={styles.centerCircularProgress}>
                        <CircularProgress/>
                    </div>
                </div>
            </LayoutAdmin>
        )
    }

    if (error) {
        return (
            <LayoutAdmin>
                <span className={styles.errorMessageApollo}>{error.message}</span>
            </LayoutAdmin>
        )
    }

    const handleOnClickToAddCourse = (e) => {
        e.preventDefault();
        router.push('/app/admin/courses_form');
    }

    return (
        <LayoutAdmin>
            <Head>
                <title>Cursos | Profe Paco</title>
            </Head>
            <div className={styles.toPositionFixed}>
                <div className={styles.coursesContainer}>
                    <div className={styles.header}>
                        <h3>Cursos</h3>
                        <Button variant='contained' style={{background: '#15639d', color: '#ffffff'}} onClick={(e) => {handleOnClickToAddCourse(e)}}>
                            <AddIcon/>
                        </Button>
                    </div>
                    <div className={styles.coursesGrid}>
                        {data.getCourses.map((course) => {
                            return (
                                <CourseCard key={course.id} 
                                baseUrl={'/app/admin/courses/course/?id='}
                                baseUrlToEditCourse={'/app/admin/edit_course/?id='}
                                deleteCourseComponent={true}
                                editCourseComponent={true}
                                title={course.title}
                                teacher={course.teacher}
                                id={course.id}
                                enrollmentLimit={course.enrollmentLimit}
                                enrollmentUsers={course.enrollmentUsers.length}
                                filename={course.coverImg.filename}
                                urlImg={course.coverImg.url}/>
                            )
                        })}
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}


export async function getServerSideProps({req}) {
    const session = await getSession({req});
    if ((!session || session.user.isAdmin !== true) && req) {
        return {
            redirect: {
                destination:'/',
                permanent: false
            }
        }
    }

    return {
        props:{}
    }
}

export default CoursesAdmin;