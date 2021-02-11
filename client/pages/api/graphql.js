import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../lib/schema';

const apolloServer = new ApolloServer({
    schema,
    context: async ({req, res}) => {
        return {
            req: req,
            res: res
        }
    }
});

export const config = {
    api: {
        bodyParser: false
    }
}

export default apolloServer.createHandler({path: '/api/graphql'});