import { Position } from '../utils/position';
import { BusStop } from '../utils/stop';
import { Vehicle } from '../utils/vehicle';
import { IBusRouteResponse } from '../api/typings';

export type RouteType = 'bus' | 'trolleybus';

export interface IRouteUnloadedData {
  id: string;
  name: string;
  description: string;
  type: RouteType;
}

export class Route {
  id!: string;
  name!: string;
  description?: string;
  points!: Position[];
  stops!: BusStop[];
  vehicles!: Vehicle[];
  type!: RouteType;

  constructor(id: string, name: string, description: string, points: Position[], stops: BusStop[], vehicles: Vehicle[], type: RouteType) {
    this.id = id
    this.name = name
    this.description = description
    this.points = points
    this.stops = stops
    this.vehicles = vehicles
    this.type = type
  }

  static fromApi(data: IRouteUnloadedData, response: IBusRouteResponse): Route {
    return new Route(
      data.id,
      data.name,
      data.description,
      response.Sc.Crs[0].Ps.map((v) => Position.fromApi(v)),
      response.Sc.Crs[0].Ss.map((v) => new BusStop(v.Id.toString(), v.Name, Position.fromApi(v.Pt))),
      [],
      data.type,
    );
  }
}

export class RouteUpdate {
  vehicles!: Vehicle[];
}
