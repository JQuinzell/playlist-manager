'use client'
import Link from 'next/link'
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
            <TableCell>
              <Link href={`/playlists/${playlist.id}`}>{playlist.title}</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
