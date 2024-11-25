import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { usePageStore } from "../stores/usePageStore";
import { useItemStore } from "../stores/useItemStore";
import {
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Trash,
  Triangle,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ItemRenderer from "./ItemRenderer";
import { usePresHistory } from "../stores/usePresHistoryStore";
const SliderCard = ({ index, page }) => {
  const {
    selectedPage,
    setSelectedPage,
    deleteAtIndex,
    setVisibility,
    addAtIndex,
    isDuration,
    isPlay,
    setIsPlay,
    pageSetup,
    duplicatePage,
    pages,
  } = usePageStore();
  const { deletePageItems, shiftItemsPage, items, setItems, setSelectedItem } =
    useItemStore();
    const {addHistory} = usePresHistory()
  const [isHovered, setIsHovered] = useState(false);
  const [pageItems, setPageItems] = useState([]);
  const [input, setInput] = useState(0);
  useEffect(() => {
    console.log(items)
    setPageItems(items.map((item)=>({...item,id:crypto.randomUUID()})));
  }, [items]);
  const deletePage = (index) => {
    deleteAtIndex(index);
    deletePageItems(index);
  };
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: index,
      data: page,
      disabled: true,
      transition: {
        duration: 500,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleDuplicatePage = (index) => {
    duplicatePage(index);
    // addHistory(index,"page","add")
    addHistory(index,"page","duplicate")
    const newPageItems = [...items]
      .filter((item) => item.pageIndex === index)
      .map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        pageIndex: index + 1,
      }));
    const updatedItems = items.map((item) => {
      if (item.pageIndex <= index) {
        return item;
      } else {
        return { ...item, pageIndex: item.pageIndex + 1 };
      }
    });
    setItems([...updatedItems, ...newPageItems]);
  };
  const inputRef = useRef(0);
  const currentMaxRef = useRef(0);
  useEffect(() => {
    inputRef.current = input;
  }, [input]);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <Popover
        classNames={{
          content: "rounded-none px-0",
        }}
      >
        <PopoverTrigger>
          {isHovered ? (
            <Button
              variant="light"
              radius="full"
              className="absolute top-1 right-3 min-w-3 max-w-3 h-5 "
              onClick={()=>setSelectedPage(page,index)}
            >
              <>
                <span>
                  <MoreHorizontal size={18} />
                </span>
              </>
            </Button>
          ) : (
            <>
              <div className="w-full flex justify-between items-end absolute bottom-0 left-0 z-10">
              <span className="text-sm font-bold flex ps-1 pb-1 w-8 h-8 justify-start items-end" style={{
                background:"radial-gradient(100% 120% at 0% 120%, rgba(253, 251, 251, 0.8) 55%, rgba(0, 0, 0, 0))"
              }}>{isDuration ? `${page?.duration || 5}s` :index + 1}</span>
            </div>
          </>
          )}
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col">
            <Button
              startContent={<Plus size={16} />}
              radius="none"
              variant="light"
              className="w-full justify-start"
              onPress={() => {
                addAtIndex(index + 1);
                addHistory(index +1,"page","add")
                shiftItemsPage(index, 1);
              }}
            >
              Add Page After
            </Button>
            <Button
              startContent={<Plus size={16} />}
              radius="none"
              variant="light"
              className="w-full justify-start"
              onPress={() => {
                addAtIndex(index);
                addHistory(index ,"page","add")
                // setSelectedPage(page, index + 1);
                shiftItemsPage(index - 1, 1);
              }}
            >
              Add Page Before
            </Button>
            {!page?.visibility ? (
              <Button
                startContent={<Eye size={16} />}
                radius="none"
                variant="light"
                className="w-full justify-start"
                onPress={() => {
                  setVisibility(index, true)
                  addHistory(index,"page","visible",true)
                }}
              >
                Unhide page
              </Button>
            ) : (
              <Button
                startContent={<EyeOff size={16} />}
                radius="none"
                variant="light"
                className="w-full justify-start"
                onPress={() => {
                  setVisibility(index, false)
                  addHistory(index,"page","visible",false)
                }}
              >
                Hide page
              </Button>
            )}
            <Button
              startContent={<Copy size={16} />}
              radius="none"
              variant="light"
              className="w-full justify-start"
              onPress={() => {
                handleDuplicatePage(index)
              }}
            >
              Duplicate Page
            </Button>
            <Button
              isDisabled={pages.length=== 1}
              startContent={<Trash size={16} />}
              radius="none"
              variant="light"
              className="w-full justify-start"
              onPress={() => {
                deletePage(index)
                shiftItemsPage(index,-1)
                addHistory(index,"page","delete",null,null,items)
              }}
            >
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Card
        style={{
          ...style,
          border:
            selectedPage?.pageIndex === index
              ? "2px solid #05686E"
              : isHovered
              ? "2px solid #05686E70"
              : "2px solid #05686E00",
        }}
        className="cursor-pointer"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        radius="none"
        isPressable
        onPress={() => {
          setSelectedItem(null);
          setSelectedPage(page, index);
        }}
      >
        <CardBody
          style={{
            // minHeight:
            //   pageSetup?.orientation === "landscape"
            //     ? pageSetup?.size?.height?.split("px")[0] * 0.15
            //     : pageSetup?.size?.width?.split("px")[0] * 0.15,
            aspectRatio: (pageSetup?.orientation)=== "landscape" ? "16 /9" : "9/16",
            minHeight:pageSetup?.size?.height?.split("px")[0] * 0.145,
            minWidth: pageSetup?.size?.width?.split("px")[0] * 0.145,
            maxHeight:pageSetup?.size?.height?.split("px")[0] * 0.145,
            maxWidth: pageSetup?.size?.width?.split("px")[0] * 0.145,
          }}
          className="h-[100px]   min-w-[170px] max-w-[150px] overflow-hidden p-0"
        >
          {" "}
          <div
            className="origin-top-left scale-[0.148] relative"
            id={`pagePreview-${index}`}
            style={{
              minHeight:pageSetup?.size?.height,
              minWidth:pageSetup?.size?.width,
              height:pageSetup?.size?.height,
              width:pageSetup?.size?.width,
            }}
          >
            {items?.length > 0 &&
              items
                ?.filter((item) => item?.pageIndex === index)
                ?.map((item, index) => {
                  // console.log(item)
                  return (
                    <ItemRenderer
                      key={index}
                      item={item}
                      // fromOverlay={true}
                      fromPreview={true}
                    />
                  );
                })}
          </div>
          {/* <span>{index+1}</span> */}
        </CardBody>
      </Card>
    </div>
  );
};

export default SliderCard;
