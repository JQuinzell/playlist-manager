import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  onCreate: (name: string) => void
}
export function CreatePlaylistButton({ onCreate }: Props) {
  return (
    <Dialog>
      <form
        onSubmit={(e) => {
          e.preventDefault()

          const data = new FormData(e.currentTarget)

          onCreate(data.get('title') as string)
        }}
      >
        <DialogTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Playlist</DialogTitle>
          </DialogHeader>
          <div className='grid gap-3'>
            <Label htmlFor='title'>Title</Label>
            <Input id='title' />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>Create</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
