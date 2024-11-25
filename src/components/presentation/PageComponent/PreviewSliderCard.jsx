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
import { getSVG } from "../../Template/shapes/shapeSvgConstants";
import PresentationItemRenderer from "../PresentationView/PresentationItemRenderer";
import { useRouter } from "next/router";
const PreviewSliderCard = ({
  index,
  page,
  items,
  selectedPage,
  pageSetup,
  selectionChange,
}) => {
  console.log(items);
  // const [selectedPage,setSelectedPage] =useState(selected)

  const { deletePageItems, shiftItemsPage, setItems, setSelectedItem } =
    useItemStore();

  const [pageItem, setPageItem] = useState([]);
  useEffect(() => {
    const temp = items.map((item) => {
      if (item?.type === "shape") {
        console.log(item.size);
        return {
          ...item,
          itemSvg: getSVG(
            item?.title,
            item?.options,
            item?.size,
            item?.orientation,
            false,
            pageSetup?.size
          ),
        };
      } else {
        return item;
      }
    });
    setPageItem(temp);
  }, [items]);

  const [isHovered, setIsHovered] = useState(false);

  const [input, setInput] = useState(0);

  console.log(page?.pageNo);
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
      <Card
        style={{
          ...style,
          // display:page?.visibility===true?"flex":"none",
          border:
            selectedPage?.pageIndex ===index 
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
          selectionChange(page,index)
          // setSelectedPage(page, index);
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
          className="overflow-hidden p-0"
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
            {pageItem?.length > 0 &&
              pageItem
                ?.filter((item) => item?.pageIndex === page?.pageNo-1)
                ?.map((item, index) => {
                  return (
                    <PresentationItemRenderer
                      key={index}
                      item={item}
                      // fromOverlay={true}
                      fromPreview={true}
                      pageSize={pageSetup?.size}
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

export default PreviewSliderCard;
