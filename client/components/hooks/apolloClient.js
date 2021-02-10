import { 
    ApolloClient,
    InMemoryCache } from '@apollo/client';
import { useMemo } from 'react';
import merge from 'deepmerge';

let apolloClient;

const createIsomorphLink = () => {
    if (typeof window === 'undefined') {
        const { SchemaLink } = require('@apollo/client/link/schema');
        const { schema } = require('../../lib/schema');
        return new SchemaLink({schema});
    } else {
        const { HttpLink } = require('@apollo/client/link/http');
        return new HttpLink({
            uri: '/api/graphql',
            credentials: 'same-origin'
        });
    }
}

const createApolloClient = () => {

    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: createIsomorphLink(),
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