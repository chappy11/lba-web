import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
	subsets: ["latin"], // specify subsets as needed
	weight: ["400", "700"], // specify font weights you want
	variable: "--font-poppins", // optional, for CSS variables
});

export const metadata: Metadata = {
	title: "Create Next App",
	description:
		"Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={poppins.variable}
		>
			<body className=" bg-black">
				<Toaster
					toastOptions={{
						style: {
							backgroundColor:
								"#0a0a0a",
							color: "#ffffff",
						},
					}}
					position="bottom-left"
					duration={2000}
				/>

				<div className=" h-full w-full bg-black ">
					{children}
				</div>
			</body>
		</html>
	);
}
