import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import dayjs from 'dayjs';
import { CornerUpRight, Edit, Link, MoreHorizontal, Star, StarOff, Trash } from 'lucide-react';
import React, { useState } from 'react'
import { handleDelete, handleFav } from './ActionsHelpers';
const actionsList = [
  {
      title: "Rename",
  },
  {
      title: "AddFolder",
  },
];

const PopoverComponent = ({currentNode,refreshParent,setActions,discl,setDrawer,isShared}) => {
    const [isOpenPop,setIsOpenPop] = useState(false);
  return (
    <Popover
          placement="right"
          showArrow={true}
          isOpen={isOpenPop}
          onOpenChange={(open) => setIsOpenPop(open)}
        >
          <PopoverTrigger>
            <MoreHorizontal size={18} onClick={() => setIsOpenPop(true)} />
          </PopoverTrigger>
          <PopoverContent>
            <ul className={`min-w-[200px] ${isShared? 'border-b-0 py-0':'border-b py-1'} `}>
           {!isShared &&   <li
                onClick={() => {
                    handleDelete(currentNode,refreshParent);
                    setIsOpenPop(false);
                }}
                className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                <Trash size={18} /> Delete
              </li>}
              {!isShared &&  <li
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
              </li>}
              {currentNode&&currentNode?.url&&(<li
                onClick={() => {
                  navigator.clipboard.writeText(currentNode?.url);
                  setIsOpenPop(false);
                }}
                className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                <Link size={18} /> Copy link
              </li>)}
              {!isShared &&    <li
                onClick={() => {
                  setDrawer((prev)=>{return {...prev,left:false}});
                  setActions(actionsList[0]);
                  discl.onOpen();
                  setIsOpenPop(false);
                }}
                className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                <Edit size={18} /> Rename
              </li>}
              {!isShared &&    <li
                onClick={() => {
                  setDrawer((prev)=>{return {...prev,left:false}});
                  setActions({
                    title: "MoveTo",
                  });
                  discl.onOpen();
                  setIsOpenPop(false);
                }}
                className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                <CornerUpRight size={18} /> Move 
              </li>}
            </ul>
            <div className="py-2 w-full">
              <h2 className="text-xs">
               {isShared ? 'Shared by': 'Last edited by'} {currentNode?.createdByUser?.fullname}
              </h2>
              <h2 className="text-xs">
                Created at {dayjs(currentNode?.createdAt).format("DD/MM/YYYY")}
              </h2>
            </div>
          </PopoverContent>
        </Popover>
  )
}

export default PopoverComponent