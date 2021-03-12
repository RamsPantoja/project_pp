import React from 'react';
import styles from '../pages/account/styles/courses.module.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Button, CircularProgress } from '@material-ui/core';

const MiniCourseCard = ({course, mutation, firstname, lastname, email, loadingPreferenceMP}) => {

    const handleCreatePreferenceMercadoPago = (e) => {
        e.preventDefault();
        mutation({
            variables: {
                title: course.title,
                price: course.price/2,
                firstname: firstname,
                lastname: lastname,
                email: email,
                coverImg: course.coverImg.url
            }
        });
    }

    const isLoadingMutation = loadingPreferenceMP ? <CircularProgress size={30} /> : <Button onClick={(e) => {handleCreatePreferenceMercadoPago(e)}} variant='contained' size='small' style={{background: '#15639d', color: '#ffffff'}}>Pagar</Button>

    return (
        <div key={course.id} className={styles.courseMiniCard}>
            <h4>{course.title}</h4>
            <p>{course.teacher}</p>
            <p>Pagado:{course.enrollmentUsers[0].payment}/{course.price}</p>
            {course.enrollmentUsers[0].payment === course.price ? <CheckCircleIcon/> : isLoadingMutation}    
        </div>
    )
}

export default MiniCourseCard;