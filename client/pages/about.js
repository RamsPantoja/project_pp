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
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default About;