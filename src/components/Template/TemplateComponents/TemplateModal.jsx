import { TextField } from "@mui/material";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import React, { useState } from "react";
import { PageOrientationDropdown } from "../SideTabContents/Pagesetup";
// const pagesetupOptions = [
//   {
//     title: "Letter",
//     size: {
//       height: "1056px",
//       width: "816px",
//     },
//   },
//   {
//     title: "A4",
//     size: {
//       height: "1080px",
//       width: "768px",
//     },
//   },
//   {
//     title: "Legal",
//     size: {
//       height: "1346px",
//       width: "816px",
//     },
//   },
// ];

const pagesetupOptions = [
  "Letter", "A4", "Legal"
];


const TemplateModal = ({
  modalDisc,
  handleCreateTemplate,
}) => {
  const [pageOreintation, setPageOreintation] = useState("portrait");
  const [templateType, setTemplateType] = useState("document");
  const [folderName, setFolderName] = useState("");
  const [pageOption, setPageOption] = useState("A4")
  const [pageSize, setPageSize] = useState({
    height: "1080px",
    width: "768px",
  });
  const handlePageSize = (value) => {
    console.log(value)
    if (value === "Legal") {
      setPageSize({
        height: "1346px",
        width: "816px",
      },
      )
    }
    if (value === "Letter") {
      setPageSize({
        height: "1056px",
        width: "816px",
      })
    }
    if (value === "A4") {
      setPageSize({
        height: "1080px",
        width: "768px",
      })
    }
    setPageOption(value)
  }
  const handlerModClose=()=>{
    modalDisc.onClose();
    setPageOption("A4")
    setPageSize({
      height: "1080px",
      width: "768px",
    })
  }
  return (
    <Modal isOpen={modalDisc.isOpen} onOpenChange={modalDisc.onOpenChange} onClose={()=>{setFolderName("");modalDisc.onClose();}}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h1>Enter Template Name</h1>
              </div>
            </ModalHeader>
            <ModalBody>
              <TextField
                sx={{ width: "100%" }}
                id="outlined-basic"
                label={"Template Name"}
                required
                color="secondary"
                variant="outlined"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                  console.log(e.target.value)
                }}
                name="foldername"
              />
              <div className="flex items-center">
                <span className="text-[14px]">Select Template Type:</span>
                <RadioGroup
                  // label="Select Page Size:"
                  className="p-4 text-[14px]"
                  value={templateType}
                  onValueChange={setTemplateType}
                  orientation="horizontal"
                  defaultValue={"document"}
                >
                  <Radio
                    value={"document"}
                    classNames={{
                      label: "text-[14px]",
                      control: "bg-[#e8713d] border-[#e8713d]",
                    }}
                    size="sm"
                  >
                    Document
                  </Radio>
                  <Radio
                    value={"presentation"}
                    classNames={{
                      label: "text-[14px]",
                      control: "bg-[#e8713d] border-[#e8713d]",
                    }}
                    size="sm"
                  >
                    Presentation
                  </Radio>
                </RadioGroup>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center border-t py-4">
                  <p className="text-[14px]">Page Orientation: </p>
                  <PageOrientationDropdown
                    pageOreintation={pageOreintation}
                    setPageOreintation={setPageOreintation}
                  />
                </div>
                {templateType !== "presentation" &&
                  <RadioGroup
                    label="Select Page Size:"
                    className="py-4 text-[14px]"
                    orientation="horizontal"
                    value={pageOption}
                    onValueChange={handlePageSize}

                  >
                    {pagesetupOptions.map((ele) => {
                      return (
                        <Radio
                          value={ele}
                          key={ele}
                          classNames={{
                            label: "text-[14px]",
                            control: "bg-[#e8713d] border-[#e8713d]",
                          }}
                          size="sm"
                        >
                          {console.log(ele)}
                          {ele}
                        </Radio>
                      );
                    })}
                  </RadioGroup>
                }
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                radius="md"
                variant="light"
                onPress={()=>handlerModClose()}
              >
                Close
              </Button>
              <Button
                color="primary"
                radius="md"
                className="bg-[#05686E] text-background w-max"
                onPress={() => {
                  modalDisc.onClose();
                  let size = pageSize;
                  if (templateType === "presentation") {
                    if (pageOreintation === "portrait") {
                      size = {
                        height: "1024px",
                        width: "576px",
                      }
                    } else {
                      size = {
                        width: "1024px",
                        height: "576px",
                      }
                    }
                  }
                  handleCreateTemplate({
                    folderName: folderName,
                    templateType: templateType,
                    pageSetup: {
                      orientation: pageOreintation,
                      size: size,
                    }
                  });
                }}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TemplateModal;
