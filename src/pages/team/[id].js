import Navbar from "@/components/Navbar/Navbar";
import SideNav from "@/components/Navbar/SideNav/Dashboard/SideNav";
import React, { useState } from "react";
import {useDisclosure} from "@nextui-org/react";
import Member from "../../components/Team/Member";
import {useRouter} from 'next/router'
import Cookies from "js-cookie";
import { getTeamListById } from "../../Apis/team";
import { getUserProfile } from "../../Apis/login";

const TeamId = ({ document,data }) => {
    const router=useRouter()
	const id= router.query.id
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
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
					title: data?.name,
					comp: false,
					back:{title:"Team",link:"/team"},
					cta:{title:"New Team Member",onOpen:handleAdd}
				}}
				footer={document.footer}
			/>
			<Member teamId={id} isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} addMode={addMode} setAddMode={setAddMode}/>
		</>
	);
};

export default TeamId;

export const getServerSideProps = async (context) => {
	const data = await fetch(
		"https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
		{ cache: "no-store" }
	);
	const res = await getTeamListById(context.params.id,context.req.cookies["accessToken"]);
	const user = await getUserProfile(context.req.cookies["accessToken"])
	if(!res || !res?.userTeam || res?.userTeam?.createdByUser?.email !== user?.data?.email){
		return {
			notFound:true
		}
	}
	const DocumentObject = await data.json();

	return { props: { document: DocumentObject,data:res?.userTeam } };
};
