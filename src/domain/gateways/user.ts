import { User } from '@/domain/models/user'

export interface FindUserByEmail {
  findByEmail: (email: string) => Promise<User | undefined>
}
