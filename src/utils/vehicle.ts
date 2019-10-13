import { Position } from './position';
import { IApiVehicle, IApiVehicleInformation } from '../api/typings';

export class Vehicle {
  id!: string;
  routeId?: string;
  position!: Position;
  heading!: number;
  velocity?: number;
  lastUpdated!: Date;

  constructor(id: string, position: Position, heading: number, routeId?: string) {
    this.id = id
    this.position = position
    this.heading = heading
    this.routeId = routeId
    this.lastUpdated = new Date(Date.now())
  }

  static fromApi(data: IApiVehicle, routeId?: string): Vehicle {
    return new Vehicle(data.Id.toString(), new Position(data.LT, data.LN), data.AZ, routeId);
  }

  updateWith(newVehicle: Vehicle) {
    this.heading = newVehicle.heading
    this.velocity =
      Position.getDistanceBetweenPositions(this.position, newVehicle.position) /
      ((newVehicle.lastUpdated.getTime() - this.lastUpdated.getTime()) / 1000)

    this.position = newVehicle.position
    this.lastUpdated = newVehicle.lastUpdated
  }
}

export class VehicleInformation {
  id!: string;
  make?: string;
  makeCountry?: string;
  makeYear?: string;
  licenseId?: string;

  lastUpdate?: Vehicle;

  constructor(id: string, make?: string, makeCountry?: string, makeYear?: string, licenseId?: string, lastUpdate?: Vehicle) {
    this.id = id
    this.make = make
    this.makeCountry = makeCountry
    this.makeYear = makeYear
    this.licenseId = licenseId
    this.lastUpdate = lastUpdate
  }

  static fromApi(data: IApiVehicleInformation): VehicleInformation {
    return new VehicleInformation(
      data.Id.toString(),
      data.Md,
      data.Pc,
      data.Py.toString(),
      data.Nm,
    );
  }
}
