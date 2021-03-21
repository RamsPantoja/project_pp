import React, { useState } from 'react';
import { GET_COURSE_BY_ID } from '../../apollo/querys';
import Layout from '../../components/Layout';
import Head from 'next/head';
import styles from '../styles/shopping_id.module.css';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { useMutation, useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, RadioGroup } from '@material-ui/core';
import { CREATE_PREAPPROVAL, CREATE_PREFERENCE_MERCADO_PAGO } from '../../apollo/mutations';
import { useRouter } from 'next/router'
import { getSession, useSession } from 'next-auth/client';
import Image from 'next/image';
import ConfirmSuscription from '../../components/ConfirmSuscription';
import { useSnackbar } from 'notistack';

const ShoppingCart = ({id}) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    //Obtiene la session que existe.
    const [session] = useSession();
    const [confirmSuscription, setConfirmSuscription] = useState(false);

    const { data, error, loading } = useQuery(GET_COURSE_BY_ID, {
        variables: {
            id: id
        }
    })

    //Este mutation crea una preferencia de mercado pago y redirecciona al usuario al checkout para que proceda con el flujo de pago.
    const [createPreferenceMercadoPago, {data: dataCreatePreferenceMercadoPago, error: errorCreatePreferenceMercadoPago, loading: loadingCreatePreferenceMercadoPago}] = useMutation(CREATE_PREFERENCE_MERCADO_PAGO, {
        onCompleted: async (dataCreatePreferenceMercadoPago) => {
            router.push(dataCreatePreferenceMercadoPago.createPreferenceMercadoPago);
        }
    });

    const [totalOption, setTotalOption] = useState(1);
    
    if (loading) {
        return (
            <Layout>
                <Head>
                    <title>Shopping - Curso | Profe Paco</title>
                </Head>
                <div className={styles.shoppingDescription_progress}>
                    <CircularProgress/>
                </div>
            </Layout>
        )
    }

    if (error) {
        return error.message
    }

    const {title, teacher, price, coverImg, modeSuscription} = data.getCourseById;
    //Actualiza el valor del precio si se activa el checkradio A ó B.
    const handleOnChangeInputRadio = (e) => {
        e.preventDefault();
        const value = e.target.value;
        if(value === 'a') {
            setTotalOption(1);
        } else if (value === 'b') {
            setTotalOption(2);
        }
    }

    //Divide el precio entre si el usuario elige pagar en dos pagos.
    const transformPrice = totalOption === 1 ? price : totalOption === 2 ? price/totalOption : null;

    const handleOnClickSetConfirmSuscription = () => {
        if (confirmSuscription) {
            setConfirmSuscription(false)
        } else {
            setConfirmSuscription(true)
        }
    }

    //Ejecuta el mutation de createPreferenceMercadoPago si el curso es de pago unico, de lo contrario, ejecuta el mutation si es de tipo suscripción.
    const handleCreatePreferenceMutation = (e) => {
        e.preventDefault();
        if (modeSuscription.isActivated) {
            handleOnClickSetConfirmSuscription();
        } else {
            createPreferenceMercadoPago({
                variables: {
                    title: title,
                    price: parseFloat(transformPrice),
                    firstname: session.user.firstname,
                    lastname: session.user.lastname,
                    email: session.user.email,
                    coverImg: coverImg.url
                }
            });
        }
    }

    const isCreatePreferenceLoading = loadingCreatePreferenceMercadoPago ? <div className={styles.loadingMutation}><CircularProgress/></div> : <Button variant='contained' style={{background: '#dbf998', color:'#15639d', fontWeight: 'bold'}} onClick={(e) => {handleCreatePreferenceMutation(e)}}>{modeSuscription.isActivated ? 'SUSCRIBIRSE' : 'COMPRAR'}</Button>
    const isConfirmSuscription = confirmSuscription ? <ConfirmSuscription modeSuscription={modeSuscription} handleOnClickSetConfirmSuscription={handleOnClickSetConfirmSuscription}/> : null;

    return (
        <Layout>
            <Head>
                <title>Shopping - {title} | Profe Paco</title>
            </Head>
            {isConfirmSuscription}
            <div className={styles.shoppingContainer}>
                <div className={styles.shoppingCourseInf}>
                    <div className={styles.imageContainer}>
                        <Image className={styles.imageBorderRadius} alt={coverImg.filename} src={coverImg.url} layout='fill' objectFit='cover' objectPosition='50 50'/>
                    </div>
                    <div className={styles.shoppingDescription}>
                        <h3>Curso</h3>
                        <ul className={styles.shoppingDescription_grid}>
                            <li className={styles.shoppingConcept}>Descripción:<p>{title}</p></li>
                            <li className={styles.shoppingConcept}>Profesor:<p>{teacher}</p></li>
                            <li className={styles.shoppingConcept}>Tipo:<p>{modeSuscription.isActivated ? 'Suscripción mensual' : 'Pago único'}</p></li>
                            <li className={styles.shoppingConcept}>Precio:<p>${price}</p></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.shoppingAmount}>
                    { modeSuscription.isActivated ? null :
                        <div className={styles.shoppingAmountSelect}>
                            <p>Monto a pagar:</p>
                            <RadioGroup row={true} name='position' defaultValue='a' onChange={(e) => {handleOnChangeInputRadio(e)}}>
                                <FormControlLabel value='a' labelPlacement='start' label='Un pago' control={<Radio style={{color: '#15639d'}}/>}/>
                                <FormControlLabel value='b' labelPlacement='start' label='Dos pagos' control={<Radio style={{color: '#15639d'}}/>}/>
                            </RadioGroup>
                        </div>
                    }
                    <div className={styles.shoppingAmountTotal}>
                        <p>Total: </p>
                        <p>${price/totalOption}</p>
                    </div>
                    {isCreatePreferenceLoading}
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps({query, req}) {
    const session = await getSession({req});

    if (!session && req) {
        return {
            redirect: {
                destination: '/app/signin',
                permanent: false
            }
        }
    }

    const id = query.id;
    return {
        props: {
            id: id
        }
    }
}

export default ShoppingCart;