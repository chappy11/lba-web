import { PlayerStatusPayloadBulkInsert } from "@/_lib/dto/TeamScoring.model"
import { insertBulkPlayerStatus } from "@/_lib/server/playerStatus"
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
import { Label } from "@/components/ui/label"
import Papa from "papaparse"
import { useState } from "react"
import Swal from "sweetalert2"

type Props = {
  downLoadCsv: () => void
}

export default function PlayerStatusBatchUpload({ downLoadCsv }: Props) {
  const [data, setData] = useState<PlayerStatusPayloadBulkInsert[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file as File, {
      header: true,
      skipEmptyLines: true,
      skipFirstNLines: 3,
      complete: (result) => {
        const unformedData = result.data as Array<any>
        console.log("Unformed Data:", unformedData)
        const formatedData: Array<PlayerStatusPayloadBulkInsert> =
          unformedData.map((val: any) => {
            return {
              gameId: val["Game ID"] || "",
              playerId: val["Player ID"] || "",
              points: parseInt(val["Points"]) || 0,
              rebound: parseInt(val["Rebounds"]) || 0,
              assist: parseInt(val["Assists"]) || 0,
              threepoints: parseInt(val["Three Points"]) || 0,
              foul: parseInt(val["Fouls"]) || 0,
              steal: parseInt(val["Steals"]) || 0,
              turnOver: parseInt(val["Turnovers"]) || 0,
              firstName: val["First Name"] || "",
              lastName: val["Last Name"] || "",
            }
          })
        console.log("Formatted Data:", formatedData)
        setData(formatedData)
        // You can now use formatedData as needed
      },
    })
    // Handle file upload logic here
  }

  async function handleUploadData() {
    try {
      setIsLoading(true)
      const resp = await insertBulkPlayerStatus(data)

      if (resp) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Player status uploaded successfully",
        }).then(() => {
          window.location.reload()
        })
      }
    } catch (error) {
      console.error("Error uploading player status:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload player status",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Batch Upload</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Player Status</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Label>Upload CSV File</Label>
            <TextInput type="file" onChange={handleFileChange} />
            <div>
              <Button
                className=" w-[50%] float-right"
                variant="outline"
                onClick={downLoadCsv}
              >
                Download Sample CSV
              </Button>
            </div>

            <div className="h-1"></div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleUploadData} disabled={isLoading}>
              {isLoading ? "Uploading..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
