import React from 'react';
import LayoutAdmin from '../../../../components/LayoutAdmin';
import styles from '../styles/coursesbyid.module.css';
import UserCard from '../../../../components/UserCard';
import { useQuery } from '@apollo/client';
import { GET_COURSES, GET_COURSE_BY_ID } from '../../../../apollo/querys';
import CircularProgress from '@material-ui/core/CircularProgress';
import { initializeApollo } from '../../../../components/hooks/apolloClient';

const CoursesById = ({id}) => {
    const {data, error, loading} = useQuery(GET_COURSE_BY_ID,{variables:{id: id}});

    const circularProgress = !data && loading ? <CircularProgress/> : data.getCourseById.enrollmentUsers.map((item, index) => { return (<UserCard key={index} firstname={item.firstname} lastname={item.lastname} email={item.email}/>)});
    if (loading) {
        return (
            <LayoutAdmin>
                <div className={styles.layoutCoursesById}>
                    <CircularProgress/>
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


export async function getStaticPaths() {
    const apolloClient = initializeApollo();
    const {data} = await apolloClient.query({query: GET_COURSES})

    const paths = data.getCourses.map((course) => ({
        params: {
            coursesbyid: course.id
        }
    }));

    return {paths, fallback: false}
}

export async function getStaticProps({params}) {
    return {
        props: {
            id: params.coursesbyid
        }
    }
}

export default CoursesById;