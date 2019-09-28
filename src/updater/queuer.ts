export interface ICalculation<T, K> {
  func: (arg: T, lastUpdate: number) => Promise<K>,
  onResult: (result: K) => void,
  arg: T,
}

export class Queuer {
  internalQueue: Array<ICalculation<any, any>>;
  interval: number;
  lastUpdate: number;

  constructor(interval: number) {
    this.internalQueue = []
    this.interval = interval
    this.lastUpdate = 0
    this.queueTick()
  }

  push<T, K>(calculation: ICalculation<T, K>) {
    this.internalQueue.push(calculation)
  }

  queueTick() {
    setTimeout(() => this.tick(), this.interval)
  }

  async tick() {
    if (this.internalQueue.length !== 0) {
      const calculation = this.internalQueue[0]
      const result = await calculation.func(calculation.arg, this.lastUpdate)
      calculation.onResult(result)
      this.internalQueue.shift()
    }

    this.lastUpdate = Date.now()
    this.queueTick()
  }
}
