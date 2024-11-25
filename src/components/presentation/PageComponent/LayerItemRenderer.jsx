import React, { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { getSVG } from "../../Template/shapes/shapeSvgConstants";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { useItemStore } from "../stores/useItemStore";
import { usePageStore } from "../stores/usePageStore";

const LayerItemRenderer = ({ item }) => {
    const { items } =
    useItemStore();

  switch (item.type) {
    case "text":
      return <TextField key={item.id} item={item} items={items} />;
    case "image":
      return <ImageField key={item.id} item={item} items={items} />;
    case "avatar":
      return <AvatarField key={item.id} item={item} items={items} />;
    case "video":
      return <VideoField key={item.id} item={item} items={items} />;
    case "shape":
      return <ShapeField key={item.id} item={item} items={items} />;
    default:
      return <></>;
  }
};

export default LayerItemRenderer;

export function TextField({ item }) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = item.html;
    const innerText = tempElement.textContent || tempElement.innerText;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        draggable={true}
        className="w-full flex"
      >
        <div className="flex items-center w-full">
          <div className="justify-start flex items-center">
            <GripVertical />
          </div>
          <div
           className="h-[50px] w-full flex justify-center max-w-[165px] flex-2 items-center"
           >
            <div className="truncate">

            {innerText.trim()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export function ImageField({ item }) {
    console.log(item);
    const [isDraggable, setIsDraggable] = useState(true);
  
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: item.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    const [options, setOptions] = useState(item.options);
  
    return (
      <>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          draggable={true}
          className="w-full flex"
        >
          <div className="flex w-full">
            <div className="justify-start flex items-center">
              <GripVertical />
            </div>
  
            <div
              style={{
                transform: ` rotate(${options?.rotation || 0}deg)`,
                height: "50px",
              }}
              className="flex justify-center flex-2 w-full"
            >
              <img
                src={item?.link ? item?.link : URL.createObjectURL(item?.file)}
                alt=""
                style={{
                  height: "100%",
                //   width: "100%",
                }}
                className="block cursor-move"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
export function ShapeField({ item }) {
  console.log(item.size);
  const [size, setSize] = useState(item.size);
  const [isDraggable, setIsDraggable] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { selectedPage, pagePercent , pageSetup} = usePageStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [svg, setSvg] = useState(
    getSVG(item.title, item.options, item.size, item?.orientation,false, pageSetup?.size)
    // getSVG(
    //   item.title,
    //   item.options,
    //   item.size,
    //   item?.orientation,
    //   false,
    //   null,
    //   item.id
    // )
  );
  const [options, setOptions] = useState(item.options);

  useEffect(() => {
    setSvg(
      getSVG(item.title, item.options, item.size, item?.orientation,false, pageSetup?.size)
      // getSVG(item.title, options, size, item?.orientation, false, null, item.id)
    );
    
  }, [size, options]);
  console.log(svg)
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        draggable={true}
        className="w-full flex"
      >
        <div className="flex items-center w-full">
          <div className="justify-start flex items-center">
            <GripVertical />
          </div>
          <div
            style={{
              transform: `scale(0.18) rotate(${options?.rotation || 0}deg)`,
              height: "50px",
              width: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex:'2',
            }}
          >
            {svg}
          </div>
        </div>
      </div>
    </>
  );
}
export function VideoField({ item }) {
  console.log("item", item.ref);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        draggable={true}
        className="w-full flex"
      >
        <div className="flex items-center">
          <div className="justify-start flex items-center">
            <GripVertical />
          </div>
          <div className="h-[50px] flex justify-center flex-2 w-full">
          {item.link && (
          <video
            className="rounded-xl"
            // autoPlay
            controls
            // width={item.size.width}
            // height={item.size.height}
            poster={item?.thumbnailLink || item?.thumbnailLink}
          >
            <source src={item?.link} />
            {/* <source src="movie.ogg" type="video/ogg"> */}
            Your browser does not support the video tag.
          </video>
        )}
          </div>
        </div>
      </div>
    </>
  );
}
export function AvatarField({ item }) {
  console.log("item", item.ref);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        draggable={true}
        className="w-full flex"
      >
        <div className="flex items-center w-full">
          <div className="justify-start flex items-center">
            <GripVertical />
          </div>
          <div className="h-[50px] flex justify-center flex-2 w-full">
          {item?.image &&
            <img
            src={item?.image}
            alt=""
            style={{
              height: "100%",
            //   width: "100%",
              opacity: item?.options?.opacity,
              borderRadius: `${parseInt(item?.options?.radius)}px`,
          }}
            className="block cursor-move"
            />
        }
          </div>
        </div>
      </div>
    </>
  );
}
