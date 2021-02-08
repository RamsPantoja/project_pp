import React from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import styles from '../styles/course_id.module.css';
import {useQuery} from '@apollo/client';
import { GET_COURSE_BY_ID } from '../../apollo/querys';
import CircularProgress from '@material-ui/core/CircularProgress';

const DescriptionCourse = ({id}) => {

    const {data, error, loading} = useQuery(GET_COURSE_BY_ID, {
        variables: {id: id}
    })


    if (loading) {
        return (
            <Layout>
                <div className={styles.courseDescription_progress}>
                    <CircularProgress/>
                </div>
            </Layout>
        )
    }

    const {title, description, price, objectives, conceptList} = data.getCourseById;

    return (
        <Layout>
            <Head>
                <title>Profe Paco!</title>
            </Head>
            <div className={styles.courseDescription}>
                <div className={styles.courseDescription_header}>
                    <div className={styles.courseDescription_headerInf}>
                        <h2>{title}</h2>
                        <p>{description}</p>
                        <ul className={styles.objectiveList}>
                            { objectives.map((item, index) => {
                                return (
                                    <li key={index} className={styles.objective}>{item}</li>
                                )
                            })}
                        </ul>
                        <span className={styles.price}>{`$ ${price}`}</span>
                        <button>OBTENER CURSO</button>
                    </div>
                    <div className={styles.courseDescription_headerButton}>
                        <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                    </div>
                </div>
                <div className={styles.conceptContent}>
                    <div className={styles.conceptCourse}>
                        <h2>{`Temario del ${title}`}</h2>
                    </div>
                    <div className={styles.conceptBlock}>
                        {conceptList.map((item, index) => {
                            return (
                                <div key={index} className={styles.conceptBlock_grid}>
                                    <div className={styles.conceptTitle}>
                                        <h2>{item.concept}</h2>
                                    </div>
                                    <ul className={styles.subConceptList}>
                                        {item.subConceptList.map((subConcept, index) => {
                                            return (
                                                <li key={index} className={styles.subConcept}>{subConcept}</li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticPaths() {
    const paths = await getAllCourseIds();
    return {
        paths,
        fallback: false
    }
}

const getAllCourseIds = async () => {
    const res = await fetch('http://localhost:4200/courses');
    const data = await res.json();

    return data.map((item) => {
        return {
            params: {
                course_id: item.id
            }
        }
    });
}

export async function getStaticProps({params}) {
    return {
        props: {
            id: params.course_id
        }
    }
}

export default DescriptionCourse;