'use server'

import { google } from 'googleapis'
import { auth } from './auth'

async function authorize() {
  const session = await auth()
  console.log(session)
  if (!session) {
    throw new Error('Not authenticated')
  }
  const oauth = new google.auth.OAuth2()
  oauth.setCredentials({ access_token: (session as any).accessToken })
  return google.youtube({
    version: 'v3',
    auth: oauth,
  })
}

interface Thumbnail {
  url?: string | null
  width?: number | null
  height?: number | null
}

interface ThumbnailMap {
  default?: Thumbnail
  standard?: Thumbnail
  medium?: Thumbnail
  high?: Thumbnail
  maxres?: Thumbnail
}

export interface Playlist {
  id: string
  title: string
  thumbnails?: ThumbnailMap
}

export async function listPlaylists(): Promise<Playlist[]> {
  const youtube = await authorize()
  const nextPageToken = null

  const res = await youtube.playlists.list({
    part: ['snippet', 'contentDetails', 'id'],
    mine: true,
    maxResults: 50,
    // pageToken: nextPageToken,
  })

  const playlists =
    res.data.items?.map((data) => ({
      id: data.id ?? '???',
      title: data.snippet?.title ?? 'No Title',
      thumbnails: data.snippet?.thumbnails,
    })) ?? []
  return playlists
}
