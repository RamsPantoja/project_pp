import { 
    ApolloClient,
    InMemoryCache } from '@apollo/client';
import { useMemo } from 'react';
import { offsetLimitPagination } from '@apollo/client/utilities';

let apolloClient;

const createIsomorphLink = () => {
    if (typeof window === 'undefined') {
        const { SchemaLink } = require('@apollo/client/link/schema');
        const { schema } = require('../../lib/schema');
        return new SchemaLink({schema});
    } else {
        const { createUploadLink } = require('apollo-upload-client');
        return new createUploadLink({
            uri: '/api/graphql',
            credentials: 'same-origin'
        });
    }
}

const createApolloClient = () => {

    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: createIsomorphLink(),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        getCourses: {
                            merge: false
                        },
                        getUsers: {
                            keyArgs: false,
                            merge(existing, incoming, {readField}) {
                                const users = existing ? {...existing.users} : {};
                                incoming.users.forEach(user => {
                                    users[readField('id', user)] = user;
                                });
                                return {
                                    totalUsers: incoming.totalUsers,
                                    users
                                }
                            },

                            read(existing) {
                                if(existing) {
                                    return {
                                        totalUsers: existing.totalUsers,
                                        users: Object.values(existing.users)
                                    }
                                }
                            }
                        },
                        getUsersInSuscription: offsetLimitPagination()
                    }
                },
                Course: {
                    fields: {
                        enrollmentUsers: {
                            merge: false
                        }
                    }
                }
            }
        }),
        credentials: 'same-origin'
    })
}

 export const initializeApollo = (initialState = null) => {
    const _apolloClient = apolloClient ?? createApolloClient();

    if (initialState) {
        const existingCache = _apolloClient.extract();


        _apolloClient.cache.restore({...existingCache, ...initialState});
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