export interface IBusRouteResponse {
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
        Name: string,
        Pt: {
          X: number,
          Y: number,
        },
      }>,
    }>,
  }
}
