import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/footer";
import RentalAgreementPage from "@/components/Agreement/Rental";


export default function RentalAgreement({document}) {
  return (
    <>
      <Navbar />
      <RentalAgreementPage/>
      <Footer footer={document?.footer}/>
    </>
  );
}

export const getServerSideProps = async ()=>{
  const data = await fetch(
    'https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json',
    { cache: 'no-store' }
  );
  const DocumentObject = await data.json(); 
  return {props:{document:DocumentObject}};
}