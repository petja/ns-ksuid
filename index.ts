import KSUID from 'ksuid'

export type IdString<NS extends string> = `${NS}_${string}`

export default class NS_KSUID<NS extends string = string> {
  readonly namespace: NS
  readonly ksuid: KSUID

  constructor(namespace: NS, ksuid: KSUID) {
    if (!NS_KSUID.isValidNamespace(namespace)) {
      throw new TypeError(
        `ID namespace must be underscore letters a-z and have length between 1 and 10. Received: "${namespace}"`
      )
    }

    this.namespace = namespace
    this.ksuid = ksuid
  }

  get string(): IdString<NS> {
    return `${this.namespace}_${this.ksuid.string}` as IdString<NS>
  }

  toString() {
    return this.string
  }

  get raw(): Readonly<Buffer> {
    return this.ksuid.raw
  }

  get date(): Readonly<Date> {
    return this.ksuid.date
  }

  get timestamp(): Readonly<number> {
    return this.ksuid.timestamp
  }

  get payload(): Readonly<Buffer> {
    return this.ksuid.payload
  }

  compare(other: NS_KSUID<NS>) {
    if (this.namespace !== other.namespace) throw new TypeError('Cannot compare IDs from different namespaces')

    return this.ksuid.compare(other.ksuid)
  }

  equals(other: NS_KSUID<NS>) {
    return this.compare(other) === 0
  }

  static randomSync<NS extends string>(namespace: NS, timeInMs?: number | Date): NS_KSUID<NS> {
    return new NS_KSUID<NS>(namespace, KSUID.randomSync(timeInMs as any))
  }

  static async random<NS extends string>(namespace: NS, timeInMs?: Date | number): Promise<NS_KSUID<NS>> {
    return NS_KSUID.randomSync(namespace, timeInMs)
  }

  static parse<NS extends string>(str: IdString<NS>): NS_KSUID<NS> {
    const splits = str.split('_')
    return new NS_KSUID<NS>(splits[0] as NS, KSUID.parse(splits[1]))
  }

  static fromParts<NS extends string>(namespace: NS, timeInMs: number, payload: Buffer): NS_KSUID<NS> {
    return new NS_KSUID<NS>(namespace, KSUID.fromParts(timeInMs, payload))
  }

  static isValidNamespace<NS extends string>(namespace: NS): boolean {
    return /^[a-z]{1,10}$/.test(namespace)
  }

  static validateIdString<NS extends string>(namespace: NS, str: string): str is IdString<NS> {
    const parsed = NS_KSUID.parse(str as any)
    return parsed.namespace === namespace
  }

  static isValid(buffer: Buffer) {
    return KSUID.isValid(buffer)
  }
}

export function* IdFactory<NS extends string>(namespace: NS) {
  while (true) {
    yield NS_KSUID.randomSync(namespace)
  }
}
