import React, { useState } from 'react';
import styles from './styles/UserCard.module.css';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import UserFormDelete from './UserFormDelete';
import { Fragment } from 'react';
import cn from 'classnames';

const UserCard = ({firstname, lastname, email, mutation, id, error, userId, payment, coursePrice, basicCard}) => {
    const [isUserFormDelete, setIsUserFormDelete] = useState(false);

    const handleOnClickDeleteUserInCourse = (e) => {
        e.preventDefault();
        if(isUserFormDelete) {
            setIsUserFormDelete(false)
        } else {
            setIsUserFormDelete(true)
        }
    }

    const userFormDelete = isUserFormDelete ? <UserFormDelete userId={userId} error={error} handleOnClickDeleteUserInCourse={handleOnClickDeleteUserInCourse} emailToDelete={email} mutation={mutation} id={id}/> : null;
    const amountDescribe = payment ? <p>Pagado: {payment}/{coursePrice}</p> : null;
    return (
        <Fragment>
            {userFormDelete}
            <div className={
                cn({
                    [styles.userCardTotalPayment]: payment === coursePrice,
                    [styles.userCardPendingPayment]: payment === coursePrice/2,
                    [styles.userCard]: basicCard === true
                })
            }>
                <div className={styles.userCardInf}>
                    <p>{firstname}</p>
                    <p>{lastname}</p>
                    <p>{email}</p>
                    {amountDescribe}
                </div>
                <div className={styles.userCardButtons}>
                    <Button onClick={(e) => {handleOnClickDeleteUserInCourse(e)}}  variant='contained' style={{background: '#ff5555', color:'#ffffff'}} startIcon={<DeleteIcon/>}>Eliminar</Button>
                </div>
            </div>
        </Fragment>
    )
}

export default UserCard;