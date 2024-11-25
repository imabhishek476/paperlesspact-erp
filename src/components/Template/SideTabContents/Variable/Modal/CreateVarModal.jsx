import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link
} from "@nextui-org/react";
import { MoreHorizontal, Plus } from "lucide-react";
import { Autocomplete, TextField } from "@mui/material";
import {createVariableWithTemplate } from "../../../../../Apis/variable";
import { useTabsStore } from "../../../stores/useDocTabsStore";

const options = [
  { label: 'Name', value: 'text' },
  { label: 'Date', value: 'date' },
];

const CreateVarModal = ({TemplateId, handleSnackbarClick, setUpdateVariable,isModal,setModal,variable,setVariable}) => {

  const [selectedType, setSelectedType] = useState('text');

//   const [isModal, setModal] = useState(false);
//   const [variable, setVariable] = useState("");
//   const [selectedType, setSelectedType] = useState('text');

  const [error, setError] = useState();
  const {updateVariables} = useTabsStore();

  const onOpen=()=>{
    setModal(true)
    setVariable("")
  }

  const onClose = ()=>{
    // onOpen(false)
    // setVariable("")
    setModal(false);
  }
  const handleClose = ()=>{
    setModal(false)
  }

  const handleCreateVarGroup = async () => {
    try {
      if (!variable) {
        setError("Name is required");
        return;
      }
      // console.log("create Variable")
      let obj = {
        name : variable,
        templateId : TemplateId,
        type: selectedType
      }
      console.log(obj)
      const response = await createVariableWithTemplate(obj);
      // console.log("heeeyyy", response);
      if(response.error ==='Name Already in use'){
        setError(response.error);
        return;
      }
      if (response) {
        onClose();
        console.log("response")
        handleSnackbarClick("Created Successfully")
        updateVariables();
      }
    } catch (error) {
      console.error("Error in GetVariable:", error.message);
    }
  };

  const handleTypeChange = (event, newValue) => {
    setSelectedType(newValue ? newValue.value : '');
    setModal(true)
  };
  
  return (
    <>
      {/* <Button
        onPress={onOpen}
        className="hover:bg-[#05686e] text-white font-bold rounded-md mx-2 mb-2"
      >
        <Plus size={15} />
        <p className="text-xs">Add New Variable</p>
      </Button> */}
      <Button
        variant="light"
        color="success"
        onPress={onOpen}
      >
          <Plus size={12} />
          <span className="text-[12px]">Add</span>
      </Button>
      <Modal
        isOpen={isModal}
        onClose={()=>onClose()}
        placement="top-center"
        radius="sm"
        classNames={{
          body: "py-2",
          backdrop: "bg-overlay/50 backdrop-opacity-40",
          base: "text-black",
          header: "",
          footer: "",
          closeButton: ""
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>Add New Variable</p>
              </ModalHeader>
              <ModalBody>
                <TextField
                  error={error}
                  value={variable}
                  onChange={(e) => {setVariable(e.target.value); setError("")}}
                  autoFocus
                  sx={{ borderRadius: "10px" }}
                  label={"Variable Name"}
                  fullWidth
                  id="fullWidth"
                  helperText={error}
                />
                <Autocomplete
                  id="autocomplete"
                  options={options}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.label}
                  value={options.find(option => option.value === selectedType)}
                  onChange={handleTypeChange}
                  renderInput={(params) => <TextField {...params} label="Variable type" />}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#05686e] font-bold text-white"
                  onPress={handleCreateVarGroup}
                >
                  <p>Add</p>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};



export default CreateVarModal;
