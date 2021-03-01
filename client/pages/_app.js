import { ApolloProvider } from '@apollo/client';
import { Provider } from 'next-auth/client'
import { useApollo } from '../components/hooks/apolloClient'
import '../styles.css'
import { SnackbarProvider } from 'notistack';

export default function MyApp({ Component, pageProps }) {
    
    const apolloClient = useApollo(pageProps.initialApolloState);
    return (
        <ApolloProvider client={apolloClient}>
            <Provider session={pageProps.session}>
                <SnackbarProvider>
                    <Component {...pageProps} />
                </SnackbarProvider>
            </Provider>
        </ApolloProvider>
    )
}