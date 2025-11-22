import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog"
import {
    DialogClose,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@radix-ui/react-dialog"

export default function EndSeason() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Done</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update this season</DialogTitle>
          <DialogDescription>This will end the Season</DialogDescription>
        </DialogHeader>
        <p>Test</p>
        <DialogFooter>
          <DialogClose>
            <Button variant={"ghost"}>Close</Button>
          </DialogClose>
          <Button>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
