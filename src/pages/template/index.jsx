import TemplateComponent from "@/components/Template/TemplateComponent";


const index = ({ document }) => {
	return (
		<TemplateComponent document={document}/>
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
