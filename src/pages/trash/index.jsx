import Dash from "@/components/Dashboard/Dash";
import Navbar from "@/components/Navbar/Navbar";
import SideNav from "@/components/Navbar/SideNav/Dashboard/SideNav";
import Team from "@/components/Team/Team";
import Trash from "@/components/Trash/Trash";
import React from "react";

const index = ({ document }) => {
	return (
		<>
			<SideNav />
			<Navbar
				hideLogo={true}
				content={{
					title: "Trash",
					comp: false,
				}}
				footer={document.footer}
			/>
			<Trash />
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
