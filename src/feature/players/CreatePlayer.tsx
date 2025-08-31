"use client";

import { Player } from "@/_lib/dto/Player.model";
import { createPlayer } from "@/_lib/server/player";
import { uploadImage } from "@/_lib/server/upload"
import LoadingScreen from "@/components/loading-screen"
import TextInput from "@/components/textinput";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useMemo, useState } from "react"
import { toast } from "sonner";
import Swal from "sweetalert2"

type Props = {
	teamId: string;
};

export function CreatePlayer(
	props: Props
) {
	const { teamId } = props;
	const [firstname, setFirstname] =
		useState<string>("");
	const [middlename, setMiddlename] =
		useState<string>("");
	const [lastname, setLastname] =
		useState<string>("");
	const [position, setPosition] =
		useState<string>("");
	const [age, setAge] =
		useState<string>("0");
	const [
		jerseyNumber,
		setJerseyNumber,
	] = useState<string>("");

	const [logo, setLogo] = useState<File | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [firstNameError, setFirstNameError] = useState<string>("")
  const [middleNameError, setMiddleNameError] = useState<string>("")
  const [lastNameError, setLastNameError] = useState<string>("")
  const [positionError, setPositionError] = useState<string>("")
  const [ageError, setAgeError] = useState<string>("")
  const [jerseyNumberError, setJerseyNumberError] = useState<string>("")

  async function handleSubmit() {
    try {
      if (!logo) {
        toast.error("Please upload a player image")
        return
      }

      if (!firstname) {
        setFirstNameError("Please enter a firstname")
        return
      }

      if (!middlename) {
        setMiddleNameError("Please enter a middlename")
        return
      }
      if (!lastname) {
        setLastNameError("Please enter a lastname")
        return
      }

      if (!age) {
        setAgeError("Please enter a age")
        return
      }

      if (!jerseyNumber) {
        setJerseyNumberError("Please enter a jersey number")
        return
      }

      if (!position) {
        setPositionError("Please select a position")
        return
      }
      setIsLoading(true)
      const formData = new FormData()
      formData.append("file", logo)

      const imgResp = await uploadImage(formData)

      const payload: Player = {
        firstname,
        middlename,
        lastname,
        position,
        playerImage: imgResp?.url as string,
        age: parseInt(age),
        jerseyNumber,
        dateCreated: new Date().toISOString(),
        teamId: teamId,
      }

      const response = await createPlayer(payload)

      if (response) {
        Swal.fire({
          icon: "success",
          title: "Player created successfully",
          text: "You have successfully created a new player",
        }).then(() => {
          setIsLoading(false)
          window.location.reload()
        })
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "You cannot create a new player at this moment",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const displayLogo = useMemo(() => {
    if (!logo) {
      return <div className=" h-[100px] w-[100px] bg-gray-500 rounded-full" />
    }
    const imagePath = URL.createObjectURL(logo)

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imagePath} height={100} width={100} alt="season photo" />
  }, [logo])

  return (
    <Sheet>
      {isLoading && <LoadingScreen />}
      <SheetTrigger asChild>
        <Button>Create Player</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Player</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className=" p-3 w-full flex flex-col gap-1">
          <div className=" flex flex-1 justify-center flex-col items-center  ">
            {displayLogo}
            <TextInput
              label="Upload Season Logo"
              type="file"
              className=" text-white w-[100px]"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setLogo(file)
                }
              }}
            />
          </div>
          <TextInput
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            label=" Player Firstname"
          />
          <TextInput
            value={middlename}
            onChange={(e) => setMiddlename(e.target.value)}
            label=" Player Middlename"
          />
          <TextInput
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            label=" Player Lastname"
          />
          <TextInput
            label=" Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <TextInput
            label=" Jersey Number"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
          />
          <div className=" w-full">
            <p className=" text-[14px]">Position</p>
            <Select onValueChange={(e) => setPosition(e)} value={position}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PG">Point Guard (PG)</SelectItem>
                <SelectItem value="SG">Shooting Guard (SG)</SelectItem>
                <SelectItem value="SF">Small Forward (SF)</SelectItem>
                <SelectItem value="PF">Power Forward (PF)</SelectItem>
                <SelectItem value="C">Center (C)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={() => handleSubmit()}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
