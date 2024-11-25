import Footer from "@/components/Footer/footer";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";
import NewPresentationPage from "../../../components/presentation/NewPresentationPage";
import SideNav from "../../../components/Navbar/SideNav/Dashboard/SideNav";
import { getTemplate } from "../../../Apis/template";
import { getUserProfile } from "../../../Apis/login";
import { getAncestorsForServer } from "../../../Apis/folderStructure";


const index = ({ data ,ancestors}) => {
	return (
		<>
      		<SideNav />
			<NewPresentationPage data={data} ancestors={ancestors}/>
		</>
	);
};

export default index;

export const getServerSideProps = async (ctx) => {
	let ancestors = null;
	const data = await fetch(
	  "https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
	  { cache: "no-store" }
	);
	const DocumentObject = await data.json();
	const accessToken = ctx.req.cookies['accessToken'];
	const id = ctx.query.id	
	if (!id) {
	  return {
		notFound: true,
	  };
	}
	let ref = await getTemplate(id,accessToken);
	const object  = ref?.data?.ref;

	if (object?._id) {
		try {
			const response = await getAncestorsForServer(accessToken, object?._id);
			if (response) {
				ancestors = response;
			} 
		  let access = true;
		  const userDetails = await getUserProfile(accessToken);
		  console.log("userDetails",object)
		  if (userDetails) {
			const isRecipient = object?.participants && object?.participants?.recipients && object?.participants?.recipients.some((ele) => ele?.email === userDetails?.data?.email);
			const isCollaborator = object?.participants && object?.participants?.collaborators && object?.participants?.collaborators.some((ele) => ele?.email === userDetails?.data?.email);
			const isApprove = object?.approvers && object?.approvers?.some((ele) => ele?.email === userDetails?.data?.email);
			const isCreatedBy = object?.createdByUser?.email === userDetails?.data?.email;
			if (!isRecipient && !isCollaborator && !isCreatedBy && !isApprove) {
			  access = false;
			}
			const approver = object?.approvers?.find((el) => el?.email === userDetails?.data?.email)
			// console.log(object?.approvers ,userDetails.email )
	
			if (!(isCollaborator || isCreatedBy) && (approver?.status === "approved" || approver?.status === "reject")) {
	
			  access = false
			}
			if (!access) {
			  return {
				notFound: true
			  }
			}
	
		  }
		} catch (err) {
		  console.log(err);
		}
	  }
	console.log(object)
	
	return { props: { document: DocumentObject,data:object, ancestors: ancestors} };
  };
