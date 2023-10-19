import { Pool, PoolClient, PoolConfig } from 'pg'
import { IConnection } from '@/domain/gateways/connection'

export const postgresNativeOptions: PoolConfig = {
  host: 'localhost',
  port: 5434,
  user: 'postgres',
  password: 'P@ssw0rd',
  database: 'postgres'
}

export class PostgresConnection implements IConnection<PoolClient> {
  private source: PoolClient

  constructor (private readonly config: PoolConfig) {}

  async connect (): Promise<void> {
    this.source = await new Pool(this.config).connect()
  }

  async disconnect (): Promise<void> {
    this.source.release(true)
  }

  async db (): Promise<PoolClient> {
    if (!this.source) await this.connect()
    return this.source
  }
}
