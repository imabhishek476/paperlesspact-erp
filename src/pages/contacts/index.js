import Contacts from "@/components/Contacts/Contacts";
import Dash from "@/components/Dashboard/Dash";
import Navbar from "@/components/Navbar/Navbar";
import SideNav from "@/components/Navbar/SideNav/Dashboard/SideNav";
import { useDisclosure } from "@nextui-org/react";
import React from "react";

const Index = ({ document }) => {
	return (
		<>
			<SideNav />
			<Contacts document={document}/>
		</>
	);
};

export default Index;

export const getServerSideProps = async () => {
	const data = await fetch(
		"https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
		{ cache: "no-store" }
	);
	const DocumentObject = await data.json();
	return { props: { document: DocumentObject } };
};
