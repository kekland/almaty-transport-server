import 'reflect-metadata'
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import Logger from './logger/logger';
import axios from 'axios'
import { Updater } from './updater/updater';
import { IRouteUnloadedData } from './routes/route';

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
  const routeInfos = await Updater.getRoutes()
  const routeDataArray = []

  const routeData: IRouteUnloadedData = routeInfos.find(r => r.id === '86') as IRouteUnloadedData
  const route = await Updater.getRouteInfo(routeData)

  console.log(route)

  const updates = await Updater.getRoutesUpdate([route])

  console.log(updates)
})();
// bootstrap()
