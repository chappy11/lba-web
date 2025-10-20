import { axiosConfig } from "../config/config";

export const insertEmployeeIntoServer =
	async (
		payload: InsertEmployeeModel
	) => {
		const response =
			await axiosConfig.post(
				"employee",
				payload
			);
		return response.data;
	};

export const retrivedEmployee =
	async () => {
		const response =
			await axiosConfig.get("employee");

		return response.data.data;
	};

