import Login from "@/components/Auth/authPages/login";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ["latin"] });
export default function Home({ document }) {
	console.log(document);
	return (
		<div className={`min-h-screen ${nunito.className}`}>
			<Login />
		</div>
	);
}

export const getServerSideProps = async () => {
	const data = await fetch(
		"https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
		{ cache: "no-store" }
	);
	const DocumentObject = await data.json();
	return { props: { document: DocumentObject } };
};
