import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Tooltip,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DrawIcon from "@mui/icons-material/Draw";
import AbcIcon from "@mui/icons-material/Abc";
import EventIcon from "@mui/icons-material/Event";
import { SpeedDial, SpeedDialAction } from "@mui/material";

const approvers = ["Basit Ansari", "Divyansh Malik"];

const fields = [
  {
    name: "Signature",
    icon: <DrawIcon className="fill-[#E77813] text-[18px]" />,
  },
  {
    name: "Initials",
    icon: <AbcIcon className="fill-[#E77813] text-[18px]" />,
  },
  {
    name: "Date Signed",
    icon: <EventIcon className="fill-[#E77813] text-[18px]" />,
  },
];
const signees = [
  {
    fullname: "Basit Ansari",
    color: "rgba(0, 112, 240,0.2)",
    variant: "primary",
  },
  {
    fullname: "Divyansh Malik",
    color: "rgba(245, 165, 36,0.2)",
    variant: "warning",
  },
  {
    fullname: "Sanjay Singh",
    color: "rgba(243, 83, 96,0.2)",
    variant: "danger",
  },
];


const Footer = ({ handleSubmit, selectedSignee, setSelectedSignee,isLoading,signees }) => {
  const [isOpen, setisOpen] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setisOpen(false);
    }, 3000);
  }, []);
  const handleDragStart = (e, field, index) => {
    const rect = e.target.getBoundingClientRect();
    setOffsetX(e.clientX - rect.x);
    setOffsetY(e.clientY - rect.y);
    console.log((index + e.clientX) * Math.floor(Math.random() * 100));
    // setSelectedFieldItem({
    //   id: (index + e.clientX) * Math.floor(Math.random() * 100),
    //   field: field.name,
    //   signee: selectedSignee,
    // });
  };
  const handleTooltipClick = (index)=>{
    console.log("in click")
    if(Number.isInteger(index)&&index>-1){
      approversTooltipBooleanArray[index] = !approversTooltipBooleanArray[index];
    }
  }
  return (
    <div className="absolute bottom-0 w-full pt-2  flex flex-col justify-between items-center gap-2">
      <div className="block w-full lg:hidden px-5">
        <div className="flex w-full justify-start">
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            FabProps={{
              sx: {
                "&.MuiButtonBase-root": {
                  backgroundColor: "#151513",
                  width: "40px",
                  height: "40px",
                },
              },
            }}
            icon={<CheckCircleOutlineIcon className="fill-[#fda178]" />}
            direction="right"
          >
            {signees&&signees.length>0&&signees.map((signee, index) => {
              if(signee.signerRole === "Approver"){
                return(
                  <SpeedDialAction
                    key={index}
                    icon={
                      <Avatar
                        isBordered
                        size="md"
                        className="text-white"
                        classNames={{
                          base: "bg-[#05686E] ring-[#05686E]",
                          icon: "text-white",
                        }}
                        name={signee.fullname}
                      />
                    }
                    tooltipTitle={signee.fullname}
                    // tooltipOpen={approversTooltipBooleanArray[index]}
                    // onClick={()=>handleTooltipClick(index)}
                  />
                )
              }
            })}
          </SpeedDial>
        </div>
      </div>
      <div className="flex w-full border-t border-gray-400 px-5 bg-white pb-2  justify-between text-[#151513] text-[10px] lg:text-[14px]">
        <div></div>
        <div className="p-4 text-justify md:text-center max-w-[100%] lg:max-w-[75%]">
        I am giving consent to easedraft to send this agreement to respective parties and I agree to be bound by the <Link href="https://easedraft.com/terms-and-conditions" className="text-[10px] lg:text-[14px]">easedraft terms and conditions.</Link> Click on "Confirm" to send this agreement.
        </div>
        <Button radius="sm" className="bg-[#fda178] mt-4" onClick={handleSubmit} isLoading={isLoading}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Footer;
