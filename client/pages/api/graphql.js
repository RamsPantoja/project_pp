import { ApolloServer } from 'apollo-server-micro';
import MercadoPagoAPI from '../../lib/dataSource';
import { schema } from '../../lib/schema';

const apolloServer = new ApolloServer({
    schema,
    dataSources: () => {
        return {
            mercadoPagoAPI: new MercadoPagoAPI()
        }
    },
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