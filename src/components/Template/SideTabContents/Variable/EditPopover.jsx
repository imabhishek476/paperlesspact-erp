import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { MoreHorizontal, SquarePen } from "lucide-react";
import EditModal from "./Modal/EditModal";
import CreateVarModal from "./Modal/CreateVarModal";
import {deleteVarGroup} from "../../../../Apis/variableGroup";
import {deleteVariable} from "../../../../Apis/variable";
import { usePageDataStore } from "../../stores/usePageDataStore";
import { $nodesOfType } from "lexical";
import { MentionNode } from "../../../LexicalTemplatePlayground/lexical-playground/src/nodes/VariableNode";
import { useTabsStore } from "../../stores/useDocTabsStore";
import { useDocItemStore } from "../../stores/useDocItemStore";
// import { useTabsStore } from "../../stores/useDocTabsStore";

const EditPopover = ({ VarGroup , handleSnackbarClick, setUpdateVariable}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isModal, setModal] = useState(false);
  const {pages} = usePageDataStore();
  const {updateVariables} = useTabsStore();
  const {items} = useDocItemStore();

  const handleDeleteVariable = async (onClose) => {
    console.log(VarGroup._id)
    try {
      for(const page of pages){
        if(!page?.ref?.current){
          throw Error(`Page: ${page} has no ref`);
        }
        page?.ref?.current?.update(()=>{
          const variableNodes = $nodesOfType(MentionNode);
          for(const variableNode of variableNodes){
            // debugger;
            if(variableNode.__varName === VarGroup.name){
              variableNode.remove();
            }
          }
        })
      }
      for (const textItems of items) {
        // debugger;
        if (
          (textItems?.type === "textArea" ||
          textItems?.type === "table") && textItems?.ref
        ) {
          textItems?.ref?.update(()=>{
            const variableNodes = $nodesOfType(MentionNode);
            for(const variableNode of variableNodes){
              // debugger;
              if(variableNode.__varName === VarGroup.name){
                variableNode.remove();
              }
            }
          })
        }
      }
      const response = await deleteVariable(VarGroup.id)
      if(response){
        handleSnackbarClick("Deleted Successfully")
        updateVariables();
        console.log(response);
      }
    } catch (error) {
      // handleSnackbarClick("Something went wrong")
      console.error("Error in GetVariable:", error.message);
    }
  };

  return (
    <>
      <Popover placement="top" showArrow={true}>
        <PopoverTrigger>
          <button className="hover:bg-gray-200 rounded-md transition-all duration-600 mr-4">
          <MoreHorizontal size={20} />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <Listbox
              aria-label="Dynamic Actions"
              //   onAction={(key) => alert(key)}
            >
              {/* {identifier === 1 && (
                <ListboxItem
                  onClick={() => setModal2(true)}
                  key={1}
                  color={"default"}
                  className={""}
                >
                  Create New Variable
                </ListboxItem>
              )} */}

              <ListboxItem
                onClick={() => setModal(true)}
                key={2}
                color={"default"}
                className={""}
              >
                Rename
              </ListboxItem>
              <ListboxItem
                // onClick={()=>
                //   handleDeleteVariable()
                // }
                onPress={onOpen}
                key={3}
                color={"default"}
                className={""}
              >
                Delete
              </ListboxItem>
            </Listbox>
          </div>
        </PopoverContent>
      </Popover>
      <EditModal
        isModal={isModal}
        setModal={setModal}
        VarGroup={VarGroup}
        handleSnackbarClick={handleSnackbarClick}
        setUpdateVariable={setUpdateVariable}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Variable</ModalHeader>
              <ModalBody>
                Deleting variable will delete all the instances of the variable from your template as well. Are you sure you want to delete?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={()=>handleDeleteVariable(onClose)}>
                  Delete
                </Button>
                <Button color="primary" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* <CreateVarModal
        isModal={isModal2}
        setModal={setModal2}
        setUpdate={setUpdate}
        setUpdateVariable={setUpdateVariable}
        VarGroup={VarGroup}
        handleSnackbarClick={handleSnackbarClick}
      /> */}
    </>
  );
};

export default EditPopover;
