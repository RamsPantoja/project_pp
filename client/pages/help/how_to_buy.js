import Head from 'next/head';
import React from 'react'
import Layout from '../../components/Layout';
import styles from '../styles/how_to_buy.module.css';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const HowToBuy = () => {
    return (
        <Layout>
            <Head>
                <title>Ayuda - ¿Cómo comprar? | Profe Paco</title>
            </Head>
            <div className={styles.howToBuy}>
                <div className={styles.howToBuyHeader}>
                    <h2>¿Cómo comprar?</h2>
                </div>
                <div className={styles.howToBuyCenter}>
                    <div className={styles.howToBuyContent}>
                        <p>A continuación, te mostramos los pasos para que puedas obtener un curso de Profe Paco.</p>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            style={{fontWeight: 'bold'}}>
                                Crea una cuenta de PROFEPACO o Inicia sesión
                            </AccordionSummary>
                            <AccordionDetails>
                                <ul className={styles.stepContent}>
                                    <li>Es necesario que crear una cuenta de PROFEPACO para tener acceso a los cursos.</li>
                                    <li>Al ingresar en www.profepaco.com, te aparecerán dos botones en la parte superior derecha, uno de crear cuenta y otro de iniciar sesión, respectivamente.</li>
                                    <li>Usa un correo electrónico válido y registra tus datos.<p>¡Importante! Necesitas tener acesso a este correo ya que por este medio te llegará un correo de confirmación para validar tu cuenta de PROFEPACO.</p></li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            style={{fontWeight: 'bold'}}>
                                Comprar un curso
                            </AccordionSummary>
                            <AccordionDetails>
                                <ul className={styles.stepContent}>
                                    <li>Diríjase a la sección cursos que se encuentra en la parte superior derecha.</li>
                                    <li>Elija el curso que desea comprar.</li>
                                    <li>Una vez esté en el curso que desea comprar, aparecerá toda la información relacionada al curso, titulo, descripción, precio, tipo de curso, etc.</li>
                                    <li>Antes de poder obtener el curso y dar click en el botón “OBTENER”, necesitas tener una cuenta de PROFEPACO previamente validada y haber iniciado sesión, de lo contrario, se te redireccionara a la página de “Iniciar sesión” o a la sección para validar tu cuenta.</li>
                                    <li>Después de haber dado click en el botón de “OBTENER”, te aparecerá una descripción del curso que quieres obtener y el monto que deseas pagar.</li>
                                    <li>Puedes elegir pagar el curso en un solo pago o en dos.</li>
                                    <li>Al dar click en el botón “COMPRAR”, se te redireccionara al checkout de MercadoPago, el cual procesara los datos de tu tarjeta para finalizar la compra.</li>
                                    <li>Una vez la compra haya sido aprobada por MercadoPago, se te redireccionara a nuestra página web y podrás ver en la sección “Cuenta, Tus cursos”, el curso que has comprado.</li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            style={{fontWeight: 'bold'}}>
                                Suscribirse a un curso
                            </AccordionSummary>
                            <AccordionDetails>
                                <ul className={styles.stepContent}>
                                    <li>Diríjase a la sección cursos que se encuentra en la parte superior derecha.</li>
                                    <li>Elija el curso al que desea suscribirse.</li>
                                    <li>Una vez esté en el curso al que desea suscribirse, aparecerá toda la información relacionada al curso, titulo, descripción, precio, tipo de curso, etc.</li>
                                    <li>Antes de poder suscribirse al curso y dar click en el botón “SUSCRIBIRSE”, necesitas tener una cuenta de PROFEPACO previamente validada y haber iniciado sesión, de lo contrario, se te redireccionara a la página de “Iniciar sesión” o a la sección para validar tu cuenta.</li>
                                    <li>Después de haber dado click en el botón de “SUSCRIBIRSE”, te aparecerá una descripción del curso al que quieres suscribirte y el monto a pagar. <p>¡Importante! Las suscripciones solo aceptan tarjetas de credito/debito como medio de pago.</p></li>
                                    <li>Al dar click en el botón “SUSCRIBIRSE”, se te redireccionara al checkout de MercadoPago, el cual procesara los datos de tu tarjeta para finalizar la suscripción.</li>
                                    <li>Una vez el pago de la suscripción haya sido aprobado por MercadoPago, se te redireccionara a nuestra página web y podrás ver en la sección “Cuenta, Tus cursos”, el curso al que te has suscrito.</li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            style={{fontWeight: 'bold'}}>
                                ¿Cómo pagar en Oxxo?
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={styles.contentOxxoMethod}>
                                    <p>Este metodo de pago es únicamente en efectivo y a través de tiendas OXXO.</p>
                                    <ul className={styles.stepContent}>
                                        <li>Cuando estés en el checkout de Mercado Pago, elije "Efectivo" como método de pago.</li>
                                        <li>Elije OXXO como medio de pago.</li>
                                        <li>Una vez generada tu orden de pago a través de Mercado Pago, se te proporcionará una referencia única y un recibo para realizar tu pago en cualquier sucursal OXXO. También puedes revisar tu correo para ver los detalles de la compra.</li>
                                        <li>Visita cualquier sucursal OXXO y menciona al cajero que quieres pagar un servicio de Mercado Pago.</li>
                                        <li>Díctale la REFERENCIA DE PAGO o entregale el recibo que te proporciono Mercado Pago.</li>
                                        <li>Realiza tu pago.</li>
                                    </ul>
                                    <p>El pago se acreditará de 1 a 2 días hábiles y sin costo adicional.</p>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HowToBuy;