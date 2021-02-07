import React from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import styles from '../styles/course_id.module.css';

const DescriptionCourse = ({id}) => {
    return (
        <Layout>
            <Head>
                <title>Profe Paco!</title>
            </Head>
            <div className={styles.courseDescription}>
                <div className={styles.courseDescription_header}>
                    <div className={styles.courseDescription_headerInf}>
                        <h2>Curso Básico de Python</h2>
                        <p>Inicia en el mundo de la programación con el lenguaje de mayor crecimiento en el planeta: Python. Descubre qué es un algoritmo, y cómo se construye uno. Domina las variables, funciones, estructuras de datos, los condicionales y ciclos.</p>
                        <ul className={styles.objectiveList}>
                            <li className={styles.objective}>Hacer estructuras de datos</li>
                            <li className={styles.objective}>Crear bucles</li>
                            <li className={styles.objective}>Conocer herramientas para programar</li>
                            <li className={styles.objective}>Aprender conceptos básicos de Python</li>
                        </ul>
                        <span className={styles.price}>$1400</span>
                        <button>OBTENER CURSO</button>
                    </div>
                    <div className={styles.courseDescription_headerButton}>
                        <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                    </div>
                </div>
                <div className={styles.conceptContent}>
                    <div className={styles.conceptCourse}>
                        <h2>Temario del Curso Básico de Python</h2>
                    </div>
                    <div className={styles.conceptBlock}>
                        <div className={styles.conceptBlock_grid}>
                            <div className={styles.conceptTitle}>
                                <h2>Introducción a la programación con Python</h2>
                            </div>
                            <ul className={styles.subConceptList}>
                                <li className={styles.subConcept}>El arte de la programación</li>
                                <li className={styles.subConcept}>¿Por que Python?</li>
                                <li className={styles.subConcept}>El nucleo de un programa: los algoritmos</li>
                            </ul>
                        </div>
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