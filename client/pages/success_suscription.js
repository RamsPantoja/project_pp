import React from 'react';
import { getSession } from 'next-auth/client';
import Link from 'next/link';
//Usa los mismos estilos que la página success_payment.
import styles from './styles/success_payment.module.css';


const SuccessSuscription = () => {
    return (
        <div className={styles.successPayment}>
            <div className={styles.successInf}>
                <h2>Muchas gracias por suscribirse a un curso de Profe Paco.</h2>
                <p>El pago de la suscripción tarda alrededor de una hora para ser acreditado. Una vez haya sido acreditado, podrás ver el curso al que te has suscrito en la sección "cuenta, tus cursos".</p>
                <Link href='/'><a className={styles.linkToYourCourses}>Ir a inicio</a></Link>
            </div>
        </div>
    )
}

export async function getServerSideProps({req}) {
    const session = await getSession({req});
    
    if(!session && req) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default SuccessSuscription;