import { Position } from '../utils/position';
import { BusStop } from '../utils/stop';
import { Vehicle } from '../utils/vehicle';

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
}

export class RouteUpdate {
  vehicles!: Vehicle[];
}
