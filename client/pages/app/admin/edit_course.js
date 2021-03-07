import { useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import React from 'react';
import { GET_COURSE_BY_ID } from '../../../apollo/querys';
import EditCourseForm from '../../../components/EditCourseForm';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/edit_course.module.css';

const EditCourse = ({id}) => {
    const { data, error, loading } = useQuery(GET_COURSE_BY_ID, {
        variables: {
            id: id
        }
    });

    if(loading) {
        return (
            <LayoutAdmin>
                <Head>
                    <title>Editar curso | Profe Paco</title>
                </Head>
                <div className={styles.toPositionFixed}>
                    <div className={styles.centerCircularProgress}>
                        <CircularProgress/>
                    </div>
                </div>
            </LayoutAdmin>
        )
    }

    if(error) {
        return `${error.message}`
    }

    const {getCourseById} = data;

    return (
        <LayoutAdmin>
            <Head>
                <title>Editar curso | Profe Paco</title>
            </Head>
            <EditCourseForm courseData={getCourseById} id={id}/>
        </LayoutAdmin>
    )
}

export async function getServerSideProps({req, query}) {
    const session = await getSession({req});
    const { id } = query
    if ((!session || session.user.isAdmin !== true) && req) {
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

export default EditCourse;