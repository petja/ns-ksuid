# ns-ksuid

A Node.js library to create namespaced KSUIDs (K-Sortable Unique IDentifier)

Based on [`ksuid`](https://www.npmjs.com/package/ksuid) library

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
const idFromSync: NS_KSUID<'user'> = ID.randomSync('user')
// user_24ydbcZSMKu7w4Oj2hbFUOWChX7
```

Or asynchronously:

```typescript
const idFromAsync: NS_KSUID<'page'> = await ID.random('page')
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
const yesterdayKSUID = ID.fromParts('date', yesterdayInMs, payload)
```

You can parse a valid string-encoded KSUID:

```typescript
const id = ID.parse('user_aWgEPTl1tmebfsQzFP4bxwgy80V')
```

Finally, you can create a KSUID from a 20-byte buffer:

```typescript
const fromBuffer = new ID(buffer)
```

### Properties

Once the KSUID has been created, use it:

```typescript
id.namespace // Namespace (eg. "user")
id.string // Stringify NS_KSUID object (eg. "user_aWgEPTl1tmebfsQzFP4bxwgy80V")
id.raw // The KSUID as a 20-byte buffer (doesn't contain namespace!)
id.date // The timestamp portion of the KSUID, as a `Date` object
id.timestamp // The raw timestamp portion of the KSUID, as a number
id.payload // A Buffer containing the 16-byte payload of the KSUID (typically a random value)
```

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
