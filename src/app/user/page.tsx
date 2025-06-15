"use client";
import { insertEmployeeIntoServer } from "@/_lib/server/employee";
import TextInput from "@/components/textinput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import DisplayEmployeeList from "@/feature/employee/DisplayEmployeeList";
import {
	useEffect,
	useState,
} from "react";
import { toast } from "sonner";

enum DepartmentEnum {
	SOFT_DEV = "SOFTWARE DEVELOPMENT",
	PROJECT_MANAGER = "PROJECT MANAGER",
	DESIGNER = "DESIGNER",
}

export default function Page() {
	const [firstname, setFirstname] =
		useState<string>("");
	const [lastname, setLastname] =
		useState<string>("");
	const [middlename, setMiddlename] =
		useState<string>("");
	const [department, setDepartment] =
		useState<string>("");

	const [
		errorFirstname,
		setErrorFirstname,
	] = useState<string>("");
	const [
		errorLastname,
		setErrorLastname,
	] = useState<string>("");
	const [
		errorMiddlename,
		setErrorMiddlename,
	] = useState<string>("");
	const [
		errorDepartment,
		setErrorDepartment,
	] = useState<string>("");

	async function handleSubmit() {
		try {
			if (!firstname) {
				setErrorFirstname(
					"Firstname is required"
				);
				return;
			}
			if (!middlename) {
				setErrorMiddlename(
					"Middlename is required"
				);

				return;
			}
			if (!lastname) {
				setErrorLastname(
					"Lastname is required"
				);

				return;
			}

			if (!department) {
				setErrorDepartment(
					"Department is required"
				);

				return;
			}

			const payload: InsertEmployeeModel =
				{
					firstname: firstname,
					middlename: middlename,
					lastname: lastname,
					department: department,
				};

			const resp =
				await insertEmployeeIntoServer(
					payload
				);

			if (resp) {
				toast.success(
					"Successfully Inserted"
				);
				window.location.reload();
			}
		} catch (error) {
			toast.error(
				"Something went wrong"
			);
		}
	}

	useEffect(() => {
		setErrorFirstname("");
	}, [firstname]);

	useEffect(() => {
		setErrorMiddlename("");
	}, [middlename]);

	useEffect(() => {
		setErrorLastname("");
	}, [lastname]);

	useEffect(() => {
		setErrorDepartment("");
	}, [department]);

	return (
		<div className=" h-screen w-screen bg-white">
			<div className=" w-[50%] flex flex-col gap-3 mt-3 p-5 rounded-md shadow-xl bg-white mx-auto ">
				<h1 className=" text-xl text-slate-800">
					Employee
				</h1>
				<div className=" flex flex-row gap-3 w-full justify-center">
					<TextInput
						className=" w-full "
						label="Firstname"
						onChange={(e) =>
							setFirstname(
								e.target.value
							)
						}
						placeholder="Enter Firstname..."
						error={errorFirstname}
					/>

					<TextInput
						className=" w-full"
						onChange={(e) =>
							setMiddlename(
								e.target.value
							)
						}
						error={errorMiddlename}
						label="Middlename"
						placeholder="Enter Middlename..."
					/>
					<TextInput
						className=" w-full"
						label="Lastname"
						placeholder="Enter Lastname..."
						onChange={(e) =>
							setLastname(
								e.target.value
							)
						}
						error={errorLastname}
					/>
				</div>
				<div className=" flex flex-col gap-2">
					<Label>Department</Label>
					<Select
						onValueChange={(e) =>
							setDepartment(e)
						}
						value={department}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select Department" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								value={
									DepartmentEnum.PROJECT_MANAGER
								}
							>
								{
									DepartmentEnum.PROJECT_MANAGER
								}
							</SelectItem>
							<SelectItem
								value={
									DepartmentEnum.SOFT_DEV
								}
							>
								{
									DepartmentEnum.SOFT_DEV
								}
							</SelectItem>
							<SelectItem
								value={
									DepartmentEnum.DESIGNER
								}
							>
								{
									DepartmentEnum.DESIGNER
								}
							</SelectItem>
						</SelectContent>
					</Select>
					<span className=" text-sm text-red-500">
						{errorDepartment}
					</span>
				</div>
				<div className=" mt-3 flex flex-row justify-end">
					<Button
						onClick={() =>
							handleSubmit()
						}
					>
						Submit
					</Button>
				</div>
			</div>
			<DisplayEmployeeList />
		</div>
	);
}
