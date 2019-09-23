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
  let url = `https://citybus.kz/almaty/Monitoring/GetStatusInfo/X`
  routeInfos.forEach((v) => url += `${v.id}X`)
  url += '/1569158750?_=1569158755947'
  console.log(url)
  console.log(await axios.get('https://citybus.kz/almaty/Monitoring/GetStatusInfo//1569158787?_=1569158791508'))
})();
// bootstrap()
