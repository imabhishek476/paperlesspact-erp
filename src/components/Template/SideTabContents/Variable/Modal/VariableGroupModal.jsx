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
import { createVariableGroup } from "../../../../../Apis/variableGroup";

const VariableGroupModal = ({
  category,
  identifier,
  setUpdate,
  handleSnackbarClick,
  TemplateId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [varGroup, setVarGroup] = useState("");
  const [error, setError] = useState();

  const onOpen = ()=>{
    setIsOpen(true);
    setVarGroup("");
    setError("");
  }

  const onClose = () => {
    setVarGroup("");
    setIsOpen(false);
  };

  const handleCreateVarGroup = async () => {
    try {
      if (!varGroup) {
        setError("Name is required");
        return 
      }
      const response = await createVariableGroup(
        varGroup,
        TemplateId
      );
      if (response) {
        setUpdate((prev) => !prev);
        // handleSnackbarClick("Created Successfully")
        onClose();
      }
      console.log(response);
    } catch (error) {
      console.error("Error in GetVariable:", error.message);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="w-full h-[30px] bg-[#05686e] text-white font-bold rounded-md mx-2 mb-2"
      >
        <Plus size={15} />
        <p className="text-xs">{category}</p>
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
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
                {identifier === 1 ? (
                  <p>Add Variable Group</p>
                ) : (
                  <p>Add Variable</p>
                )}
              </ModalHeader>
              <ModalBody>
                <TextField
                  value={varGroup}
                  onChange={(e) => {setVarGroup(e.target.value); setError("")}}
                  autoFocus
                  sx={{ borderRadius: "10px" }}
                  placeholder={
                    identifier === 1 ? "Variable Group Name" : "Variable Name"
                  }
                  fullWidth
                  id="fullWidth"
                />
                <div className="py-1 ml-2 text-red-600">{error}</div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#05686e] font-bold text-white"
                //   onPress={onClose}
                  onPress={
                    identifier === 1
                      ? handleCreateVarGroup
                      : () => alert("submit")
                  }
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};


export default VariableGroupModal;
