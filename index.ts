import KSUID from 'ksuid'

export type Id<NS extends string = string> = `${NS}_${string}`

function split<NS extends string>(id: Id<NS>): [NS, KSUID] {
  const [namespace, ksuidString] = id.split('_')

  validateNamespace(namespace, true)

  return [namespace as NS, KSUID.parse(ksuidString)]
}

export function validateNamespace(namespace: string, throwIfNotValid: boolean = false): boolean {
  const isValid = /^[a-z]{1,10}$/.test(namespace)

  if (!isValid && throwIfNotValid) {
    throw new TypeError(
      `ID namespace must be underscore letters a-z and have length between 1 and 10. Received: "${namespace}"`
    )
  }

  return isValid
}

export function isValid(id: Id): boolean {
  try {
    split(id)
    return true
  } catch {
    return false
  }
}

export function create<NS extends string>(namespace: NS, date?: Date): Id<NS> {
  validateNamespace(namespace, true)

  const ksuid = date ? KSUID.randomSync(date) : KSUID.randomSync()
  return `${namespace}_${ksuid.string}`
}

export function getDate(id: Id): Date {
  const [_, ksuid] = split(id)
  return ksuid.date
}

export function toBuffer(id: Id): Buffer {
  const [_, ksuid] = split(id)
  return ksuid.raw
}

export function fromBuffer<NS extends string>(buffer: Buffer, namespace: NS): Id<NS> {
  validateNamespace(namespace, true)

  const ksuid = new KSUID(buffer)
  return `${namespace}_${ksuid.string}`
}

export function getPayload(id: Id): Buffer {
  const [_, ksuid] = split(id)
  return ksuid.payload
}

export function getNamespace<NS extends string>(id: Id<NS>): NS {
  const [namespace] = split(id)
  return namespace as NS
}

export function getKSUID<NS extends string>(id: Id<NS>): KSUID {
  const [_, ksuid] = split(id)
  return ksuid
}

export function isNamespace<NS extends string>(id: Id, namespace: NS, throwIfNotMatch: boolean = false): id is Id<NS> {
  const isMatch = getNamespace(id) === namespace

  if (!isMatch && throwIfNotMatch) {
    throw new TypeError(`Expected ID to have namespace "${namespace}" but received ${getNamespace(id)}`)
  }

  return isMatch
}

export function isBefore<NS extends string>(id1: Id<NS>, id2: Id<NS>): boolean {
  const [ns1, ksuid1] = split(id1)
  const [ns2, ksuid2] = split(id2)

  if (ns1 !== ns2) {
    throw new TypeError(`IDs must have same namespace but received "${ns1}" for left-hand and "${ns2}" for right-hand`)
  }

  return ksuid1.compare(ksuid2) === -1
}

export function isAfter<NS extends string>(id1: Id<NS>, id2: Id<NS>): boolean {
  return isBefore(id2, id1)
}

export function fromParts<NS extends string>(namespace: NS, date: Date, payload: Buffer): Id<NS> {
  const ksuid = KSUID.fromParts(date.getTime(), payload)
  return `${namespace}_${ksuid.string}`
}

export function* factory<NS extends string>(namespace: NS) {
  while (true) {
    yield create(namespace)
  }
}
