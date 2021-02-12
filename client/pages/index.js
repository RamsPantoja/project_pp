import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import styles from './styles/Index.module.css';
import {getSession, useSession} from 'next-auth/client';

const HomePage = () => {
    return (
        <Layout>
            <Head>
                <title>Profe Paco!</title>
            </Head>
            <div className={styles.home_container}>
                <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                <h1>Fórmate online como profesional en tecnología</h1>
                <p>70% de los graduados de Platzi duplican sus ingresos 20% crean su propia empresa de tecnología o startup</p>
            </div>
            <div className={styles.featureList_container}>
                <ul className={styles.feature_list}>
                    <li className={styles.cardFeature}>Escuelas con nuevas formas de aprendizaje para profundizar en lo que quieres triunfar.</li>
                    <li className={styles.cardFeature}>Más de 600 cursos para crear tu ruta personalizada y adquirir habilidades específicas.</li>
                    <li className={styles.cardFeature}>Contenido actualizado, nuevos cursos, blog posts y podcasts cada semana.</li>
                </ul>
            </div>
            <div className={styles.featureList2_container}>
                <img src='https://static.platzi.com/static/images/landing/default/core.png'></img>
                <div className={styles.featureList2_right}>
                    <h2>La mejor experiencia de aprendizaje</h2>
                    <ul className={styles.feature_list2}>                    
                        <li className={styles.cardFeature2}>Clases prácticas, concretas y enfocadas en las habilidades de mayor demanda laboral.</li>
                        <li className={styles.cardFeature2}>Diplomas de certificación físicos de las Escuelas aprobadas.</li>
                        <li className={styles.cardFeature2}>Descarga las clases con la app y estudia en cualquier lugar sin conexión.</li>
                        <li className={styles.cardFeature2}>Tus profesores serán personas líderes reconocidas en sus respectivas industrias.</li>
                        <li className={styles.cardFeature2}>Platzi CDN, ten la mejor experiencia sin importar la velocidad de tu conexión.</li>
                        <li className={styles.cardFeature2}>Te ayudamos a construir una ruta de aprendizaje específica para ti. Contáctanos</li>
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage;