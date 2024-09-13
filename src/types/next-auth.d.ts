import type { DefaultSession } from 'next-auth'

type TeamSession = {
  session: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      session: string
      teamSessions: { [key: string]: TeamSession }
    }
  }
  interface User {
    id: string
    email: string
    session: string
    teamSessions: { [key: string]: TeamSession }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    session: string
    teamSessions: { [key: string]: TeamSession }
  }
}
