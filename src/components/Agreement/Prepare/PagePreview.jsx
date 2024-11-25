import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import NextImage from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Resizable } from "re-resizable";
import { hexToRgb } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Toolbar from "./Toolbar";
import DrawIcon from "@mui/icons-material/Draw";
import AbcIcon from "@mui/icons-material/Abc";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Building2, CaseUpper, Image, Type } from "lucide-react";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const fields = [
  {
    name: "Signature",
    icon: <DrawIcon className="fill-white" />,
  },
  { name: "Initials", icon: <CaseUpper className="text-white" /> },
  {
    name: "Date Signed",
    icon: <EventIcon className="fill-white" />,
  },
  {
    name: "Company",
    icon: <Building2 className="text-white" />,
    type: "text"
  },
  {
    name: "Job Title",
    icon: <WorkOutlineIcon className="fill-white" />,
    type: "text"
  },
  {
    name: "Fullname",
    icon: <AbcIcon className="fill-white" />,
    type: "text"
  },{
    name: "Text",
    type: "text",
    icon : <Type className="text-white"/>
  },
  {
    name: "Image",
    type: "image",
    icon : <Image className="text-white"/>
  }
];

// const signees = [
//   {
//     fullname: "Basit Ansari",
//     color: "rgba(0, 112, 240,0.2)",
//     variant: "primary",
//   },
//   {
//     fullname: "Divyansh Malik",
//     color: "rgba(245, 165, 36,0.2)",
//     variant: "warning",
//   },
//   {
//     fullname: "Sanjay Singh",
//     color: "rgba(243, 83, 96,0.2)",
//     variant: "danger",
//   },
// ];

