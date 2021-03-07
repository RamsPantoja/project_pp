import React from 'react';
import styles from './styles/IsConfirmated.module.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const IsConfirmated = () => {
    return (
        <div className={styles.confirmatedContainer}>
            <CheckCircleIcon style={{color: '#4caf50'}}/>
            <h3>Email confirmado!</h3>
        </div>
    )
}

export default IsConfirmated;