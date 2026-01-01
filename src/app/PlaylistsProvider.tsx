'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { createContext, type FC, type ReactNode, useContext } from 'react'
import { listPlaylists } from '@/youtube'

type PlaylistsContextValue = {}

const PlaylistsContext = createContext<PlaylistsContextValue | null>(null)

export const PlaylistsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: playlists } = useQuery({
    queryKey: ['playlists'],
    queryFn: listPlaylists,
  })
  console.log(playlists)
  return (
    <PlaylistsContext.Provider value={{}}>{children}</PlaylistsContext.Provider>
  )
}

export function usePlaylistsContext() {
  const context = useContext(PlaylistsContext)
  if (!context) {
    throw new Error('No PlaylistsProvider')
  }
  return context
}
