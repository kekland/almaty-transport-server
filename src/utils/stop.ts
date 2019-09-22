import { Position } from './position';

export class BusStop {
  id!: string;
  name!: string;
  position!: Position;

  constructor(id: string, name: string, position: Position) {
    this.id = id
    this.name = name
    this.position = position
  }
}
