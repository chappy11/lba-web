import {
	addDoc,
	collection,
	getDocs,
	query,
} from "firebase/firestore";
import db from "../config/firebaseConfig";
import { FirebaseCollection } from "../enums/FirebaseCollection.enum";

export async function createEmployee(
	payload: InsertEmployeeModel
) {
	try {
		const resp = await addDoc(
			collection(
				db,
				FirebaseCollection.EMPLOYEE
			),
			payload
		);

		if (resp) {
			return payload;
		}
	} catch (error) {
		console.log(error);
		throw new Error();
	}
}

export async function getAllEmployee() {
	const qry = query(
		collection(
			db,
			FirebaseCollection.EMPLOYEE
		)
	);

	const data = await getDocs(qry);

	let employee: EmployeeModel[] = [];
	data.forEach((val) => {
		const payload: EmployeeModel = {
			...(val.data() as Partial<EmployeeModel>),
			id: val.id.toString(),
		};

		employee.push(payload);
	});

	return employee;
}
