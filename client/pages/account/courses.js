import { useQuery } from '@apollo/client';
import { Button, CircularProgress } from '@material-ui/core';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import React from 'react';
import { GET_COURSES_BY_USER, GET_USER_BY_EMAIL } from '../../apollo/querys';
import Layout from '../../components/Layout';
import LayoutAccount from '../../components/LayoutAccount';
import styles from './styles/courses.module.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const Courses = ({userEmail}) => {
    const {data, loading, error} = useQuery(GET_USER_BY_EMAIL, {
        variables: {
            email: userEmail
        }
    })

    const {data: dataCourses, loading: loadingCourses, error: errorCourses} = useQuery(GET_COURSES_BY_USER, {
        variables: {
            userEmail: userEmail
        }
    })

    if(error || errorCourses) {
        return (error || errorCourses);
    }

    if(loading || loadingCourses) {
        return (
            <Layout>
                <Head>
                    <title>Cuenta | Profe Paco</title>
                </Head>
                <div className={styles.centerCircularProgress}>
                    <CircularProgress/>
                </div>
            </Layout>
        )
    }

    const {firstname} = data.getUserByEmail;

    return (
        <Layout>
            <Head>
                <title>Tus cursos | Profe Paco</title>
            </Head>
            <LayoutAccount userName={firstname}>
                <div className={styles.coursesContainer}>
                    <h3>Tus cursos</h3>
                    {
                        dataCourses.getCoursesByUser.map((course) => {
                            return (
                                <div key={course.id} className={styles.courseMiniCard}>
                                    <h4>{course.title}</h4>
                                    <p>{course.teacher}</p>
                                    <p>Pagado:{course.enrollmentUsers[0].payment}/{course.price}</p>
                                    {course.enrollmentUsers[0].payment === course.price ? <CheckCircleIcon/> : <Button variant='contained' size='small' style={{background: '#15639d', color: '#ffffff'}}>Pagar</Button>}    
                                </div>
                            )
                        })
                    }
                </div>
            </LayoutAccount>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const session = await getSession({req});
    if(!session && req) {
        return {
            redirect: {
                destination: '/app/signin',
                permanent: false
            }
        }
    }

    return {
        props: {
            userEmail: session.user.email
        }
    }
}

export default Courses;