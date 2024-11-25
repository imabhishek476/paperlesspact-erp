
import React, { useEffect, useState } from "react";
import {useRouter} from 'next/router'
import { acceptInvite, getTeamListById } from "../../../Apis/team";
import LoadingPage from "@/components/LoadingPage/loadingPage";


const InvitedPage = () => {
	
    const router=useRouter()
	// console.log(router.query.id)
	const id= router.query.teamId
	const adminId = router.query.adminId
    console.log(id)

	const accept=async()=>{
		const res=await acceptInvite(id,adminId)
        console.log(res)
		if(!res){
			router.push('/500');
		}
		else{
			router.push('/team')
		}
	}
	
	useEffect(()=>{
		if(id){
			accept()
		}
	},[id])
	return (
		<>
			<div>
                <LoadingPage/>
            </div>
		</>
	);
};

export default InvitedPage;


