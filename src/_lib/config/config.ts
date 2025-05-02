import axios from 'axios'
import { NextApiRequest } from 'next'
export const getBaseUrlFromRequest = (req:NextApiRequest) => {
  const proto = req.headers["x-forwarded-proto"] || "http"
  return `${proto}://${req.headers.host}`
}
export const axiosConfig = axios.create({
  baseURL: "http://localhost:3001/api/", // only available in browser
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
})

