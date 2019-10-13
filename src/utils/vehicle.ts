import { Position } from './position';
import { IApiVehicle, IApiVehicleInformation } from '../api/typings';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Type } from 'class-transformer';

@ObjectType()
export class Vehicle {
  @Field(type => ID)
  id!: string;

  @Field({ nullable: true })
  routeId?: string;

  @Field(type => Position)
  @Type(() => Position)
  position!: Position;

  @Field(type => Int)
  heading!: number;

  @Field({ nullable: true })
  velocity?: number;

  @Field()
  @Type(() => Date)
  lastUpdated!: Date;

  constructor(id: string, position: Position, heading: number, routeId?: string) {
    this.id = id
    this.position = position
    this.heading = heading
    this.routeId = routeId
    this.lastUpdated = new Date(Date.now())
  }

  static fromApi(data: IApiVehicle, routeId?: string): Vehicle {
    return new Vehicle(data.Id.toString(), Position.fromApiWithDecryption(data), data.AZ, routeId);
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

@ObjectType()
export class VehicleInformation {
  @Field(type => ID)
  id!: string;

  @Field({ nullable: true })
  make?: string;

  @Field({ nullable: true })
  makeCountry?: string;

  @Field({ nullable: true })
  makeYear?: string;

  @Field({ nullable: true })
  licenseId?: string;

  @Field(type => Vehicle, { nullable: true })
  @Type(() => Vehicle)
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
