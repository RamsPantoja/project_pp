import React from 'react';
import Layout from '../components/layout';
import Head from 'next/head';
import styles from './styles/Index.module.css';

const HomePage = () => {
    return (
        <Layout>
            <Head>
                <title>Profe Paco!</title>
            </Head>
            <div className={styles.home_container}>
                <h1>Fórmate online como profesional en tecnología</h1>
                <p>70% de los graduados de Platzi duplican sus ingresos 20% crean su propia empresa de tecnología o startup</p>
                <ul className={styles.feature_list}>
                    <li className={styles.cardFeature}>Escuelas con nuevas formas de aprendizaje para profundizar en lo que quieres triunfar.</li>
                    <li className={styles.cardFeature}>Más de 600 cursos para crear tu ruta personalizada y adquirir habilidades específicas.</li>
                    <li className={styles.cardFeature}>Contenido actualizado, nuevos cursos, blog posts y podcasts cada semana.</li>
                </ul>
            </div>
        </Layout>
    )
}

export default HomePage;