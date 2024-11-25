import Navbar from "@/components/Navbar/Navbar";
import SideNav from "@/components/Navbar/SideNav/Dashboard/SideNav";
import Payments from "@/components/Payments/Payments";
import React from "react";
import PaymentReceipt from "../../components/Payments/PaymentReceipt";

const index = ({ document }) => {
	return (
		<>
			<SideNav />
			<Navbar
				hideLogo={true}
				content={{
					title: "Payments",
					comp: false,
                    save:{title:"View Receipt",link:""}
				}}
				// footer={document.footer}
			/>
			<PaymentReceipt />
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
