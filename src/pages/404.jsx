import Footer from "@/components/Footer/footer";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";

const Custom404 = ({ document }) => {
	return (
		<>
			<Navbar footer={document?.footer} />
			<div className="sm:pt-12">
				<div className="mx-auto max-w-7xl px-0 lg:px-8">
					<div className="lg:flex mx-auto h-[50vh] lg:mx-0 items-center justify-center">
						<h2 className="text-[24px] font-[700] tracking-tight text-[#05686E] ">
							404 : The page that you are looking for does not exist.
						</h2>
					</div>
				</div>
			</div>
			<Footer footer={document?.footer} />
		</>
	);
};

export default Custom404;

export const getStaticProps = async () => {
	const data = await fetch(
		"https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
		{ cache: "no-store" }
	);
	const DocumentObject = await data.json();
	return { props: { document: DocumentObject } };
};
