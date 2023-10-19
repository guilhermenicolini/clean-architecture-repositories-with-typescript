import { FindUserByEmail } from '@/domain/gateways/user'
import { Repository } from './repository'
import { Connection } from 'mysql2/promise'
import { User } from '@/domain/models/user'

export class MySqlNativeRepository extends Repository implements FindUserByEmail {
  async findByEmail (email: string): Promise<User | undefined> {
    const repo = await this.getDb<Connection>('mysql-native')
    const [result] = await repo
      .query<any>('SELECT id, email, name, password FROM users WHERE email = ?', [email])

    if (result.length === 0) return undefined

    return result[0]
  }
}
