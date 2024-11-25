import Dash from "@/components/Dashboard/Dash";
import Navbar from "@/components/Navbar/Navbar";
import SideNav from "@/components/Navbar/SideNav/Dashboard/SideNav";
import React from "react";
import Dashboard from "../../components/Dashboard/Dashboard";

const index = ({ document }) => {
	return (
		<>
			<SideNav />
			<Navbar
				hideLogo={true}
				content={{
					title: "Dashboard",
					comp: true,
				}}
				footer={document.footer}
			/>
			{/* <Dash /> */}
			<Dashboard />
		</>
	);
};

export default index;

export const getServerSideProps = async () => {
	const data = await fetch(
		"https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
		{ cache: "no-store" }
	);
	const DocumentObject = await data.json();
	return { props: { document: DocumentObject } };
};
