export interface IConnection<T> {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  db: () => Promise<T>
}
