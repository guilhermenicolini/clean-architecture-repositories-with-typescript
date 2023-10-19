import { MsSqlNativeRepository } from '@/infra/repositories/mssql-native-repository'
import { ConnectionPool, VarChar } from 'mssql'
import { DataSources } from '@/infra/repositories/connections/data-sources'
import { SqlConnection, msSqlNativeOrmOptions } from '@/infra/repositories/connections/sql-connection'

describe('MsSqlNativeRepository', () => {
  let sut: MsSqlNativeRepository
  let client: ConnectionPool

  beforeAll(async () => {
    await DataSources.getInstance().add('mssql-native', new SqlConnection(msSqlNativeOrmOptions))
    client = await DataSources.getInstance().db('mssql-native')
  })

  beforeEach(() => {
    sut = new MsSqlNativeRepository()
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
      .request()
      .input('email', VarChar, 'john.doe@inbox.me')
      .input('name', VarChar, 'John Doe')
      .input('password', VarChar, 'hashed_password')
      .query('INSERT INTO users (id, email, name, password) VALUES (NEWID(), @email, @name, @password)')

    const user = await sut.findByEmail('john.doe@inbox.me')
    expect(user).toEqual({
      id: expect.any(String),
      email: 'john.doe@inbox.me',
      name: 'John Doe',
      password: 'hashed_password'
    })
  })
})
