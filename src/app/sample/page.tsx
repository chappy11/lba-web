"use client";
import TextInput from "@/components/textinput";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Papa from "papaparse";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export type EmployeePayroll = {
	employeeId: string;
	name: string;
	position: string;
	department: string;
	basicSalary: number;
	allowance: number;
	deductions: number;
	netPay: number;
	payDate: string; // ISO format e.g. "2025-11-01"
	status: "Paid" | "Pending" | "Unpaid";
};

export default function Sample() {
	const [uploadData, setUploadData] =
		React.useState<File | null>(null);
	const [data, setData] =
		React.useState<
			Array<EmployeePayroll>
		>([]);
	const [error, setError] =
		useState<string>("");
	const handleUpload = (
		file: File | undefined
	) => {
		const fileData = file || null;
		setUploadData(fileData);
	};

	const handleConvertCsv = async () => {
		if (!uploadData) {
			setError("No file uploaded");
			return;
		}

		// Papa.parse(uploadData, {
		// 	headers: false,
		// 	complete: (results) => {
		// 		const data: string[][] =
		// 			results.data;
		// 		console.log(data.length);
		// 		const formaatedData: Array<EmployeePayroll> =
		// 			data.map((val) => {
		// 				return {
		// 					employee_id: val[0] || "",
		// 					name: val[1] || "",
		// 					position: val[2] || "",
		// 					department: val[3] || "",
		// 					basic_salary:
		// 						Number(val[4]) || 0,
		// 					allowance:
		// 						Number(val[5]) || 0,
		// 					deductions:
		// 						Number(val[6]) || 0,
		// 					net_pay:
		// 						Number(val[7]) || 0,
		// 					pay_date: val[8] || "",
		// 					status:
		// 						(val[9] as
		// 							| "Paid"
		// 							| "Pending"
		// 							| "Unpaid") ||
		// 						"Pending",
		// 				};
		// 			});

		// 		console.log(data);
		// 		setData(formaatedData);
		// 	},
		// 	error: (error) => {
		// 		setError("Error parsing CSV");
		// 	},
		// });

		Papa.parse(uploadData as File, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				const unformatedData =
					results.data as Array<any>;
				const formaatedData: Array<EmployeePayroll> =
					unformatedData.map(
						(val: any) => {
							return {
								employeeId:
									val["employee_id"] ||
									"",
								name: val["name"] || "",
								position:
									val["position"] || "",
								department:
									val["department"] ||
									"",
								basicSalary:
									Number(
										val["basic_salary"]
									) || 0,
								allowance:
									Number(
										val["allowance"]
									) || 0,
								deductions:
									Number(
										val["deductions"]
									) || 0,
								netPay:
									Number(
										val["net_pay"]
									) || 0,
								payDate:
									val["pay_date"] || "",
								status:
									(val["status"] as
										| "Paid"
										| "Pending"
										| "Unpaid") ||
									"Pending",
							};
						}
					);
				setData(formaatedData);
			},
		});
		// Map the payroll data to the desired format
	};

	return (
		<div>
			<TextInput
				onChange={(e) =>
					handleUpload(
						e?.target?.files?.[0]
					)
				}
				type="file"
			/>
			<Button
				onClick={() =>
					handleConvertCsv()
				}
			>
				ConverData
			</Button>
			<Table className=" w-[80%] mx-auto">
				<TableHeader>
					<TableRow>
						<TableHead>
							Emplyoee ID
						</TableHead>
						<TableHead>
							Employee Name
						</TableHead>
						<TableHead>
							Position
						</TableHead>
						<TableHead>
							Department
						</TableHead>
						<TableHead>
							Basic Salary
						</TableHead>
						<TableHead>
							Allowance
						</TableHead>
						<TableHead>
							Deductions
						</TableHead>

						<TableHead>
							Net Pay
						</TableHead>
						<TableHead>
							Pay Date
						</TableHead>
						<TableHead>
							Status
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map(
						(
							val: EmployeePayroll,
							index: number
						) => {
							return (
								<TableRow
									key={index.toString()}
								>
									<TableCell>
										{val.employeeId}
									</TableCell>
									<TableCell>
										{val.name}
									</TableCell>
									<TableCell>
										{val.position}
									</TableCell>
									<TableCell>
										{val.department}
									</TableCell>
									<TableCell>
										{val.basicSalary}
									</TableCell>
									<TableCell>
										{val.allowance}
									</TableCell>
									<TableCell>
										{val.deductions}
									</TableCell>
									<TableCell>
										{val.netPay}
									</TableCell>
									<TableCell>
										{val.payDate}
									</TableCell>
									<TableCell>
										{val.status}
									</TableCell>
								</TableRow>
							);
						}
					)}
				</TableBody>
			</Table>
		</div>
	);
}
