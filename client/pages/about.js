import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '../apollo/querys';
import { TextField } from '@material-ui/core';

const About = () => {
    return (
        <Layout>
            <Head>
                <title>About | Profe Paco</title>
            </Head>
        </Layout>
    )
}

export default About;