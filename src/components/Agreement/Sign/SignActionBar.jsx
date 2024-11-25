import { Avatar, Button, Modal, Tooltip, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import SignModal from "../Sign/SignModal";
import DrawIcon from "@mui/icons-material/Draw";
import AbcIcon from "@mui/icons-material/Abc";
import EventIcon from "@mui/icons-material/Event";
import { Banknote, Building2, CaseUpper, CheckSquare, ChevronDown, CopyCheck, Disc, File, FileVideo2, Files, Image, Stamp, Type } from "lucide-react";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const SignModal = dynamic(() => import("../Sign/SignModal"));

function groupBy(items, groupingFunction) {
  return items.reduce((result, item) => {
    const key = groupingFunction(item);


    if (!result[key]) {
      result[key] = [];
    }


    result[key].push(item);

    return result;
  }, {});
}

const fields = ["Signature", "Initials", "Date Signed"];
const SignActionBar = ({
  isOpen,
  onOpen,
  onClose,
  items,
  selectedFieldItem,
  setItems,
  selectedSignee,
  auth,
  setAuth,
  setSelectedFieldItem,
}) => {
  const [itemObject, setItemObject] = useState(null)
  useEffect(() => {
    setItemObject(groupBy(items.filter((item) => item.type !== "shape" && item.type !== "table" && item.type !== "textArea" && item.type !== "payment" && item?.type !== "inEditorImage"), ({ field }) => field))
    // console.log(Object.groupBy(items, ({ field }) => field))
  }, [items])
  const getIcon = (field) => {
    console.log(field)
    switch (field) {
      case "Signature":
        return <DrawIcon className="text-white" />;
      case "Initials":
        return <CaseUpper className="text-white" />;
      case "Date Signed":
        return <EventIcon className="fill-white" />;
      case "Company":
        return <Building2 className="text-white" />;
      case "Job Title":
        return <WorkOutlineIcon className="fill-white" />;
      case "Fullname":
        return <AbcIcon className="fill-white" />;
      case "Text":
        return <Type className="text-white" />;
      case "Image":
        return <Image className="text-white" />;
      case "payment":
        return <Banknote className="text-white" />;
      case "dropdown":
        return <ChevronDown className="text-white" />;
      case "check box":
        return <CheckSquare className="text-white" />;
      case "file":
        return <File className="text-white" />;
      case "radio buttons":
        return <Disc className="text-white" />;
      case "stamp":
        return <Stamp className="text-white" />;
      case "video":
        return <FileVideo2 className="text-white" />;
      default:
        return <></>;
    }
  };

  return (
    <div className="hidden lg:block col-span-2 h-full bg-gray-50  border-l border-t border-gray-400 overflow-scroll">
      <div>
        <p className="px-3 pt-2 pb-2 font-semibold border-b border-gray-400 text-[#151513]">
          Recipients
        </p>
        <div className="flex flex-col gap-2 py-4 px-3 border-b border-gray-400">
          {selectedSignee && (
            <div
              // color={signee.variant}
              // variant={
              //   selectedSignee?.fullname === signee?.fullname
              //     ? "shadow"
              //     : "bordered"
              // }
              style={{
                borderColor: selectedSignee.color,
                backgroundColor:
                  selectedSignee?.fullname === selectedSignee?.fullname
                    ? selectedSignee.color
                    : "",
                // color:selectedSignee.color
              }}
              className={`flex items-center p-3 gap-3 hover:cursor-pointer rounded-lg border`}
            >
              <Avatar
                isBordered
                color={selectedSignee.variant}
                src={selectedSignee?.profileImgUrl}
                size="sm"
              />
              {selectedSignee.fullname}
            </div>
          )}
        </div>
      </div>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <SignModal
          onClose={onClose}
          selectedFieldItem={selectedFieldItem}
          setItems={setItems}
          selectedSignee={selectedSignee}
          auth={auth}
          setAuth={setAuth}
        />
      </Modal>
      <div>
        <p className="px-3 pt-2 pb-2 font-semibold border-b border-gray-400 text-[#151513]">
          Actions
        </p>
        <div className="flex flex-col gap-3 pt-2 px-2">

          {/* {items.some((ele) => ele.field === "Signature") && (
            <p
              style={{
                cursor: "pointer",
              }}
              className="relative flex justify-between items-center border-2 border-[#E77813]  rounded-md"
              onClick={()=>{
                const index = items.findIndex((ele)=>ele.field==="Signature"&&ele.signee.fullname===selectedSignee.fullname)
                if(index!==-1){
                  setSelectedFieldItem(items[index]);
                  onOpen();
                }
              }}
            >
              
              <span className="flex items-center text-[#E77813] p-2 gap-2">
                {" "}
                Signature
                <Tooltip  color={selectedSignee.variant} showArrow={true} content={`${items.reduce((total, ele) => {
                  if (
                    ele.field === "Signature" &&
                    ele.signee?.fullname === selectedSignee?.fullname
                  ) {
                    return total + 1;
                  }
                  return total;
                }, 0)} places`}
                // classNames={{
                //     content:{selectedSignee?.color?`bg-[${selectedSignee}]`:"bg-[white]"}
                // }}
                >
                <span 
                className="flex justify-center items-center  bg-[#E7781380] rounded-[50%] h-[25px] w-[25px]  p-2 text-white text-[16px]"
                >
                {items.reduce((total, ele) => {
                  if (
                    ele.field === "Signature" &&
                    ele.signee?.fullname === selectedSignee?.fullname
                  ) {
                    return total + 1;
                  }
                  return total;
                }, 0)}
              </span>
              </Tooltip>
              </span>
              <span className="absolute  flex items-center justify-center top-0 right-0 bg-[#E77813] h-full  w-[40px] align-center">
                {getIcon("Signature")}
              </span>
            </p>
          )}
          {items.some((ele) => ele.field === "Initials") && (
            <p
              style={{
                cursor: "pointer",
              }}
              className="relative flex justify-between items-center border-2 border-[#E77813]  rounded-md"
              onClick={()=>{
                const index = items.findIndex((ele)=>ele.field==="Initials"&&ele.signee.fullname===selectedSignee.fullname)
                if(index!==-1){
                  setSelectedFieldItem(items[index]);
                  onOpen();
                }
              }}
            >
              
              <span className="flex items-center text-[#E77813] p-2 gap-2">
                {" "}
                Initials
                <Tooltip color={selectedSignee.variant} showArrow={true} content={`${items.reduce((total, ele) => {
                  if (
                    ele.field === "Initials" &&
                    ele.signee?.fullname === selectedSignee?.fullname
                  ) {
                    return total + 1;
                  }
                  return total;
                }, 0)} places`}>
                <span 
                className="flex justify-center items-center  bg-[#E7781380] rounded-[50%] h-[25px] w-[25px]  p-2 text-white text-[16px]"
                >
                {items.reduce((total, ele) => {
                  if (
                    ele.field === "Initials" &&
                    ele.signee?.fullname === selectedSignee?.fullname
                  ) {
                    return total + 1;
                  }
                  return total;
                }, 0)}
              </span>
              </Tooltip>
              </span>
              <span className="absolute  flex items-center justify-center top-0 right-0 bg-[#E77813] h-full  w-[40px] align-center">
                {getIcon("Initials")}
              </span>
            </p>
          )}
          {items.some((ele) => ele.type === "text") && (
            items.map((item,index)=> {
            if(item.type === "text"){
            return <p
               key={index}
              style={{
                cursor: "default",
              }}
              className="relative flex justify-between items-center border-2 border-[#E77813]  rounded-md"
              // onClick={()=>{
              //   const index = items.findIndex((ele)=>ele.field==="Date Signed"&&ele.signee.fullname===selectedSignee.fullname)
              //   if(index!==-1){
              //     setSelectedFieldItem(items[index]);
              //     onOpen();
              //   }
              // }}
            >
              <span className="flex items-center text-[#E77813] p-2 gap-2">
                {" "}
                {item.field}
                <Tooltip  color={selectedSignee.variant} showArrow={true} content={`${items.reduce((total, ele) => {
                  if (
                    ele.field === "Date Signed" &&
                    ele.signee?.fullname === selectedSignee?.fullname
                  ) {
                    return total + 1;
                  }
                  return total;
                }, 0)} places`}>
                <span 
                className="flex justify-center items-center  bg-[#E7781380] rounded-[50%] h-[25px] w-[25px]  p-2 text-white text-[16px]"
                >
                  {items.reduce((total, ele) => {
                    if (
                      ele.field === "Date Signed" &&
                      ele.signee?.fullname === selectedSignee?.fullname
                    ) {
                      return total + 1;
                    }
                    return total;
                  }, 0)}
                </span>
                </Tooltip>
              </span>
              <span className="absolute  flex items-center justify-center top-0 right-0 bg-[#E77813] h-full  w-[40px] align-center">
                {getIcon("Date Signed")}
              </span>
            </p>
            }
            })
          )} */}
          {console.log(itemObject)}
          {itemObject && Object.keys(itemObject).map((field, index) => {
            console.log(field)
            const count = itemObject[field].filter((el) => el.signee?.fullname === selectedSignee?.fullname)?.length
            return <p
              key={index}
              style={{
                cursor: (field === "Initials" || field === "Signature") ? "pointer" : "default",
              }}
              className="relative flex justify-between items-center border-2 border-[#05686E]  rounded-md"
              onClick={() => {
                if (field === "Initials" || field === "Signature") {
                  const index = items.findIndex((ele) => (ele.field === "Initials" || ele.field === "Signature") && ele.signee.fullname === selectedSignee.fullname)
                  if (index !== -1) {
                    setSelectedFieldItem(items[index]);
                    onOpen();
                  }
                }
              }}
            >

              <span className="flex items-center text-[#05686E] p-2 gap-2">
                {" "}
                {field}
                <Tooltip color={selectedSignee.variant} showArrow={true} content={`${count} places`}>
                  <span
                    className="flex justify-center items-center  bg-[#05686E80] rounded-[50%] h-[25px] w-[25px]  p-2 text-white text-[16px]"
                  >
                    {count}
                  </span>
                </Tooltip>
              </span>
              <span className="absolute  flex items-center justify-center top-0 right-0 bg-[#05686E] h-full  w-[40px] align-center">
                {getIcon(field)}
              </span>
            </p>
          })
          }
        </div>
      </div>
    </div>
  );
};

export default SignActionBar;
