import {
  Autocomplete,
  AutocompleteItem,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import { ChevronRightIcon, File, Folder, Home } from "lucide-react";
import { moveFile } from "@/Apis/folderStructure";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { Box, TextField, Typography, styled, useTheme } from "@mui/material";
import { getFolderStructure } from "../../../Apis/folderStructure";
import LabelComponent from "../LabelComponent";

function MoveTo({
  onClose,
  setUpdate,
  node,
  folder,
  activeFolderContent,
  setActiveFolderContent,
  setParentId,
}) {
  const [folderName, setFolderName] = useState("");
  const [Template, setTemplate] = useState();
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isActiveLoading, setIsActiveLoading] = useState({});
  const [searchValue, setSearchValue] = useState(null);
  const [isHomeSelected,setIsHomeSelected] = useState(false);
  const currentNode = node;
  const folderSearchOptions = useMemo(() => {
    let temp = [...folder];
    const Keys = Object.keys(activeFolderContent);
    Keys.map((ele) => {
      temp = [...temp, ...activeFolderContent[ele]];
    });
    return temp;
  }, [folder, activeFolderContent]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };
  // console.log(node);

  async function handleMoveTo() {
    // const id = node?._id;
    console.log(node?._id,selected)
    if (selected) {
      const response = await moveFile(node?._id, selected);
      if (response) {
        setParentId(selected)
        setUpdate((prev) => !prev);
     
      }
    }
    if (searchValue) {
      const response = await moveFile(node?._id, searchValue);
      if (response) {
        setParentId(searchValue)
        setUpdate((prev) => !prev);
      }
    }
  }

  // console.log(selected);
  async function fetchfolderStructureByPath(id) {
    // console.log(id);
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp[id] = true;
      return temp;
    });
    // console.log('loading');
    const folderStructure = await getFolderStructure(id);
    // console.log(folderStructure);
    setActiveFolderContent((prev) => {
      const temp = { ...prev };
      temp[id] = folderStructure;
      return temp;
    });
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp[id] = false;
      return temp;
    });
  }

  const renderTree = (nodes) =>
    nodes.map((node) => {
      // console.log(node);
      if (node?.isFile === "1"||node?._id===currentNode?._id) {
        return;
      }
      return (
        <TreeItem
          key={node._id}
          nodeId={node._id}
          label={
            <LabelComponent
            isOptionsEnabled={false}
            labelText={node?.name}
            currentNode={node}
            isExpanded={expanded.some((ele) => ele === node?._id)}
            // setCurrentId={setCurrentId}
            // handlePlusClick={handlePlusClick}
            // refreshParent={refreshParent}
            // setActions={setActions}
            // discl={actionaModalDiscl}
            />
          }
          // icon={<Folder/>}
          onClick={() => {
            fetchfolderStructureByPath(node?._id);
          }}
        >
          {Array.isArray(node.children) && node.children.length > 0 ? (
            expanded.some((ele) => ele === node?._id) ? (
              isActiveLoading[node?._id] ? (
                <Spinner size="sm" />
              ) : (
                renderTree(activeFolderContent[node?._id])
              )
            ) : (
              <TreeItem key={0} nodeId={0} label={""}></TreeItem>
            )
          ) : null}
        </TreeItem>
      );
    });

  useEffect(() => {
    setTemplate(node);
  }, [node]);
  useEffect(()=>{
	if(isHomeSelected){
		setSelected('root');
	}
  },[isHomeSelected])
  useEffect(()=>{
	if(selected!=='root'&&isHomeSelected){
		setIsHomeSelected(false)
	}
  },[selected])

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <h4>Move {node?.name} to</h4>
          {/* <Autocomplete
            size="sm"
            items={folderSearchOptions}
            label="Search Folder"
            selectedKey={searchValue}
            onSelectionChange={setSearchValue}
            classNames={{
              base: "w-[175px]",
            }}
          >
            {(item) => (
              <AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>
            )}
          </Autocomplete> */}
        </div>
      </ModalHeader>
      <ModalBody className="gap-1 pt-0">
        <h2
          className={`flex items-center gap-2  ${isHomeSelected?'bg-[#15151314]':'bg-inherit'} hover:cursor-pointer hover:bg-[#0000000a]`}
          onClick={() => {
			// setSelected("root");
			setIsHomeSelected((prev)=>!prev);
		}}
        >
          <Home size={18} /> Home
        </h2>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          selected={selected}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
        >
          {Array.isArray(folder) && folder.length > 0
            ? renderTree(folder)
            : null}
        </TreeView>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button
      className="bg-[#05686E] text-white"
          onPress={() => {
            handleMoveTo();
            onClose();
          }}
        >
          Move
        </Button>
      </ModalFooter>
    </>
  );
}

export default MoveTo;
