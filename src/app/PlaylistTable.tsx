'use client'
import type { FC } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table'
import { usePlaylistsContext } from './PlaylistsProvider'

export const PlaylistTable: FC = () => {
  const playlists = usePlaylistsContext()

  return (
    <Table>
      <TableCaption>Playlists</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {playlists.map((playlist) => (
          <TableRow key={playlist.id}>
            <TableCell>{playlist.title}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
