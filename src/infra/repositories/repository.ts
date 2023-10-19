import { DataSources } from '@/infra/repositories/connections/data-sources'

export abstract class Repository {
  constructor (private readonly dataSources: DataSources = DataSources.getInstance()) {}

  async getDb<T = any>(connection: string): Promise<T> {
    return await this.dataSources.db(connection)
  }
}
