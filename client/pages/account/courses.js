import { useMutation, useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import React from 'react';
import { GET_COURSES_BY_USER, GET_USER_BY_EMAIL } from '../../apollo/querys';
import Layout from '../../components/Layout';
import LayoutAccount from '../../components/LayoutAccount';
import styles from './styles/courses.module.css';
import MiniCourseCard from '../../components/MiniCourseCard';
import { CREATE_PREFERENCE_MERCADO_PAGO } from '../../apollo/mutations';
import { useRouter } from 'next/router';
import MiniCourseCardSuscription from '../../components/MiniCourseCardSuscription';

const Courses = ({userEmail}) => {
    const router = useRouter();
    const {data, loading, error} = useQuery(GET_USER_BY_EMAIL, {
        variables: {
            email: userEmail
        }
    })

    //Hace un query de todos los cursos que ha comprado el usuario logeado.
    const {data: dataCourses, loading: loadingCourses, error: errorCourses} = useQuery(GET_COURSES_BY_USER, {
        variables: {
            userEmail: userEmail
        }
    })

    //Se define el metodo para crear la prefencia de mercado pago que retornara el link para iniciar el flujo de pago.
    const [createPreferenceMercadoPago, {data: dataPrefenceMP, error: errorPreferenceMP, loading: loadingPreferenceMP}] = useMutation(CREATE_PREFERENCE_MERCADO_PAGO, {
        onCompleted: (dataPrefenceMP) => {
            router.push(dataPrefenceMP.createPreferenceMercadoPago);
        }
    });

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

    const {firstname, lastname, email} = data.getUserByEmail;

    return (
        <Layout>
            <Head>
                <title>Tus cursos | Profe Paco</title>
            </Head>
            <LayoutAccount userName={firstname}>
                <div className={styles.coursesContainer}>
                    <h3>Tus cursos</h3>
                    {
                        dataCourses.getCoursesByUser.length === 0 ? <p>No tienes ningún curso aun :(</p> :
                            dataCourses.getCoursesByUser.map((course, index) => {
                                if (course.modeSuscription.isActivated) {
                                    return (
                                        <MiniCourseCardSuscription key={course.id} course={course}/>
                                    )
                                } else {
                                    return (
                                        <MiniCourseCard key={course.id} 
                                        course={course}
                                        index={index} 
                                        mutation={createPreferenceMercadoPago}
                                        firstname={firstname}
                                        lastname={lastname}
                                        email={email}
                                        loadingPreferenceMP={loadingPreferenceMP}/>
                                    )
                                }
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