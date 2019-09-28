import { Datastore, DatastoreManager, IFilledModelMetadata } from 'lapisdb'
import { LowDbAdapter } from 'lapisdb-lowdb-adapter'
import { Route, RouteUpdate } from '../routes/route';
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

  const vehicleUpdaterQueuer = new Queuer(conf.vehicleUpdateInterval)
  const routeUpdaterQueuer = new Queuer(conf.routeUpdateInterval)
  const queuer = new Queuer(conf.queuerInterval)

  const updateRoute = async (route: Route) => {
    // Logger.info(`Saving route ${route.name} ${route.id}`)
    const item = await datastore.get(route.id)
    if (item) {
      item.applyUpdate(route)
      await item.save()
    }
    else {
      route.meta = {
        created: Date.now(),
        updated: Date.now(),
        id: route.id,
      } as IFilledModelMetadata
      await route.save()
    }
  }

  /*const initRoutes = await Updater.getRoutes()
  initRoutes.forEach(route => {
    console.log(route)
    queuer.push({
      arg: route,
      func: (r) => Updater.getRouteInfo(r),
      onResult: async (res: Route) => {
        Logger.info(`Downloaded route ${res.id}`)
        updateRoute(res)
      },
    })
  })*/
  const updateVehicles = async (_: any, lastUpdate: number) => {
    const routes = await datastore.getItems()
    Logger.info('Updating vehicles ' + routes.length)
    const routesSplit: Route[][] = [[]]
    for (const route of routes) {
      if (routesSplit[routesSplit.length - 1].length >= 30) {
        routesSplit.push([])
      }

      routesSplit[routesSplit.length - 1].push(route)
    }

    for (const routeBatch of routesSplit) {
      queuer.push({
        arg: routeBatch,
        func: (r) => {
          Logger.info('Updating vehicles. Got ' + r.length)
          return Updater.getRoutesUpdate(r, lastUpdate)
        },
        onResult: (u: RouteUpdate) => {
          Logger.info('Updated vehicles. Got ' + routeBatch.length)
          routeBatch.forEach(r => r.applyRouteUpdate(u))
          routeBatch.forEach(updateRoute)
        },
      })
    }
  }

  const queueVehicles = () => {
    vehicleUpdaterQueuer.push({
      arg: null,
      func: updateVehicles,
      onResult: queueVehicles,
    });
  }

  const updateRoutes = async () => {
    Logger.info('Updating routes.')
  }

  const queueRoutes = () => {
    vehicleUpdaterQueuer.push({
      arg: null,
      func: updateRoutes,
      onResult: queueRoutes,
    });
  }

  queueVehicles()
  queueRoutes()

  /* setInterval(() => {

  }, conf.routeUpdateInterval) */
}
