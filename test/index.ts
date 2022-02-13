import { expect } from 'chai'
import * as Id from '..'

it('throw error if incorrect namespace format', () => {
  expect(() => Id.create('användare')).to.throw()
})

it('create ID strings in correct format', () => {
  for (let i = 0; i < 100; i++) {
    const id = Id.create('user')
    expect(id).to.match(/^user_[A-z0-9]+$/)
  }
})

it('parse ID strings', () => {
  const idString = 'user_24yPTDCR1QRPZITB83lxvgcz7KI'

  expect(Id.getNamespace(idString)).to.equal('user')

  expect(Id.getDate(idString).getTime()).to.equal(new Date('2022-02-11T17:17:38.000Z').getTime())

  expect(Id.getPayload(idString).toString('hex')).to.equal('76e8fbc01cd81a5b6120178d5d76e9fe')

  expect(Id.toBuffer(idString).toString('hex')).to.equal('0e944c3276e8fbc01cd81a5b6120178d5d76e9fe')
})

it('throw error when comparing ids from different namespaces', () => {
  const id1 = Id.create('user')
  const id2 = Id.create('payment')
  const id3 = Id.create('payment')

  expect(() => Id.isBefore(id1, id2)).to.throw()

  expect(Id.isBefore(id2, id3)).to.be.true
})

it('create id from parts', () => {
  const id = Id.fromParts(
    'person',
    new Date('2022-02-11T17:17:38.000Z'),
    Buffer.from('76e8fbc01cd81a5b6120178d5d76e9fe', 'hex')
  )

  expect(id).to.equal('person_24yPTDCR1QRPZITB83lxvgcz7KI')
})

it('validate id string', () => {
  expect(Id.isNamespace('player_24yPHHYrYySQDhHsqEAFjCtuS9d', 'player')).to.be.true
  expect(Id.isNamespace('player_24yPHHYrYySQDhHsqEAFjCtuS9d', 'person')).to.be.false

  expect(() => Id.isNamespace('player_iNvAlIdVaLue', 'player', true)).to.throw()
})

it('validate buffer', () => {
  const buffer1 = Buffer.from('foo')
  expect(() => Id.fromBuffer(buffer1, 'bar')).to.throw()

  const buffer2 = Buffer.from('39f43f82ddc3b9dfef67d7591dbaea9deaec6e7c', 'hex')
  expect(Id.fromBuffer(buffer2, 'bar')).to.be.string
})

it('create ids with factory', () => {
  const idFactory = Id.factory('person')

  const id1 = idFactory.next().value!
  const id2 = idFactory.next().value!
  const id3 = idFactory.next().value!

  expect(id1).to.not.be.undefined
  expect(id2).to.not.be.undefined
  expect(id3).to.not.be.undefined

  expect(Id.getNamespace(id1)).to.equal('person')
  expect(Id.getNamespace(id2)).to.equal('person')
  expect(Id.getNamespace(id3)).to.equal('person')

  expect(id1).to.not.equal(id2)
  expect(id2).to.not.equal(id3)
  expect(id3).to.not.equal(id1)
})
