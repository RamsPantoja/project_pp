import React from 'react';
import LayoutAdmin from '../../../../components/LayoutAdmin';
import styles from '../styles/coursesbyid.module.css';
import UserCard from '../../../../components/UserCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COURSE_BY_ID } from '../../../../apollo/querys';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DELETE_USER_IN_COURSE } from '../../../../apollo/mutations';
import { getSession } from 'next-auth/client';

const CoursesById = ({id}) => {
    const {data, error, loading} = useQuery(GET_COURSE_BY_ID,{variables:{id: id}, pollInterval: 1000});
    const [deleteUserInCourse, {data: dataDeleteUserInCourse, error: errorDeleteUserInCourse, loading: loadingDeleteUserInCourse}] = useMutation(DELETE_USER_IN_COURSE);


    const circularProgress = !data && loading ? <CircularProgress/> : data.getCourseById.enrollmentUsers.map((item, index) => { return (<UserCard error={errorDeleteUserInCourse} key={index} firstname={item.firstname} id={id} mutation={deleteUserInCourse} lastname={item.lastname} email={item.email}/>)});
    
    if (loading) {
        return (
            <LayoutAdmin>
                <div className={styles.layoutCoursesById}>
                    <div className={styles.centerCircularProgress}>
                        <CircularProgress/>
                    </div>
                </div>
            </LayoutAdmin>
        )
    }

    const { title, description, teacher} = data.getCourseById;

    return (
        <LayoutAdmin>
            <div className={styles.layoutCoursesById}>
                <div className={styles.courseInf}>
                    <img src='https://static.platzi.com/media/achievements/badge-basico-python-bdcc67b3-031d-4dce-8e78-5699fb243149.png'></img>
                    <h2>{title}</h2>
                    <p>{description}</p>
                    <span>{teacher}</span>
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

export async function getServerSideProps({query, req}) {
    const id = query.id;
    const session = await getSession({req});

    if ((!session || session.user.isAdmin !== true) && req ) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            id: id
        }
    }
}

export default CoursesById;