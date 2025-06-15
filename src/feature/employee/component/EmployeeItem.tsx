type Props = EmployeeModel;

export default function EmployeeItem(
	props: Props
) {
	const {
		firstname,
		middlename,
		lastname,
		department,
	} = props;

	return (
		<div className=" p-3 border-b border-b-slate-300  flex flex-row gap-3">
			<div className=" h-[50px] w-[50px] rounded-full bg-gray-500" />
			<div>
				<p className=" text-lg text-slate-800">
					{firstname} {middlename}{" "}
					{lastname}
				</p>
				<p className=" text-sm text-slate-500">
					{department}
				</p>
			</div>
		</div>
	);
}
