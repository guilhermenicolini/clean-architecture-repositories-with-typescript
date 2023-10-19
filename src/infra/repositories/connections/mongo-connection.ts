import { MongoClient, Db } from 'mongodb'
import { IConnection } from '@/domain/gateways/connection'

export const mongoNativeOptions: string = 'mongodb://sa:root@localhost:27018/local?authSource=admin&readPreference=primary&ssl=false'

export class MongoConnection implements IConnection<Db> {
  private source: MongoClient

  constructor (private readonly url: string) {}

  async connect (): Promise<void> {
    this.source = new MongoClient(this.url)
    await this.source.connect()
  }

  async disconnect (): Promise<void> {
    await this.source.close(true)
  }

  async db (): Promise<Db> {
    if (!this.source) await this.connect()
    return this.source.db()
  }
}
