export interface IPosition {
  lat: number;
  lon: number;
}

export class Position {
  lat: number;
  lon: number;

  constructor(data: IPosition) {
    if (data == null) {
      throw Error('Provided data is null.')
    }
    this.lat = data.lat
    this.lon = data.lon
  }

  static getDistanceBetweenPositions(a: Position, b: Position): number {
    // TODO
    return 0.0;
  }
}
