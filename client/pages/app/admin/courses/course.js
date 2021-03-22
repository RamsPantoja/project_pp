import React from 'react';
import LayoutAdmin from '../../../../components/LayoutAdmin';
import styles from '../styles/coursesbyid.module.css';
import UserCard from '../../../../components/UserCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COURSE_BY_ID, GET_USERS_IN_SUSCRIPTION } from '../../../../apollo/querys';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DELETE_USER_IN_COURSE } from '../../../../apollo/mutations';
import { getSession } from 'next-auth/client';
import Image from 'next/image';
import Head from 'next/head';
import { useSnackbar } from 'notistack';
import UserCardForSuscription from '../../../../components/UserCardForSuscription';

const CoursesById = ({id, preapproval_plan_id}) => {
    const {enqueueSnackbar} = useSnackbar();
    const {data, error, loading} = useQuery(GET_COURSE_BY_ID,{variables:{id: id}, pollInterval: 1000});

    //Obtiene todos los usuarios suscritos al curso.
    const { data: dataUsersFromApiMP, error: errorUsersFromApiMP, loading: loadingUsersFromApiMP, fetchMore} = useQuery(GET_USERS_IN_SUSCRIPTION, {
        variables: {
            limit: 100, 
            offset: 0,
            preapproval_plan_id: preapproval_plan_id
        }
    })

    //Este mutation elimina un usuario del curso.
    const [deleteUserInCourse, {data: dataDeleteUserInCourse, error: errorDeleteUserInCourse, loading: loadingDeleteUserInCourse}] = useMutation(DELETE_USER_IN_COURSE, {
        onCompleted: (data) => {
            enqueueSnackbar(data.deleteUserInCourse, {variant: 'success', anchorOrigin: {vertical: 'top', horizontal: 'center'}})
        },
        onError: (error) => {
            enqueueSnackbar(error.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center'}})
        }
    });
    
    if (loading || loadingUsersFromApiMP) {
        return (
            <LayoutAdmin>
                <div className={styles.layoutCoursesById}>
                    <div className={styles.centerCircularProgress}>
                        <CircularProgress/>
                    </div>
                </div>
            </LayoutAdmin>
        )
    }

    const { title, description, teacher, coverImg, modeSuscription} = data.getCourseById;

    const usersToPaginateFromApiMercadoPago = dataUsersFromApiMP?.getUsersInSuscription.map((user, index) => {
        return (
            <UserCardForSuscription key={index}
            payer_email={user.payer_email}
            status={user.status}
            date_created={user.date_created}
            end_date={user.end_date}
            quotas={user.quotas}
            charged_quantity={user.charged_quantity}
            charged_amount={user.charged_amount}
            last_charged_date={user.last_charged_date}/>
        )
    })

    const usersToPaginateInEnrollmentUsers = data.getCourseById.enrollmentUsers.map((item, index) => { 
        return (
            <UserCard 
            payment={item.payment} 
            coursePrice={data.getCourseById.price} 
            error={errorDeleteUserInCourse} 
            key={index} 
            firstname={item.firstname} 
            id={id} 
            mutation={deleteUserInCourse} 
            lastname={item.lastname} 
            email={item.email}/>
        )
    });

    const whichUsersToPaginate = modeSuscription.isActivated ? usersToPaginateFromApiMercadoPago : usersToPaginateInEnrollmentUsers;
    //const buttonToLoadMore = modeSuscription.isActivated ? <Button variant='contained' style={{backgroundColor: '#15639d', color: '#ffffff'}} onClick={() => fetchMore({variables: {offset: dataUsersFromApiMP.getUsersInSuscription.length}})}>Cargar más</Button> : null;

    return (
        <LayoutAdmin>
            <Head>
                <title>{title} | Profe Paco</title>
            </Head>
            <div className={styles.layoutCoursesById}>
                <div className={styles.courseInf}>
                    <div className={styles.imageContainer}>
                        <Image src={coverImg.url} className={styles.imageBorderRadius} layout='fill' objectFit='cover' objectPosition='50 50'/>
                    </div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                    <span>Tipo: {modeSuscription.isActivated ? 'Suscripción' : 'Pago único'}</span>
                    <span>{teacher}</span>
                </div>
                <div className={styles.courseEnrollmentList}>
                    <h3>Alumnos inscritros:</h3>
                    <div className={styles.courseEnrollmentGrid}>
                        {whichUsersToPaginate}
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}

export async function getServerSideProps({query, req}) {
    const {id, preapproval_plan_id} = query;
    const session = await getSession({req});

    if ((!session || session.user.isAdmin !== true) && req ) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            id: id,
            preapproval_plan_id: preapproval_plan_id
        }
    }
}

export default CoursesById;