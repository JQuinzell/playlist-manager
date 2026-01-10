'use server'

import z from 'zod'

// TODO: rewriting the existing version to work with convex

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

async function fetchYoutube(
  path: string,
  options: RequestInit & {
    params?: Record<string, string | boolean | number | undefined>
    accessToken: string
  }
) {
  const url = new URL(`${YOUTUBE_API_BASE}/${path}`)

  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value.toString())
  }

  const res = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      Accept: 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`YouTube API error: ${res.status} - ${error}`)
  }

  if (res.status !== 204) {
    return res.json()
  }
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
    resourceId: z.object({
      videoId: z.string(),
      kind: z.string(),
    }),
  }),
})

type PlaylistItemResource = z.infer<typeof playlistItemResourceSchema>

const playlistResponseSchema = googleResponseSchema.extend({
  items: z.array(playlistResourceSchema),
})

const playlistItemResponseSchema = googleResponseSchema.extend({
  items: z.array(playlistItemResourceSchema),
  nextPageToken: z.string().optional(),
  prevPageToken: z.string().optional(),
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

export async function listPlaylists(accessToken: string): Promise<Playlist[]> {
  const res = await fetchYoutube('playlists', {
    params: {
      part: 'snippet,contentDetails,id',
      mine: true,
      maxResults: 50,
    },
    accessToken,
  })

  const data = playlistResponseSchema.parse(res)

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
  resourceId: PlaylistItemResource['snippet']['resourceId']
  title: string
  description: string
  thumbnail?: Thumbnail
}

export async function getItems(
  id: string,
  accessToken: string,
  pageToken?: string
): Promise<{ items: PlaylistItem[]; nextPageToken: string | null }> {
  const res = await fetchYoutube('playlistItems', {
    params: {
      part: 'snippet,contentDetails,status',
      playlistId: id,
      maxResults: 50,
      pageToken,
    },
    accessToken,
  })

  const data = playlistItemResponseSchema.parse(res)

  return {
    items: data.items.map((item) => ({
      id: item.id,
      resourceId: item.snippet.resourceId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: findThumbnail(item.snippet.thumbnails),
    })),
    nextPageToken: data.nextPageToken ?? null,
  }
}

export async function insertItem(
  resourceId: PlaylistItem['resourceId'],
  playlistId: string,
  accessToken: string
) {
  await fetchYoutube('playlistItems', {
    accessToken,
    params: {
      part: 'snippet',
    },
    method: 'POST',
    body: JSON.stringify({
      snippet: {
        playlistId,
        resourceId,
      },
    }),
  })
}

export async function deleteItem(id: string, accessToken: string) {
  await fetchYoutube('playlistItems', {
    accessToken,
    method: 'DELETE',
    params: {
      id,
    },
  })
}
