import { ApolloProvider } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useApollo } from '../components/hooks/apolloClient'
import '../styles.css'

export default function MyApp({ Component, pageProps }) {
    
    const client = useApollo(pageProps.initialApolloState);
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    )
}