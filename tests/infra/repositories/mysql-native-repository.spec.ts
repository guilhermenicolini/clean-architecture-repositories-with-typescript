import { MySqlNativeRepository } from '@/infra/repositories/mysql-native-repository'
import { Connection } from 'mysql2/promise'
import { DataSources } from '@/infra/repositories/connections/data-sources'
import { MySqlConnection, mySqlNativeOptions } from '@/infra/repositories/connections/mysql-connection'

describe('MySqlNativeRepository', () => {
  let sut: MySqlNativeRepository
  let client: Connection

  beforeAll(async () => {
    await DataSources.getInstance().add('mysql-native', new MySqlConnection(mySqlNativeOptions))
    client = await DataSources.getInstance().db('mysql-native')
  })

  beforeEach(() => {
    sut = new MySqlNativeRepository()
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
      .query('INSERT INTO users (id, email, name, password) VALUES (UUID() , ?, ?, ?)', ['john.doe@inbox.me', 'John Doe', 'hashed_password'])

    const user = await sut.findByEmail('john.doe@inbox.me')
    expect(user).toEqual({
      id: expect.any(String),
      email: 'john.doe@inbox.me',
      name: 'John Doe',
      password: 'hashed_password'
    })
  })
})
