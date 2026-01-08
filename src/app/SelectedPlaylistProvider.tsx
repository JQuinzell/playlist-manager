'use client'

import { createContext, type FC, type ReactNode, useContext } from 'react'
import type { Playlist, PlaylistItem } from '@/youtube'
import { usePlaylistsContext } from './PlaylistsProvider'

type SelectedPlaylistContextValue = {
  playlist: Playlist
  items: PlaylistItem[]
}

const SelectedPlaylistsContext =
  createContext<SelectedPlaylistContextValue | null>(null)

export const SelectedPlaylistProvider: FC<{
  children: ReactNode
  playlistId: string
  items: PlaylistItem[]
}> = ({ children, playlistId, items }) => {
  const playlists = usePlaylistsContext()
  // biome-ignore lint/style/noNonNullAssertion: TODO
  const selectedPlaylist = playlists.find(
    (playlist) => playlist.id === playlistId
  )!

  const value = {
    items,
    playlist: selectedPlaylist,
  }
  return (
    <SelectedPlaylistsContext.Provider value={value}>
      {children}
    </SelectedPlaylistsContext.Provider>
  )
}

export function useSelectedPlaylistContext() {
  const context = useContext(SelectedPlaylistsContext)
  if (!context) {
    throw new Error('No SelectedPlaylistProvider')
  }
  return context
}
