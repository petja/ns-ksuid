import KSUID from 'ksuid'

export type IdString<NS extends string> = `${NS}_${string}`

export class Id<NS extends string = string> {
  readonly namespace: NS
  readonly ksuid: KSUID

  constructor(namespace: NS, ksuid: KSUID) {
    if (!Id.isValidNamespace(namespace)) {
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

  compare(other: Id<NS>) {
    if (this.namespace !== other.namespace) throw new TypeError('Cannot compare IDs from different namespaces')

    return this.ksuid.compare(other.ksuid)
  }

  equals(other: Id<NS>) {
    return this.compare(other) === 0
  }

  static randomSync<NS extends string>(namespace: NS, timeInMs?: number | Date): Id<NS> {
    return new Id<NS>(namespace, KSUID.randomSync(timeInMs as any))
  }

  static async random<NS extends string>(namespace: NS, timeInMs?: Date | number): Promise<Id<NS>> {
    return Id.randomSync(namespace, timeInMs)
  }

  static parse<NS extends string>(str: IdString<NS>): Id<NS> {
    const splits = str.split('_')
    return new Id<NS>(splits[0] as NS, KSUID.parse(splits[1]))
  }

  static fromParts<NS extends string>(namespace: NS, timeInMs: number, payload: Buffer): Id<NS> {
    return new Id<NS>(namespace, KSUID.fromParts(timeInMs, payload))
  }

  static isValidNamespace<NS extends string>(namespace: NS): boolean {
    return /^[a-z]{1,10}$/.test(namespace)
  }

  static validateIdString<NS extends string>(namespace: NS, str: string): str is IdString<NS> {
    const parsed = Id.parse(str as any)
    return parsed.namespace === namespace
  }

  static throwIfNotValidIdString<NS extends string>(namespace: NS, str: string): void {
    const isValid = Id.validateIdString(namespace, str)

    if (!isValid) {
      throw new TypeError(`Invalid ID string "${str}". Expected namespace "${namespace}".`)
    }
  }

  static isValid(buffer: Buffer) {
    return KSUID.isValid(buffer)
  }
}

export function* IdFactory<NS extends string>(namespace: NS) {
  while (true) {
    yield Id.randomSync(namespace)
  }
}

export default Id
