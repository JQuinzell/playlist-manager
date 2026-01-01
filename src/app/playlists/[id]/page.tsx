import Image from 'next/image'
import Link from 'next/link'
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
import { getItems } from '@/youtube'
export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const items = await getItems(id)
  console.log(items)
  return (
    <div>
      <Table>
        <TableCaption>Videos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Title</TableHead>
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
                    alt={item.description}
                    className='object-cover'
                  ></Image>
                )}
              </TableCell>
              <TableCell>
                <Link href={`/playlists/${item.id}`}>{item.title}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
