import { Route, IRouteUnloadedData, RouteType, RouteUpdate } from '../routes/route';
import axios from 'axios'
import { plainToClass } from 'class-transformer'
import { TimestampUtils } from '../utils/utils';
import * as HTMLParser from 'cheerio'
import { IApiBusRoute } from '../api/typings';
import { BusStop } from '../utils/stop';

const base: string = 'https://citybus.kz/'
const baseApi: string = 'https://citybus.kz/almaty/Monitoring'

export class Updater {
  static async request(url: string): Promise<any> {
    const response = await axios.get(url, { params: { _: TimestampUtils.getCurrentMilliseconds() } })
    return response.data
  }

  static getRouteDataFromHtml(element: CheerioElement, type: RouteType): IRouteUnloadedData {
    const id = element.attribs.id.split('-')[1].trim()
    const data = element.attribs.title.split(': ')
    const name = data[0].split('№')[1].trim()
    const description = data[1].trim()

    return {
      id,
      description,
      name,
      type,
    }
  }

  static async getRoutes(): Promise<IRouteUnloadedData[]> {
    const $ = HTMLParser.load((await axios.get(`${base}/`)).data)

    const routes: IRouteUnloadedData[] = []

    $('div .route-button-bus').each((_, el) => routes.push(this.getRouteDataFromHtml(el, 'bus')))
    $('div .route-button-troll').each((_, el) => routes.push(this.getRouteDataFromHtml(el, 'trolleybus')))

    return routes
  }

  static async getBusStops(): Promise<BusStop[]> {
    const data: any[] = await Updater.request(`${baseApi}/GetStops/`)
    return data.map(BusStop.fromApi)
  }

  static async getRouteInfo(routeData: IRouteUnloadedData): Promise<Route> {
    const data = await Updater.request(`${baseApi}/GetRouteInfo/${routeData.id}`)

    return Route.fromApi(routeData, data as IApiBusRoute)
  }

  static async getRoutesUpdate(routes: Route[], lastUpdateTime: number = 0): Promise<RouteUpdate> {
    if (routes.length > 10) {
      throw Error('Too many routes batched in single update')
    }

    let routesString = 'X'

    routes.forEach((v) => routesString += `${v.id}X`)

    const data = await Updater.request(`${baseApi}/GetStatusInfo/${routesString}/${Math.round(lastUpdateTime / 1000.0)}`)

    const update = RouteUpdate.fromApi(data)
    update.vehicles.forEach((v) => {
      let routeId: string | undefined

      routes.forEach(r => r.vehicles.forEach(rv => routeId = rv.id === v.id ? r.id : routeId))
      v.routeId = routeId
    })

    return update
  }
}
