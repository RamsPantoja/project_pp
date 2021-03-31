import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import styles from '../styles/course_id.module.css';
import { useQuery } from '@apollo/client';
import { GET_COURSE_BY_ID } from '../../apollo/querys';
import CircularProgress from '@material-ui/core/CircularProgress';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

const DescriptionCourse = ({id}) => {
    const [session, loading] = useSession();
    const router = useRouter();

    const {data, error, loading: loadingCourse} = useQuery(GET_COURSE_BY_ID, {
        variables: {id: id}
    })

    if (loadingCourse) {
        return (
            <Layout>
                <Head>
                    <title>Curso | Profe Paco</title>
                </Head>               
                <div className={styles.courseDescription_progress}>
                    <CircularProgress/>
                </div>
            </Layout>
        )
    }

    const {title, description, price, objectives, conceptList, coverImg, modeSuscription, enrollmentUsers, enrollmentLimit} = data.getCourseById;

    const handleOnClickSession = (e) => {
        e.preventDefault();
        if (session) {
            router.push(`/shopping/shopping_course/?id=${id}`)
        } else {
            signIn();
        }
    }

    const buttonToShoppingCourse = enrollmentUsers.length >= enrollmentLimit ? <div className={styles.fullCourseAlert}><span style={{paddingRight: '0.5em'}}>El curso está lleno</span><SentimentVeryDissatisfiedIcon/></div> : <button onClick={(e) => {handleOnClickSession(e)}}>{modeSuscription.isActivated ? 'SUSCRIBIRSE' : 'OBTENER'}</button>

    return (
        <Layout>
            <Head>
                <title>{title} | Profe Paco</title>
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
                        <span className={styles.typeCourse}>Tipo: {modeSuscription.isActivated ? 'Suscripción': 'Pago único'}</span>
                        <span className={styles.price}>{`$ ${price}`}</span>
                        {buttonToShoppingCourse}
                    </div>
                    <div className={styles.courseDescription_headerImg}>
                        <Image className={styles.borderImgRadius} src={coverImg.url} alt={coverImg.filename} quality={100} layout='fill' objectFit='cover'/>
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


export async function getServerSideProps({query}) {
    const id = query.id

    return {
        props: {
            id: id
        }
    }

}

export default DescriptionCourse;