import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import React from "react";
import Preview from "./Preview";

const PreviewPopover = ({ agreementResponse, documentsArray, type }) => {
  return (
    <Popover
      showArrow
      backdrop="blur"
      placement="bottom-end"
      classNames={{
        base: [
          // arrow color
          "before:bg-[#fda1785]",
        ],
        content: [
          "py-3 px-4 border border-default-200",
          "bg-gradient-to-br from-white to-[#fda17850]",
          "dark:from-default-100 dark:to-default-50",
        ],
      }}
    >
      <PopoverTrigger>
        <Button className="block lg:hidden text-[12px] px-1 bg-[#fda178]">Preview</Button>
      </PopoverTrigger>
      <PopoverContent>
        {(titleProps) => (
          <div className="w-[80vw] h-[80vh]">
            <Preview
              agreementResponse={agreementResponse}
              documentsArray={agreementResponse?.agreements}
              type={false}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PreviewPopover;
