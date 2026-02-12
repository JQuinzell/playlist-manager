'use server'
import { headers } from 'next/headers'
import * as youtube from '../app/youtube'
import { auth } from '../lib/auth'
import { db } from './database'

export async function importYoutubePlaylist(youtubePlaylistId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) return
  const user = session.user

  // collecting data from youtube
  const playlists = await youtube.listPlaylists()
  const playlist = playlists.find((pl) => pl.id === youtubePlaylistId)
  if (!playlist) return
  const items: youtube.PlaylistItem[] = []
  let nextPage: string | undefined
  do {
    const res = await youtube.getItems(youtubePlaylistId, nextPage)
    items.push(...res.items)
    nextPage = res.nextPageToken || undefined
  } while (nextPage)

  const res = await db.transaction().execute(async (trx) => {
    // creating in database
    const createdPlaylist = await trx
      .insertInto('playlist')
      .values({
        name: playlist.title,
        userId: user.id,
        resourceId: playlist.id,
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    const createdItems = await trx
      .insertInto('item')
      .values(
        items.map((item) => ({
          name: item.title,
          resourceId: item.resourceId.videoId,
          userId: user.id,
          source: 'youtube',
        }))
      )
      .returningAll()
      .execute()

    await trx
      .insertInto('playlistEntry')
      .values(
        createdItems.map((item) => ({
          playlistId: createdPlaylist.id,
          itemId: item.id,
        }))
      )
      .execute()

    return {
      playlist: createdPlaylist,
      items: createdItems,
    }
  })

  return res
}
