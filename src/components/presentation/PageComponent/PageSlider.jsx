import React, { useEffect, useRef, useState } from "react";
import { usePageStore } from "../stores/usePageStore";
import { Button, Card, CardBody, Slider } from "@nextui-org/react";
import {
  ChevronDown,
  Minus,
  Pause,
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
import { usePresHistory } from "../stores/usePresHistoryStore";

const PageSlider = ({orientation}) => {
  const {
    pages,
    addPage,
    setPages,
    setSelectedPage,
    isDuration,
    setIsDuration,
    selectedPage,
    pagePercent,
    setPagePercent,
    pageSetup,
    IsDraggings,
    setIsDragginginStore
  } = usePageStore();
  const { handlePageDropItem, items, setSelectedItem } = useItemStore();
  const {addHistory} = usePresHistory() 
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
    const pageIndex = Math.floor(input / 5);
    const duration = pages[pageIndex]?.duration || 5;
    const increment = (5 * 0.1) / duration;
    incrementRef.current = increment;
    console.log(increment, duration);
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
  useEffect(() => {
    const pageIndex = Math.floor(input / 5);
    if (pageIndex !== selectedPage?.pageIndex && pageIndex !== pages?.length) {
      setSelectedPage(pages[pageIndex], pageIndex);
    }
  }, [input]);
  useEffect(() => {
    let interval;

    if (isPlay) {
      interval = setInterval(() => updateInput(), 100);
    }

    return () => clearInterval(interval);
  }, [isPlay]);
  useEffect(()=>{
    setIsPlay(false)
  },[IsDraggings])
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
                    {pages && isDuration && (
                      <>
                        <Button
                          onPress={() => setIsPlay((prev) => !prev)}
                          size="lg"
                          variant="faded"
                          isIconOnly
                          className="bg-[#EEEEEE] rounded-full ms-2 absolute top-8 left-2 z-50"
                        >
                          {isPlay ? <Pause size={18} /> : <Play size={18} />}
                        </Button>

                        <Slider
                          size="sm"
                          value={input}
                          onChange={setInput}
                          color="transparent"
                          minValue={0}
                          maxValue={pages.length * 5}
                          step={0.1}
                          style={{ width: orientation==='portrait'? pages.length  * 104.325 : pages.length * 168.869 }}
                          // valueLabelDisplay="auto"
                          className="w-[2000px] absolute left-[70px] top-0"
                          classNames={{
                            base: "transition-all",
                            track: "bg-transparent",
                            filler: "bg-transparent opacity-0",
                            // thumb: [
                            //   "transition-all",
                            //   "bg-gradient-to-r from-secondary-400 to-primary-500",
                            //   "shadow-lg dark:shadow-black/20",
                            //   "w-7 h-7 after:h-6 after:w-6",
                            // ],
                          }}
                          renderThumb={(props) => (
                            <div
                              {...props}
                              className={`absolute transition-all flex flex-col items-center ${orientation === 'portrait'? 'top-[75px]': 'top-[45px]'}  z-2`}
                            >
                              {/* {Math.floor(input)} */}
                              <Triangle
                                size={16}
                                className="rotate-180"
                                fill="#E8731C"
                                stroke="#E8731C"
                              />
                              <span className={`w-[2px] bg-black ${orientation === 'portrait'? 'h-[150px]': 'h-[90px]'} `}></span>
                              {/* <span className="transition-transform bg-gradient-to-br shadow-small from-secondary-100 to-secondary-500 rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" /> */}
                            </div>
                          )}
                        />
                      </>
                    )}
                    {pages.map((page, index) => (
                      <SliderCard
                        page={page}
                        key={`sliderPage-${index}`}
                        index={index}
                      />
                    ))}
                    <DragOverlay>
                      {activeId ? (
                        <SliderCard page={pages[activeId]} index={activeId} />
                      ) : null}
                    </DragOverlay>
                  </SortableContext>
                  <Card
                    radius="none"
                    className="cursor-pointer   z-50"
                    style={{
                      // minHeight:
                      //   pageSetup?.orientation === "landscape"
                      //     ? pageSetup?.size?.height?.split("px")[0] * 0.15
                      //     : pageSetup?.size?.width?.split("px")[0] * 0.15,
                      aspectRatio: (pageSetup?.orientation)=== "landscape" ? "16 /9" : "9/16",
                      minHeight:pageSetup?.size?.height?.split("px")[0] * 0.14,
                      minWidth: pageSetup?.size?.width?.split("px")[0] * 0.14,
                      maxHeight:pageSetup?.size?.height?.split("px")[0] * 0.14,
                      maxWidth: pageSetup?.size?.width?.split("px")[0] * 0.14,
                    }}
                  >
                    <CardBody
                      onClick={() => {
                        addPage();
                        addHistory(pages.length,"page","add",null,null,items)
                      }}
                      radius="none"
                      
                      className="h-[100px] overflow-hidden p-0 flex justify-center items-center bg-[#eee] border-white"
                    
                    >
                      <PlusCircle />
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
            <div className="flex justify-between py-1 px-2">
              <Button
                onPress={() => setIsDuration(!isDuration)}
                color="primary"
                size="sm"
                variant={isDuration ? "bordered" : "light"}
                startContent={<PlaySquare />}
              >
                Duration
              </Button>
              <Slider
                aria-label="Volume"
                size="sm"
                color="primary"
                value={pagePercent}
                onChange={setPagePercent}
                step={0.5}
                maxValue={500}
                minValue={10}
                classNames={{
                  startContent: "w-full flex justify-end",
                }}
                startContent={
                  <span className="border-r-2 border-[#00000070] text-[14px] pe-2">
                    Page {selectedPage?.pageIndex + 1}/{pages.length}
                  </span>
                }
                endContent={
                  <span className=" text-[14px]">{pagePercent}%</span>
                }
                className="max-w-md"
              />
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

export default PageSlider;
