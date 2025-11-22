"use client"

import { InsertPlayerViaBatchUpload } from "@/_lib/dto/Player.model"
import { generateCsvForPlayerCreation } from "@/_lib/utils/csv.utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertCircle,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    Trash2,
    Upload,
    Users,
} from "lucide-react"

import { createPlayerViaBatchUpload } from "@/_lib/server/player"
import Papa from "papaparse"
import { useState } from "react"
import { toast } from "sonner"
import Swal from "sweetalert2"
import { PlayerType } from "./CreatePlayer"

type Props = {
    teamId: string;
}

export default function BatchUploadPlayer(props: Props) {
    const { teamId } = props;
  const [data, setData] = useState<InsertPlayerViaBatchUpload[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  const handleDownloadTemplate = () => {
    generateCsvForPlayerCreation()
    toast.success("Template downloaded!", {
      description: "Fill in the template and upload it back.",
    })
  }

  const onChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    Papa.parse(file as File, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const unformattedData = results.data as Array<Record<string, string>>

        const formattedData: Array<InsertPlayerViaBatchUpload> =
          unformattedData.map((val: Record<string, string>) => {
            return {
              teamId:teamId,
              firstname: val["firstname"] || "",
              middlename: val["middlename"] || "",
              lastname: val["lastname"] || "",
              position: val["position"] || "",
              age: parseInt(val["age"]) || 0,
              jerseyNumber: val["jerseyNumber"] || "",
              dateCreated: new Date().toISOString(),
              playerType: (val["playerType"] || "MAIN") as PlayerType,
              height: val["height"] || "",
              weight: val["weight"] || "",
            }
          })

        setData(formattedData)
        toast.success("CSV parsed successfully!", {
          description: `Found ${formattedData.length} players to upload.`,
        })
      },
      error: (error) => {
        toast.error("Failed to parse CSV", {
          description: error.message,
        })
      },
    })
  }

  const handleSubmit = async () => {
    try {
      if (data.length === 0) {
        toast.error("No data to upload", {
          description: "Please upload a CSV file first.",
        })
        return
      }

      setIsLoading(true)

      // TODO: Implement API call to upload players
      // const resp = await uploadPlayerBatch(data)

      // Simulating API call
        const resp = await createPlayerViaBatchUpload(data)
        if (resp) {
            Swal.fire({
                    title:'Player uploaded successfully',
                text: `${data.length} players have been added.`,
                icon: 'success',
                showConfirmButton:true,
            }).then(res => {
                window.location.reload();
            })
        }

   

      // Reset and close
      setData([])
      setFileName("")
      // Refresh page
    } catch (error) {
      console.error("Error uploading players:", error)
      toast.error("Failed to upload players", {
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearData = () => {
    setData([])
    setFileName("")
    toast.info("Data cleared")
  }

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
        >
          <Upload className="w-4 h-4" />
          Batch Upload Players
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                Batch Upload Players
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                Upload multiple players at once using a CSV file
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">
                  How to Upload
                </h4>
                <ol className="space-y-1.5 text-sm text-blue-800 list-decimal list-inside">
                  <li>Download the CSV template below</li>
                  <li>Fill in player information in the template</li>
                  <li>Upload the completed CSV file</li>
                  <li>Review the data and click Upload</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Download Template Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadTemplate}
              className="gap-2 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            >
              <Download className="w-4 h-4" />
              Download CSV Template
            </Button>
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
            <div className="text-center">
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer inline-block"
              >
                <div className="text-sm text-gray-600 mb-2">
                  {fileName ? (
                    <span className="text-blue-600 font-medium">
                      {fileName}
                    </span>
                  ) : (
                    <>
                      <span className="text-blue-600 font-medium hover:text-blue-700">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500">CSV files only</p>
              </label>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={onChangeData}
                className="hidden"
              />
            </div>
          </div>

          {/* Data Preview */}
          {data.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">
                    Ready to Upload
                  </h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearData}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-green-700">Total Players:</span>
                  </div>
                  <div>
                    <span className="font-semibold text-green-900">
                      {data.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">File:</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-900 truncate">
                      {fileName}
                    </span>
                  </div>
                </div>

                {/* Preview first few players */}
                <div className="mt-3 max-h-32 overflow-y-auto">
                  <p className="text-xs text-green-700 font-medium mb-1">
                    Preview:
                  </p>
                  <ul className="space-y-1 text-xs text-green-800">
                    {data.slice(0, 5).map((player, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-600">•</span>
                        <span>
                          {player.firstname} {player.lastname} - #
                          {player.jerseyNumber} ({player.position})
                        </span>
                      </li>
                    ))}
                    {data.length > 5 && (
                      <li className="text-green-700 italic">
                        ... and {data.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
         
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || data.length === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {data.length > 0 ? `${data.length} Players` : "Players"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
