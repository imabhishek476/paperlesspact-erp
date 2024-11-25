import Footer from "@/components/Footer/footer";
import Navbar from "@/components/Navbar/Navbar";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import React from "react";

const ExpiredPage = ({ document }) => {
    const router  = useRouter();
    const handleClick = ()=>{
        router.push("/document/new");
    }
	return (
		<>
			<Navbar footer={document?.footer} />
			<div className="">
				<div className="mx-auto max-w-7xl px-0 lg:px-8">
					<div className="flex flex-col mx-auto h-[90vh] lg:mx-0 items-center justify-center gap-4">
						<h2 className="text-[18px] lg:text-[24px] font-[700] tracking-tight text-[#05686E] px-5 text-center">
							Oops! : The document that you are looking for is expired.
						</h2>
                        <Button
                        className="bg-[#05686E] text-white"
                        onPress={()=>handleClick()}
                        >
                            Create New Document
                        </Button>
					</div>
				</div>
			</div>
			{/* <Footer footer={document?.footer} /> */}
		</>
	);
};

export default ExpiredPage;

export const getStaticProps = async () => {
	const data = await fetch(
		"https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
		{ cache: "no-store" }
	);
	const DocumentObject = await data.json();
	return { props: { document: DocumentObject } };
};
