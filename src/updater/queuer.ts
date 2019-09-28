export interface ICalculation<T> {
  func: () => Promise<T>,
  onResult: (result: T) => void,
}

export class Queuer {
  internalQueue: Array<ICalculation<any>>;
  interval: number;

  constructor(interval: number) {
    this.internalQueue = []
    this.interval = interval
    this.queueTick()
  }

  push<T>(calculation: ICalculation<T>) {
    this.internalQueue.push(calculation)
  }

  queueTick() {
    setTimeout(this.tick, this.interval)
  }

  async tick() {
    if (this.internalQueue.length !== 0) {
      const calculation = this.internalQueue[0]
      const result = await calculation.func()
      calculation.onResult(result)
    }

    this.queueTick()
  }
}
