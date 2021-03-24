import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import styles from './styles/about.module.css';

const About = () => {
    return (
        <Layout>
            <Head>
                <title>Sobre nosotros | Profe Paco</title>
            </Head>
            <div className={styles.aboutContainer}>
                <div className={styles.aboutHeader}>
                    <h2>Sobre nosotros</h2>
                </div>
                <div className={styles.centerContent}>
                    <div className={styles.aboutContent}>
                        <h3>Profe. Paco</h3>
                        <p>El escenario es mi salón de clases, la nariz roja es mi corazón, mis manos hablan y mis palabras hacen ruido. Lo que algunos no dicen lo digo yo.</p>
                        <ul className={styles.curriculum}>
                            <li>Pedagogo</li>
                            <li>Licenciado en Educación Secundaria con Especialidad en Biología</li>
                            <li>Maestría en Docencia</li>
                            <li>Intérprete en LSM</li>
                            <li>Risoterapeuta</li>
                            <li>Premio Estatal en el 2015 y 2019</li>
                            <li>Conferencista</li>
                            <li>Edutuber</li>
                        </ul>
                        <div className={styles.descriptionAbout}>
                            <p>Profe. Paco, es una página de facebook que se creó en el año 2011 con el fin de ayudar a docentes y padres de familia con técnicas, materiales y actividades de aprendizaje, con la filosofía de aprender cantando, jugando y riendo, además de incorporar la risoterapia en las aulas;  comenzó a generar interés entre las personas de México y Latinoamérica, esta página de facebook actualmente cuenta con más 700 mil seguidores. </p>
                            <p>A partir de 2020, ante la necesidad de crear una forma de ayudar a los niños que estaban desde casa “aprendiendo”, nació Cazadores de letras, un curso diseñado para acompañar a niños de 5 a 7 años durante su proceso de adquirir la lectoescritura con la filosofía mencionada anteriormente; y sobre todo a costos muy accesibles. El curso ha tenido gran aceptación y debido a esto se abrió el curso a docentes que quisieran adquirir la metodología para aplicarla con sus alumnos.</p>
                            <p>Cerca de 800 niños y 400 docentes de México y Latinoamérica se han graduado de este primer curso con excelentes resultados.</p>
                            <p>Ahora, Profe. Paco cuenta con más cursos para niños y docentes.</p>
                            <p>La visión de Profe. Paco es seguir creciendo en cuanto a cursos y en un futuro cercano conferencias presenciales. </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default About;