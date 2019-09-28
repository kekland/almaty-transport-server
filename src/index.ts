import 'reflect-metadata'
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import Logger from './logger/logger';
import axios from 'axios'
import { Updater } from './updater/updater';
import { IRouteUnloadedData } from './routes/route';
import { launch } from './updater/process';

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  const schema = await buildSchema({
    // IMPORTANT: Add resolvers here
    resolvers: [],
  });

  const production = process.env.NODE_ENV === 'production'

  const server = new ApolloServer({
    schema,
    playground: !production,
  });

  const serverInfo = await server.listen(PORT);
  Logger.info(`Server is running at port ${serverInfo.port}. GraphQL Playground is ${production ? 'disabled' : `available at ${serverInfo.url}`}.`)
}

(async () => {
  await launch({
    queuerInterval: 1500,
    routeUpdateInterval: 3600,
    vehicleUpdateInterval: 1600,
  })
})();
// bootstrap()
