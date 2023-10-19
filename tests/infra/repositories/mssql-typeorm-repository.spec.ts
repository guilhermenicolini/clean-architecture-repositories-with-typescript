import { MsSqlTypeOrmRepository } from '@/infra/repositories/mssql-typeorm-repository'
import { DataSources } from '@/infra/repositories/connections/data-sources'
import { TypeOrmConnection, msSqlTypeOrmOptions } from '@/infra/repositories/connections/typeorm-connection'
import { DataSource } from 'typeorm'

describe('MsSqlTypeOrmRepository', () => {
  let sut: MsSqlTypeOrmRepository
  let client: DataSource

  beforeAll(async () => {
    await DataSources.getInstance().add('mssql-typeorm', new TypeOrmConnection(msSqlTypeOrmOptions))
    client = await DataSources.getInstance().db('mssql-typeorm')
  })

  beforeEach(() => {
    sut = new MsSqlTypeOrmRepository()
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
      .query("INSERT INTO users (id, email, name, password) VALUES (NEWID(), 'john.doe@inbox.me', 'John Doe', 'hashed_password')")

    const user = await sut.findByEmail('john.doe@inbox.me')
    expect(user).toEqual({
      id: expect.any(String),
      email: 'john.doe@inbox.me',
      name: 'John Doe',
      password: 'hashed_password'
    })
  })
})
