import { EllipsisVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PlaylistCommand } from '@/PlaylistCommand'
import { getItems, insertItem, listPlaylists } from '@/youtube'
export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const items = await getItems(id)
  const playlists = await listPlaylists()

  return (
    <div>
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
            <TableRow key={item.id}>
              <TableCell>
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail.url}
                    width={240}
                    height={135}
                    alt={item.title}
                    className='object-cover'
                  ></Image>
                )}
              </TableCell>
              <TableCell>
                <Link href={`/playlists/${item.id}`}>{item.title}</Link>
              </TableCell>
              <TableCell>
                <Checkbox />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size='icon'>
                      <EllipsisVertical />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PlaylistCommand playlists={playlists} item={item} />
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
