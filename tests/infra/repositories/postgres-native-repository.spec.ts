import { PostgresNativeRepository } from '@/infra/repositories/postgres-native-repository'
import { PoolClient } from 'pg'
import { DataSources } from '@/infra/repositories/connections/data-sources'
import { PostgresConnection, postgresNativeOptions } from '@/infra/repositories/connections/postgres-connection'

describe('PostgresNativeRepository', () => {
  let sut: PostgresNativeRepository
  let client: PoolClient

  beforeAll(async () => {
    await DataSources.getInstance().add('postgres-native', new PostgresConnection(postgresNativeOptions))
    client = await DataSources.getInstance().db('postgres-native')
  })

  beforeEach(() => {
    sut = new PostgresNativeRepository()
  })

  afterEach(async () => {
    await client.query('DELETE FROM users')
  })

  afterAll(async () => {
    await DataSources.getInstance().disconnect()
  })

  test('Should return no users', async () => {
    const user = await sut.findByEmail('john.doe@inbox.me')
    expect(user).toBeUndefined()
  })

  test('Should return correct output on success', async () => {
    await client
      .query('INSERT INTO users (id, email, name, password) VALUES (uuid_generate_v4(), $1, $2, $3)', ['john.doe@inbox.me', 'John Doe', 'hashed_password'])

    const user = await sut.findByEmail('john.doe@inbox.me')
    expect(user).toEqual({
      id: expect.any(String),
      email: 'john.doe@inbox.me',
      name: 'John Doe',
      password: 'hashed_password'
    })
  })
})
