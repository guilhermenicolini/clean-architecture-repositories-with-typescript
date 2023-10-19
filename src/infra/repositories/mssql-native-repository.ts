import { FindUserByEmail } from '@/domain/gateways/user'
import { Repository } from './repository'
import { ConnectionPool, VarChar } from 'mssql'
import { User } from '@/domain/models/user'

export class MsSqlNativeRepository extends Repository implements FindUserByEmail {
  async findByEmail (email: string): Promise<User | undefined> {
    const repo = await this.getDb<ConnectionPool>('mssql-native')
    const result = await repo
      .request()
      .input('email', VarChar, email)
      .query('SELECT id, email, name, password FROM users WHERE email = @email')

    if (result.recordset.length === 0) return undefined

    return result.recordset[0]
  }
}
