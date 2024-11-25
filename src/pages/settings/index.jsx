import Footer from "@/components/Footer/footer";
import Navbar from "@/components/Navbar/Navbar";
import SideNav from "@/components/Navbar/SideNav/Dashboard/SideNav";
import Settings from "@/components/Settings/Settings";
import React from "react";

const index = ({ document }) => {
	return (
		<>
        	<SideNav />
            
            <Navbar
				hideLogo={true}
				content={{
					title: "Business Settings",
					comp: false,
				}}
				footer={document.footer}
			/>
            <Settings />
			{/* <Navbar navbar={document.navBar} footer={document.footer} /> */}
			{/* <Footer footer={document?.footer} /> */}
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
