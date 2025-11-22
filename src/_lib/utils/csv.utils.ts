import Papa from "papaparse";

import { PlayerStatusPayloadBulkInsert } from "../dto/TeamScoring.model";
type Props = {
    data: PlayerStatusPayloadBulkInsert[];
    title: string;
    subTitle?: string;
}

export function generateCsvForPlayerStatus(props: Props) {
  const { data, title, subTitle } = props

  const headers = [
    "Game ID",
    "Player ID",
    "First Name",
    "Last Name",
    "Points",
    "Three Points",
    "Fouls",
    "Assists",
    "Steals",
    "Rebounds",
    "Turn Overs",
  ]
  const rows = data.map((item) => [
    item.gameId,
    item.playerId,
    item.firstName,
    item.lastName,
    item.points,
    item.threepoints,
    item.foul,
    item.assist,
    item.steal,
    item.rebound,
    item.turnOver,
  ])

  let csv = `${title}\n${subTitle}\n\n`
  csv += headers.join(",") + "\n"

  const csvData = Papa.unparse(rows, { header: false })
  csv += csvData

  // Safety check: only run in browser context
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn(
      "generateCsvForPlayerStatus can only be called in browser context"
    )
    return
  }
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute(
    "download",
    `${title.replace(/\s+/g, "_").toLowerCase()}.csv`
  )
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const generateCsvForTeamCreation = () => {
  const headers = [
    "teamName",
    "coachFirstName",
    "coachMiddleName",
    "coachLastName",
  ]
  const csv = Papa.unparse({
    fields: headers,
    data: [],
  })

  // Safety check: only run in browser context
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn(
      "generateCsvForTeamCreation can only be called in browser context"
    )
    return
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `team_creation_format.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const generateCsvForPlayerCreation = () => {
  const headers = [
    "firstname",
    "middlename",
    "lastname",
    "position",
    "age",
    "jerseyNumber",
    "playerType",
    "height",
    "weight",
  ]

  const sampleData = [
    ["John", "M", "Doe", "PG", "25", "23", "MAIN", "100", "180"],
  ]

  const csv = Papa.unparse({
    fields: headers,
    data: sampleData,
  })

  // Safety check: only run in browser context
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn(
      "generateCsvForPlayerCreation can only be called in browser context"
    )
    return
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `player_upload_template.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
