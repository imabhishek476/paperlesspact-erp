import Navbar from "@/components/Navbar/Navbar";
import SideNav from "@/components/Navbar/SideNav/Dashboard/SideNav";
import Team from "@/components/Team/Team";
import React, { useState } from "react";
import {useDisclosure} from "@nextui-org/react";

const Teams = ({ document }) => {
	// const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const [isOpen,setIsOpen]=useState(false)
	const [addMode,setAddMode]=useState(false)
	const handleAdd=()=>{
		setAddMode(true)
		onOpen()
	}
	return (
		<>
			<SideNav />
			<Navbar
				hideLogo={true}
				content={{
					title: "Team",
					comp: false,
					cta:{title:"Create Team",onOpen:setIsOpen}
				}}
				footer={document.footer}
			/>
			<Team isOpen={isOpen} onOpen={setIsOpen} addMode={addMode} setAddMode={setAddMode} />
		</>
	);
};

export default Teams;

export const getServerSideProps = async () => {
	
	const data = await fetch(
		"https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
		{ cache: "no-store" }
	);
	const DocumentObject = await data.json();
	return { props: { document: DocumentObject } };
};
