'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { PlaylistsProvider } from './PlaylistsProvider'

const queryClient = new QueryClient()

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <PlaylistsProvider>{children}</PlaylistsProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
