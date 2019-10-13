import { Position } from '../utils/position';
import { BusStop } from '../utils/stop';
import { Vehicle, VehicleInformation } from '../utils/vehicle';
import { IApiBusRoute, IApiVehicle } from '../api/typings';
import { Model } from 'lapisdb';
import { ObjectType, Field, ID } from 'type-graphql';
import Logger from '../logger/logger';
import { Type } from 'class-transformer';

export type RouteType = 'bus' | 'trolleybus';

export interface IRouteUnloadedData {
  id: string;
  name: string;
  description: string;
  type: RouteType;
}

@ObjectType()
export class Route extends Model<Route> {
  @Field(type => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [Position])
  @Type(() => Position)
  points!: Position[];

  @Field(type => [BusStop])
  @Type(() => BusStop)
  stops!: BusStop[];

  @Field(type => [VehicleInformation])
  @Type(() => VehicleInformation)
  vehicles!: VehicleInformation[];

  @Field()
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
        if (v.lastUpdate) {
          v.lastUpdate.updateWith(updated)
        }
        else {
          v.lastUpdate = updated
        }
      }
    })
  }

  applyUpdate(update: Route): void {
    this.id = update.id
    this.name = update.name
    this.description = update.description
    this.points = update.points
    this.stops = update.stops
    this.vehicles = update.vehicles
    this.type = update.type
  }
}

@ObjectType()
export class RouteSlim {
  @Field(type => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  type!: RouteType;

  constructor(route: Route) {
    this.id = route.id
    this.name = route.name
    this.description = route.description
    this.type = route.type
  }
}

export class RouteUpdate {
  vehicles!: Vehicle[];

  constructor(vehicles: Vehicle[]) {
    this.vehicles = vehicles
  }

  static fromApi(data: IApiVehicle[]) {
    if (!data) data = []
    return new RouteUpdate(
      data.map((v) => Vehicle.fromApi(v)),
    );
  }

  getVehicleWithId(id: string): Vehicle | undefined {
    return this.vehicles.find(v => v.id === id)
  }
}
