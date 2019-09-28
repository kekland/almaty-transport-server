export class TimestampUtils {
  static getCurrentSeconds(): number {
    return Math.round(Date.now() / 1000.0)
  }
  static getCurrentMilliseconds(): number {
    return Date.now()
  }
}
