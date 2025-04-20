import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"
cloudinary.config({
  cloud_name: "dqyhsgcfg",
  api_key: "711446654222213",
  api_secret: "ULym0yv0O-CfXdmoMD92xk38w4Y",
})

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "your_folder_name" }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
        .end(buffer)
    })

    return NextResponse.json({ url: (result as any).secure_url })
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "your_folder_name/", // Replace with your folder name
      max_results: 500, // Adjust as needed
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching Cloudinary assets:", error)
    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    )
  }
}