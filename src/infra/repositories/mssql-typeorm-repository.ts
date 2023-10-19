import { FindUserByEmail } from '@/domain/gateways/user'
import { Repository } from './repository'
import { DataSource } from 'typeorm'
import { User } from '@/domain/models/user'

export class MsSqlTypeOrmRepository extends Repository implements FindUserByEmail {
  async findByEmail (email: string): Promise<User | undefined> {
    const repo = await this.getDb<DataSource>('mssql-typeorm')
    const result = await repo
      .query(`SELECT id, email, name, password FROM users WHERE email = '${email}'`)

    if (result.length === 0) return undefined

    return result[0]
  }
}
