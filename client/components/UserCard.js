import React from 'react';
import styles from './styles/UserCard.module.css';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete'
import UpdateIcon from '@material-ui/icons/Update';

const UserCard = ({firstname, lastname, email}) => {
    return (
        <div className={styles.userCard}>
            <div className={styles.userCardInf}>
                <p>{firstname}</p>
                <p>{lastname}</p>
                <p>{email}</p>
            </div>
            <div className={styles.userCardButtons}>
                <div className={styles.userCardButtonsMargin}>
                    <Button variant='contained' style={{background: '#15639d', color:'#ffffff'}} startIcon={<UpdateIcon/>}>Actualizar</Button>
                </div>
                <Button  variant='contained' style={{background: '#ff5555', color:'#ffffff'}} startIcon={<DeleteIcon/>}>Eliminar</Button>
            </div>
        </div>
    )
}

export default UserCard;