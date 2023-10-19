import { IConnection } from '@/domain/gateways/connection'

export class DataSources {
  private static instance?: DataSources
  private dataSources: Record<string, IConnection<any>> = {}

  private constructor () {}

  static getInstance (): DataSources {
    if (DataSources.instance === undefined) DataSources.instance = new DataSources()
    return DataSources.instance
  }

  async add (name: string, connection: IConnection<any>): Promise<void> {
    this.dataSources[name] = connection
  }

  async disconnect (): Promise<void> {
    for (const ds of Object.values(this.dataSources)) {
      await ds.disconnect()
    }
  }

  async db (name: string): Promise<any> {
    const conn = this.dataSources[name]
    if (!conn) throw new Error('Data source not found')

    return await conn.db()
  }
}
