import { createConnection, ConnectionOptions, Connection } from 'mysql2/promise'
import { IConnection } from '@/domain/gateways/connection'

export const mySqlNativeOptions: ConnectionOptions = {
  host: 'localhost',
  port: 3308,
  user: 'root',
  password: 'P@ssw0rd',
  database: 'sys'
}

export class MySqlConnection implements IConnection<Connection> {
  private source: Connection

  constructor (private readonly config: ConnectionOptions) {}

  async connect (): Promise<void> {
    this.source = await createConnection(this.config)
  }

  async disconnect (): Promise<void> {
    this.source.destroy()
  }

  async db (): Promise<Connection> {
    if (!this.source) await this.connect()
    return this.source
  }
}
