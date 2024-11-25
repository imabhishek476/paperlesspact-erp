import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Tooltip, cn, useDisclosure } from "@nextui-org/react";
import { File, FileBadge, IndianRupee, Info, Upload } from "lucide-react";
import { Nunito } from "next/font/google";
import React, { useEffect, useState } from "react";
import { saveInfo } from "../../../Utils/Contstant";
import { useTabsStore } from "../stores/useDocTabsStore";
const nunito = Nunito({ subsets: ["latin"] });
const StampComponent = ({stampUrl, isApprover}) => {

    const [isStampRequired,setStampRequired] = useState(false);
    const [isSelectedStamp,setIsSelectedStamp] = useState(true);
    const [stampAmount,setStampAmount] = useState('');
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const {enableStamp,setEnableStamp, stampFile,setStampFile} = useTabsStore()

    function handleFileStampChange(event) {
		setStampFile(event.target.files[0]);
	}
  function createfileURL(file){
        return URL.createObjectURL(file);
    
}

const handleEnableStampChange =(event)=>{
setEnableStamp(event.target.checked)
}

  useEffect(()=>{
    console.log(stampFile);
  },[stampFile])

  return (
    <div className="relative h-full">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b-2">Stamp Preview</ModalHeader>
              <ModalBody className="p-0">
              {(stampFile||stampUrl)&&(
          <div>
            <iframe src={stampUrl?`${stampUrl}#toolbar=0&navpanes=0`:`${createfileURL(stampFile)}#toolbar=0&navpanes=0`} className="w-full h-[calc(100vh-325px)]"/>
          </div>
          )}
              </ModalBody>
              <ModalFooter className="border-t">
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="p-4 border-b-2 flex justify-between">
            <p className="text-[14px] text-[#05686e]">Stamp</p>
            <span className=" text-[#05686E] ">
              <Tooltip
                placement="top"
                size="md"
                className={`w-[250px]  bg-[#e3feff] p-3 ${nunito.className}`}
                content={saveInfo}
              >
                <Info size={17} />
              </Tooltip>
            </span>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <Switch
          isDisabled={isApprover}
            isSelected={enableStamp}
            onChange={handleEnableStampChange}
            // onValueChange={setStampRequired}
            color="success"
            size="sm"
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse w-full max-w-md bg-content1 items-center",
                "justify-between cursor-pointer rounded-lg gap-2 border-2 border-transparent"
              ),
              wrapper: "p-0 h-4 overflow-visible",
              thumb: cn(
                "w-6 h-6 border-2 shadow-lg",

                //selected
                "group-data-[selected=true]:ml-6 ",
                // pressed
                "group-data-[pressed=true]:w-7",
                "group-data-[selected]:group-data-[pressed]:ml-4"
              ),
            }}
          >
            <div className="flex flex-col gap-1">
              <p className="text-[14px]">
                Is stamp required for this agreement ?
              </p>
            </div>
          </Switch>
          {enableStamp && (
            <>
                <div className="max-w-full">
                  <label htmlFor="" className="text-[14px]">Upload PDF of Stamp *</label>
                  <div className="relative border rounded-full border-[#04686e] mt-2">
                    <input
                      onChange={handleFileStampChange}
                      type="file"
                      accept="application/pdf"
                      className="border opacity-0 relative z-30 cursor-pointer  py-1 pl-8 px-3 min-h-[47px] w-full"
                    />
                    <Upload
                      size={18}
                      className="absolute top-0 min-h-[47px] mx-3"
                      color="#05686e"
                    />
                    <p className="min-h-[47px] top-0 flex items-center absolute left-10 text-[14px] text-[#05686e]">
                      {stampFile?.name
                        ?<span>  {stampFile?.name?.slice(0,25)}{stampFile?.name?.length>25 && "..."}</span>
                        : "Choose purchased stamp file"}
                    </p>
                  </div>
                </div>
            </>
          )}
          {(stampFile||stampUrl)&&enableStamp&&(
            <div className="flex justify-end items-center">
              <Button onClick={onOpen} className="text-[10px] text-[#05686e] bg-white items-start">
              Click to Preview
              </Button>
              </div>
          )}
          
        </div>
      </div>
      
    </div>
  );
};

export default StampComponent;
