import { ConnectionPool, connect, config } from 'mssql'
import { IConnection } from '@/domain/gateways/connection'

export const msSqlNativeOrmOptions: config = {
  user: 'sa',
  password: 'P@ssw0rd',
  server: 'localhost',
  port: 1437,
  database: 'master',
  options: {
    trustServerCertificate: true
  }
}

export class SqlConnection implements IConnection<ConnectionPool> {
  private source: ConnectionPool

  constructor (private readonly config: config) {}

  async connect (): Promise<void> {
    this.source = await connect(this.config)
  }

  async disconnect (): Promise<void> {
    await this.source.close()
  }

  async db (): Promise<ConnectionPool> {
    if (!this.source?.connected) await this.connect()
    return this.source
  }
}
