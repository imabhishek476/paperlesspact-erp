import { TreeItem, TreeView } from "@mui/x-tree-view";
import { Home, Plus, ChevronRightIcon, Users } from "lucide-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useState } from "react";
import LabelComponent from "../LabelComponent";
import { Skeleton, Spinner, useDisclosure } from "@nextui-org/react";
import ActionsModal from "./ActionsModal";
import { useRouter } from "next/router";
import SharedLabelComponent from "../SharedLabelComponent";

const actionsList = [
  {
    title: "Rename",
  },
  {
    title: "AddFolder",
  },
];

const CustomTreeView = ({
  fetchShared,
  sharedList,
  rootFolders,
  actionaModalDiscl,
  toggleDrawer,
  setDrawer,
  activeFolderContent,
  fetchRootContent,
  isActiveLoading,
  setUpdate,
  fetchRootfolders,
  setParentId,
  setActiveFolderContent,
  actions,
  setActions,
  setNode,
  allPath,
  setCurrentPage,
  setAllPath
}) => {
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const router = useRouter()
  // const [actions, setActions] = useState({
  //   title: "Rename",
  // });
  // const actionaModalDiscl = useDisclosure();

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };
  const handlePlusClick = (node) => {
    if (!node) {
      return;
    }
    toggleDrawer(false)
    if (node === "root") {
      setCurrentId(node);

    } else {
      setCurrentId(node?._id);
    }
    setActions(actionsList[1]);
    actionaModalDiscl.onOpen();
  };

  const refreshParent = async (node) => {
    setUpdate((prev) => !prev);
    if (node?.parent !== "root") {
      await fetchRootContent(node?.parent);
    }
  };
  const refreshFolder = async (id) => {
    await fetchRootContent(id);
  };
  const refreshRoot = async () => {
    await fetchRootfolders();
  };

  const renderTree = (nodes) =>
    nodes?.map((node) => {
      // console.log(node);
      if (node?._id) {
        return (
          <TreeItem
            key={node._id}
            nodeId={node._id}
            label={
              <LabelComponent
                isOptionsEnabled={true}
                labelText={node?.name}
                currentNode={node}
                setDrawer={setDrawer}
                isExpanded={expanded.some((ele) => ele === node?._id)}
                setCurrentId={setCurrentId}
                handlePlusClick={handlePlusClick}
                refreshParent={refreshParent}
                setActions={setActions}
                discl={actionaModalDiscl}
              />
            }
            // onClick={() => {
            //   if (node?.isFile === '1') {
            //     console.log("in")
            //     console.log(node?.isFile)
            //     router.push(`/template/new?id=${node?._id}`)
            //   }
            //   else {
            //     console.log("in")
            //     fetchRootContent(node?._id);
            //     setCurrentNode(node);
            //     setParentId(node?._id)
            //   }
            onClick={() => {
              if (node?.isFile === '0') {
                fetchRootContent(node?._id);
                setParentId(node?._id)
              }
              setCurrentNode(node);
              setNode(node)
            }}
          >
            {Array.isArray(node.children) && node.children.length > 0 ? (
              expanded.some((ele) => ele === node?._id) ? (
                isActiveLoading[node?._id] ? (
                  // true ? (
                  <div className="ps-4 mt-2 space-y-2">
                    <div className="flex w-full justify-between">
                      <div className="w-[70%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                      <div className="w-[10%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                    </div>
                    <div className="flex w-full justify-between">
                      <div className="w-[70%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                      <div className="w-[10%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                    </div>
                    <div className="flex w-full justify-between">
                      <div className="w-[70%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                      <div className="w-[10%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                    </div>


                  </div>
                ) : (
                  renderTree(activeFolderContent[node?._id])
                )
              ) : (
                <TreeItem key={0} nodeId={"0"} label={""}></TreeItem>
              )
            ) : null}
          </TreeItem>
        );
      }
    });
    const renderSharedTree = (nodes) =>
    nodes?.map((node) => {
      // console.log(node);
      if (node?._id) {
        return (
          <TreeItem
            key={node._id}
            nodeId={node._id}
            label={
              <SharedLabelComponent
                isOptionsEnabled={true}
                labelText={node?.name}
                currentNode={node}
                setDrawer={setDrawer}
                isExpanded={expanded.some((ele) => ele === node?._id)}
                setCurrentId={setCurrentId}
                handlePlusClick={handlePlusClick}
                refreshParent={refreshParent}
                setActions={setActions}
                discl={actionaModalDiscl}
              />
            }
            // onClick={() => {
            //   if (node?.isFile === '1') {
            //     console.log("in")
            //     console.log(node?.isFile)
            //     router.push(`/template/new?id=${node?._id}`)
            //   }
            //   else {
            //     console.log("in")
            //     fetchRootContent(node?._id);
            //     setCurrentNode(node);
            //     setParentId(node?._id)
            //   }
            onClick={() => {
              if (node?.isFile === '0') {
                fetchRootContent(node?._id);
                setParentId(node?._id)
              }
              setCurrentNode(node);
              setNode(node)
            }}
          >
            {Array.isArray(node.children) && node.children.length > 0 ? (
              expanded.some((ele) => ele === node?._id) ? (
                isActiveLoading[node?._id] ? (
                  // true ? (
                  <div className="ps-4 mt-2 space-y-2">
                    <div className="flex w-full justify-between">
                      <div className="w-[70%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                      <div className="w-[10%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                    </div>
                    <div className="flex w-full justify-between">
                      <div className="w-[70%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                      <div className="w-[10%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                    </div>
                    <div className="flex w-full justify-between">
                      <div className="w-[70%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                      <div className="w-[10%]">
                        <Skeleton className="w-full rounded-lg">
                          <div className="h-3 w-full rounded-lg bg-default-200"></div>
                        </Skeleton>
                      </div>
                    </div>


                  </div>
                ) : (
                  renderSharedTree(activeFolderContent[node?._id])
                )
              ) : (
                <TreeItem key={0} nodeId={"0"} label={""}></TreeItem>
              )
            ) : null}
          </TreeItem>
        );
      }
    });
  return (
    <>
      <div className="flex items-stretch justify-between">
        <h2 onClick={() => {
          fetchRootContent();
          setCurrentPage('root')
          setAllPath({ name: 'root', path: 'root' })
          setParentId('root')
        }} className="flex items-center gap-2 my-3 cursor-pointer ">
          <Home size={18} /> Home
        </h2>
        <div
          // onClick={() => {
          //   setActions(actionsList[1]);
          //   actionaModalDiscl.onOpen();
          // }}
          className="flex items-center px-2"
        >
          <Plus
            size={18}
            className="cursor-pointer"
            onClick={() => {
              setDrawer((prev) => { return { ...prev, left: false } })
              toggleDrawer(false)
              setCurrentNode('root')
              setNode('root')
              setParentId('root')
              setActions(actionsList[1]);
              actionaModalDiscl.onOpen();
            }}
          />
        </div>
      </div>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {Array.isArray(rootFolders) && rootFolders.length > 0
          ? renderTree(rootFolders)
          : null}
      </TreeView>
      <div className="flex items-stretch">
        <h2 onClick={() => {
           fetchShared();
          setCurrentPage('root')
          setAllPath({ name: 'root', path: 'root' })
          setParentId('root')
        }} className="flex items-center gap-2 my-3 cursor-pointer ">
          <Users size={18} /> Shared with me
        </h2>
      </div>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {Array.isArray(sharedList) && sharedList.length > 0
          ? renderSharedTree(sharedList)
          : null}
      </TreeView>
      {/* {rootFolders.length > 0 &&
        rootFolders?.map((item, index) => {
          return <ul className="cursor-pointer pl-5 hover:bg-gray-100" key={index}>
            <li>
              {item?.name}
            </li>
          </ul>
        })
      } */}
    </>
  );
};

export default CustomTreeView;
