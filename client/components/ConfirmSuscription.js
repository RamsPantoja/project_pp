import { Button } from '@material-ui/core';
import React from 'react';
import { Fragment } from 'react';
import styles from './styles/ConfirmSuscription.module.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import moment from 'moment';

const ConfirmSuscription = ({mutation, handleOnClickSetConfirmSuscription, title, price, email, modeSuscription}) => {

    const handleOnClickConfirm = (e) => {
        e.preventDefault();
        mutation({
            variables: {
                input: {
                    title: title,
                    price: parseFloat(price),
                    email: email,
                    amountMonths: modeSuscription.amountMonths,
                    start_date: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                    end_date: moment().add((modeSuscription.amountMonths * 31), 'days').format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                }
            }    
        });
        handleOnClickSetConfirmSuscription();
    }

    return (
        <Fragment>
            <div className={styles.backgroundContainer}></div>
            <div className={styles.confirmSuscription}>
                <div className={styles.cardConfirmSuscription}>
                    <h4>Suscripción mensual</h4>
                    <p>Una vez realices la suscripción, se te hará un cargo de $10 a tu tarjeta para validarla, una vez hecho esto, se te hará la devolución automáticamente a tu tarjeta.</p>
                    <p>Luego de suscribirse, el pago de la la primera cuota se acreditará en 1 hora.</p>
                    <div className={styles.buttons}>
                        <Button size='small' variant='contained' startIcon={<CancelIcon/>} onClick={() => handleOnClickSetConfirmSuscription()} >cancelar</Button>
                        <Button size='small' variant='contained' startIcon={<CheckCircleIcon/>} style={{backgroundColor: '#dbf998', color: '#15639c'}} onClick={(e) => {handleOnClickConfirm(e)}}>confirmar</Button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ConfirmSuscription;