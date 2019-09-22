import { Route, IRouteUnloadedData, RouteType } from '../routes/route';
import axios from 'axios'
import { plainToClass } from 'class-transformer'
import { TimestampUtils } from '../utils/utils';
import * as HTMLParser from 'cheerio'

const base: string = 'https://citybus.kz/'

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
  static async getRouteInfo(route: string): Promise<Route> {
    const response = await axios.get(`${base}/almaty/Monitoring/GetRouteInfo/${route}?_=${TimestampUtils.getCurrentMilliseconds()}`)

    return plainToClass(Route, response.data)
  }

  static async getRoutes(): Promise<IRouteUnloadedData[]> {
    const $ = HTMLParser.load((await axios.get(`${base}/`)).data)

    const routes: IRouteUnloadedData[] = []

    $('div .route-button-bus').each((index, el) => routes.push(this.getRouteDataFromHtml(el, 'bus')))
    $('div .route-button-troll').each((index, el) => routes.push(this.getRouteDataFromHtml(el, 'trolleybus')))

    return routes
  }
}
