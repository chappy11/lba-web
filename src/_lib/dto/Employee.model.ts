type EmployeeModel = {
	id: string;
	firstname: string;
	middlename: string;
	lastname: string;
	department: string;
};

type InsertEmployeeModel = Omit<
	EmployeeModel,
	"id"
>;
