import {
	createEmployee,
	getAllEmployee,
} from "@/_lib/services/Employee.service";
import { NextResponse } from "next/server";

export async function POST(
	request: Request
) {
	try {
		const body =
			(await request.json()) as unknown as InsertEmployeeModel;

		const resp = await createEmployee(
			body
		);

		return NextResponse.json(
			{
				message: "Successfully Added",
				data: resp,
			},
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Something went wrong",
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const resp = await getAllEmployee();

		return NextResponse.json(
			{
				message: "Data is retrieved",
				data: resp,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Something went wrong",
			},
			{ status: 500 }
		);
	}
}

//POST - Insert data;
//GET - retriving data;
//PUT - update data to server;
//DELETE - delete;
