import { query } from './_generated/server'

export const getPlaylists = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query('playlists').order('desc').take(100)
    return tasks
  },
})
