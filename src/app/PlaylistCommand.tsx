'use client'
import type React from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './components/ui/command'
import { insertItem, type Playlist, type PlaylistItem } from './youtube'

interface Props {
  playlists: Playlist[]
  item: PlaylistItem
}
export const PlaylistCommand: React.FC<Props> = ({ playlists, item }) => {
  return (
    <Command>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandSeparator />
        <CommandGroup heading='Move to playlist'>
          {playlists.map((playlist) => (
            <CommandItem
              key={playlist.id}
              onSelect={() => {
                insertItem(item.resourceId, playlist.id)
              }}
            >
              {playlist.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
