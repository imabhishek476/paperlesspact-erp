
import React from "react";
import SideNav from "../../../components/Navbar/SideNav/Dashboard/SideNav";
import { getTemplate } from "../../../Apis/template";
import PreviewPresentaion from "../../../components/presentation/PreviewPresentaion";
import { getUserProfile } from "../../../Apis/login";
import CryptoJS from "crypto-js";

const index = ({ data, isOwner, roomId,user }) => {
	console.log(user)
	return (
		<>
			    <PreviewPresentaion data={data} isOwner={isOwner} roomId={roomId} user={user} />
		</>
	);
};

export default index;

export const getServerSideProps = async (ctx) => {
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
	console.log(object)

	if(!ref){
		return{
			notFound:true
		}
	}

	const user = await getUserProfile(accessToken);

	const isOwner =object?.createdByUser?.email === user.data.email

	const b64 = CryptoJS.SHA3(id).toString();
	
	return { props: { document: DocumentObject, data:object, isOwner, roomId: b64, user:user, } };
  };
