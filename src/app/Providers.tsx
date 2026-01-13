'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { PlaylistsProvider } from './PlaylistsProvider'

const queryClient = new QueryClient()

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <PlaylistsProvider>{children}</PlaylistsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
