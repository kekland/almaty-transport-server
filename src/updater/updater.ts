import { Route, IRouteUnloadedData, RouteType } from '../routes/route';
import axios from 'axios'
import { plainToClass } from 'class-transformer'
import { TimestampUtils } from '../utils/utils';
import * as HTMLParser from 'cheerio'
import { IBusRouteResponse } from '../api/typings';

const base: string = 'https://citybus.kz/'
const baseApi: string = 'https://citybus.kz/almaty/Monitoring'

export class Updater {
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
  static async getRouteInfo(routeData: IRouteUnloadedData): Promise<Route> {
    const response: IBusRouteResponse =
      await axios.get(`${baseApi}/GetRouteInfo/${routeData}?_=${TimestampUtils.getCurrentMilliseconds()}`)

    return Route.fromApi(routeData, response)
  }

  static async getRoutes(): Promise<IRouteUnloadedData[]> {
    const $ = HTMLParser.load((await axios.get(`${base}/`)).data)

    const routes: IRouteUnloadedData[] = []

    $('div .route-button-bus').each((_, el) => routes.push(this.getRouteDataFromHtml(el, 'bus')))
    $('div .route-button-troll').each((_, el) => routes.push(this.getRouteDataFromHtml(el, 'trolleybus')))

    return routes
  }
}
