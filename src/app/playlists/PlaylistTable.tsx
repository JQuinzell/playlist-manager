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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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

function usePagination<T>(pageSize: number, items: T[]) {
  const [activePage, setActivePage] = useState(1)
  const windowSize = 3
  const numPages = Math.ceil(items.length / pageSize)
  const pages = Array.from({ length: numPages }, (_, i) => i + 1).map(
    (page) => ({
      isActive: page === activePage,
      page,
    })
  )
  const startIndex = activePage - 1
  const visibleItems = items.slice(startIndex, startIndex + pageSize)

  return {
    pages,
    visibleItems,
    setActivePage(page: number) {
      setActivePage(page)
    },
    nextPage() {
      setActivePage((prev) => prev + 1)
    },
    previousPage() {
      setActivePage((prev) => prev - 1)
    },
  }
}

export const PlaylistTable: FC = () => {
  const playlists = usePlaylistsContext()
  const [isEdit, setIsEdit] = useState(false)
  const paginator = usePagination(5, playlists)

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
          {paginator.visibleItems.map((playlist) => (
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
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={() => paginator.previousPage()}
              />
            </PaginationItem>
            {paginator.pages.map((page) => (
              <PaginationItem key={page.page}>
                <PaginationLink
                  href='#'
                  isActive={page.isActive}
                  onClick={() => paginator.setActivePage(page.page)}
                >
                  {page.page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {/* <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem> */}
            <PaginationItem>
              <PaginationNext href='#' onClick={() => paginator.nextPage()} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
