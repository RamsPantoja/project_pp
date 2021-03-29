import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout'
import styles from './styles/index.module.css';
import {getSession} from 'next-auth/client';
import Image from 'next/image';
import Link from 'next/link';
import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import YouTubeIcon from '@material-ui/icons/YouTube';
import InstagramIcon from '@material-ui/icons/Instagram';
import { useRouter } from 'next/router';
import SliderImage from '../components/SliderImage';

const HomePage = () => {
    const router = useRouter();
    return (
        <Layout>
            <Head>
                <title>Profe Paco</title>
            </Head>
            <div className={styles.home_container}>
                <div className={styles.home_containerHeader}>
                    <div className={styles.imgContainer}>
                        <Image className={styles.objectFit} src='/images/profepaco_portada.png' alt='profepaco_portada' layout='fill' />
                    </div>
                    <div className={styles.home_title}>
                        <h1>La escuela del Profe Paco es una nueva forma de adquirir aprendizajes.</h1>
                        <p>El escenario es mi salón de clases, la nariz roja es mi corazón, mis manos hablan y mis palabras hacen ruido. Lo que algunos no dicen lo digo yo.</p>
                    </div>
                </div>
                <div className={styles.featureList_container}>
                    <SliderImage/>
                </div>
                <div className={styles.featureList2_container}>
                    <div className={styles.img2Container}>
                        <Image className={styles.objectFit2} src='/images/profepaco_avatar.jpg' layout='fill'/>
                    </div>
                    <div className={styles.featureList2_right}>
                        <h2>La mejor experiencia de aprendizaje</h2>
                        <ul className={styles.feature_list2}>                    
                            <li className={styles.cardFeature2}>Clases prácticas, concretas y enfocadas en las habilidades de mayor demanda laboral.</li>
                            <li className={styles.cardFeature2}>Diplomas de certificación físicos de las Escuelas aprobadas.</li>
                            <li className={styles.cardFeature2}>Descarga las clases con la app y estudia en cualquier lugar sin conexión.</li>
                            <li className={styles.cardFeature2}>Tus profesores serán personas líderes reconocidas en sus respectivas industrias.</li>
                            <li className={styles.cardFeature2}>Platzi CDN, ten la mejor experiencia sin importar la velocidad de tu conexión.</li>
                            <li className={styles.cardFeature2}>Te ayudamos a construir una ruta de aprendizaje específica para ti. Contáctanos</li>
                        </ul>
                    </div>
                </div>
                <footer className={styles.footerContainer}>
                    <div className={styles.footerInf}>
                        <ul className={styles.footerLinks}>
                            <li className={styles.listLink}><Link href='/help/how_to_buy'><a className={styles.footerLink}>¿Cómo comprar?</a></Link></li>
                            <li className={styles.listLink}><Link href='/about'><a className={styles.footerLink}>Sobre nosotros</a></Link></li>
                            <li className={styles.listLink}><Link href='/help/notice_of_privacy'><a className={styles.footerLink}>Aviso de privacidad</a></Link></li>
                        </ul>
                        <div className={styles.socialNetworks}>
                            <IconButton onClick={() => router.push('https://www.facebook.com/elprofepaco')}>
                                <FacebookIcon style={{color: '#0d8bf1'}}/>
                            </IconButton>
                            <IconButton onClick={() => router.push('https://youtube.com/c/ProfePacoCazadoresdeletras')}>
                                <YouTubeIcon style={{color: '#ff0000'}}/>
                            </IconButton>
                            <IconButton onClick={() => router.push('https://instagram.com/elprofepaco')}>
                                <InstagramIcon fontSize='small' classes={{root: styles.instagramIcon}}/>
                            </IconButton>
                        </div>
                    </div>
                    <div className={styles.bannerContainer}>
                        <Image src='/images/bannerMercadoPago.jpg' width="728" height="90" title="Mercado Pago - Medios de pago" alt="Mercado Pago - Medios de pago"/>
                    </div>
                    <div className={styles.bannerContainerMovil}>
                        <Image src='/images/bannerMercadoPagoMovil.jpg' title="Mercado Pago - Medios de pago" alt="Mercado Pago - Medios de pago" width="120" height="240"/>
                    </div>
                    <p>Copyright © 2021 ProfePaco.</p>
                </footer>
            </div>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const session = await getSession({req})
    if ((session && session.user.isAdmin === true) && req) {
        return {
            redirect: {
                destination: '/app/admin/notifications',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default HomePage;