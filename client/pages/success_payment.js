import React from 'react';
import { getSession } from 'next-auth/client';
import mercadopago from 'mercadopago';
import Link from 'next/link';
import styles from './styles/success_payment.module.css';


const SuccessPayment = ({description, firstname}) => {
    return (
        <div className={styles.successPayment}>
            <div className={styles.successInf}>
                <h2>Muchas gracias por comprar {description} de Profe Paco.</h2>
                <p>{firstname}, en el siguiente enlace podrás ver el curso que has comprado:</p>
                <Link href='/account/courses'><a className={styles.linkToYourCourses}>Ver curso</a></Link>
            </div>
        </div>
    )
}

export async function getServerSideProps({req, query}) {
    mercadopago.configure({
        access_token: process.env.ACCESS_TOKEN_MP
    })
    const session = await getSession({req})
    const payment_id = query.payment_id;
    const course = await mercadopago.payment.get(payment_id);

    if (!session || !payment_id) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            description: course.body.description,
            firstname: course.body.payer.first_name
        }
    }
}

export default SuccessPayment;