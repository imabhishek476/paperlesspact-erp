import React, { useEffect, useRef, useState } from "react";
import { usePageStore } from "../stores/usePageStore";
import { Button, Card, CardBody, Slider } from "@nextui-org/react";
import {
  ChevronDown,
  Minus,
  Play,
  PlaySquare,
  Plus,
  PlusCircle,
  Triangle,
  Video,
  Youtube,
} from "lucide-react";
import SliderCard from "./SliderCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useItemStore } from "../stores/useItemStore";
import PreviewSliderCard from "./PreviewSliderCard";

const PreviewPageSlider = ({pages,items,pageSetup, selectedPage, selectionChange }) => {
  const {
    
    addPage,
    setPages,
    
    isDuration,
    setIsDuration,
    
    pagePercent,
    setPagePercent
  } = usePageStore();
  
  console.log(pages)
  const { handlePageDropItem,  } = useItemStore();
  const [isSliderOpen, setIsSliderOpen] = useState(true);
  const [isPlay, setIsPlay] = useState(false);
  const [input, setInput] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [width, setWidth] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const inputRef = useRef(0);
  const incrementRef = useRef(0.1);
  useEffect(() => {
    inputRef.current = input;
    const pageIndex = Math.floor(input/5)
    const duration = pages[pageIndex]?.duration || 5
    const increment =5 * 0.1 / duration
    incrementRef.current = increment
    console.log(increment, duration)
  }, [input]);
  const updateInput = () => {
    if (parseInt(inputRef.current) === pages.length * 5) {
      setInput(0);
      inputRef.current = 0;
      setIsPlay(false);
    } else {
      setInput(inputRef.current + incrementRef.current);
      // setInput((prevInput) => (prevInput + 4));
    }
  };
  useEffect(()=>{
    const pageIndex = Math.floor(input/5)
    if(pageIndex !== selectedPage?.pageIndex && pageIndex !== pages?.length){
      setSelectedPage(pages[pageIndex],pageIndex)
    }
  },[input])

  

  useEffect(() => {
    let interval;

    if (isPlay) {
      interval = setInterval(() => updateInput(), 100);
    }

    return () => clearInterval(interval);
  }, [isPlay]);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={(e) => setActiveId(e?.active?.id)}
    >
      <>
        {!isSliderOpen && (
          <div
            onClick={() => setIsSliderOpen((prev) => !prev)}
            style={{
              backgroundColor: isSliderOpen ? "white" : "#05686E",
              bottom: isSliderOpen ? "116.5px" : "0px",
              color: isSliderOpen ? "#05686E" : "white",
            }}
            className="absolute z-10 left-[calc(50%-2rem)] px-8 rounded-t-3xl cursor-pointer py-1 border-t-2 border-[#05686E80] border-x-2 bg-white"
          >
            <ChevronDown
              size={12}
              className={`transition-all duration-1000 ${
                !isSliderOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        )}
        {isSliderOpen && (
          <div className="flex flex-col pt-[22px]  w-full ">
            <div className="flex w-full justify-center">
              <div
                onClick={() => setIsSliderOpen((prev) => !prev)}
                style={{
                  backgroundColor: isSliderOpen ? "white" : "#05686E",
                  top: "-22px",
                  color: isSliderOpen ? "#05686E" : "white",
                }}
                className="px-8 rounded-t-3xl cursor-pointer py-1 border-t-2 border-x-2 bg-white"
              >
                <ChevronDown
                  size={12}
                  className={`transition-all duration-1000 ${
                    !isSliderOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
            <div className="overflow-x-auto relative bg-white border-t-2 z-10">
              <div className="flex flex-col">
                <div
                  style={{
                    paddingLeft: isDuration ? "80px" : "20px",
                  }}
                  className="flex items-center relative gap-4  py-4  transition-all"
                >
                  <SortableContext
                    items={pages}
                    strategy={horizontalListSortingStrategy}
                  >
                    {pages.map((page, index) => {
                      return(
                      <PreviewSliderCard
                      page={page}
                      key={`sliderPage-${index}`}
                      index={index}
                      items={items}
                      selectedPage={selectedPage}
                      pageSetup={pageSetup}
                      selectionChange={selectionChange}
                    />
                    )})}
                    <DragOverlay>
                      {activeId ? (
                        <PreviewSliderCard page={pages[activeId]} index={activeId} />
                      ) : null}
                    </DragOverlay>
                  </SortableContext>
                  {/* <Card className="cursor-pointer  min-w-[150px] max-w-[150px] aspect-video z-50">
                    <CardBody
                      onClick={() => {
                        addPage();
                      }}
                      className="flex justify-center items-center bg-[#eee] border-white"
                    >
                      <PlusCircle />
                    </CardBody>
                  </Card> */}
                </div>
              </div>
            </div>
           
          </div>
        )}
      </>
    </DndContext>
  );
  function handleDragEnd(event) {
    const { active, over } = event;
    console.log(active?.id, over?.id);
    if (active?.id && over?.id && active?.id !== over?.id) {
      const newPages = arrayMove(pages, active.id, over.id);
      setPages(newPages);
      handlePageDropItem(over.id, active.id);
      setSelectedPage(pages[over.id], over.id);
    }
    setActiveId(null);
  }
};

export default PreviewPageSlider;
