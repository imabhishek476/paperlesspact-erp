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

const SharedLabelComponent = ({ setDrawer, labelText, isExpanded, refreshParent, currentNode, handlePlusClick, setActions, discl, isOptionsEnabled }) => {
    let isShared=true;
    const router = useRouter();
    return (
        <div className="flex justify-between gap-[2px]">
            <div onClick={() => {
                if (currentNode?.isFile === '1') {
                    console.log("in")
                    console.log(currentNode?.isFile)
                    router.push(`/template/new?id=${currentNode?._id}`)
                }
            }} className="flex gap-2 items-center">
                {!isExpanded ? currentNode?.isFile === '0' ? <Folder size={18} /> : <FileText size={18} /> : <FolderOpen size={18} />}
                <Tooltip title={labelText} >
                    <p className="text-nowrap">{labelText.length > 7 ? `${labelText?.slice(0, 7)}...` : labelText}</p>
                </Tooltip>
            </div>
            {isOptionsEnabled && (
                <div className="flex items-center gap-[10px] p-0"
                >
                    <PopoverComponent isShared={isShared} setDrawer={setDrawer} refreshParent={refreshParent} currentNode={currentNode} setActions={setActions} discl={discl} />
                    {!isShared && currentNode?.isFile === '0' && <Plus size={18} onClick={() => { setDrawer((prev) => { return { ...prev, left: false } }); handlePlusClick(currentNode) }} />}
                </div>
            )}
        </div>
    );
};

export default SharedLabelComponent;
