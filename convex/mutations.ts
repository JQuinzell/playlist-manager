import { v } from 'convex/values'
import { mutation } from './_generated/server'

export const importYoutubePlaylist = mutation({
  args: {
    youtubePlaylistId: v.string(),
  },
  handler: () => {},
})
