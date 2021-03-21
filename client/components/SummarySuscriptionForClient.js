import { useQuery } from '@apollo/client';
import { Button, CircularProgress } from '@material-ui/core';
import React from 'react';
import { Fragment } from 'react';
import { GET_PREAPPROVAL } from '../apollo/querys';
import styles from './styles/SummarySuscription.module.css';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const SummarySuscriptionForClient = ({payer_email, handleOnClickButtonDetails, preapproval_id, handleOnClickCancelSuscriptionModal}) => {
    const {data, error, loading} = useQuery(GET_PREAPPROVAL, {
        variables: {
            preapproval_id: preapproval_id,
            email: payer_email
        }
    })

    if (loading) {
        return (
            <Fragment>
                <div className={styles.backgroundContainer}></div>
                <div className={styles.centerContainer}>
                    <div className={styles.centerCircularProgress}>
                        <CircularProgress/>
                    </div>
                </div>
            </Fragment>
        )
    }

    const handleOnClickButtonCancelSuscription = (e) => {
        e.preventDefault();
        handleOnClickButtonDetails(e);
        handleOnClickCancelSuscriptionModal();
    }

    const {date_created, charged_amount, charged_quantity, quotas, end_date, last_charged_date} = data.getPreapproval[0];

    return (
        <Fragment>
            <div className={styles.backgroundContainer}></div>
            <div className={styles.centerContainer}>
                <div className={styles.cardDetailsSuscription}>
                    <h3>{payer_email}</h3>
                    <div className={styles.cardDetail}>
                        <p>Fecha de adhesión</p>
                        <p>{date_created}</p>
                    </div>
                    <div className={styles.cardDetail}>
                        <p>Pagos recibidos</p>
                        <p>{charged_quantity ? charged_quantity : 0}/{quotas}</p>
                    </div>
                    <div className={styles.cardDetail}>
                        <p>Duración de la suscripción</p>
                        <p>{end_date}</p>
                    </div>
                    <div className={styles.cardDetail}>
                        <p>Monto total recibido</p>
                        <p>{charged_amount ? charged_amount : 0}</p>
                    </div>
                    <div className={styles.cardDetail}>
                        <p>Fecha de último cargo</p>
                        <p>{last_charged_date}</p>
                    </div>
                    <div className={styles.buttons}>
                        <Button startIcon={<ArrowBackIosIcon/>} size='small' variant='contained' style={{backgroundColor: '#15629c', color: '#ffffff'}} onClick={(e) => {handleOnClickButtonDetails(e)}}>volver</Button>
                        <Button size='small' variant='contained' style={{backgroundColor: '#ff5555', color: '#ffffff'}} onClick={(e) => {handleOnClickButtonCancelSuscription(e)}}>cancelar suscripción</Button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SummarySuscriptionForClient;