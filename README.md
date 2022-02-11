# ns-ksuid

A Node.js library to create namespaced KSUIDs (K-Sortable Unique IDentifier)

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

## Benefits

* Thanks to namespace you instantly know which kind of ID it is – no more guesswork
* Namespace helps spotting ID from the wall of text, for example from logs and API responses
* Timestamp makes sure IDs are sortable
* This library is strongly typed 💪

## Installation

```console
npm add ns-ksuid
```

## Usage

Require the module:

```typescript
import ID from 'ns-ksuid'
```

### Creation

You can create a new instance synchronously:

```typescript
const idFromSync: ID<'user'> = ID.randomSync('user')
// user_24ydbcZSMKu7w4Oj2hbFUOWChX7
```

Or asynchronously:

```typescript
const idFromAsync: ID<'page'> = await ID.random('page')
// page_24ydfG6C0bNQ96giyrLlhIQf4vb
```

You can also specify a specific time, either in milliseconds or as a `Date` object:

```typescript
const idFromDate = ID.randomSync('user', new Date('2022-02-11T16:53:50Z'))
const idFromMillisecondsAsync = await ID.random('vehicle', 1644598430000)
```

Or you can compose it using a timestamp and a 16-byte payload:

```typescript
import { randomBytes } from 'crypto'
const yesterdayInMs = Date.now() - 86400 * 1000
const payload = randomBytes(16)
const yesterdayId = ID.fromParts('date', yesterdayInMs, payload)
```

You can parse a valid string-encoded ID:

```typescript
const id: ID<'user'> = ID.parse('user_aWgEPTl1tmebfsQzFP4bxwgy80V')
```

Finally, you can create ID from a namespace and 20-byte buffer:

```typescript
const id: ID<'article'> = new ID('article', buffer)
// article_24yPdjC5sbYCzDiLoprjRvYbxse
```

### Properties

Once the ID has been created, you can access its properties:

| field       | description                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `date`      | Timestamp of the ID as a `Date` object                                                                                                 |
| `namespace` | Namespace (e.g. `user`)                                                                                                                |
| `payload`   | Random payload of the ID as a `Buffer` object                                                                                          |
| `raw`       | 20-byte buffer representing ID. Does not include namespace. You might want to use this for example on your database.                   |
| `string`    | Stringified ID (e.g. `user_aWgEPTl1tmebfsQzFP4bxwgy80V`). You might want to use this for example on API responses of your application. |
| `timestamp` | Timestamp of the ID in numeric format                                                                                                  |

### Comparisons

You can compare KSUIDs:

```js
todayId.compare(yesterdayId) // 1
todayId.compare(todayId) // 0
yesterdayId.compare(todayId) // -1
```

And check for equality:

```js
todayId.equals(todayId) // true
todayId.equals(yesterdayId) // false
```

### Validation

You can check whether a particular buffer is a valid KSUID:

```js
ID.isValid(buffer) // Boolean
```
