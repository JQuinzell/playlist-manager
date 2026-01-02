'use client'
import { EllipsisVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PlaylistCommand } from '@/PlaylistCommand'
import type { Playlist, PlaylistItem } from '@/youtube'

type Props = {
  items: PlaylistItem[]
  playlists: Playlist[]
}

export const PlaylistItemTable: React.FC<Props> = ({ items, playlists }) => {
  const [selectedItemsMap, setSelectedItemsMap] = useState<
    Record<string, boolean>
  >({})

  function toggleItem(item: PlaylistItem, selected: boolean) {
    setSelectedItemsMap((prev) => ({
      ...prev,
      [item.id]: selected,
    }))
  }

  const selectedItems = Object.entries(selectedItemsMap)
    .filter(([, selected]) => selected)
    // kinda inefficient
    .map(([id]) => items.find((item) => item.id === id))
    .filter((item) => !!item)

  return (
    <Table>
      <TableCaption>Videos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Title</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item.id}
            data-state={selectedItemsMap[item.id] ? 'selected' : ''}
          >
            <TableCell>
              <Checkbox
                onCheckedChange={(state) =>
                  // handle indeterminate state
                  toggleItem(item, typeof state === 'boolean' ? state : false)
                }
              />
            </TableCell>
            <TableCell>
              {item.thumbnail && (
                <Image
                  src={item.thumbnail.url}
                  width={120}
                  height={68}
                  alt={item.title}
                  className='object-cover'
                ></Image>
              )}
            </TableCell>
            <TableCell>
              <Link href={`/playlists/${item.id}`}>{item.title}</Link>
            </TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size='icon'>
                    <EllipsisVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PlaylistCommand
                    playlists={playlists}
                    items={selectedItems}
                  />
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
