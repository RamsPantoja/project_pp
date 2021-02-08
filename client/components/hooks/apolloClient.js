import { ApolloClient, ApolloLink, concat, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { isEnumType } from 'graphql';
import { useEffect, useMemo, useState } from 'react';

let apolloClient;

const createApolloClient = () => {
    const isServer = typeof window === 'undefined';

    const getToken = (isServer) => {
        let token;
        if(!isServer) {
            token = localStorage.getItem('token');
        }
        return token;
    }

    const authMiddleware = new ApolloLink((operation, forward) => {
        operation.setContext({
            headers: {
                authorization: getToken(isServer) || null
            }
        })
        return forward(operation);
    })

    const httpLink = new createUploadLink({uri: 'http://localhost:4200/graphql'})

    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: concat(authMiddleware, httpLink),
        cache: new InMemoryCache(),
        credentials: 'same-origin'
    })
}

 export const initializeApollo = (initialState = null) => {
    const _apolloClient = apolloClient ?? createApolloClient();

    if (initialState) {
        const existingCache = _apolloClient.extract();

        const data = merge(initialState, existingCache);

        _apolloClient.cache.restore(data);
    }

    if (typeof window === 'undefined') {
        return _apolloClient;
    }

    if (!apolloClient) {
        apolloClient = _apolloClient;
    }
    return _apolloClient;
}

export const useApollo = (initialState) => {
    const store = useMemo(() => initializeApollo(initialState), [initialState])
    return store
}