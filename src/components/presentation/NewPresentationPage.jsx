import React, { useEffect, useState } from "react";
import PresentationNavbar from "./PresentationNavbar";
import { useUserStore } from "./stores/userDetailStore";
import PageComponent from "./PageComponent/PageComponent";
import SideBar from "./SideBar";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createSnapModifier } from "@dnd-kit/modifiers";
// import { useItemStore } from "../stores/useItemStore";
// import { usePageStore } from "../stores/usePageStore";
import ItemRenderer from "./PageComponent/ItemRenderer";
import { useItemStore } from "./stores/useItemStore";
import { usePageStore } from "./stores/usePageStore";
import { usePresHistory } from "./stores/usePresHistoryStore";

const gridSize = 1; // pixels
const snapToGridModifier = createSnapModifier(gridSize);

const NewPresentationPage = ({data, ancestors}) => {
  const [activeId, setActiveId] = useState(null);
  const [activeData, setActiveData] = useState(null);
  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const sensors = useSensors(mouseSensor);
  const { items, setSelectedItem, handleDrop,setItems } = useItemStore();
  // const {undo, redo,clear} =useItemStore.temporal.getState()
  const { selectedPage, setPages,setSelectedPage,setPageSetup } = usePageStore();
  const {addHistory,resetHistory} = usePresHistory()
	useEffect(() => {
		return () => { resetHistory() }
	  }, [])
  useEffect(()=>{
    if(data?.pages && data?.items){      
      const newItems =data?.items?.map((item)=>{
        const {icon, itemSvg, ...restItem} = item
        return restItem
      })
      setPages(data?.pages)
      setItems(newItems)
    } else {
      setPages([{
        notes:[],
        visibility: true,
        transition: "none",
        transitionSpeed: "default",
        duration: 1
    }])
      setItems([])
      setSelectedPage({
        notes:[],
        visibility: true,
        transition: "none",
        transitionSpeed: "default",
        duration: 1
    },0)
    }
    if(data?.pageSetup){
      console.log(data?.pageSetup)
      setPageSetup(data?.pageSetup)
    } 
  },[data])
  const targetRef = React.useRef(null);
  
  return (
    <>
      <PresentationNavbar presentationName={data?.name} ancestors={ancestors}/>
      <DndContext
        // modifiers={[snapToGridModifier]}
        sensors={sensors}
        // {...props}
        
        onDragEnd={(e) => {
          console.log(e.over)
          if (
            !(
              e.active.rect.current.translated?.left ===
                e.active.rect.current.initial?.left &&
              e.active.rect.current.translated?.top ===
                e.active.rect.current.initial?.top
            ) && e.over
          ) {
            handleDrop(
              selectedPage.pageIndex,
              {
                clientX: e.active.rect.current.translated?.left,
                clientY: e.active.rect.current.translated?.top,
              },
              e.active.data.current,
              addHistory
            );
            // setDraggedItem(null);
            setSelectedItem(items.find((el) => el.id === e.active.id));
            setActiveData(null)
            setActiveId(null);
          }
        }}
        onDragStart={(e) => {
          console.log(e)
          setActiveId(e.active.id);
          // setActiveData({id:e.active.id, ...e.active.data.current});s
        }}
      >
        <div className="flex justify-between overflow-hidden" ref={targetRef}>
          <PageComponent orientation = {data?.pageSetup?.orientation} />
          <SideBar />
          {activeId &&
            createPortal(
              <DragOverlay>
                {activeId ? (
                  <ItemRenderer
                    item={items.find((el) => el.id === activeId)}
                    fromOverlay={true}
                  />
                ) : null}
              </DragOverlay>,
              document.body
            )}
        </div>
      </DndContext>
    </>
  );
};

export default NewPresentationPage;
