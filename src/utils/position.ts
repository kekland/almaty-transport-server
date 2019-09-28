import { IApiPosition } from '../api/typings';

export class Position {
  lat: number;
  lon: number;

  constructor(lat: number, lon: number) {
    this.lat = lat
    this.lon = lon
  }

  static getDistanceBetweenPositions(a: Position, b: Position): number {
    // TODO
    return 0.0;
  }

  static fromApi(data: IApiPosition): Position {
    return new Position(
      data.Y,
      data.X,
    )
  }
}
