import Navbar from "@/components/Navbar/Navbar";
import { InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { getDocumentDrafts } from "@/Apis/legalAgreement";
import { formatDate } from "@/Utils/dateTimeHelpers";

const filters = [
  {
    name: "All",
  },
  {
    name: "Drafts",
  },
  {
    name: "Completed",
  },
  {
    name: "In Process",
  },
  {
    name: "I need to sign",
  },
  {
    name: "Cancelled",
  },
];

const DocumentsListingPage = ({ navbarDocument }) => {
  const [size, setSize] = useState("5");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages,setTotalPages] = useState(0);
  const [agreement,setAgreement] = useState(null);
  const getDrafts = async()=>{
    try{
        const response = await getDocumentDrafts(pageNumber,size);
        console.log(response);
        if(response){
            setAgreement(response?.agreementDetails);
            setTotalPages(response?.totalpages);
        }
    }catch(err){
        console.log(err);
    }
}
  useEffect(()=>{
    getDrafts();
  },[pageNumber,size])
  return (
    <>
      <Navbar
        navbar={navbarDocument.navBar}
        footer={navbarDocument.footer}
        hideLogo={true}
      />
      <div className="w-full pr-[35px] pl-[6rem] ">
        <div className="flex flex-col pt-7 ">
          <div className="flex justify-end">
            <TextField
              placeholder="Search Document"
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="flex justify-between mt-10">
            <p>
              Showing {size} results on {pageNumber} page
            </p>
            <div className="flex">
              {filters.map((filter) => {
                return (
                  <div
                    key={filter.name}
                    className="bg-[#e8eff6] border min-w-[100px] flex justify-center py-2 px-4"
                  >
                    {filter.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col">
            {agreement&&agreement.length>0&&agreement.map((ele,index)=>{
                return (<div key={ele._id} className="w-full flex flex-col border p-2">
                    <div className="flex gap-2">
                        <div classname="p-1 bg-[#e8eff6] text-[12px]">{formatDate(ele.createdDate)}</div>
                        <div className></div>
                    </div>
                    </div>);
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentsListingPage;
