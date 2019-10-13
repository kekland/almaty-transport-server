import { IApiPosition } from '../api/typings'
import { ObjectType, Field, Float } from 'type-graphql'

@ObjectType()
export class Position {
  @Field(type => Float)
  lat: number

  @Field(type => Float)
  lon: number

  constructor(lat: number, lon: number) {
    this.lat = lat
    this.lon = lon
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  static getDistanceBetweenPositions(a: Position, b: Position): number {
    const R = 6371 * 1000
    const dLat = Position.deg2rad(a.lat - b.lat)
    const dLon = Position.deg2rad(a.lon - b.lon)
    const dis =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(Position.deg2rad(a.lat)) * Math.cos(Position.deg2rad(b.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(dis), Math.sqrt(1 - dis))
    const d = R * c
    return d
  }

  static fromApi(data: IApiPosition): Position {
    return new Position(
      data.Y,
      data.X,
    )
  }

  static fromApiWithDecryption(data: { LT: number, LN: number }) {
    return PositionDecryptor.decrypt(data.LN, data.LT)
  }
}

const odckji: number = .9996
const bmkpsv: number = 3.14159265358979
const rgkntj: number = 6378137
const ssfodl: number = 6356752.314
const xvisbq: number = .00669437999013
const abxuri: number = 43
const ebshkr: number = 180

class PositionDecryptor {
  static tdrndu(a: number): number {
    return a / bmkpsv * ebshkr
  }

  static vquqbz(a: number): number {
    const b = (rgkntj - ssfodl) / (rgkntj + ssfodl)
    a /= (rgkntj + ssfodl) / 2 * (1 + Math.pow(b, 2) / 4 + Math.pow(b, 4) / 64)
    return a +
      (3 * b / 2 + -27 * Math.pow(b, 3) / 32 + 269 * Math.pow(b, 5) / 512) *
      Math.sin(2 * a) +
      (21 * Math.pow(b, 2) / 16 + -55 * Math.pow(b, 4) / 32) *
      Math.sin(4 * a) +
      (151 * Math.pow(b, 3) / 96 + -417 * Math.pow(b, 5) / 128) *
      Math.sin(6 * a) +
      1097 * Math.pow(b, 4) / 512 * Math.sin(8 * a)
  }

  static zcscxo(a: number, b: number, c: number): { lat: number, lon: number } {
    b = PositionDecryptor.vquqbz(b)
    let h = (Math.pow(rgkntj, 2) - Math.pow(ssfodl, 2)) / Math.pow(ssfodl, 2)
    let k = Math.cos(b)
    const e = h * Math.pow(k, 2)
    let f = h = Math.pow(rgkntj, 2) / (ssfodl * Math.sqrt(1 + e))
    const l = Math.tan(b)
    const g = l * l
    const m = g * g
    const n = 1 / (f * k)
    f *= h
    const p = l / (2 * f)
    f *= h
    const q = 1 / (6 * f * k)
    f *= h
    const r = l / (24 * f)
    f *= h
    const t = 1 / (120 * f * k)
    f *= h
    const u = l / (720 * f)
    f *= h
    k = 1 / (5040 * f * k)
    const v = -1 - 2 * g - e
    const w = 5 + 28 * g + 24 * m + 6 * e + 8 * g * e
    const x = -61 - 662 * g - 1320 * m - 720 * m * g

    return {
      lat: PositionDecryptor.tdrndu(b +
        p * (-1 - e) * a * a +
        r *
        (5 + 3 * g + 6 * e - 6 * g * e - 3 * e * e - 9 * g * e * e) *
        Math.pow(a, 4) +
        u * (-61 - 90 * g - 45 * m - 107 * e + 162 * g * e) * Math.pow(a, 6) +
        l /
        (40320 * f * h) *
        (1385 + 3633 * g + 4095 * m + 1575 * m * g) *
        Math.pow(a, 8)),
      lon: PositionDecryptor.tdrndu(c +
        n * a +
        q * v * Math.pow(a, 3) +
        t * w * Math.pow(a, 5) +
        k * x * Math.pow(a, 7)),
    }
  }

  static qsdows(a: number): number {
    return a / 180 * bmkpsv
  }

  static isaqrl(a: number): number {
    return PositionDecryptor.qsdows(-183 + 6 * a)
  }

  static decrypt(a: number, b: number): Position {
    a = (a - 5E5) / odckji
    b /= odckji
    const d = PositionDecryptor.isaqrl(abxuri)
    const ans = PositionDecryptor.zcscxo(a, b, d)

    return new Position(ans.lat, ans.lon)
  }
}
