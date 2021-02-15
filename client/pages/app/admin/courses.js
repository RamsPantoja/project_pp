import React from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/courses_admin.module.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CourseCard from '../../../components/CourseCard';
import { getSession } from 'next-auth/client';
import { useRouter }from 'next/router';

const CoursesAdmin = () => {
    const router = useRouter();

    const handleOnClick = (e) => {
        e.preventDefault();
        router.push('/app/admin/courses_form');
    }

    return (
        <LayoutAdmin>
            <div className={styles.toPositionFixed}>
                <div className={styles.coursesContainer}>
                    <div className={styles.header}>
                        <h3>Cursos</h3>
                        <Fab color="default" aria-label="add" onClick={(e) => {handleOnClick(e)}}>
                            <AddIcon/>
                        </Fab>
                    </div>
                    <div className={styles.coursesGrid}>
                        <CourseCard baseUrl={'/app/admin/courses/'}/>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}


export async function getServerSideProps({req}) {
    const session = await getSession({req});
    if ((!session || session.user.isAdmin !== true) && req) {
        return {
            redirect: {
                destination:'http://localhost:3000/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default CoursesAdmin;