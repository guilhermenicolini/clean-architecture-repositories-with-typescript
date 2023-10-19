import { createConnection, Connection, ConnectionConfig } from 'mariadb'
import { IConnection } from '@/domain/gateways/connection'

export const mariaDbNativeOptions: ConnectionConfig = {
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'P@ssw0rd',
  database: 'sys'
}

export class MariaDbConnection implements IConnection<Connection> {
  private source: Connection

  constructor (private readonly config: ConnectionConfig) {}

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
