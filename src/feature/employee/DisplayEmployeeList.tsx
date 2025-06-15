"use client";

import { retrivedEmployee } from "@/_lib/server/employee";
import {
	useEffect,
	useState,
} from "react";
import { toast } from "sonner";
import EmployeeItem from "./component/EmployeeItem";

export default function DisplayEmployeeList() {
	const [employee, setEmployee] =
		useState<EmployeeModel[]>([]);
	const [isLoading, setIsLoading] =
		useState<boolean>(false);

	const sendRequest = async () => {
		try {
			setIsLoading(true);
			const data =
				await retrivedEmployee();

			setEmployee(data);
		} catch (error) {
			toast.error(
				"Something went wrong"
			);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		sendRequest();
	}, []);

	console.log("EMPLYEE", employee);
	return (
		<div className=" mx-auto w-[50%] mt-5 bg-white p-5 rounded-md shadow-xl">
			<h1 className=" text-xl text-slate-800">
				Employee List
			</h1>
			{employee.map(
				(val: EmployeeModel) => (
					<EmployeeItem
						{...val}
						key={val.id}
					/>
				)
			)}
			{isLoading && (
				<p className=" text-center text-sm text-slate-800">
					Loading...
				</p>
			)}
		</div>
	);
}
