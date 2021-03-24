import Head from 'next/head';
import React from 'react';
import Layout from '../../components/Layout';
import styles from '../styles/notice_of_privacy.module.css';

const NoticeOfProvacy = () => {
    return (
        <Layout>
            <Head>
                <title>Aviso de privacidad</title>
            </Head>
            <div className={styles.noticePrivacyContainer}>
                <div className={styles.noticePrivacyHeader}>
                    <h2>Aviso de privacidad</h2>
                </div>
                <div className={styles.noticePrivacyCenter}>
                    <div className={styles.noticePrivacyContent}>
                        <h4>Aviso de privacidad forma parte de www.profepaco.com. Sus datos personales serán tratados por ProfePaco.</h4>
                        <hr></hr>
                        <h4>Datos personales que solicitamos.</h4>
                        <p>La información solicitada al usuario para registrarse en la pagina:</p>
                        <ul className={styles.registerInf}>
                            <li>Nombre</li>
                            <li>Apellidos</li>
                            <li>Dirección de correo electrónico</li>
                        </ul>
                        <hr></hr>
                        <h4>Datos personales sensibles.</h4>
                        <p>En www.profepaco.com, no solicitamos datos personales sensibles como: Número de tarjeta, código de seguridad, etc.</p>
                        <p>Cuando realices una compra en www.profepaco.com, automáticamente serás redireccionado al checkout de MercadoPago, donde los datos sensibles serán tratados y cifrados por MercadoPago, esto para garantizar una compra segura y eficiente a través de MercadoPago.</p>
                        <hr></hr>
                        <h4>Utilización de SSL.</h4>
                        <p>En www.profepaco.com, utilizamos el protocolo SSL para ofrecerle una experiencia de navegación más segura y privada, ya que dicho protocolo cifra la conexión entre su ordenador y www.profepaco.com, para prevenir que terceros puedan ver la información que usted nos proporciona en la página web.</p>
                        <hr></hr>
                        <h4>¿Cookies?</h4>
                        <p>En www.profepaco.com, utilizamos cookies para obtener la sesión creada por el usuario. Este proceso sucede cuando inicia sesión en nuestra página web.</p>
                        <p>Los cookies son pequeñas piezas de información que son enviadas por el sitio Web a su navegador y se almacenan en el disco duro de su equipo y se utilizan para determinar sus preferencias cuando se conecta a los servicios de nuestros sitios, así como para rastrear determinados comportamientos o actividades llevadas a cabo por usted dentro de nuestros sitios.</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default NoticeOfProvacy;