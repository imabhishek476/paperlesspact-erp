import React, { useEffect, useState } from "react";
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
  Link,
} from "@nextui-org/react";
import { MoreHorizontal } from "lucide-react";
import { Autocomplete, TextField } from "@mui/material";
import { updateVarGroup } from "../../../../../Apis/variableGroup";
import {
  updateVariable,
  updateVariableWithTemplate,
} from "../../../../../Apis/variable";
import { useRouter } from "next/router";
import { useTabsStore } from "../../../stores/useDocTabsStore";
import { usePageDataStore } from "../../../stores/usePageDataStore";
import { $nodesOfType } from "lexical";
import { MentionNode } from "../../../../LexicalTemplatePlayground/lexical-playground/src/nodes/VariableNode";
import { useDocItemStore } from "../../../stores/useDocItemStore";
// import { useTabsStore } from "../../../stores/useDocTabsStore";

const options = [
  { label: "Name", value: "text" },
  { label: "Date", value: "date" },
];

const EditModal = ({
  isModal,
  setModal,
  VarGroup,
  handleSnackbarClick,
  setUpdateVariable,
}) => {
  const [variable, setVariable] = useState(VarGroup?.name || "");
  const [selectedType, setSelectedType] = useState(VarGroup?.type || "");
  const [error, setError] = useState();
  const { updateVariables } = useTabsStore();
  const { pages } = usePageDataStore();
  const router = useRouter();
  const { items } = useDocItemStore();
  const { id } = router.query;
  const TemplateId = id;

  const onClose = () => {
    setModal(false);
  };

  const handleRenameVariable = async () => {
    // return console.log(selectedType);
    try {
      if (!variable) {
        setError("Name is required");
        return;
      }
      let obj = {
        id: VarGroup?._id,
        templateId: TemplateId,
        type: VarGroup?.type,
      };
      if (VarGroup?.name !== variable) {
        obj.name = variable;
      }
      console.log(obj);
      const response = await updateVariableWithTemplate(obj);
      console.log(response);
      if (response.error === "Name Already in use") {
        setError(response.error);
        return;
      }
      if (response) {
        handleSnackbarClick("Updated Successfully");
        // debugger;
        for (const page of pages) {
          page?.ref?.current?.update(() => {
            const variableNodes = $nodesOfType(MentionNode);
            for (const variableNode of variableNodes) {
              // debugger;
              if (variableNode.__varName === VarGroup.name) {
                //   const newVarNode = $createMentionNode(VarGroup.value,variable);
                // const replacedNode = variableNode.replace(newVarNode);
                // console.log(replacedNode);
                const writable = variableNode.getWritable();
                writable.__varName = variable;
                writable.setTextContent(`[${variable}]`)
                console.log(writable);
              }
            }
          });
        }
        for (const item of items) {
          if (
            (item?.type === "textArea" ||
            item?.type === "table") && item?.ref
          ) {
            item?.ref?.update(() => {
              const variableNodes = $nodesOfType(MentionNode);
              for (const variableNode of variableNodes) {
                // debugger;
                if (variableNode.__varName === VarGroup.name) {
                  //   const newVarNode = $createMentionNode(VarGroup.value,variable);
                  // const replacedNode = variableNode.replace(newVarNode);
                  // console.log(replacedNode);
                  const writable = variableNode.getWritable();
                  writable.__varName = variable;
                  console.log(writable);
                }
              }
            });
          }
        }
        // debugger;
        updateVariables();
        onClose();
      }
    } catch (error) {
      // alert(error.message);
      console.error("Error in GetVariable:", error.message);
    }
  };

  const handleTypeChange = (event, newValue) => {
    setSelectedType(newValue ? newValue.value : "");
    setModal(true);
  };

  useEffect(() => {
    console.log(VarGroup);
  }, []);

  return (
    <>
      <Modal
        isOpen={isModal}
        onClose={onClose}
        placement="top-center"
        radius="sm"
        classNames={{
          body: "py-2",
          backdrop: "bg-overlay/50 backdrop-opacity-40",
          base: "text-black",
          header: "",
          footer: "",
          closeButton: "",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>Rename Variable</p>
              </ModalHeader>
              <ModalBody>
                <TextField
                  error={error}
                  value={variable}
                  onChange={(e) => {
                    setVariable(e.target.value);
                    setError("");
                  }}
                  autoFocus
                  sx={{ borderRadius: "10px" }}
                  label={"Variable Name"}
                  fullWidth
                  id="fullWidth"
                  helperText={error}
                />
                {/* <Autocomplete
                  id="autocomplete"
                  options={options}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.label}
                  value={options.find(
                    (option) => option.value === selectedType
                  )} // Set the value based on selectedType
                  onChange={handleTypeChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Variable type" />
                  )}
                /> */}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => onClose()}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#05686e] font-bold text-white"
                  onPress={handleRenameVariable}
                >
                  <p>Rename</p>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
