import { MariaDbNativeRepository } from '@/infra/repositories/mariadb-native-repository'
import { Connection } from 'mariadb'
import { DataSources } from '@/infra/repositories/connections/data-sources'
import { MariaDbConnection, mariaDbNativeOptions } from '@/infra/repositories/connections/mariadb-connection'

describe('MariaDbNativeRepository', () => {
  let sut: MariaDbNativeRepository
  let client: Connection

  beforeAll(async () => {
    await DataSources.getInstance().add('mariadb-native', new MariaDbConnection(mariaDbNativeOptions))
    client = await DataSources.getInstance().db('mariadb-native')
  })

  beforeEach(() => {
    sut = new MariaDbNativeRepository()
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
