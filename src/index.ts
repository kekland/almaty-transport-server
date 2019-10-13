import 'reflect-metadata'
import { ApolloServer, PubSub } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import Logger from './logger/logger';
import axios from 'axios'
import { Updater } from './updater/updater';
import { IRouteUnloadedData, Route } from './routes/route';
import { launchUpdater } from './updater/updaterProcess';
import { Datastore, DatastoreManager } from 'lapisdb';
import { LowDbAdapter } from 'lapisdb-lowdb-adapter';
import { launchApi } from './updater/apiProcess';

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  const datastore = new Datastore<Route>('routes', Route, new LowDbAdapter(Route, {
    name: 'routes',
    directory: './db',
  }))

  DatastoreManager.register(datastore)
  const pubSubEngine = new PubSub()

  await launchUpdater({
    queuerInterval: 1000,
    routeUpdateInterval: 3600,
    vehicleUpdateInterval: 10000,
  }, pubSubEngine)

  await launchApi(8080, pubSubEngine)
}

bootstrap()
