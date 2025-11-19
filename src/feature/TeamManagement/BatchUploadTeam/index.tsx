import { TeamBatchInsertPayload } from "@/_lib/dto/Team.model"
import { uploadTeamBatch } from "@/_lib/server/team"
import TextInput from "@/components/textinput"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Papa from "papaparse"
import { useState } from "react"
import Swal from "sweetalert2"

export default function BatchUploadTeam() {
  const [data, setData] = useState<TeamBatchInsertPayload[]>([])

  const onChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file as File, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const unformatedData = results.data as Array<any>

        const formaatedData: Array<TeamBatchInsertPayload> = unformatedData.map(
          (val: any) => {
            return {
              teamName: val["teamName"] || "",
              coachInfo: {
                firstname: val["coachFirstName"] || "",
                middlename: val["coachMiddleName"] || "",
                lastname: val["coachLastName"] || "",
              },
            }
          }
        )

        setData(formaatedData)
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const resp = await uploadTeamBatch(data)

      if (resp) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Teams uploaded successfully",
        }).then(() => {
          window.location.reload()
        })
        return
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to upload teams",
        })
      }
    } catch (error) {
      console.error("Error uploading teams:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload teams",
      })
    }
  }
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Upload Team Via CSV</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <TextInput
              type="file"
              accept=".csv"
              onChange={(e) => onChangeData(e)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleSubmit()}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
