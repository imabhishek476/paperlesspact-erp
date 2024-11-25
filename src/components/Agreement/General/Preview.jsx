import React, { useEffect, useState } from "react";
import AgreementPreview from "../Rental/AgreementPreview";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Image from "next/image";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";

const Preview = ({ documentsArray, agreementResponse, type }) => {
  const [currentIndex, setCurrentIndex] = useState(
    // 
    0
  );
    console.log(documentsArray);
  const createBlob = (index) => {
    try {
      if (documentsArray && documentsArray.length > 0) {
        console.log(index);
        console.log(documentsArray[index]);
        // const blob = new Blob([documentsArray[index]],{type:"application/pdf"});
        // console.log(blob);
        const url = URL.createObjectURL(documentsArray[index]);
        console.log(url);
        return url;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e)=>{
    setCurrentIndex(e.target.value);
  }

  useEffect(() => {
    if (documentsArray && documentsArray.length > 0 && currentIndex === null) {
      setCurrentIndex(0);
    }
  }, [documentsArray]);
  if (type && agreementResponse) {
    return <AgreementPreview agreementResponse={agreementResponse} />;
  }

  if(!(documentsArray&&documentsArray.length>0)){
    return(
      <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "575px",
        flexDirection: "column",
        marginTop: "40px",
        gap: "16px",
        border: "none",
      }}
    >
      <Image
        height={350}
        width={300}
        alt={"No Case Image"}
        src={"/images/NoCaseImage.png"}
      />
      <p className="text-[20px] font-[500] ml-[55px]">
        No preview available
      </p>
    </div>
    )
  }
  return (
    <div className="w-full h-full p-4 pt-0 mb-4">
      {/* <FormControl>
        <FormLabel sx={{
            color:"rgb(31,41,55)",
            lineHeight:"1.5",
            fontSize:"16px",
            fontWeight:600
        }}
        >
            Preview
            </FormLabel>
        <RadioGroup
          row
          value={currentIndex}
          onChange={handleChange}
        >
          {documentsArray &&
            documentsArray.length > 1 &&
            documentsArray.map((document, index) => {
              return (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={document.name}
                />
              );
            })}
        </RadioGroup>
      </FormControl> */}
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-[16px] text-[#1f2937]">Preview</p>
        <Dropdown>
        <DropdownTrigger>
        <Button 
          variant="solid" 
          className="capitalize bg-[#fda178]"
          endContent={<ArrowDropDownIcon/>}
        >
          {documentsArray[currentIndex]?.name}
        </Button>
        </DropdownTrigger>
        <DropdownMenu 
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        onAction={(key) => setCurrentIndex(key)}
      >
        {documentsArray&&documentsArray.length>0 && documentsArray.map((document,index)=>{
          return (
            <DropdownItem key={index}>{document?.name}</DropdownItem>
          )
        })}
      </DropdownMenu>
        </Dropdown>
      </div>
      <iframe src={documentsArray[currentIndex]?.URL} height={"80%"} width={"100%"} />
    </div>
  );
};

export default Preview;
