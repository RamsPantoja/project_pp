import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '../apollo/querys';

const About = () => {
    const {data, error, loading} = useQuery(CURRENT_USER);
    
    return (
        <Layout>
            <Head>
                <title>Profe Paco</title>
            </Head>
            <h2>About</h2>
        </Layout>
    )
}

export default About;