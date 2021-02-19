import { 
    ApolloClient,
    InMemoryCache } from '@apollo/client';
import { useMemo } from 'react';

let apolloClient;

function offsetFromCursor(items, cursor, readField) {
    // Search from the back of the list because the cursor we're
    // looking for is typically the ID of the last item.
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i];
      // Using readField works for both non-normalized objects
      // (returning item.id) and normalized references (returning
      // the id field from the referenced entity object), so it's
      // a good idea to use readField when you're not sure what
      // kind of elements you're dealing with.
      if (readField("id", item) === cursor) {
        // Add one because the cursor identifies the item just
        // before the first item in the page we care about.
        return i + 1;
      }
    }
    // Report that the cursor could not be found.
    return -1;
}

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
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        getCourses: {
                            merge: false
                        },
                        getUsers: {
                            keyArgs: false,
                            merge(existing, incoming, { args: { cursor }, readField}) {
                                const merged = existing ? existing.slice(0) : [];
                                let offset = offsetFromCursor(merged, cursor, readField);
                                if (offset < 0) offset = merged.length;
                                for (let i = 0; i < incoming.length; ++i) {
                                    merged[offset + i] = incoming[i];
                                }
                                return merged;
                            }    
                        }
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