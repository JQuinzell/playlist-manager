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
import {
  deleteItem,
  insertItem,
  type Playlist,
  type PlaylistItem,
} from './youtube'

interface Props {
  playlists: Playlist[]
  items: PlaylistItem[]
}
export const PlaylistCommand: React.FC<Props> = ({ playlists, items }) => {
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
              onSelect={async () => {
                const results = await Promise.allSettled(
                  items.map(async (item) => {
                    await insertItem(item.resourceId, playlist.id)
                    await deleteItem(item.id)
                  })
                )
                const rejected = results.filter(
                  (result) => result.status === 'rejected'
                )
                if (rejected.length > 0) {
                  console.log(rejected)
                }
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
