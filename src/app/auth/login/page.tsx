"use client"
import { useEffect, useState } from "react"

import { login } from "@/_lib/server/user"
import { setSession } from "@/app/action"
import TextInput from "@/components/textinput"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Swal from "sweetalert2"

export default function Page() {
  const [email, setEmail] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  async function handleSubmit() {
    try {
      if (!email) {
        setEmailError("Email is required")
        return
      }
      if (!password) {
        setPasswordError("Password is required")
        return
      }

      const resp = await login(email, password)

      if (resp) {
        await setSession(JSON.stringify(resp))
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Login successful!",
        }).then(() => {
          window.location.href = "/dashboardv2"
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid email or password!",
        })
      }
    } catch (error) {
           Swal.fire({
             icon: "error",
             title: "Oops...",
             text: "Invalid email or password!",
           })
      console.log(error)
    }
  }

  useEffect(() => {
    setEmailError("")
  }, [email])

  useEffect(() => {
    setPasswordError("")
  }, [password])

  return (
    <div className=" mx-auto w-full h-[100vh] bg-[#FCF8F0]  flex flex-col justify-center">
      <div className=" mx-auto w-[60%] bg-white  flex flex-row shadow-lg rounded-lg overflow-hidden">
        <div className=" flex flex-1 w-full h-full bg-basksetball ">
          <Image
            src={"/basketball.jpg"}
            width={600}
            height={300}
            alt={"test"}
            className=" "
          />
        </div>
        <div className=" flex flex-1 p-10 flex flex-col">
          <h1 className=" text-lg font-semibold ">Sign In as Admin</h1>
          <div className=" flex-1 flex flex-col mt-20">
            <TextInput
              label="Email"
              value={email}
              placeholder="Enter your email"
              type="email"
              error={emailError}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextInput
              label="Password"
              value={password}
              placeholder="Enter your password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
            />

            <div className=" mt-10">
              <Button onClick={() => handleSubmit()} className=" w-[100px]">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
