'use client'
import { Ellipsis } from 'lucide-react'
import { type FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { usePlaylistsContext } from '../PlaylistsProvider'
import { CreatePlaylistButton } from './[id]/CreatePlaylistButton'

export const PlaylistTable: FC = () => {
  const playlists = usePlaylistsContext()
  const [isEdit, setIsEdit] = useState(false)

  return (
    <div className='max-w-[750px] w-full'>
      <div className='flex justify-between '>
        <Input placeholder='Search' className='w-50' />
        <CreatePlaylistButton onCreate={console.log} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {isEdit && (
              <TableHead>
                <Checkbox className='m-2' />
              </TableHead>
            )}
            <TableHead>Title</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {playlists.map((playlist) => (
            <TableRow key={playlist.id}>
              {isEdit && (
                <TableCell className='w-[1%] whitespace-nowrap'>
                  <Checkbox className='m-2' />
                </TableCell>
              )}
              <TableCell>{playlist.title}</TableCell>
              <TableCell className='w-[1%] whitespace-nowrap'>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant='ghost' size='icon'>
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Action 1</DropdownMenuItem>
                    <DropdownMenuItem>Action 2</DropdownMenuItem>
                    <DropdownMenuItem>Action 3</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
