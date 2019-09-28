export interface IApiBusRoute {
  R: {
    I: number,
    N: string,
  },
  Sc: {
    Crs: Array<{
      Ps: Array<{
        X: number,
        Y: number,
      }>,
      Ss: Array<{
        Id: number,
        Nm: string,
        Pt: {
          X: number,
          Y: number,
        },
      }>,
    }>,
  },
  V: IApiVehicleInformation[],
}

export interface IApiPosition {
  X: number;
  Y: number;
}

export interface IApiVehicle {
  Id: number;
  AZ: number;
  LN: number;
  LT: number;
}

export interface IApiVehicleInformation {
  Id: number,
  Md: string,
  Nm: string,
  Pc: string,
  Py: number,
}

export interface IApiBusStop {
  Id: number,
  Nm: string,
  Pt: IApiPosition,
  Rn?: string,
}
