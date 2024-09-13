import cookie from 'cookie'
import NextAuth from 'next-auth'
import { decode } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import pino from 'pino'

import type { NextAuthOptions } from 'next-auth'

const COOKIE_PREFIX = 'sample-auth'
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

const logger = pino()

const getDecodedCookie = async (cookieHeader: string) => {
  try {
    const cookies = cookie.parse(cookieHeader)
    const token = cookies[`${COOKIE_PREFIX}.session-token`]
    if (!token) {
      return null
    }
    const session = await decode({
      token,
      secret: NEXTAUTH_SECRET ?? '',
    })
    return session
  } catch (error) {
    console.error(error)
    return null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        teamId: { label: 'Team ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        if (!credentials?.email || credentials.password === '') {
          return null
        }
        const session = Math.random().toString(32).substring(2)
        const { email, teamId } = credentials

        const cookieHeader = req?.headers?.cookie
        if (!cookieHeader) {
          return {
            id: '',
            session,
            email,
            teamSessions: {
              [teamId]: {
                session,
              },
            },
          }
        }
        const currentSession = await getDecodedCookie(cookieHeader)
        if (!currentSession) {
          return {
            id: '',
            session,
            email,
            teamSessions: {
              [teamId]: {
                session,
              },
            },
          }
        }
        return {
          id: '',
          session: currentSession.session,
          email: currentSession.email,
          teamSessions: {
            ...currentSession.teamSessions,
            [teamId]: {
              session,
            },
          },
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.session = user.session
        token.teamSessions = user.teamSessions
      }

      return token
    },
    session: async ({ session, token }) => {
      session.user.id = token.id
      session.user.email = token.email
      session.user.session = token.session
      session.user.teamSessions = token.teamSessions
      return session
    },
  },
  cookies: {
    sessionToken: {
      name: `${COOKIE_PREFIX}.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: `${COOKIE_PREFIX}.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `${COOKIE_PREFIX}.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },
  logger: {
    error(code, metadata) {
      logger.error({ code, metadata })
    },
    warn(code) {
      logger.warn({ code })
    },
    debug(code, metadata) {
      logger.debug({ code, metadata })
    },
  },
}

export default NextAuth(authOptions)
