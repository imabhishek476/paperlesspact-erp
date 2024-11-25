import React, { useEffect, useState } from "react";
import { Input, useDisclosure } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Plus, Search } from "lucide-react";
import VariableAccordion from "./VariableAccordion";
import VariableGroupModal from "./Modal/VariableGroupModal";
import { useRouter } from "next/router";
import { Alert, Snackbar, TextField } from "@mui/material";
import CreateVarModal from "./Modal/CreateVarModal";
import { getVariableWithTemplateId } from "../../../../Apis/variable";
import EditPopover from "./EditPopover";
import VariableValue from "./VariableValue";
import { useTabsStore } from "../../stores/useDocTabsStore";
import { usePageDataStore } from "../../stores/usePageDataStore";

const Variable = () => {
  const [searchInput, setSearchInput] = useState("");
  const [allVariable, setAllVariableData] = useState(null);
  const [updateVariable, setUpdateVariable] = useState(true);
  const {update, setUpdate} = useTabsStore()
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [SnackbarMsg, setSnackbarMsg] = useState("");
  const [isModal, setModal] = useState(false);
  const [variable, setVariable] = useState("");
  const {variables,setVariables,variableUpdate} = useTabsStore();
  const router = useRouter();
  const { id } = router.query;
  const TemplateId = id;
  const {isEditable} = usePageDataStore();

  const handleSnackbarClick = (String) => {
    setOpenSnackbar(true);
    setSnackbarMsg(String);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const GetAllVariable = async () => {
    try {
      const response = await getVariableWithTemplateId(TemplateId);
      console.log('in side tabs');
      setVariables(response.data.map((ele)=>({...ele,id:ele?._id})));
      console.log(response.data)
      // setCountGroup(data.length);
    } catch (error) {
      console.error("Error in GetAllVariableGroup:", error.message);
    }
  };

  useEffect(() => {
    console.log(variableUpdate);
    GetAllVariable();
  }, [variableUpdate]);


  useEffect(()=>{
    console.log(variables);
  },[variables])


  return (
    <>
      <div>
        <div className="flex justify-between items-center h-[55px] p-4 sticky top-0 z-1 border-b-2">
          <h1 className="text-sm text-[#05686E] ">Variables</h1>
          {isEditable && <div name="buttons" className="flex my-4 mx-2">
              <CreateVarModal
              isModal={isModal}
              setModal={setModal}
              variable={variable}
              setVariable={setVariable}
                TemplateId={TemplateId}
                handleSnackbarClick={handleSnackbarClick}
                setUpdateVariable={setUpdateVariable}
              />
            </div>
            }
          
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-155px)]">
          <div className="p-4 text-sm border-b-2">
            <p className="my-2">Using a variable helps save time.</p>
            <p className="leading-5 my-2">
              Simply add it once, then let it populate throughout your document
              or template automatically.
            </p>
            <p className="leading-5">
              A variable is enclosed within brackets such as{" "}
              <span className="font-bold text-md">[YourVariable.Name]</span> —
              you can choose from our list or create your own.
            </p>
          </div>

          <div name="variableSection" className="">
            {/* <div name="search" className="my-4 mx-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                radius="none"
                classNames={{
                  input: [
                    "text-black/90",
                    "placeholder:text-default-700/50"
                  ],
                  inputWrapper: [
                    "bg-default-200/50",
                    // "group-data-[focused=true]:bg-default-200/50",
                  ]
                }}
                placeholder="Search Variable Group"
                startContent={
                  <Search  className="text-default-700/50"/>
                }
              />
            </div> */}

            <div className="px-2">
              {
                variables && variables?.map((item,index)=>{
                  return (
                    <div key={item.name} id="VariableName" className="mx-2 my-4">
                      <div className="flex justify-between pb-1">
                        <p className="text-sm text-gray-500 font-bold truncate">
                          {item.name}
                        </p>
                        {isEditable && <EditPopover VarGroup={item} handleSnackbarClick={handleSnackbarClick} setUpdateVariable={setUpdateVariable}/>}
                        
                      </div>
                      <VariableValue item={item}/>
                    </div>
                  )
                })
              }
              
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {SnackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Variable;
