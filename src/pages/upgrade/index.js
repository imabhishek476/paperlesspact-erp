import SideNav from "@/components/Navbar/SideNav/Dashboard/SideNav";
import UpgradePage from "@/components/UpgradePage/UpgradePage";
import React from "react";

const Upgrade = ({ data }) => {
  return (
    <>
      <SideNav />
      <UpgradePage data={data} />
    </>
  );
};
export const getServerSideProps = async () => {
  const data = await fetch(
    "https://plp-home-ui.s3.ap-south-1.amazonaws.com/subscription.json",
    { cache: "no-store" }
  );
  const DocumentObject = await data.json();
  console.log(DocumentObject);
  return { props: { data: DocumentObject } };
};

export default Upgrade;
