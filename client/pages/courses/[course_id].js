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
                    </div>
                    <div>
                        <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                        <button>Adquirir curso</button>
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