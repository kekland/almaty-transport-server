import { Position } from './position';
import { IApiBusStop } from '../api/typings';

export class BusStop {
  id!: string;
  name!: string;
  position!: Position;
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
