import { ApolloClient, ApolloLink, concat, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { useEffect, useState } from 'react';

let apolloClient;

const createApolloClient = () => {
    const [isToken, setIsToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsToken(token);
    })

    const httpLink = new createUploadLink({uri: 'http://localhost:4200/graphql'})

    const authMiddleware = new ApolloLink((operation, forward) => {
        operation.setContext({
            headers: {
                authorization: isToken || null
            }
        })
        return forward(operation);
    })

    return new ApolloClient({
        link: concat(authMiddleware, httpLink),
        cache: new InMemoryCache(),
        credentials: 'include'
    })
}

const initializeApollo = () => {
    const _apolloClient = apolloClient ?? createApolloClient();

    return _apolloClient;
}

export const useApollo = () => {
    return initializeApollo();
}