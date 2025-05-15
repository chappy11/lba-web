type Props = {
	title: string;
	icon: React.ReactNode;
	bgColor: string;
	onClick: () => void;
};

export const Card = (props: Props) => {
	const { title, icon, bgColor } =
		props;
	return (
		<div
			className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${bgColor}`}
		>
			<div className="p-6 flex flex-col items-center text-white">
				<div className="mb-4">
					{icon}
				</div>
				<h3 className="text-xl font-bold text-center">
					{title}
				</h3>
				<div
					className="mt-4 rounded-lg px-4 py-2 border border-white border-opacity-30 hover:opacity-35 cursor-pointer hover:bg-opacity-10 transition-all duration-200"
					onClick={() =>
						props.onClick()
					}
				>
					<span className="text-sm font-medium">
						View Details
					</span>
				</div>
			</div>
		</div>
	);
};
