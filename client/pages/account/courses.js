import { Button } from '@material-ui/core';
import React from 'react';
import Layout from '../../components/Layout';
import LayoutAccount from '../../components/LayoutAccount';
import styles from './styles/courses.module.css';

const Courses = () => {
    return (
        <Layout>
            <LayoutAccount>
                <div className={styles.coursesContainer}>
                    <h3>Tus cursos</h3>
                    <div className={styles.courseMiniCard}>
                        <h4>Curso básico de Python</h4>
                        <p>Bertha Alicia</p>
                        <p>Pagado:750/1500</p>
                        <Button variant='contained' size='small' style={{background: '#15639d', color: '#ffffff'}}>Pagar</Button>
                    </div>
                </div>
            </LayoutAccount>
        </Layout>
    )
}

export default Courses;