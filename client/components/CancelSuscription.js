import { useMutation } from '@apollo/client';
import { Button } from '@material-ui/core';
import React from 'react';
import { Fragment } from 'react';
import { CANCEL_PREAPPROVAL } from '../apollo/mutations';
import styles from './styles/CancelSuscription.module.css';
import { useSnackbar } from 'notistack';

const CancelSuscription = ({preapproval_id, handleOnClickCancelSuscriptionModal}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [cancelSuscription, {data, error, loading}] = useMutation(CANCEL_PREAPPROVAL, {
        variables: {
            preapproval_id: preapproval_id
        },
        onCompleted: (data) => {
            enqueueSnackbar(data.cancelPreapproval, { variant: 'success', anchorOrigin: { vertical: 'bottom', horizontal: 'left'}});
            handleOnClickCancelSuscriptionModal();
        },
        onError: (error) => {
            enqueueSnackbar(error.message, { variant: 'error', anchorOrigin: {vertical: 'bottom', horizontal: 'left'}});
            handleOnClickCancelSuscriptionModal()
        }
    })

    const handleOnClickCancelSuscription = (e) => {
        e.preventDefault();
        cancelSuscription();
    }

    return (
        <Fragment>
            <div className={styles.backgroundContainer}></div>
            <div className={styles.centerContainer}>
                <div className={styles.cardDetailsSuscription}>
                    <h3>¿Quieres cancelar la suscripción?</h3>
                    <p>Dejaremos de debitarle pagos a su tarjeta.</p>
                    <p>Ten en cuenta que luego no podrás volver a activar la suscripción.</p>
                    <div className={styles.buttons}>
                        <Button variant='contained' size='small' style={{backgroundColor: '#ff5555', color: '#ffffff'}} onClick={(e) => {handleOnClickCancelSuscription(e)}}>Sí, cancelar suscripción</Button>
                        <Button variant='contained' size='small' color='default' onClick={() => handleOnClickCancelSuscriptionModal()}>No, gracias</Button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default CancelSuscription;