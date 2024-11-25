import React from "react";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

const Toolbar = ({
  selectedSignee,
  signees,
  handleZoomIn,
  widthPerct,
  handleZoomOut,
  setSelectedSignee,
  selectedField,
  setSelectedField,
  fields,
}) => {
  return (
    <>
      <span className="hidden z-10  border-r-0 bg-[#151513]   right-10 top-[0.1px]   w-auto items-center h-auto p-2">
        <p className="p-1 text-[12px]  text-white ">{widthPerct}%</p>
        <p
          className=" p-1 text-white text-[12px] hover:cursor-pointer text-center   "
          size="sm"
          onClick={() => handleZoomIn()}
        >
          <ZoomInIcon className="fill-white text-[18px]" />
        </p>
        <p
          className="p-1  text-white text-[12px] hover:cursor-pointer text-center  "
          size="sm"
          onClick={() => handleZoomOut()}
        >
          <ZoomOutIcon className="fill-white text-[18px]" />
        </p>
      </span>
      <span className="flex  sticky justify-between lg:hidden z-10  border-r-0 bg-gray-100   right-10 top-[0.1px]   w-auto items-center h-auto p-2">
        <Dropdown showArrow>
          <DropdownTrigger>
            <div
              // style={{
              //     backgroundColor:selectedSignee?selectedSignee?.color:signees[0]?.color
              // }}
              className={`flex items-center p-3 bg-gray-50 gap-3 hover:cursor-pointer rounded-lg border `}
            >
              <Avatar
                isBordered
                color={
                  selectedSignee ? selectedSignee?.variant : signees[0]?.variant
                }
                src={
                  selectedSignee
                    ? selectedSignee?.profileImgUrl
                    : signees[0]?.profileImgUrl
                }
                // size="sm"
                className="w-5 h-5 text-tiny"
              />
              {selectedSignee ? selectedSignee.fullname : signees[0]?.fullname}
            </div>
          </DropdownTrigger>
          <DropdownMenu
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            onAction={(index) => setSelectedSignee(signees[index])}
          >
            {signees &&
              signees.length > 0 &&
              signees.map((signee, index) => {
                return (
                  <DropdownItem
                    key={index}
                      className="p-2"
                    // classNames={{
                    //   base: "flex items-center p-3 gap-3",
                    // }}
                    startContent={
                      <Avatar
                        isBordered
                        color={signee.variant}
                        src={signee?.profileImgUrl}
                        //   size="sm"
                        className="w-5 h-5 text-tiny"
                      />
                    }
                  >
                    {signee.fullname}
                  </DropdownItem>
                );
              })}
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" endContent={selectedField.icon}>{selectedField.name}</Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            onAction={(index) => setSelectedField(fields[index])}
          >
            {fields &&
              fields.length > 0 &&
              fields.map((field, index) => {
                return (
                  <DropdownItem
                    key={index}
                    endContent={field.icon}
                    // className={`flex items-center p-3 bg-gray-50 gap-3 hover:cursor-pointer rounded-lg border `}
                  >
                    {field.name}
                  </DropdownItem>
                );
              })}
          </DropdownMenu>
        </Dropdown>
      </span>
    </>
  );
};

export default Toolbar;
