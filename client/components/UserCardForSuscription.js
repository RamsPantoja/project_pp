import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import styles from './styles/UserCardForSuscription.module.css';
import cn from 'classnames';
import SummarySuscription from './SummarySuscription';
import { Fragment } from 'react';

const UserCardForSuscription = ({payer_email, status, date_created, end_date, quotas, charged_quantity, charged_amount, last_charged_date}) => {
    const [isSummarySuscription, setIsSummarySuscription] = useState(false);

    const handleOnClickButtonDetails = (e) => {
        e.preventDefault();
        if(isSummarySuscription) {
            setIsSummarySuscription(false)
        } else {
            setIsSummarySuscription(true)
        }
    }

    const summarySuscription = isSummarySuscription ? <SummarySuscription last_charged_date={last_charged_date} handleOnClickButtonDetails={handleOnClickButtonDetails} payer_email={payer_email} date_created={date_created} end_date={end_date} quotas={quotas} charged_quantity={charged_quantity} charged_amount={charged_amount}/> : null;

    return (
        <Fragment>
            {summarySuscription}
            <div className={
                cn({
                    [styles.userCardForSuscriptionCancelled]: status === 'cancelled',
                    [styles.userCardForSuscriptionAuthorized]: status === 'authorized'
                })
            }>
                <div className={styles.userCardInf}>
                    <h4>{payer_email}</h4>
                    <div className={styles.status}>Estado:<p>{status}</p></div>
                </div>
                <div className={styles.buttonContainer}>
                    <Button size='small' variant='contained' style={{backgroundColor: '#15629c', color: '#ffffff'}} onClick={(e) => {handleOnClickButtonDetails(e)}}>Detalles</Button>
                </div>
            </div>
        </Fragment>
    )
}

export default UserCardForSuscription;