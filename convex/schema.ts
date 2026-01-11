import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const playlistSchema = {
  name: v.string(),
  user: v.id('users'),
}

export const entrySchema = {
  playlist: v.id('playlists'),
  item: v.id('items'),
}

export const sourcesSchema = v.union(v.literal('youtube'))

export const itemSchema = {
  name: v.string(),
  resourceId: v.string(),
  source: sourcesSchema,
  user: v.id('users'),
}

export const userSchema = {
  authId: v.string(),
}

export default defineSchema({
  playlists: defineTable(playlistSchema),
  entries: defineTable(entrySchema),
  items: defineTable(itemSchema),
  users: defineTable(userSchema).index('by_authId', ['authId']),
})
