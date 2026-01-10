'use client'

import { authClient } from '@/lib/auth-client'

export default function SignIn() {
  async function handleSignIn() {
    await authClient.signIn.social({
      provider: 'google',
    })
  }
  return (
    <button type='button' onClick={handleSignIn}>
      Signin with Google
    </button>
  )
}
