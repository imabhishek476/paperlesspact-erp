import { Avatar, Button, Modal, useDisclosure } from "@nextui-org/react";
import React from "react";
import SignModal from "../Sign/SignModal";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DrawIcon from "@mui/icons-material/Draw";
import AbcIcon from "@mui/icons-material/Abc";
import EventIcon from "@mui/icons-material/Event";
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
const approvers = ["Basit Ansari", "Divyansh Malik"];
const ActionBar = ({
  setOffsetX,
  setOffsetY,
  setSelectedFieldItem,
  isOpen,
  onOpen,
  onClose,
  selectedFieldItem,
  setItems,
  selectedSignee,
  setSelectedSignee,
  signees,
}) => {
  const handleDragStart = (e, field, index) => {
    const rect = e.target.getBoundingClientRect();
    setOffsetX(e.clientX - rect.x);
    setOffsetY(e.clientY - rect.y);
    console.log((index + e.clientX) * Math.floor(Math.random() * 100));
    setSelectedFieldItem({
      id: (index + e.clientX) * Math.floor(Math.random() * 100),
      field: field.name,
      signee: selectedSignee,
      type: field.type && field.type
    });
  };
  return (
    <div className="hidden pb-[100px] lg:flex flex-col col-span-2 overflow-y-auto relative h-full bg-gray-50  border-l border-t border-gray-400">
      <div>
        <p className="px-3 pt-2 pb-2 font-semibold border-b border-gray-400 text-[#151513]">
          Recipients
        </p>
        <div className="flex flex-col gap-2 py-4 px-3 border-b border-gray-400">
          {signees &&
            signees.length > 0 &&
            signees.map((signee, index) => {
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
                    className={`flex items-center p-3 gap-3 hover:cursor-pointer rounded-lg border`}
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
        </div>
      </div>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <SignModal
          onClose={onClose}
          selectedFieldItem={selectedFieldItem}
          setItems={setItems}
          selectedSignee={selectedSignee}
        />
      </Modal>
      <div>
        <p className="px-3 pt-2 pb-2 font-semibold border-b border-gray-400 text-[#151513]">
          Draggable Fields
        </p>
        <div className="flex flex-col gap-3 p-2 shrink-0">
          {fields.map((field, index) => {
            return (
              <p
                key={index}
                draggable={selectedSignee ? "true" : "false"}
                style={{
                  cursor: selectedSignee ? "grab" : "not-allowed",
                }}
                onDragStart={(e) => handleDragStart(e, field, index)}
                className="relative flex justify-between items-center border-2 border-[#E77813]  rounded-md"
              >
                <span className="flex items-center text-[#E77813] p-2">
                  <DragIndicatorIcon className="fill-[#E77813]" />
                  {field.name}
                </span>
                <span className="absolute  flex items-center justify-center top-0 right-0 bg-[#E77813] h-full  w-[40px] align-center">
                  {field.icon}
                </span>
              </p>
            );
          })}
        </div>
      </div>
      <div>
        {signees?.some((el) => el.signerRole === "Approver") && (
          <>
            <p className="px-3 pt-2 pb-2 font-semibold border-b border-t border-gray-400 mt-4 text-[#151513]">
              Approvals
            </p>
            <div className="flex flex-col gap-3 pt-2 px-2">
              {/* {approvers &&
            approvers.length > 0 &&
            approvers.map((approver, index) => {
              return (
                <p
                  key={index}
                  className="flex items-center gap-3 border border-[#05686E] p-2 rounded-md text-[#05686E]"
                >
                  <Avatar
                    isBordered
                    color={approver.variant}
                    src={approver?.profileImgUrl}
                    size="sm"
                    classNames={{
                      base: "bg-[#05686E] ring-[#05686E]",
                      icon: "text-white",
                    }}
                  />
                  {approver}
                </p>
              );
            })} */}
              {signees &&
                signees.length > 0 &&
                signees.map((signee, index) => {
                  // console.log(signee);
                  if (signee?.signerRole === "Approver") {
                    return (
                      <p
                        key={index}
                        className="flex items-center gap-3 border border-[#05686E] p-2 rounded-md text-[#05686E]"
                      >
                        <Avatar
                          isBordered
                          color={signee.variant}
                          src={signee?.profileImgUrl}
                          size="sm"
                          classNames={{
                            base: "bg-[#05686E] ring-[#05686E]",
                            icon: "text-white",
                          }}
                        />
                        {signee.fullname}
                      </p>
                    );
                  }
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
