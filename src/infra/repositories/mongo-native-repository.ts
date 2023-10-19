import { FindUserByEmail } from '@/domain/gateways/user'
import { Repository } from './repository'
import { Db } from 'mongodb'
import { User } from '@/domain/models/user'

export class MongoNativeRepository extends Repository implements FindUserByEmail {
  async findByEmail (email: string): Promise<User | undefined> {
    const repo = await this.getDb<Db>('mongo-native')
    const result = await repo
      .collection('users')
      .aggregate([
        {
          $match: { email }
        },
        {
          $addFields: { id: { $toString: '$_id' } }
        },
        {
          $project: { _id: 0 }
        }
      ]).toArray()

    if (result.length === 0) return undefined

    return result[0] as any
  }
}
