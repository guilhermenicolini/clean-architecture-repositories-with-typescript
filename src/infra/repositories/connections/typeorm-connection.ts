import { DataSource, DataSourceOptions } from 'typeorm'
import { IConnection } from '@/domain/gateways/connection'

export const msSqlTypeOrmOptions: DataSourceOptions = {
  name: 'sqlConnection',
  type: 'mssql',
  host: 'localhost',
  port: 1437,
  username: 'sa',
  password: 'P@ssw0rd',
  database: 'master',
  extra: {
    options: {
      encrypt: false
    }
  }
}

export const pgTypeOrmOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'postgres',
  password: 'P@ssw0rd',
  database: 'postgres'
}

export const mariaDbTypeOrmOptions: DataSourceOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: 'P@ssw0rd',
  database: 'sys'
}

export const mysqlTypeOrmOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3308,
  username: 'root',
  password: 'P@ssw0rd',
  database: 'sys'
}

export class TypeOrmConnection implements IConnection<DataSource> {
  private source: DataSource

  constructor (private readonly options: DataSourceOptions) {}

  async connect (): Promise<void> {
    this.source = new DataSource(this.options)
    await this.source.initialize()
  }

  async disconnect (): Promise<void> {
    await this.source.destroy()
  }

  async db (): Promise<DataSource> {
    if (!this.source?.isInitialized) await this.connect()
    return this.source
  }
}
