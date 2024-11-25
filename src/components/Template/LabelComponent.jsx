import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import dayjs from "dayjs";
import { CornerUpRight, Edit, File, FileText, Folder, FolderOpen, Link, MoreHorizontal, Plus, Star, StarOff, Trash } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { deleteNode } from "../../Apis/folderStructure";
import { handleDelete, handleFav } from "./CustomTreeView/ActionsHelpers";
import PopoverComponent from "./CustomTreeView/PopoverComponent";
import { useRouter } from "next/router";
import { Tooltip } from "@mui/material";
import Cookies from "js-cookie";
import { getUserProfile } from "../../Apis/login";

const LabelComponent = ({ setDrawer, labelText, isExpanded, refreshParent, currentNode, handlePlusClick, setActions, discl, isOptionsEnabled }) => {
  
  let isShared=false;
  const router=useRouter()
  const handleClickOpen = (node) => {
    if (node?.isFile === '1') {
        console.log(node)
        if (node?.type === "presentation") {
            router.push(`/presentation/new?id=${node?._id}`)
        } else {
            router.push(`/template/new?id=${node?._id}`)
        }
    }
}
  return (
    <div className="flex justify-between gap-[2px]">
      <div onClick={() => {
        handleClickOpen(currentNode)
        // if (currentNode?.isFile === '1') {

        //   console.log("in")
        //   console.log(currentNode)
        //   // router.push(`/template/new?id=${currentNode?._id}`)
        // }
      }} className="flex gap-2 items-center">
        {!isExpanded ? currentNode?.isFile === '0' ? <Folder size={18} /> : <FileText size={18} /> : <FolderOpen size={18} />}
        <Tooltip title={labelText} >
          <p className="text-nowrap">{labelText?.length > 7 ? `${labelText?.slice(0, 7)}...` : labelText}</p>
        </Tooltip>
      </div>
      {isOptionsEnabled && (
        <div className="flex items-center gap-[10px] p-0"
        >

          {/* <Popover
          placement="right"
          showArrow={true}
          isOpen={isOpenPop}
          onOpenChange={(open) => setIsOpenPop(open)}
        >
          <PopoverTrigger>
            <MoreHorizontal size={18} onClick={() => setIsOpenPop(true)} />
          </PopoverTrigger>
          <PopoverContent>
            <ul className="min-w-[200px] py-1 border-b">
              <li
                onClick={() => {
                    handleDelete(currentNode,refreshParent);
                    setIsOpenPop(false);
                }}
                className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                <Trash size={18} /> Delete
              </li>
              <li
                onClick={() => {
                  handleFav(currentNode,refreshParent, currentNode?.isFavourite === "0" ? "1" : "0");
                  setIsOpenPop(false);
                }}
                className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                {currentNode?.isFavourite === "0" ? (
                  <>
                    <Star size={18} /> Add to Favorites
                  </>
                ) : (
                  <>
                    <StarOff size={18} color="#05686e"  />
                    Remove from Favorites
                  </>
                )}
              </li>
              {currentNode&&currentNode?.isFile==='1'&&(<li
                onClick={() => {
                  navigator.clipboard.writeText(node?.url);
                  setIsOpenPop(false);
                }}
                className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                <Link size={18} /> Copy link
              </li>)}
              <li
                onClick={() => {
                  setNode(node);
                  setActions(actionList[0]);
                  onOpen();
                }}
                className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                <Edit size={18} /> Rename
              </li>
              <li
                onClick={() => {
                  setNode(node);
                  setActions({
                    title: "MoveTo",
                  });
                  onOpen();
                }}
                className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                <CornerUpRight size={18} /> Move to
              </li>
            </ul>
            <div className="py-2 w-full">
              <h2 className="text-xs">
                Last edited by {currentNode.createdByUser?.fullname}
              </h2>
              <h2 className="text-xs">
                Created at {dayjs(currentNode.createdAt).format("DD/MM/YYYY")}
              </h2>
            </div>
          </PopoverContent>
        </Popover> */}
          <PopoverComponent isShared={isShared} setDrawer={setDrawer} refreshParent={refreshParent} currentNode={currentNode} setActions={setActions} discl={discl} />
          {!isShared && currentNode?.isFile === '0' && <Plus size={18} onClick={() => { setDrawer((prev) => { return { ...prev, left: false } }); handlePlusClick(currentNode) }} />}
        </div>
      )}
    </div>
  );
};

export default LabelComponent;