const PagePreview = ({
  documentPages,
  currentPageIndex,
  items,
  handleAdditem,
  handleRemoveItem,
  offsetX,
  offsetY,
  setOffsetX,
  setOffsetY,
  selectedFieldItem,
  setSelectedFieldItem,
  onOpen,
  selectedSignee,
  update,
  setUpdate,
  allowedName,
  setSelectedSignee,
  signees,
}) => {
  const imageRef = useRef(null);
  const [widthPerct, setWidthPerct] = useState(100);
  const [scale, setScale] = useState(0.5);
  const [selectedField, setSelectedField] = useState(fields[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e);
  };
  const handleDrop = (e, pageIndex) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e);
    console.log("in drop");
    const { x, y, height, width } = e.target.getBoundingClientRect();
    const posX = Math.floor(((e.clientX - x) / width) * 100) + "%";
    const posY = Math.floor(((e.clientY - y) / height) * 100) + "%";
    handleAdditem(selectedFieldItem, pageIndex, posX, posY);
    setSelectedFieldItem(null);
    setUpdate((prev) => !prev);
  };

  const handleMobileDrop = (e, index) => {
    console.log("in drop");
    if (selectedFieldItem) {
      const { x, y, height, width } = e.target.getBoundingClientRect();
      const posX = Math.floor(((e.clientX - x) / width) * 100) + "%";
      const posY = Math.floor(((e.clientY - y) / height) * 100) + "%";
      handleAdditem(selectedFieldItem, index, posX, posY);
      setSelectedFieldItem(null);
      setUpdate((prev) => !prev);
    }
  };

  const handleFieldSelect = (e, field, index) => {
    setSelectedFieldItem({
      id: (index + e.clientX) * Math.floor(Math.random() * 100),
      field: field.name,
      signee: selectedSignee,
      type : field.type && field.type
    });
  };

  const handleZoomIn = () => {
    if (widthPerct < 100) {
      setWidthPerct((prev) => prev + 10);
    }
    // if(scale<2){
    //     setScale((prev)=>prev+0.25);
    // }
  };
  const handleZoomOut = () => {
    if (widthPerct > 10) {
      setWidthPerct((prev) => prev - 10);
    }
    // if(scale>0.25){
    //     setScale((prev)=>prev-0.25);
    // }
  };
  const handleDragStart = (e, field, index) => {
    const rect = e.target.getBoundingClientRect();
    setOffsetX(e.clientX - rect.x);
    setOffsetY(e.clientY - rect.y);
    setSelectedFieldItem(field);
  };
  useEffect(() => {
    if (currentPageIndex !== -1 && imageRef && imageRef.current) {
      imageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPageIndex]);
  return (
    <div className=" relative  flex flex-col gap-4 col-span-12 lg:col-span-8 h-full bg-gray-50 overflow-y-auto border-t border-gray-400">
      {/* <Toolbar
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        signees={signees}
        selectedSignee={selectedSignee}
        widthPerct={widthPerct}
        setSelectedSignee={setSelectedSignee}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        fields={fields}
      /> */}
      <div className="flex flex-col gap-15 items-center justify-center px-10 pt-[50px] mb-[55px]">
        <Popover
          placement="right"
          isOpen={isOpen}
          onOpenChange={(isOpen) => setIsOpen(isOpen)}
          classNames={{
            base: "-right-[40px] w-screen",
          }}
          radius="none"
          //  backdrop="blur"
        >
          <PopoverTrigger>
            <Button
              className="block lg:hidden fixed top-[40%] right-[-52px] rounded-none rounded-t-lg -rotate-90"
              variant="bordered"
            >
              Recipients{" "}
              <AccountBoxIcon id="settingsIcon" className="fill-[#151513]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent variant="faded" aria-label="Static Actions">
            <div className="grid py-2 gap-3 grid-cols-2 flex-wrap">
              {signees &&
                signees.length > 0 &&
                signees.map((signee, index) => {
                  const className = `bg-[${signee.color}]`;
                  console.log(signee);
                  if (signee?.signerRole === "Signer") {
                  return (
                    <div
                      key={index}
                      style={{
                        borderColor: signee.color,
                        backgroundColor:
                          selectedSignee?.fullname === signee?.fullname
                            ? signee.color
                            : "",
                        // color:signee.color
                      }}
                      className={`flex items-center p-2 gap-2 hover:cursor-pointer rounded-lg border`}
                      onClick={() => setSelectedSignee(signee)}
                    >
                      <Avatar
                        isBordered
                        color={signee.variant}
                        src={signee?.profileImgUrl}
                        size="sm"
                      />
                      {signee.fullname}
                    </div>
                  );
                  }
                })}
              <span
                className="absolute top-1 left-2  hover:cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <CancelIcon className="text-[24px] " />
              </span>
            </div>
          </PopoverContent>
        </Popover>
        <Popover
          placement="right"
          isOpen={isOpen2}
          onOpenChange={(isOpen) => setIsOpen2(isOpen)}
          classNames={{
            base: "w-[101vw]",
            // content:"w-screen"
          }}
          offset={-40}
          radius="none"
          //  backdrop="blur"
        >
          <PopoverTrigger>
            <Button
              className="block lg:hidden fixed top-[20%] left-[-40px] rounded-none rounded-t-lg rotate-90"
              variant="bordered"
            >
              <SettingsIcon id="settingsIcon" className="fill-[#151513]" />
              {" "}Settings
            </Button>
          </PopoverTrigger>
          <PopoverContent variant="faded" aria-label="Static Actions">
            <div
              className="flex flex-col justify-between w-full p-2 "
            >
              <p className="flex justify-end"><CancelIcon className="text-[24px] hover:cursor-pointer" onClick={() => setIsOpen2(false)}/></p>
              <p className="text-[#151513] text-[14px]">Select any dragable tool and tap on the pdf screen where you want to place field</p>
            </div>
            <div className="grid w-full  py-2 gap-2 grid-cols-2">
              {fields &&
                fields.length > 0 &&
                fields.map((field, index) => {
                  return (
                    <div
                      key={index}
                      draggable={selectedSignee ? "true" : "false"}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedFieldItem &&
                          selectedFieldItem?.field === field.name
                            ? "#05686e10"
                            : "white",
                      }}
                      onClick={(e) => {
                        handleFieldSelect(e, field, index);
                      }}
                      onDragStart={(e) => handleDragStart(e, field, index)}
                      className="relative flex justify-between items-center border-2 border-[#E77813]  rounded-md h-[40px]"
                    >
                      <span className="flex items-center text-[#E77813]">
                        <DragIndicatorIcon className="fill-[#E77813]" />
                        {field.name}
                      </span>
                      <span className="absolute  flex items-center justify-center top-0 right-0 bg-[#E77813] h-full  w-[40px] align-center">{field.icon}</span>
                    </div>
                  );
                })}
            </div>
          </PopoverContent>
        </Popover>
        {documentPages &&
          documentPages.length > 0 &&
          documentPages.map((page, index) => {
            return (
              <div
                key={index}
                className="flex  flex-col justify-center items-center mb-16"
              >
                {(update || !update) && (
                  <div className="relative">
                    <img
                      onDrop={(e) => handleDrop(e, index)}
                      onDragOver={(e) => handleDragOver(e)}
                      onDragEnter={(e) => handleDragEnter(e)}
                      onDragLeave={(e) => handleDragLeave(e)}
                      onClick={(e) => handleMobileDrop(e, index)}
                      src={page}
                      width={`${widthPerct}%`}
                      alt={`${index} image`}
                      //   className={`transform scale-${scale}`}
                      ref={index === currentPageIndex ? imageRef : null}
                    />
                    {items?.length > 0 &&
                      items?.map((item, itemIndex) => {
                        // console.log("ITEM", item);
                        if (item.pageIndex === index) {
                          return (
                            // <Resizable key={index}
                            // defaultSize={{
                            //     width: 200,
                            //     height: 50,
                            //   }}
                            // >
                            <div
                              key={item.id}
                              style={{
                                top: item.top,
                                left: item.left,
                                width: "17%",
                                height : "3.6%",
                                backgroundColor: item?.signee?.color || "rgba(0, 112, 240, 0.2)",
                                // height: "3%",
                                // width: "auto"
                                cursor :item?.signee?.fullname ===
                                selectedSignee?.fullname
                                  ? "grab"
                                  : "disabled"
                              }}
                              draggable={
                                item?.signee?.fullname ===
                                selectedSignee?.fullname
                                  ? "true"
                                  : "false"
                              }
                              onDragStart={(e) => handleDragStart(e, item)}
                              className={`absolute flex p-3 text-[#151513] rounded-lg items-center hover:cursor-pointer`}
                            >
                              <div className="relative w-full h-full flex justify-center items-center">
                                <div
                                  onClick={() => {
                                    if (
                                      item?.signee?.fullname ===
                                      selectedSignee?.fullname
                                    ) {
                                      setSelectedFieldItem(item);
                                      // if (
                                      //   allowedName === item.signee?.fullname
                                      // ) {
                                      //   onOpen();
                                      // }
                                    }
                                  }}
                                >
                                  {item.field === "Signature" ||
                                  item.field === "Initials" ? (
                                    item.image && (
                                      <NextImage
                                        src={typeof item.image === "string" ? item.image: URL.createObjectURL(item.image)}
                                        width={200}
                                        height={40}
                                        alt=""
                                      />
                                    ) 
                                  ) : null}
                                  {item.text ? (
                                    item.text && (
                                      <span>{item.text}</span>

                                    ) 
                                
                                      
                                  ) : <span>{item.field}</span>
                                  }
                                </div>
                                <span
                                  className="absolute top-[-50%]   lg:top-[-200%] right-[-16px] hover:cursor-pointer"
                                  onClick={() => handleRemoveItem(item)}
                                >
                                  <CancelIcon className="text-[14px] fill-[#0f766e75] " />
                                </span>
                              </div>
                            </div>
                            //   </Resizable>
                          );
                        }
                      })}
                  </div>
                )}
                <p>{index + 1}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PagePreview;
