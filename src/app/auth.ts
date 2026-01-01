import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/youtube',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and refresh_token to the JWT token
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token // Crucial for long-lived access
        token.expiresAt = account.expires_at // Expiration time for the access token
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a JWT.
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.expiresAt = token.expiresAt as number
      return session
    },
  },
})
