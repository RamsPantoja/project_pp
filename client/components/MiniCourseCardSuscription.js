import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { Fragment } from 'react';
import styles from '../pages/account/styles/courses.module.css';
import SummarySuscriptionForClient from './SummarySuscriptionForClient';
import CancelSuscription from './CancelSuscription';

const MiniCourseCardSuscription = ({course}) => {
    const [isSummarySuscription, setIsSummarySuscription] = useState(false);
    const [isCancelSuscription, setIsCancelSuscription] = useState(false);

    const {title, teacher, enrollmentUsers} = course
    
    const handleOnClickButtonDetails = (e) => {
        e.preventDefault();
        if (isSummarySuscription) {
            setIsSummarySuscription(false)
        } else {
            setIsSummarySuscription(true)
        }
    }

    const handleOnClickCancelSuscriptionModal = () => {
        if (isCancelSuscription) {
            setIsCancelSuscription(false);
        } else {
            setIsCancelSuscription(true)
        }
    }

    const summarySuscription = isSummarySuscription ? <SummarySuscriptionForClient handleOnClickCancelSuscriptionModal={handleOnClickCancelSuscriptionModal} handleOnClickButtonDetails={handleOnClickButtonDetails} payer_email={enrollmentUsers[0].email} preapproval_id={enrollmentUsers[0].preapproval_id}/> : null;
    const cancelSuscription = isCancelSuscription ? <CancelSuscription handleOnClickCancelSuscriptionModal={handleOnClickCancelSuscriptionModal} preapproval_id={enrollmentUsers[0].preapproval_id}/> : null;
    return (
        <Fragment>
            {summarySuscription || cancelSuscription}
            <div className={styles.courseMiniCard}>
                <h4>{title}</h4>
                <p>{teacher}</p>
                <p>Estado: {enrollmentUsers[0].status === 'authorized' ? 'Activada' : 'Cancelada'}</p>
                <Button size='small' style={{backgroundColor: '#15639d', color: '#ffffff'}} onClick={(e) => {handleOnClickButtonDetails(e)}}>Detalles</Button>
            </div>
        </Fragment>
    )
}

export default MiniCourseCardSuscription;