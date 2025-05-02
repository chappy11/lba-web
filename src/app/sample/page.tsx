"use client"

import { useQRCode } from "next-qrcode"

export default function Sample() {
    const { SVG } = useQRCode()
     return (
       <SVG
         text={"https://mlhuillier.com/redirection"}
         options={{
           margin: 2,
           width: 500,
           color: {
             dark: "#fefefe",
             light: "#00000000",
           },
         }}
       />
     )
}
