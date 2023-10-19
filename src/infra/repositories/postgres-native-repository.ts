import { FindUserByEmail } from '@/domain/gateways/user'
import { Repository } from './repository'
import { PoolClient } from 'pg'
import { User } from '@/domain/models/user'

export class PostgresNativeRepository extends Repository implements FindUserByEmail {
  async findByEmail (email: string): Promise<User | undefined> {
    const repo = await this.getDb<PoolClient>('postgres-native')
    const result = await repo
      .query('SELECT id, email, name, password FROM users WHERE email = $1', [email])

    if (result.rowCount === 0) return undefined

    return result.rows[0]
  }
}
