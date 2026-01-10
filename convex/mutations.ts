import { v } from 'convex/values'
import { api } from './_generated/api'
import { action, mutation } from './_generated/server'
import { authComponent, createAuth } from './auth'
import * as youtube from './youtube'

export const importYoutubePlaylist = mutation({
  args: {
    playlist: v.object({
      id: v.string(),
      title: v.string(),
      items: v.array(
        v.object({
          title: v.string(),
          resourceId: v.string(),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx)
    const { accessToken } = await auth.api.getAccessToken({
      body: {
        providerId: 'google',
      },
      headers,
    })

    const newPlaylistId = await ctx.db.insert('playlists', {
      name: args.playlist.title,
    })
    const queries = args.playlist.items.map(async (item) => {
      const itemId = await ctx.db.insert('items', {
        name: item.title,
        source: 'youtube',
        resourceId: item.resourceId,
      })
      await ctx.db.insert('entries', {
        playlist: newPlaylistId,
        item: itemId,
      })
    })
    await Promise.all(queries)
  },
})

export const importYoutubePlaylistAction = action({
  args: { playlistId: v.string() },
  handler: async (ctx, args) => {
    const { accessToken } = await ctx.runQuery(api.auth.getAccessToken)
    const playlists = await youtube.listPlaylists(accessToken)
    const playlist = playlists.find((pl) => pl.id === args.playlistId)
    if (!playlist) return false
    const items = await youtube.getItems(args.playlistId, accessToken)
    await ctx.runMutation(api.mutations.importYoutubePlaylist, {
      playlist: {
        id: playlist.id,
        title: playlist.title,
        items: items.map((item) => ({
          title: item.title,
          resourceId: item.resourceId.videoId,
        })),
      },
    })
  },
})
