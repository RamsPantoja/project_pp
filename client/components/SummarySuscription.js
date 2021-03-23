import { Button } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { Fragment } from 'react';
import styles from './styles/SummarySuscription.module.css';

const SummarySuscription = ({status, payer_email, date_created, end_date, quotas, charged_quantity, charged_amount, handleOnClickButtonDetails, last_charged_date}) => {
    const lastDaySuscription = moment(last_charged_date).add(1, 'month');
    const haveAccess = moment().isAfter(lastDaySuscription._d);

    return (
        <Fragment>
            <div className={styles.backgroundContainer}></div>
            <div className={styles.centerContainer}>
                <div className={styles.cardDetailsSuscription}>
                    <h3>{payer_email}</h3>
                    <div className={styles.cardDetail}>
                        <p>Fecha de adhesión</p>
                        <p>{moment(date_created).format('YYYY-MM-DD')}</p>
                    </div>
                    <div className={styles.cardDetail}>
                        <p>Pagos recibidos</p>
                        <p>{charged_quantity ? charged_quantity : 0}/{quotas}</p>
                    </div>
                    <div className={styles.cardDetail}>
                        <p>Duración de la suscripción</p>
                        <p>{status === 'cancelled' ? moment(lastDaySuscription._d).format('YYYY-MM-DD') : moment(end_date).format('YYYY-MM-DD')}</p>
                    </div>
                    <div className={styles.cardDetail}>
                        <p>Monto total recibido</p>
                        <p>{charged_amount ? charged_amount : 0}</p>
                    </div>
                    <div className={styles.cardDetail}>
                        <p>Fecha de último cargo</p>
                        <p>{moment(last_charged_date).format('YYYY-MM-DD')}</p>
                    </div>
                    <div className={styles.cardDetail}>
                        <p>Acceso al curso</p>
                        <p>{haveAccess ? 'Denegado' : 'Permitido'}</p>
                    </div>
                    <Button size='small' variant='contained' style={{backgroundColor: '#15629c', color: '#ffffff'}} onClick={(e) => {handleOnClickButtonDetails(e)}}>Aceptar</Button>
                </div>
            </div>
        </Fragment>
    )
}

export default SummarySuscription;