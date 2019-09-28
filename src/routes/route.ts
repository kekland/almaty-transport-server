import { Position } from '../utils/position';
import { BusStop } from '../utils/stop';
import { Vehicle, VehicleInformation } from '../utils/vehicle';
import { IApiBusRoute, IApiVehicle } from '../api/typings';
import { Model } from 'lapisdb';

export type RouteType = 'bus' | 'trolleybus';

export interface IRouteUnloadedData {
  id: string;
  name: string;
  description: string;
  type: RouteType;
}

export class Route extends Model<Route> {
  id!: string;
  name!: string;
  description?: string;
  points!: Position[];
  stops!: BusStop[];
  vehicles!: VehicleInformation[];
  type!: RouteType;

  constructor(id: string, name: string, description: string, points: Position[], stops: BusStop[], vehicles: VehicleInformation[], type: RouteType) {
    super(Route)
    this.id = id
    this.name = name
    this.description = description
    this.points = points
    this.stops = stops
    this.vehicles = vehicles
    this.type = type
  }

  static fromApi(data: IRouteUnloadedData, response: IApiBusRoute): Route {
    return new Route(
      data.id,
      data.name,
      data.description,
      response.Sc.Crs[0].Ps.map(Position.fromApi),
      response.Sc.Crs[0].Ss.map(BusStop.fromApi),
      response.V.map(VehicleInformation.fromApi),
      data.type,
    );
  }

  applyRouteUpdate(update: RouteUpdate): void {
    this.vehicles.forEach((v) => {
      const updated = update.getVehicleWithId(v.id)
      if (updated) {
        v.lastUpdate = updated
      }
    })
  }

  applyUpdate(update: Route): void {
    this.id = update.id
    this.name = update.name
    this.description = update.description
    this.points = update.points
    this.stops = update.stops
    this.vehicles = update.vehicles.map((updatedVehicle) => {
      const oldVehicle = this.vehicles.find(v => v.id === updatedVehicle.id)
      if (oldVehicle) {
        updatedVehicle.lastUpdate = oldVehicle.lastUpdate
      }
      return updatedVehicle
    })
    this.type = update.type
  }
}

export class RouteUpdate {
  vehicles!: Vehicle[];

  constructor(vehicles: Vehicle[]) {
    this.vehicles = vehicles
  }

  static fromApi(data: IApiVehicle[]) {
    return new RouteUpdate(
      data.map((v) => Vehicle.fromApi(v)),
    );
  }

  getVehicleWithId(id: string): Vehicle | undefined {
    return this.vehicles.find(v => v.id === id)
  }
}
