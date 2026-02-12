'use server'

import type { Playlist } from '@/youtube'
import { importYoutubePlaylist } from '../../db/queries'

export async function handleImportPlaylist(playlist: Playlist) {
  return importYoutubePlaylist(playlist.id).then(console.log)
}
