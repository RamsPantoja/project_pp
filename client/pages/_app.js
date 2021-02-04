import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../components/hooks/apolloClient'
import '../styles.css'

export default function MyApp({ Component, pageProps }) {
    const client = useApollo();
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    )
}