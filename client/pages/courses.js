import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import styles from './styles/courses.module.css';
import CourseCard from '../components/CourseCard';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '../apollo/querys';
import { initializeApollo } from '../components/hooks/apolloClient';

const Courses = () => {
    const {data, error, loading} = useQuery(CURRENT_USER, {fetchPolicy:'cache-and-network'});
    const { getUserAuth } = data;
    console.log(getUserAuth)
    return (
        <Layout useAuth={getUserAuth}>
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

export async function getStaticProps() {
    const apolloClient = await initializeApollo();
    await apolloClient.query({
        query: CURRENT_USER
    })

    return {
        props: {
            initialApolloState: apolloClient.cache.extract()
        }
    }
}

export default Courses;