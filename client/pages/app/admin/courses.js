import React from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/courses_admin.module.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CourseCard from '../../../components/CourseCard';

const CoursesAdmin = () => {
    return (
        <LayoutAdmin>
            <div className={styles.toPositionFixed}>
                <div className={styles.coursesContainer}>
                    <div className={styles.header}>
                        <h3>Cursos</h3>
                        <Fab color="default" aria-label="add">
                            <AddIcon />
                        </Fab>
                    </div>
                    <div className={styles.coursesGrid}>
                        <CourseCard/>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}

export default CoursesAdmin;