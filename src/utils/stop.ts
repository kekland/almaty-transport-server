import { Position } from './position';
import { IApiBusStop } from '../api/typings';
import { ObjectType, ID, Field } from 'type-graphql';
import { Type } from 'class-transformer';

@ObjectType()
export class BusStop {
  @Field(type => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(type => Position)
  @Type(() => Position)
  position!: Position;

  @Field({nullable: true})
  description?: string;

  constructor(id: string, name: string, position: Position, description?: string) {
    this.id = id
    this.name = name
    this.position = position
    this.description = description
  }

  static fromApi(data: IApiBusStop): BusStop {
    return new BusStop(data.Id.toString(), data.Nm, Position.fromApi(data.Pt), data.Rn)
  }
}
