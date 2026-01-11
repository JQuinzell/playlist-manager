import { v } from 'convex/values'
import { api } from './_generated/api'
import { action, type MutationCtx, mutation } from './_generated/server'
import { authComponent, createAuth } from './auth'
import * as youtube from './youtube'

async function getUser(ctx: MutationCtx) {
  const authUser = await authComponent.getAuthUser(ctx)

  const existing = await ctx.db
    .query('users')
    .withIndex('by_authId', (q) => q.eq('authId', authUser._id))
    .unique()

  if (existing) return existing

  const id = await ctx.db.insert('users', {
    authId: authUser._id,
  })

  // biome-ignore lint/style/noNonNullAssertion: We just inserted so it is there
  return (await ctx.db.get(id))!
}

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
    const user = await getUser(ctx)
    const { accessToken } = await auth.api.getAccessToken({
      body: {
        providerId: 'google',
      },
      headers,
    })

    const newPlaylistId = await ctx.db.insert('playlists', {
      name: args.playlist.title,
      user: user._id,
    })
    const queries = args.playlist.items.map(async (item) => {
      const itemId = await ctx.db.insert('items', {
        name: item.title,
        source: 'youtube',
        resourceId: item.resourceId,
        user: user._id,
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
    const items: youtube.PlaylistItem[] = []
    let nextPage: string | undefined
    do {
      const res = await youtube.getItems(args.playlistId, accessToken, nextPage)
      items.push(...res.items)
      nextPage = res.nextPageToken || undefined
    } while (nextPage)
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
