import React, { useState } from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/courses_admin.module.css';
import AddIcon from '@material-ui/icons/Add';
import CourseCard from '../../../components/CourseCard';
import { getSession } from 'next-auth/client';
import { useRouter }from 'next/router';
import { GET_COURSES } from '../../../apollo/querys';
import { useQuery } from '@apollo/client';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';
import CourseFormDelete from '../../../components/CourseFormDelete';
import { initializeApollo } from '../../../components/hooks/apolloClient';

const CoursesAdmin = () => {
    const router = useRouter();
    const {data, error, loading} = useQuery(GET_COURSES, {pollInterval: 1000})
    const [isCourseFormDelete, setIsCourseFormDelete] = useState(false);

    const handleOnClickToAddCourse = (e) => {
        e.preventDefault();
        router.push('/app/admin/courses_form');
    }

    const handleOnClickToDeleteCourse = () => {
        if(isCourseFormDelete) {
            setIsCourseFormDelete(false)
        } else {
            setIsCourseFormDelete(true)
        }
    }   

    const courseFormDelete = isCourseFormDelete ? <CourseFormDelete handleOnClickToDeleteCourse={handleOnClickToDeleteCourse}/> : null;

    return (
        <LayoutAdmin>
            <div className={styles.toPositionFixed}>
                {courseFormDelete}
                <div className={styles.coursesContainer}>
                    <div className={styles.header}>
                        <h3>Cursos</h3>
                        <Button variant='contained' style={{background: '#15639d', color: '#ffffff'}} onClick={(e) => {handleOnClickToAddCourse(e)}}>
                            <AddIcon/>
                        </Button>
                        <Button style={{background: '#ff5555', color: '#ffffff'}}  variant='contained' onClick={handleOnClickToDeleteCourse}>
                            <DeleteIcon/>
                        </Button>
                    </div>
                    <div className={styles.coursesGrid}>
                        <CourseCard baseUrl={'/app/admin/courses/'} data={data} error={error} loading={loading}/>
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
                destination:'http://localhost:3000/',
                permanent: false
            }
        }
    }

    return {
        props:{}
    }
}

export default CoursesAdmin;