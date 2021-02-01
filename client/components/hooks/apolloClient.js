import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

let apolloClient;

const createApolloClient = () => {
    return new ApolloClient({
        link: new createUploadLink({
            uri: 'http://localhost:4200/graphql'
        }),
        cache: new InMemoryCache()
    })
}

const initializeApollo = () => {
    const _apolloClient = apolloClient ?? createApolloClient();

    return _apolloClient;
}

export const useApollo = (initialState) => {
    return initializeApollo()
}