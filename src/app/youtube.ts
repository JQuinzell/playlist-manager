'use server'

import z from 'zod'
import { auth } from './auth'

async function authorize() {
  const session = await auth()
  console.log({ session })
  if (!session) {
    throw new Error('Not authenticated')
  }
  const accessToken: string = (session as any).accessToken
  return accessToken
}

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

async function fetchYoutube(
  path: string,
  params: Record<string, string | boolean | number>
) {
  const accessToken = await authorize()
  console.log({ accessToken })
  const url = new URL(`${YOUTUBE_API_BASE}/${path}`)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`YouTube API error: ${res.status} - ${error}`)
  }

  return res.json()
}

const googleResponseSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  pageInfo: z.object({
    totalResults: z.number(),
    resultsPerPage: z.number(),
  }),
})

export type Thumbnail = z.infer<typeof thumbnailResourceSchema>

const thumbnailResourceSchema = z.object({
  url: z.url(),
  width: z.number(),
  height: z.number(),
})

const thumbnailMapResourceSchema = z.record(
  z.union([
    z.literal('default'),
    z.literal('medium'),
    z.literal('high'),
    z.literal('standard'),
    z.literal('maxres'),
  ]),
  thumbnailResourceSchema.optional()
)

export type ThumbnailMap = z.infer<typeof thumbnailMapResourceSchema>

const playlistResourceSchema = z.object({
  kind: z.literal('youtube#playlist'),
  etag: z.string(),
  id: z.string(),
  snippet: z.object({
    publishedAt: z.iso.datetime(),
    channelId: z.string(),
    title: z.string(),
    description: z.string(),
    thumbnails: thumbnailMapResourceSchema,
  }),
})

const playlistItemResourceSchema = z.object({
  kind: z.literal('youtube#playlistItem'),
  etag: z.string(),
  id: z.string(),
  snippet: z.object({
    publishedAt: z.iso.datetime(),
    channelId: z.string(),
    title: z.string(),
    description: z.string(),
    thumbnails: thumbnailMapResourceSchema,
  }),
})

const playlistResponseSchema = googleResponseSchema.extend({
  items: z.array(playlistResourceSchema),
})

const playlistItemResponseSchema = googleResponseSchema.extend({
  items: z.array(playlistItemResourceSchema),
})

function findThumbnail(thumbnails: ThumbnailMap): Thumbnail | undefined {
  const keys_by_priority = [
    'standard',
    'high',
    'medium',
    'default',
    'maxres',
  ] as const
  for (const key of keys_by_priority) {
    const thumbnail = thumbnails[key]
    if (thumbnail) return thumbnail
  }
}

export interface Playlist {
  id: string
  title: string
  thumbnails?: ThumbnailMap
}

export async function listPlaylists(): Promise<Playlist[]> {
  const res = await fetchYoutube('playlists', {
    part: 'snippet,contentDetails,id',
    mine: true,
    maxResults: 50,
  })

  const data = playlistResponseSchema.parse(res)
  console.log(res)

  const playlists =
    data.items.map((data) => ({
      id: data.id,
      title: data.snippet.title,
      thumbnails: data.snippet.thumbnails,
    })) ?? []

  return playlists
}

export type PlaylistItem = {
  id: string
  title: string
  description: string
  thumbnail?: Thumbnail
}

export async function getItems(id: string): PlaylistItem[] {
  const res = await fetchYoutube('playlistItems', {
    part: 'snippet,contentDetails,status',
    playlistId: id,
    maxResults: 50,
  })

  const data = playlistItemResponseSchema.parse(res)

  return data.items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: findThumbnail(item.snippet.thumbnails),
  }))
}
