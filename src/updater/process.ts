import { Datastore, DatastoreManager } from 'lapisdb'
import { LowDbAdapter } from 'lapisdb-lowdb-adapter'
import { Route } from '../routes/route';
import Logger from '../logger/logger';
import { Updater } from './updater';
import { Queuer } from './queuer';
export interface IUpdaterProcessConfiguration {
  queuerInterval: number;
  vehicleUpdateInterval: number;
  routeUpdateInterval: number;
}

export const launch = async (conf: IUpdaterProcessConfiguration) => {
  const datastore = new Datastore<Route>('routes', Route, new LowDbAdapter(Route, {
    name: 'routes',
    directory: './db',
  }))

  DatastoreManager.register(datastore)

  const queuer = new Queuer(conf.queuerInterval)

  const initRoutes = await Updater.getRoutes()

  for (const route of initRoutes) {
    queuer.push({
      func: () => Updater.getRouteInfo(route),
      onResult: async (res) => {
        Logger.info(`Downloaded route ${res.id}`)
        const item = await datastore.get(res.id)
        if (item) {
          item.applyUpdate(res)
          await item.save()
        }
        else {
          res.meta.id = res.id
          await res.save()
        }
      },
    })
  }

  /* setInterval(() => {
    Logger.info('Updating vehicles.')

  }, conf.vehicleUpdateInterval)

  setInterval(() => {

  }, conf.routeUpdateInterval) */
}
