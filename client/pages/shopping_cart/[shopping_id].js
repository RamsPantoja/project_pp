import React, { useState, useEffect } from 'react';
import { GET_COURSES, GET_COURSE_BY_ID } from '../../apollo/querys';
import { initializeApollo } from '../../components/hooks/apolloClient';
import Layout from '../../components/Layout';
import Head from 'next/head';
import styles from '../styles/shopping_id.module.css';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { useMutation, useQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, RadioGroup } from '@material-ui/core';
import { CREATE_PREFERENCE_MERCADO_PAGO } from '../../apollo/mutations';
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client';

const ShoppingCart = ({id}) => {
    const router = useRouter();
    const [session] = useSession();

    const { data, error, loading } = useQuery(GET_COURSE_BY_ID, {
        variables: {
            id: id
        }
    })

    const [createPreferenceMercadoPago, {data: dataCreatePreferenceMercadoPago, error: errorCreatePreferenceMercadoPago, loading: loadingCreatePreferenceMercadoPago}] = useMutation(CREATE_PREFERENCE_MERCADO_PAGO, {
        onCompleted: async (dataCreatePreferenceMercadoPago) => {
            router.push(dataCreatePreferenceMercadoPago.createPreferenceMercadoPago);
        }
    });

    const [totalOption, setTotalOption] = useState(1);
    
    if (loading) {
        return (
            <Layout>
                <div className={styles.shoppingDescription_progress}>
                    <CircularProgress/>
                </div>
            </Layout>
        )
    }

    if (error) {
        return error.message
    }

    const {title, teacher, price} = data.getCourseById

    const handleOnChangeInputRadio = (e) => {
        e.preventDefault();
        const value = e.target.value;
        if(value === 'a') {
            setTotalOption(1);
        } else if (value === 'b') {
            setTotalOption(2);
        }
    }

    const transformPrice = totalOption === 1 ? price : totalOption === 2 ? price/totalOption : null;

    const handleCreatePreferenceMutation = (e) => {
        e.preventDefault();
        createPreferenceMercadoPago({
            variables: {
                title: title,
                price: transformPrice,
                firstname: session.user.firstname,
                lastname: session.user.lastname,
                email: session.user.email
            }
        })
    }

    const isCreatePreferenceLoading = loadingCreatePreferenceMercadoPago ? <div className={styles.loadingMutation}><CircularProgress/></div> : <Button style={{background: '#dbf998', color:'#15639d', fontWeight: 'bold'}} onClick={(e) => {handleCreatePreferenceMutation(e)}}>Comprar</Button>

    return (
        <Layout>
            <Head>
                <title>Profe Paco!</title>
            </Head>
            <div className={styles.shoppingContainer}>
                <div className={styles.shoppingCourseInf}>
                    <img src='https://static.platzi.com/static/images/landing/default/foro.png'></img>
                    <div className={styles.shoppingDescription}>
                        <h3>Curso</h3>
                        <ul className={styles.shoppingDescription_grid}>
                            <li className={styles.shoppingConcept}>Descripción:<p>{title}</p></li>
                            <li className={styles.shoppingConcept}>Profesor:<p>{teacher}</p></li>
                            <li className={styles.shoppingConcept}>Precio:<p>${price}</p></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.shoppingAmount}>
                    <div className={styles.shoppingAmountSelect}>
                        <p>Monto a pagar:</p>
                        <RadioGroup row={true} name='position' defaultValue='a' onChange={(e) => {handleOnChangeInputRadio(e)}}>
                            <FormControlLabel value='a' labelPlacement='start' label='Un pago' control={<Radio style={{color: '#15639d'}}/>}/>
                            <FormControlLabel value='b' labelPlacement='start' label='Dos pagos' control={<Radio style={{color: '#15639d'}}/>}/>
                        </RadioGroup>
                    </div>
                    <div className={styles.shoppingAmountTotal}>
                        <p>Total: </p>
                        <p>${price/totalOption}</p>
                    </div>
                    <script src="https://www.mercadopago.com.mx/integrations/v1/web-payment-checkout.js" data-preference-id='<%= global.id %>' type='text/javascript'></script>
                    {isCreatePreferenceLoading}
                </div>
            </div>
        </Layout>
    )
}


export async function getStaticPaths() {
    const apolloClient = initializeApollo();
    const {data} = await apolloClient.query({query: GET_COURSES});
    const paths = data.getCourses.map((course) => ({
        params: {
            shopping_id: course.id
        }
    }))
    
    return { paths, fallback: false}
}


export async function getStaticProps({params}) {
    return {
        props: {
            id: params.shopping_id
        }
    }
}

export default ShoppingCart;