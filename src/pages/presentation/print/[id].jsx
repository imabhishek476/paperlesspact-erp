import React, { useEffect, useState } from "react";
import { getTemplate } from "../../../Apis/template";
import dynamic from "next/dynamic";
import PresentationItemRenderer from "../../../components/presentation/PresentationView/PresentationItemRenderer";
const PrintPresentation = dynamic(
  () => import("../../../components/presentation/PrintPresentation"),
  { ssr: false }
);

const PresentationPrintPage = ({ data }) => {
    const [newData, setNewData] = useState(null)
    useEffect(()=>{
        const pages = data?.pages?.map((page,index)=>(
          {
            page:page,
            items: data?.items.filter((item)=> item.pageIndex === index)
          }
        ))
        setNewData(pages)
    },[data])
  return (
    <div className="h-screen w-screen">
      <div className="reveal">
        <PrintPresentation data={data} pages={newData}/>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const data = await fetch(
    "https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
    { cache: "no-store" }
  );
  const DocumentObject = await data.json();
  const accessToken = ctx.req.cookies["accessToken"];
  const id = ctx.query.id;
  console.log(id,accessToken)
  // if (!id) {
  //   return {
  //     notFound: true,
  //   };
  // }
  let ref = await getTemplate(id, accessToken);
  const object = ref?.data?.ref;
  console.log(object);

  // if (!ref) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return { props: { document: DocumentObject, data: object } };
};

export default PresentationPrintPage;
