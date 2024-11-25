import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import EditPopover from "./EditPopover";
import { getVariableGroup } from "../../../../Apis/variableGroup";
import { updateVariableValue } from "../../../../Apis/variable";

const AccordionContent = ({
  varGroupId,
  varGroupTitle,
  setUpdate,
  handleSnackbarClick
}) => {
  const [none, setNone] = useState("");
  const [variableData, setVariableData] = useState(null);
  const [updateVariable, setUpdateVariable] = useState(false);

  const GetVariableGroup = async () => {
    try {
      const response = await getVariableGroup(varGroupId);
      setVariableData(response.data.variables);
    } catch (error) {
      console.error("Error in GetVariable:", error.message);
    }
  };

  const handleRenameVariable = async (value, id) => {
    try {
      const response = await updateVariableValue(value, id);
      if (response) {
        console.log(response);
        GetVariableGroup();
      }
    } catch (error) {
      console.error("Error in GetVariable:", error.message);
    }
  };

  useEffect(() => {
    GetVariableGroup();
    console.log("id", varGroupId);
  }, [none]);
  useEffect(() => {
    GetVariableGroup();
    console.log("id", varGroupId);
  }, [updateVariable]);

  return (
    <>
      {variableData?.map((item, index) => {
        return (
          <div key={index}>
            <div className="flex justify-between items-center my-2 pt-2 border-t-1">
              <div className="bg-[#e9f53b] px-2">
                {varGroupTitle}.{item.name}
              </div>
              {/* Popover  */}
              {varGroupTitle !== "System" &&
                (item.name !== "CreatedDate" ||
                  item.name !== "ExpirationDate") && (
                  <EditPopover
                    identifier={2}
                    VarGroup={{ name: item?.name, id: item?._id }}
                    setUpdateVariable={setUpdateVariable}
                    handleSnackbarClick={handleSnackbarClick}
                  />
                )}
            </div>
            <TextField
              value={item.value}
              onChange={(e) => {
                setNone(e.target.value);
                handleRenameVariable(e.target.value, item._id);
              }}
              fullWidth
              variant="standard"
              size="small"
              placeholder="None"
              id="value"
            />
            {/* <Input type="value" variant={"underlined"} placeholder="None" /> */}
          </div>
        );
      })}
    </>
  );
};

export default AccordionContent;
