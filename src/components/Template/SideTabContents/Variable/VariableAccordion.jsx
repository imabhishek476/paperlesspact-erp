import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem, Input } from "@nextui-org/react";
import { divide } from "lodash-es";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button
} from "@nextui-org/react";
import { Listbox, ListboxItem } from "@nextui-org/react";

import { TextField } from "@mui/material";
import AccordionContent from "./AccordionContent";
import EditPopover from "./EditPopover";

const VariableAccordion = ({
  allGroupData,
  setUpdate,
  handleSnackbarClick
}) => {
  const UserContent = "These variables are created and named by users.";
  const SystemContent =
    "These variables are created by EaseDraft and auto-fill details related to the document.";

  useEffect(() => {
    console.log(allGroupData);
  }, []);

  return (
    <>
      <Accordion
        variant="splitted"
        className="my-2"
        itemClasses={{
          base: "!mx-2 !shadow-none border-1 !rounded-md !bg-gray-100",
          heading: "h-12",
          title: "font-normal text-medium",
          trigger:
            "py-0 rounded-lg h-14 flex items-center",
          indicator: "text-medium",
          content: "text-small"
        }}
      >
        {allGroupData?.map((item, index) => {
          return (
            <AccordionItem
              key={index}
              aria-label="Accordion 1"
              title={
                <div className="flex justify-between items-center">
                  <div className="font-bold">{item?.name}</div>
                  {item?.name !== "System" && (
                    <EditPopover
                      identifier={1}
                      VarGroup={{ name: item?.name, id: item?._id }}
                      setUpdate={setUpdate}
                      handleSnackbarClick={handleSnackbarClick}
                    />
                  )}
                </div>
              }
            >
              <p className="text-gray-700">
                {item?.name === "System" ? SystemContent : UserContent}
              </p>

              {/* Variables & Value  */}
              <AccordionContent
                varGroupId={item?._id}
                varGroupTitle={item?.name}
                handleSnackbarClick={handleSnackbarClick}
                setUpdate={setUpdate}
              />
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
};

export default VariableAccordion;
