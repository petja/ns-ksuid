import { expect } from 'chai'
import { Id, IdFactory } from '..'

it('throw error if incorrect namespace format', () => {
  expect(() => Id.randomSync('användare')).to.throw()
})

it('create ID strings in correct format', () => {
  for (let i = 0; i < 100; i++) {
    const id = Id.randomSync('user')
    expect(id.string).to.match(/^user_[A-z0-9]+$/)
  }
})

it('parse ID strings', () => {
  const idString = 'user_24yPTDCR1QRPZITB83lxvgcz7KI'
  const parsed = Id.parse(idString)

  expect(parsed.namespace).to.equal('user')

  expect(parsed.date.getTime()).to.equal(new Date('2022-02-11T17:17:38.000Z').getTime())

  expect(parsed.timestamp).to.equal(244599858)

  expect(parsed.payload.toString('hex')).to.equal('76e8fbc01cd81a5b6120178d5d76e9fe')

  expect(parsed.raw.toString('hex')).to.equal('0e944c3276e8fbc01cd81a5b6120178d5d76e9fe')

  expect(parsed.string).to.equal(idString)
})

it('throw error when comparing ids from different namespaces', () => {
  const id1 = Id.randomSync('user')
  const id2 = Id.randomSync('payment')
  const id3 = Id.randomSync('payment')

  // @ts-expect-error
  expect(() => id1.compare(id2)).to.throw()

  expect(id2.compare(id3)).to.be.a('number')
})

it('do equality check', () => {
  const id1 = Id.randomSync('article')
  const id2 = Id.randomSync('article')
  const id3 = Id.parse(id2.string)

  expect(id1.equals(id2)).to.be.false
  expect(id2.equals(id3)).to.be.true
})

it('create id async', async () => {
  const id = await Id.random('car')
  expect(id.namespace).to.equal('car')
})

it('create id from parts', () => {
  const id = Id.fromParts(
    'person',
    new Date('2022-02-11T17:17:38.000Z').getTime(),
    Buffer.from('76e8fbc01cd81a5b6120178d5d76e9fe', 'hex')
  )

  expect(id.string).to.equal('person_24yPTDCR1QRPZITB83lxvgcz7KI')
})

it('validate id string', () => {
  expect(Id.validateIdString('player', 'player_24yPHHYrYySQDhHsqEAFjCtuS9d')).to.be.true

  expect(Id.validateIdString('person', 'player_24yPHHYrYySQDhHsqEAFjCtuS9d')).to.be.false

  expect(() => Id.validateIdString('player', 'player_iNvAlIdVaLue')).to.throw()
})

it('validate buffer', () => {
  const buffer = Buffer.from('foo')
  expect(Id.isValid(buffer)).to.be.false
})

it('create ids with factory', () => {
  const idFactory = IdFactory('person')

  const id1 = idFactory.next().value!
  const id2 = idFactory.next().value!
  const id3 = idFactory.next().value!

  expect(id1).to.not.be.undefined
  expect(id2).to.not.be.undefined
  expect(id3).to.not.be.undefined

  expect(id1.namespace).to.equal('person')
  expect(id2.namespace).to.equal('person')
  expect(id3.namespace).to.equal('person')

  expect(id1.string).to.not.equal(id2.string)
  expect(id2.string).to.not.equal(id3.string)
  expect(id3.string).to.not.equal(id1.string)
})
