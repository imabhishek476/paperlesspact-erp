import { Modal, ModalContent } from "@nextui-org/react";
import React from "react";
import AddFolder from "../actions/AddFolder";
import RenameAction from "../actions/RenameAction";
import MoveTo from "../actions/MoveTo";

const ActionsModal = ({ discl, actions, currentNode, refreshParent, refreshFolder, refreshRoot, fetchRootContent, setUpdate, rootFolder, activeFolderContent, setActiveFolderContent, setParentId }) => {
  return (
    <Modal isOpen={discl.isOpen} onOpenChange={discl.onOpenChange}>
      <ModalContent>
        {(onClose) =>
          actions.title === "AddFolder" ? (
            <AddFolder
              onClose={discl.onClose}
              currentNode={currentNode}
              refreshParent={refreshParent}
              refreshFolder={refreshFolder}
              refreshRoot={refreshRoot}
              
            />
          ) : actions.title === "Rename" ? (
            <RenameAction
              setUpdate={setUpdate}
              node={currentNode}
              onClose={discl.onClose}
              fetchfolderStructureByPath={fetchRootContent}
            />
          ) : (
            <MoveTo
              setParentId={setParentId}
              node={currentNode}
              onClose={discl.onClose}
              setUpdate={setUpdate}
              folder={rootFolder}
              activeFolderContent={activeFolderContent}
              setActiveFolderContent={setActiveFolderContent}
            />
          )
        }
      </ModalContent>
    </Modal>
  );
};

export default ActionsModal;
