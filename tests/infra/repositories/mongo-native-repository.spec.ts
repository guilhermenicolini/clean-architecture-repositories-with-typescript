import { MongoNativeRepository } from '@/infra/repositories/mongo-native-repository'
import { Db } from 'mongodb'
import { DataSources } from '@/infra/repositories/connections/data-sources'
import { MongoConnection, mongoNativeOptions } from '@/infra/repositories/connections/mongo-connection'

describe('MongoNativeRepository', () => {
  let sut: MongoNativeRepository
  let client: Db

  beforeAll(async () => {
    await DataSources.getInstance().add('mongo-native', new MongoConnection(mongoNativeOptions))
    client = await DataSources.getInstance().db('mongo-native')
  })

  beforeEach(() => {
    sut = new MongoNativeRepository()
  })

  afterEach(async () => {
    await client.collection('users').deleteMany({})
  })

  afterAll(async () => {
    await DataSources.getInstance().disconnect()
  })

  test('Should return no users', async () => {
    const user = await sut.findByEmail('john.doe@inbox.me')
    expect(user).toBeUndefined()
  })

  test('Should return correct output on success', async () => {
    await client.collection('users').insertOne({ email: 'john.doe@inbox.me', name: 'John Doe', password: 'hashed_password' })

    const user = await sut.findByEmail('john.doe@inbox.me')
    expect(user).toEqual({
      id: expect.any(String),
      email: 'john.doe@inbox.me',
      name: 'John Doe',
      password: 'hashed_password'
    })
  })
})
