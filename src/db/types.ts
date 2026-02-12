import type { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface Database {
  playlist: PlaylistTable
  playlistEntry: PlaylistEntryTable
  item: ItemTable
}

export interface PlaylistTable {
  id: Generated<number>
  name: string
  userId: string
  resourceId: string
  // thumbnail: string
}

export interface PlaylistEntryTable {
  id: Generated<number>
  playlistId: number
  itemId: number
}

// may eventually have more
export type Sources = 'youtube'

export interface ItemTable {
  id: Generated<number>
  name: string
  resourceId: string
  source: Sources
  userId: string
}

export type Playlist = Selectable<PlaylistTable>
export type NewPlaylist = Insertable<PlaylistTable>
export type PlaylistUpdate = Updateable<PlaylistTable>

export type PlaylistEntry = Selectable<PlaylistEntryTable>
export type NewPlaylistEntry = Insertable<PlaylistEntryTable>
export type PlaylistEntryUpdate = Updateable<PlaylistEntryTable>

export type Item = Selectable<ItemTable>
export type NewItem = Insertable<ItemTable>
export type ItemUpdate = Updateable<ItemTable>
