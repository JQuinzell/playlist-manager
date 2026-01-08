import { PlaylistsProvider } from '@/PlaylistsProvider'
import { SelectedPlaylistProvider } from '@/SelectedPlaylistProvider'
import { getItems, listPlaylists, type PlaylistItem } from '@/youtube'
import { PlaylistItemTable } from './PlaylistItemTable'

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const items = await getItems(id)

  return (
    <SelectedPlaylistProvider items={items} playlistId={id}>
      <PlaylistItemTable />
    </SelectedPlaylistProvider>
  )
}
