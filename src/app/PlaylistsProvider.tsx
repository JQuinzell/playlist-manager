'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, type FC, type ReactNode, useContext } from 'react'
import { listPlaylists, type Playlist } from '@/youtube'

type PlaylistsContextValue = Playlist[]

const PlaylistsContext = createContext<PlaylistsContextValue | null>(null)

export const PlaylistsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: playlists } = useQuery({
    queryKey: ['playlists'],
    queryFn: listPlaylists,
  })

  return (
    <PlaylistsContext.Provider value={playlists ?? []}>
      {children}
    </PlaylistsContext.Provider>
  )
}

export function usePlaylistsContext() {
  const context = useContext(PlaylistsContext)
  if (!context) {
    throw new Error('No PlaylistsProvider')
  }
  return context
}
