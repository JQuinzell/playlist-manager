import { getItems, listPlaylists, type PlaylistItem } from '@/youtube'
import { PlaylistItemTable } from './PlaylistItemTable'
export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // TODO: should move to a context provider
  const items = await getItems(id)
  const playlists = await listPlaylists()

  return (
    <div>
      <PlaylistItemTable items={items} playlists={playlists} />
    </div>
  )
}
