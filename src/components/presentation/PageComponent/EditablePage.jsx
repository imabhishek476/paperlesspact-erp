import React, { useEffect, useRef, useState } from "react";
import { usePageStore } from "../stores/usePageStore";
import DroppableContainer from "./DroppableContainer";
import { useItemStore } from "../stores/useItemStore";
import ItemRenderer from "./ItemRenderer";
import { usePresHistory } from "../stores/usePresHistoryStore";

const EditablePage = () => {
  const { selectedPage, pageSetup, pagePercent } = usePageStore();
  const { items, setDraggedItem, setSelectedItem } = useItemStore();
  const {undoStack,redoStack} =usePresHistory()
  console.log(undoStack,redoStack)
  const [localItems, setLocalItems] = useState([])
  useEffect(()=>{
    setLocalItems(items)
  },[items,selectedPage])
  const targetRef = useRef(null)
  const [pageSize , setPageSize] = useState(null)
  useEffect(()=>{
    if(pageSetup?.orientation === "landscape"){
      setPageSize({
        height:pageSetup?.size?.height,
        width:pageSetup?.size?.width,
      })
    } else {
      setPageSize({
        height:pageSetup?.size?.height,
        width:pageSetup?.size?.width,
      })
    }
  },[pageSetup?.orientation])
  return (
    <div
      id="currentPage"
      style={{
        height:"auto",
        aspectRatio: (pageSetup?.orientation)=== "landscape" ? "16 /9" : "9/16",
        minHeight:pageSize?.height,
        minWidth:pageSize?.width,
        maxHeight:pageSize?.height,
        maxWidth:pageSize?.width,
        transform: `scale(${pagePercent/100})`,
        overflow:"hidden"

      }}
      className="relative mb-4 mt-6 flex justify-center items-center bg-white shadow-md border-[#05686E70] border-4"
      onDoubleClick={(e)=> {e.preventDefault();setSelectedItem(null)}}
      // onClick={(e)=>}
      ref={targetRef}
    >
          
      <DroppableContainer id={"currentDroppable"} pageSetup={pageSetup}>   
        {items
          ?.filter((item) => item?.pageIndex === selectedPage?.pageIndex)
          ?.map((item, index) => {
            return <ItemRenderer key={item.id} item={item} container={targetRef} />;
          })}

      </DroppableContainer>
    </div>
  );
};

export default EditablePage;
