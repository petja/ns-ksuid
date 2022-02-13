# ns-ksuid

![npm](https://img.shields.io/npm/v/ns-ksuid)

A Node.js library to create namespaced IDs which are easy to spot from logs and API responses and which sort nicely thanks to timestamp included on each ID. Since this library is strongly typed, you can always be sure you have correct type of ID.

## What?

IDs generated with this library look very similar Stripe uses:

```
payment_24yPGRexFPFVcmtJGbPIGTuwvq4
payment_24yPGNvV6QG8CqzNiOpnP8GwlDE
payment_24yPGN7nlhAdrPpoiVdAGNXMlPC
payment_24yPGOtwmGam4FcrvZzfml4KIIn
payment_24yPGRMQzcPNz4X67c47FbjFuym
payment_24yPGPFb3nZu8DOdMhOw65jb3Id
payment_24yPGPn3On5DnMZ04YN6k4j03nG
payment_24yPGOWUOtfJK3fFuZ73DoVEm7X
payment_24yPGQ3OZCrYsMt3UHbzpw2tNSh
payment_24yPGOtnWpDeoGwRSfEsnlFqFRu
payment_24yPGOOOPa2wGK6lKo1ch3RB2dz
payment_24yPGMSFhsm7B5Ywb6LAjXbuLFr
payment_24yPGOwAaCgedKLnnsM3A4ENv5t
payment_24yPGNnIkkrOmhNRife6VaNSYz2
payment_24yPGQqwk2GgTvBZgALCWTrFd1h
```

Each ID consist from three parts:
1. Namespace (`payment` in this example)
2. Timestamp (4 bytes)
3. Random payload (16 bytes)

Timestamp and payload are concenated and encoded as a base62 string. This string is also known as "KSUID" (K-Sortable Unique IDentifier).

## Installation

```console
npm add ns-ksuid
```

## Usage

Import the module:

```typescript
import * as Id from 'ns-ksuid'
```

### Creation

To create new random ID:

```typescript
const id: Id<'user'> = Id.create('user') // user_24ydbcZSMKu7w4Oj2hbFUOWChX7
```

You can also specify a specific time as a `Date` object:

```typescript
const id: Id<'user'> = Id.create('user', new Date('2022-02-11T16:53:50Z')) // user_24yMZlILRdtVCO28KFYswpvj0bL
```

Or you can compose it using a timestamp and a 16-byte payload:

```typescript
import { randomBytes } from 'crypto'
const yesterday = new Date(Date.now() - 86400 * 1000)
const payload = randomBytes(16)
const yesterdayId = Id.fromParts('date', yesterday, payload)
```

Finally, you can also create ID from a namespace and 20-byte buffer:

```typescript
const id: Id<'article'> = Id.fromBuffer(buffer, 'article') // article_24yPdjC5sbYCzDiLoprjRvYbxse
```

### Parsing

Get namespace, a [KSUID object](https://www.npmjs.com/package/ksuid), creation date or buffer representation of an ID. Note that `Buffer` doesn't contain a namespace.

```typescript
const ns: 'user' = Id.getNamespace('user_254gYQ3GjIE3Am7ZawWvzVIn1Yl')
const ksuid: KSUID = Id.getKSUID('user_254gYQ3GjIE3Am7ZawWvzVIn1Yl')
const date: Date = Id.getDate('user_254gYQ3GjIE3Am7ZawWvzVIn1Yl') // 2022-02-13T22:36:59.000Z
const buffer: Buffer = Id.toBuffer('user_254gYQ3GjIE3Am7ZawWvzVIn1Yl')
```


### Comparisons

You can compare IDs:

```typescript
// IDs must be in same namespace, otherwise an error will be thrown!

const isBefore: true = Id.isBefore(yesterdayId, todayId)
const isAfter: true = Id.isAfter(todayId, yesterdayId)
const isSame: false = todayId === yesterdayId
```

If you expect ID to be in certain namespace, you can validate it:

```typescript
const isValid: true = Id.isNamespace('user_aWgEPTl1tmebfsQzFP4bxwgy80V', 'user')
```

If third parameter is true and ID has a wrong namespasce, a `TypeError` will be thrown:

```typescript
Id.isNamespace('user_aWgEPTl1tmebfsQzFP4bxwgy80V', 'user', true)
```

## Strongly typed

This library is strongly typed 💪 

For example TypeScript will complain about these:

```typescript
const id1: Id<'article'> = Id.create('user')
const id2: 'article' = Id.getNamespace('user_aWgEPTl1tmebfsQzFP4bxwgy80V')
```
