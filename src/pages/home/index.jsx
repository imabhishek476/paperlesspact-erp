import GeneralAgreementPage from "@/components/Agreement/General/General";
import Footer from "@/components/Footer/footer";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";

const index = ({ document }) => {
	return (
		<>
			<Navbar navbar={document.navBar} footer={document.footer} />
			<GeneralAgreementPage />
			<Footer footer={document?.footer} />
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
