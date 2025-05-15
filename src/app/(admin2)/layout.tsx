export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-1 flex-col">
			<div className=" w-full flex h-[60px] bg-neutral-900 text-neutral-100 px-3 items-center">
				<p>HIEEE</p>
			</div>
			{children}
		</div>
	);
}
