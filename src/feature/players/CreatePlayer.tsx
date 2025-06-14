"use client";

import { Player } from "@/_lib/dto/Player.model";
import { createPlayer } from "@/_lib/server/player";
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
import { useState } from "react";
import { toast } from "sonner";

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

	const [
		firstNameError,
		setFirstNameError,
	] = useState<string>("");
	const [
		middleNameError,
		setMiddleNameError,
	] = useState<string>("");
	const [
		lastNameError,
		setLastNameError,
	] = useState<string>("");
	const [
		positionError,
		setPositionError,
	] = useState<string>("");
	const [ageError, setAgeError] =
		useState<string>("");
	const [
		jerseyNumberError,
		setJerseyNumberError,
	] = useState<string>("");

	async function handleSubmit() {
		try {
			if (!firstname) {
				setFirstNameError(
					"Please enter a firstname"
				);
				return;
			}

			if (!middlename) {
				setMiddleNameError(
					"Please enter a middlename"
				);
				return;
			}
			if (!lastname) {
				setLastNameError(
					"Please enter a lastname"
				);
				return;
			}

			if (!age) {
				setAgeError(
					"Please enter a age"
				);
				return;
			}

			if (!jerseyNumber) {
				setJerseyNumberError(
					"Please enter a jersey number"
				);
				return;
			}

			if (!position) {
				setPositionError(
					"Please select a position"
				);
				return;
			}

			const payload: Player = {
				firstname,
				middlename,
				lastname,
				position,
				age: parseInt(age),
				jerseyNumber,
				dateCreated:
					new Date().toISOString(),
				teamId: teamId,
			};

			const response =
				await createPlayer(payload);

			if (response) {
				toast.success(
					"Player created successfully",
					{
						onDismiss: () => {
							window.location.reload();
						},
					}
				);
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
    <Sheet>
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
