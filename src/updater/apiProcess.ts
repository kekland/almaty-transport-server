import { Datastore } from 'lapisdb';
import { Route } from '../routes/route';
import { RouteResolver } from '../resolvers/routeResolver';
import { buildSchema } from 'type-graphql';
import { ApolloServer, PubSubEngine } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';
import Logger from '../logger/logger';

export const launchApi = async (port: number, pubSubEngine: PubSub) => {
  const schema = await buildSchema({
    resolvers: [RouteResolver],
    pubSub: pubSubEngine,
  });

  const production = process.env.NODE_ENV === 'production'

  const server = new ApolloServer({
    schema,
    playground: !production,
    subscriptions: {
      path: '/subscriptions',
      onConnect: (v, s, c) => {
        Logger.info(`Incoming WebSocket connection, ${c.request.url}`)
      },
    },
  });

  const serverInfo = await server.listen(port);
  Logger.info(`Server is running at port ${serverInfo.port}. GraphQL Playground is ${production ? 'disabled' : `available at ${serverInfo.url}`}.`)
}
