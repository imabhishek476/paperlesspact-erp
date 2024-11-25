import React, { useEffect, useRef, useState } from "react";
import { Resizable } from "re-resizable";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignStartHorizontal,
  AlignVerticalJustifyStart,
  BringToFront,
  ChevronsDown,
  ChevronsUp,
  Circle,
  Copy,
  CopyPlus,
  Dot,
  Minus,
  Plus,
  RefreshCw,
  SendToBack,
  Settings,
  Slash,
  Square,
  Trash2,
  X,
} from "lucide-react";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from "@nextui-org/react";
import { getSVG } from "../shapes/shapeSvgConstants";
import { renderToString } from "react-dom/server";
import ResizeHandlers from "./ResizeHandlers";
import { useTabsStore } from "../stores/useDocTabsStore";
import { usePageDataStore } from "../stores/usePageDataStore";

import { useDocItemStore } from "../stores/useDocItemStore";

import { useDocHistory } from "../stores/useDocHistoryStore";
import { useDebounce } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CodeActionMenuPlugin/utils";


const colors = [
  "#000000",
  "#ff3131",
  "#004aad",
  "#00bf63",
  "#ff914d",
  "#05686E",
];

const angles = ["0", "90", "180", "270"];
const ShapeField = ({
  item,
  updateItem,
  items,
  setSelectedItem,
  handleRemoveItem,
  sharedItems,
  updateSharedItem,
  update,
  setUpdate,
  setItemClicked,
  setMenuItem,
  setMenuOpen,
}) => {
  const { addHistory } = useDocHistory();
  const [size, setSize] = useState(item.size);
  const [isDraggable, setIsDraggable] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { isEditable } = usePageDataStore();
  const { setItems } = useDocItemStore();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      disabled: !isDraggable,
    });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };
  const [svg, setSvg] = useState(
    getSVG(
      item.title,
      item.options,
      item.size,
      item?.orientation,
      false,
      null,
      item.id
    )
  );
  const [options, setOptions] = useState(item.options);
  useEffect(() => {
    const newSvg = getSVG(
      item.title,
      item.options,
      item.size,
      item?.orientation,
      false,
      null,
      item.id
    );
    setSvg(newSvg);
  }, [item]);
  // useEffect(() => {
  //   setSvg(getSVG(item.title, options, size, item?.orientation,false,null,item.id));
  //   if (sharedItems) {
  //     updateSharedItem(sharedItems, {
  //       ...item,
  //       svg: renderToString(
  //         getSVG(item.title, options, size, item?.orientation,false,null,item.id)
  //       ),
  //       size: size,
  //       options: options,
  //     });
  //   } else {
  //     updateItem({...item,
  //       svg: renderToString(
  //         getSVG(
  //           item.title,
  //           options,
  //           { height: size.height, width: size.width },
  //           item?.orientation,
  //           false,
  //           null,
  //           item.id
  //         )
  //       ),
  //       size: size,
  //       options: options,
  //     })
  //   }
  // }, []);
  if (!item.svg) {
    updateItem({
      ...item,
      svg: renderToString(
        getSVG(
          item.title,
          options,
          { height: size.height, width: size.width },
          item?.orientation,
          false,
          null,
          item.id
        )
      ),
      size: size,
      options: options,
    });
  }

  const [rotationDeg, setRotationDeg] = useState(0);
  const [mouseOffset, setMouseOffset] = useState(0);
  const onMouseUp = (e) => {
    console.log(e);

    if (document) {
      document.onmousemove = null;
      document.onmouseup = null;
    }
    setIsHovered(false);
  };
  const onMouseMove = (e) => {
    const diffX = e.clientX - mouseOffset[0];
    const diffY = e.clientY - mouseOffset[1];
    let angle = Math.atan2(diffY, diffX) * (180 / Math.PI);
    if (angle < 0) {
      angle += 360;
    }
    setIsHovered(true);
    setOptions((prev) => {
      return {
        ...prev,
        rotation: angle.toString(),
      };
    });
    updateItem({
      ...item,
      options: {
        ...item.options,
        rotation: angle.toString(),
      },
    });
    addHistory(
      {
        ...item,
        options: {
          ...item.options,
          rotation: angle.toString(),
        },
      },
      "item",
      "update",
      item
    );
  };
  const onMouseDown = (e) => {
    setMouseOffset([e.clientX, e.clientY]);
    setIsHovered(true);
    if (document) {
      document.onmousemove = onMouseMove;
      document.onmouseup = onMouseUp;
    }
  };
  const handleDotWidthChange = (e) => {
    updateItem({
      ...item,
      options: {
        ...item.options,
        dotWidth: e.toString(),
      },
      svg:renderToString(
        getSVG(
          item.title,
          {
            ...item.options,
            dotWidth:e.toString(),
          },
          item.size,
          item?.orientation,
          false,
          null,
          item.id
        )
      )
    });
    addHistory(
      {
        ...item,
        options: {
          ...item.options,
          dotWidth: e.toString(),
        },
        svg:renderToString(
          getSVG(
            item.title,
            {
              ...item.options,
              dotWidth:e.toString(),
            },
            item.size,
            item?.orientation,
            false,
            null,
            item.id
          )
        )
      },
      "item",
      "update",
      item
    );
  };
  const handleBorderChange = (e) => {
    updateItem({
      ...item,
      options: {
        ...item.options,
        borderWeight: e.toString(),
      },
      svg:renderToString(
        getSVG(
          item.title,
          {
            ...item.options,
            borderWeight:e.toString(),
          },
          item.size,
          item?.orientation,
          false,
          null,
          item.id
        )
      )
    });
    addHistory(
      {
        ...item,
        options: {
          ...item.options,
          borderWeight: e.toString(),
        },
        svg:renderToString(
          getSVG(
            item.title,
            {
              ...item.options,
              borderWeight:e.toString(),
            },
            item.size,
            item?.orientation,
            false,
            null,
            item.id
          )
        )
      },
      "item",
      "update",
      item
    );
  };
  const handleDotGapChange = (e) => {
    updateItem({
      ...item,
      options: {
        ...item.options,
        dotGap: e.toString(),
      },
      svg:renderToString(
        getSVG(
          item.title,
          {
            ...item.options,
            dotGap:e.toString(),
          },
          item.size,
          item?.orientation,
          false,
          null,
          item.id
        )
      )
    });
    addHistory(
      {
        ...item,
        options: {
          ...item.options,
          dotGap: e.toString(),
        },
        svg:renderToString(
          getSVG(
            item.title,
            {
              ...item.options,
              dotGap:e.toString(),
            },
            item.size,
            item?.orientation,
            false,
            null,
            item.id
          )
        )
      },
      "item",
      "update",
      item
    );
  };
  const handleBorderRadiuss = (e) => {
    updateItem({
      ...item,
      options: {
        ...item.options,
        radius: e.toString(),
      },
      svg:renderToString(
        getSVG(
          item.title,
          {
            ...item.options,
            radius:e.toString(),
          },
          item.size,
          item?.orientation,
          false,
          null,
          item.id
        )
      )
    });
    addHistory(
      {
        ...item,
        options: {
          ...item.options,
          radius: e.toString(),
        },
        svg:renderToString(
          getSVG(
            item.title,
            {
              ...item.options,
              radius:e.toString(),
            },
            item.size,
            item?.orientation,
            false,
            null,
            item.id
          )
        )
      },
      "item",
      "update",
      item
    );
  };
  const handleRotationChange = (e) => {
    updateItem({
      ...item,
      options: {
        ...item.options,
        rotation: e.target.value,
      },
      svg:renderToString(
        getSVG(
          item.title,
          {
            ...item.options,
            rotation:e.target.value,
          },
          item.size,
          item?.orientation,
          false,
          null,
          item.id
        )
      )
    });
    addHistory(
      {
        ...item,
        options: {
          ...item.options,
          rotation: e.target.value,
        },
        svg:renderToString(
          getSVG(
            item.title,
            {
              ...item.options,
              rotation:e.target.value,
            },
            item.size,
            item?.orientation,
            false,
            null,
            item.id
          )
        )
      },
      "item",
      "update",
      item
    );
  };
  const updateBorderWidth = useDebounce(handleBorderChange, 300);
  const updateDotWidth = useDebounce(handleDotWidthChange, 300);
  const updateDotGap = useDebounce(handleDotGapChange, 300);
  const updateBorderRadius = useDebounce(handleBorderRadiuss, 300);
  const updateRotation = useDebounce(handleRotationChange, 300);
  console.log(item);
  return (
    <>
      <Resizable
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        lockAspectRatio={
          item.title === "Circle" ||
          item.title === "Square" ||
          item.title === "Pentagon" ||
          item.title === "Octagon" ||
          item.title === "Hexagon"
        }
        size={
          sharedItems
            ? { height: item.height, width: item.width }
            : { height: item.size.height, width: item.size.width }
        }
        enable={{
          top: isEditable,
          left: isEditable,
          bottom: isEditable,
          right: isEditable,
          topLeft: isEditable,
          topRight: isEditable,
          bottomLeft: isEditable,
          bottomRight: isEditable,
        }}
        onResizeStop={(e, direction, ref, d) => {
          console.log(item);
          const width = item.size.width + d.width;
          const height = item.size.height + d.height;
          updateItem({
            ...item,
            svg: renderToString(
              getSVG(
                item.title,
                options,
                { height: height, width: width },
                item?.orientation,
                false,
                null,
                item.id
              )
            ),
            size: { width: width, height: height },
            options: item.options,
          });
          addHistory(
            {
              ...item,
              svg: renderToString(
                getSVG(
                  item.title,
                  options,
                  { height: height, width: width },
                  item?.orientation,
                  false,
                  null,
                  item.id
                )
              ),
              size: { width: width, height: height },
              options: options,
            },
            "item",
            "update",
            item
          );
          // if (!sharedItems) {
          //   setSize((prev) => {
          //     const width = prev.width + d.width;
          //     return {
          //       width: prev.width + d.width,
          //       height: prev.height + d.height,
          //     };
          //   });
          // } else {
          //   updateSharedItem(sharedItems, {
          //     ...item,
          //     width: item.width
          //       ? item?.width + d.width > 700
          //         ? item?.width + d.width
          //         : item?.width + d.width
          //       : 300 + d.width,
          //     height: item.height ? item?.height + d.height : 50 + d.height,
          //   });
          // }
        }}
        onResizeStart={(e) => {
          console.log(e);
          setMenuOpen(false);
          setItemClicked(false);
        }}
        boundsByDirection
        style={{
          position: "absolute",
          top: item.position.y,
          left: item.position.x,
          zIndex: item?.layer + 1 || 1,
          resize: "horizontal",

          // position:'relative'
        }}
        className="resizableItem"
      >
        {!isDragging && isHovered && isEditable && <ResizeHandlers />}

        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setItemClicked(true);
            setMenuItem(item);
          }}
          //   key={item.id}
          style={{
            top: item.position.y,
            left: item.position.x,
            // width: '17%',
            // height: '3.6%',
            // resize:"horizontal",
            ...style,
            overflow: "hidden",
            border:
              (isHovered || isDragging) && isEditable
                ? "3px solid #e8713c"
                : "3px solid #e8713c00",
            // backgroundColor: 'rgba(0, 112, 240, 0.2)',
            cursor: "grab",
            // position:'relative'
            background: item.svg && `url(${item.svg})`,
            // transform: `rotate(${options.rotation}deg)`
          }}
          id={item.id}
          // draggable="true"

          // onDragStart={(e) => setSelectedFieldItem({ ...item, size })}
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className={` w-full h-full text-[#151513] z-[49]  hover:cursor-pointer`}
          onClick={() => setSelectedItem(item)}
          onBlur={() => {
            const keyboardEvent = new KeyboardEvent("keydown", {
              code: "Escape",
              key: "Escape",
              charCode: 13,
              keyCode: 13,
              view: window,
              bubbles: true,
            });
            document.dispatchEvent(keyboardEvent);
          }}
        >
          {isHovered && isEditable && (
            <span className="absolute  w-[calc(100%-2px)] top-[-22.7px]  flex justify-end ">
              <p className="flex gap-2 h-fit bg-[#e8713c] text-[11px] text-white px-[6px] py-[2px] ">
                {item.title ? item.title : "Free Textfield"}
                <span
                  className=" hover:cursor-pointer"
                  //   onClick={() => handleRemoveItem(item)}
                >
                  <Popover
                    classNames={{
                      content: "rounded-[2px] pr-0",
                    }}
                  >
                    <PopoverTrigger>
                      <Settings className="w-4 h-4 text-black hover:text-white bg-[#e8713c]" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="grid grid-cols-1 max-h-[400px] overflow-y-auto gap-6 px-1 pr-2 py-2">
                        {item.options?.bgColor && (
                          <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
                            <div className="flex">
                              <Input
                                variant="underlined"
                                label={"Background Color"}
                                labelPlacement="outside-left"
                                size="md"
                                className="!bg-transparent relative w-full m-0 !p-0"
                                radius="none"
                                maxLength={7}
                                classNames={{
                                  inputWrapper: "h-full shadow-none",
                                  innerWrapper: "p-0 m-0",
                                }}
                                // autoFocus
                                defaultValue={
                                  options.bgColor && options.bgColor
                                }
                                value={
                                  !sharedItems
                                    ? item.options.bgColor
                                    : options.bgColor
                                }
                                onChange={(e) => {
                                  if (e.target.value !== "") {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        bgColor: e.target.value,
                                      },
                                      svg: renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            bgColor: e.target.value,
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      ),
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          bgColor: e.target.value,
                                        },
                                        svg: renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              bgColor: e.target.value,
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        ),
                                      },
                                      "item",
                                      "update",
                                      item
                                    );
                                    // setOptions(prev => ({ ...prev, bgColor: e.target.value }))
                                  }
                                  if (e.target.value.length === 6) {
                                    if (sharedItems) {
                                      updateSharedItem(sharedItems, {
                                        ...item,
                                        options: {
                                          ...options,
                                          bgColor: e.target.value,
                                        },
                                      });
                                    } else {
                                      updateItem({
                                        ...item,
                                        options: {
                                          ...item.options,
                                          bgColor: e.target.value,
                                        },
                                      });
                                      addHistory(
                                        {
                                          ...item,
                                          options: {
                                            ...item.options,
                                            bgColor: e.target.value,
                                          },
                                        },
                                        "item",
                                        "update",
                                        item
                                      );
                                      // setItems((prev) => {
                                      //   const index = prev.findIndex(
                                      //     (el) => el.id === item.id
                                      //   );
                                      //   if (index !== -1) {
                                      //     const removed = prev.splice(index, 1);
                                      //   }
                                      //   prev.push({
                                      //     ...item,
                                      //     options: {
                                      //       ...options,
                                      //       bgColor: e.target.value,
                                      //     },
                                      //   });
                                      //   //   console.log(text, item);

                                      //   return prev;
                                      // });
                                    }
                                  }
                                  // setUpdate((prev) => !prev);
                                  // setTextBoxOpen(false)
                                }}
                                onKeyDown={(event) => {
                                  event.stopPropagation();
                                }}
                              />
                            </div>
                            <div className="flex w-full justify-around gap-2">
                              <Button
                                variant="flat"
                                size="sm"
                                // style={{ backgroundColor: clr }}
                                radius="sm"
                                onPress={(e) => {
                                  updateItem({
                                    ...item,
                                    options: {
                                      ...item.options,
                                      bgColor: "#00000000",
                                    },
                                    svg: renderToString(
                                      getSVG(
                                        item.title,
                                        {
                                          ...item.options,
                                          bgColor: "#00000000",
                                        },
                                        item.size,
                                        item?.orientation,
                                        false,
                                        null,
                                        item.id
                                      )
                                    ),
                                  });
                                  addHistory(
                                    {
                                      ...item,
                                      options: {
                                        ...item.options,
                                        bgColor: "#00000000",
                                      },
                                      svg: renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            bgColor: "#00000000",
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      ),
                                    },
                                    "item",
                                    "update",
                                    item
                                  );
                                  // setOptions((prev) => {
                                  //   return {
                                  //     ...prev,
                                  //     bgColor: "#00000000",
                                  //   };
                                  // });
                                }}
                                // key={`bgClr-${index}`}
                                isIconOnly
                              >
                                <Slash size={24} className="font-red" />
                              </Button>
                              {colors.map((clr, index) => {
                                return (
                                  <Button
                                    variant="flat"
                                    size="sm"
                                    style={{ backgroundColor: clr }}
                                    radius="sm"
                                    onPress={(e) => {
                                      updateItem({
                                        ...item,
                                        options: {
                                          ...item.options,
                                          bgColor: clr,
                                        },
                                        svg: renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              bgColor: clr,
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        ),
                                      });
                                      addHistory(
                                        {
                                          ...item,
                                          options: {
                                            ...item.options,
                                            bgColor: clr,
                                          },
                                          svg: renderToString(
                                            getSVG(
                                              item.title,
                                              {
                                                ...item.options,
                                                bgColor: clr,
                                              },
                                              item.size,
                                              item?.orientation,
                                              false,
                                              null,
                                              item.id
                                            )
                                          ),
                                        },
                                        "item",
                                        "update",
                                        item
                                      );
                                      // setOptions((prev) => {
                                      //   return {
                                      //     ...prev,
                                      //     bgColor: clr,
                                      //   };
                                      // });
                                    }}
                                    key={`bgClr-${index}`}
                                    isIconOnly
                                  ></Button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {item.options?.borderColor && (
                          <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
                            <div className="flex">
                              <Input
                                variant="underlined"
                                label={"Border Color"}
                                labelPlacement="outside-left"
                                size="md"
                                className="!bg-transparent relative w-full m-0 !p-0"
                                radius="none"
                                maxLength={9}
                                classNames={{
                                  inputWrapper: "h-full shadow-none",
                                  innerWrapper: "p-0 m-0",
                                }}
                                // autoFocus
                                defaultValue={
                                  options.borderColor && options.borderColor
                                }
                                value={
                                  !sharedItems
                                    ? item.options.borderColor
                                    : options.borderColor
                                }
                                onChange={(e) => {
                                  if (e.target.value) {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        borderColor: e.target.value,
                                      },
                                      svg: renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            borderColor: e.target.value,
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      ),
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          borderColor: e.target.value,
                                        },
                                        svg: renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              borderColor: e.target.value,
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        ),
                                      },
                                      "item",
                                      "update",
                                      item
                                    );
                                    // setOptions((prev) => {
                                    //   return {
                                    //     ...prev,
                                    //     borderColor: e.target.value,
                                    //   };
                                    // });
                                  }
                                }}
                                onKeyDown={(event) => {
                                  event.stopPropagation();
                                }}
                              />
                            </div>

                            <div className="flex w-full justify-around gap-2">
                              <Button
                                variant="flat"
                                size="sm"
                                // style={{ backgroundColor: clr }}
                                radius="sm"
                                onPress={(e) => {
                                  updateItem({
                                    ...item,
                                    options: {
                                      ...item.options,
                                      borderColor: "#00000000",
                                    },
                                    svg: renderToString(
                                      getSVG(
                                        item.title,
                                        {
                                          ...item.options,
                                          borderColor: e.target.value,
                                        },
                                        item.size,
                                        item?.orientation,
                                        false,
                                        null,
                                        item.id
                                      )
                                    ),
                                  });
                                  addHistory(
                                    {
                                      ...item,
                                      options: {
                                        ...item.options,
                                        borderColor: "#00000000",
                                      },
                                      svg: renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            borderColor: e.target.value,
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      ),
                                    },
                                    "item",
                                    "update",
                                    item
                                  );
                                  // setOptions((prev) => {
                                  //   return {
                                  //     ...prev,
                                  //     borderColor: "#00000000",
                                  //   };
                                  // });
                                }}
                                // key={`bgClr-${index}`}
                                isIconOnly
                              >
                                <Slash size={24} className="font-red" />
                              </Button>
                              {colors.map((clr, index) => {
                                return (
                                  <Button
                                    variant="flat"
                                    size="sm"
                                    style={{ backgroundColor: clr }}
                                    radius="sm"
                                    onPress={(e) => {
                                      updateItem({
                                        ...item,
                                        options: {
                                          ...item.options,
                                          borderColor: clr,
                                        },
                                        svg: renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              borderColor: clr,
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        ),
                                      });
                                      addHistory(
                                        {
                                          ...item,
                                          options: {
                                            ...item.options,
                                            borderColor: clr,
                                          },
                                          svg: renderToString(
                                            getSVG(
                                              item.title,
                                              {
                                                ...item.options,
                                                borderColor: clr,
                                              },
                                              item.size,
                                              item?.orientation,
                                              false,
                                              null,
                                              item.id
                                            )
                                          ),
                                        },
                                        "item",
                                        "update",
                                        item
                                      );
                                      // setOptions((prev) => {
                                      //   return {
                                      //     ...prev,
                                      //     borderColor: clr,
                                      //   };
                                      // });
                                    }}
                                    key={`bgClr-${index}`}
                                    isIconOnly
                                  ></Button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {options?.borderWeight && (
                          <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
                            <Slider
                              label="Border Weight"
                              size="sm"
                              color="secondary"
                              maxValue={parseInt(options.maxBorderWeight) || 26}
                              value={parseInt(options.borderWeight)}
                              onChange={(e) => {
                                updateBorderWidth(e);
                                setOptions((prev) => {
                                  return {
                                    ...prev,
                                    borderWeight: e.toString(),
                                  };
                                });
                              }}
                              // onChange={(e) => {
                              //   updateItem({
                              //     ...item,
                              //     options: {
                              //       ...item.options,
                              //       borderWeight: e.toString(),
                              //     }
                              //   })
                              //   addHistory({
                              //     ...item,
                              //     options: {
                              //       ...item.options,
                              //       borderWeight: e.toString(),
                              //     }
                              //   }, "item", "update", item)

                              //   setOptions((prev) => {
                              //     return {
                              //       ...prev,
                              //       borderWeight: e.toString(),
                              //     };
                              //   })
                              // }}
                              startContent={
                                <Button
                                  isIconOnly
                                  radius="full"
                                  variant="light"
                                  onPress={() => {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        borderWeight: (
                                          parseInt(item.options.borderWeight) + 1
                                        ).toString(),
                                      },
                                      svg:renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            borderWeight: (
                                              parseInt(item.options.borderWeight) + 1
                                            ).toString(),
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      )
                                      
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          borderWeight: (
                                            parseInt(item.options.borderWeight) - 1
                                          ).toString(),
                                        },
                                        svg:renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              borderWeight: (
                                                parseInt(item.options.borderWeight) + 1
                                              ).toString(),
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        )
                                      },
                                      "item",
                                      "update",
                                      item
                                    );
                                    // setOptions((prev) => {
                                    //   return {
                                    //     ...prev,
                                    //     borderWeight: (
                                    //       parseInt(prev.borderWeight) - 1
                                    //     ).toString(),
                                    //   };
                                    // })
                                  }}
                                >
                                  <Circle fill="#000" size={10} />
                                </Button>
                              }
                              endContent={
                                <Button
                                  isIconOnly
                                  radius="full"
                                  variant="light"
                                  onPress={() => {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        borderWeight: (
                                          parseInt(item.options.borderWeight) - 1
                                        ).toString(),
                                      },
                                      svg:renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            borderWeight: (
                                              parseInt(item.options.borderWeight) + 1
                                            ).toString(),
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      )
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          borderWeight: (
                                            parseInt(item.options.borderWeight) + 1
                                          ).toString(),
                                        },
                                        svg:renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              borderWeight: (
                                                parseInt(item.options.borderWeight) + 1
                                              ).toString(),
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        )
                                      },
                                      "item",
                                      "update",
                                      item
                                    );
                                    // setOptions((prev) => {
                                    //   return {
                                    //     ...prev,
                                    //     borderWeight: (
                                    //       parseInt(prev.borderWeight) + 1
                                    //     ).toString(),
                                    //   };
                                    // })
                                  }}
                                >
                                  <Circle fill="#000" size={30} />
                                </Button>
                              }
                              className="max-w-md"
                            />
                          </div>
                        )}
                        {options?.dotWidth && (
                          <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
                            <Slider
                              label="Dot Width"
                              size="sm"
                              color="secondary"
                              maxValue={size.width}
                              minValue={options.dotWidth ? 1 : 0}
                              value={parseInt(options.dotWidth)}
                              onChange={(e) => {
                                updateDotWidth(e);
                                setOptions((prev) => {
                                  return { ...prev, dotWidth: e.toString() };
                                });
                              }}
                              startContent={
                                <Button
                                  isIconOnly
                                  radius="full"
                                  variant="light"
                                  onPress={() => {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        dotWidth: (
                                          parseInt(item.options.dotWidth) - 1
                                        ).toString(),
                                      },
                                      svg:renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            dotWidth: (
                                              parseInt(item.options.dotWidth) - 1
                                            ).toString(),
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      )
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          dotWidth: (
                                            parseInt(item.options.dotWidthh) - 1
                                          ).toString(),
                                        },
                                        svg:renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              dotWidth: (
                                                parseInt(item.options.dotWidth) - 1
                                              ).toString(),
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        )
                                      },
                                      "item",
                                      "update",
                                      item
                                    );
                                    setOptions((prev) => {
                                      return {
                                        ...prev,
                                        dotWidth: (
                                          parseInt(prev.dotWidth) - 1
                                        ).toString(),
                                      };
                                    });
                                  }}
                                >
                                  <Minus fill="#000" size={24} />
                                </Button>
                              }
                              endContent={
                                <Button
                                  isIconOnly
                                  radius="full"
                                  variant="light"
                                  onPress={() => {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        dotWidth: (
                                          parseInt(item.options.dotWidth) - 1
                                        ).toString(),
                                      },
                                      svg:renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            dotWidth: (
                                              parseInt(item.options.dotWidth) - 1
                                            ).toString(),
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      )
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          dotWidth: (
                                            parseInt(item.options.dotWidth) - 1
                                          ).toString(),
                                        },
                                        svg:renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              dotWidth: (
                                                parseInt(item.options.dotWidth) - 1
                                              ).toString(),
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        )
                                      },
                                      "item",
                                      "update",
                                      item
                                    );
                                    setOptions((prev) => {
                                      return {
                                        ...prev,
                                        dotWidth: (
                                          parseInt(prev.dotWidth) + 1
                                        ).toString(),
                                      };
                                    });
                                  }}
                                >
                                  <Plus fill="#000" size={24} />
                                </Button>
                              }
                              className="max-w-md"
                            />
                          </div>
                        )}
                        {options?.dotGap && (
                          <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
                            <Slider
                              label="Dot Gap"
                              size="sm"
                              color="secondary"
                              maxValue={parseInt(options.maxBorderWeight) || 26}
                              value={parseInt(options.dotGap)}
                              onChange={(e) => {
                                updateDotGap(e);
                                setOptions((prev) => {
                                  return { ...prev, dotGap: e.toString() };
                                });
                              }}
                              startContent={
                                <Button
                                  isIconOnly
                                  radius="full"
                                  variant="light"
                                  onPress={() => {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        dotGap: (
                                          parseInt(item.options.dotGap) - 1
                                        ).toString(),
                                      },
                                      svg:renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            dotGap: (
                                              parseInt(item.options.dotGap) - 1
                                            ).toString(),
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      )
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          dotGap: (
                                            parseInt(item.options.dotGap) - 1
                                          ).toString(),
                                        },
                                        svg:renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              dotGap: (
                                                parseInt(item.options.dotGap) - 1
                                              ).toString(),
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        )
                                      },
                                      "item",
                                      "update",
                                      item
                                    );

                                    setOptions((prev) => {
                                      return {
                                        ...prev,
                                        dotGap: (
                                          parseInt(prev.dotGap) - 1
                                        ).toString(),
                                      };
                                    });
                                  }}
                                >
                                  <Minus fill="#000" size={24} />
                                </Button>
                              }
                              endContent={
                                <Button
                                  isIconOnly
                                  radius="full"
                                  variant="light"
                                  onPress={() => {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        dotGap: (
                                          parseInt(item.options.dotGap) + 1
                                        ).toString(),
                                      },
                                      svg:renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            dotGap: (
                                              parseInt(item.options.dotGap) + 1
                                            ).toString(),
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      )
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          dotGap: (
                                            parseInt(item.options.dotGap) + 1
                                          ).toString(),
                                        },
                                        svg:renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              dotGap: (
                                                parseInt(item.options.dotGap) + 1
                                              ).toString(),
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        )
                                      },
                                      "item",
                                      "update",
                                      item
                                    );

                                    setOptions((prev) => {
                                      return {
                                        ...prev,
                                        dotGap: (
                                          parseInt(prev.dotGap) + 1
                                        ).toString(),
                                      };
                                    });
                                  }}
                                >
                                  <Plus fill="#000" size={24} />
                                </Button>
                              }
                              className="max-w-md"
                            />
                          </div>
                        )}
                        {options?.radius && (
                          <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
                            <Slider
                              label="Border Radius"
                              size="sm"
                              color="secondary"
                              maxValue={item.size.width / 2}
                              value={parseInt(options.radius)}
                              onChange={(e) => {
                                updateBorderRadius(e);
                                setOptions((prev) => {
                                  return { ...prev, radius: e.toString() };
                                });
                              }}
                              startContent={
                                <Button
                                  isIconOnly
                                  radius="full"
                                  variant="light"
                                  onPress={() => {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        radius: (
                                          parseInt(item.option.radius) - 1
                                        ).toString(),
                                      },
                                      svg:renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            radius: (
                                              parseInt(item.option.radius) - 1
                                            ).toString(),
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      )
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          radius: (
                                            parseInt(item.option.radius) - 1
                                          ).toString(),
                                        },
                                        svg:renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              radius: (
                                                parseInt(item.option.radius) - 1
                                              ).toString(),
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        )
                                      },
                                      "item",
                                      "update",
                                      item
                                    );
                                    setOptions((prev) => {
                                      return {
                                        ...prev,
                                        radius: (
                                          parseInt(prev.radius) - 1
                                        ).toString(),
                                      };
                                    });
                                  }}
                                >
                                  <Circle fill="#000" size={10} />
                                </Button>
                              }
                              endContent={
                                <Button
                                  isIconOnly
                                  radius="full"
                                  variant="light"
                                  onPress={() => {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        radius: (
                                          parseInt(item.options.radius) + 1
                                        ).toString(),
                                      },
                                      svg:renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            radius: (
                                              parseInt(item.options.radius) + 1
                                            ).toString(),
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      )
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          radius: (
                                            parseInt(item.options.radius) + 1
                                          ).toString(),
                                        },
                                        svg:renderToString(
                                          getSVG(
                                            item.title,
                                            {
                                              ...item.options,
                                              radius: (
                                                parseInt(item.options.radius) + 1
                                              ).toString(),
                                            },
                                            item.size,
                                            item?.orientation,
                                            false,
                                            null,
                                            item.id
                                          )
                                        )
                                      },
                                      "item",
                                      "update",
                                      item
                                    );
                                    setOptions((prev) => {
                                      return {
                                        ...prev,
                                        radius: (
                                          parseInt(prev.radius) + 1
                                        ).toString(),
                                      };
                                    });
                                  }}
                                >
                                  <Circle fill="#000" size={30} />
                                </Button>
                              }
                              className="max-w-md"
                            />
                          </div>
                        )}

                        {(options?.rotation || options?.rotation === "") && (
                          <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
                            <div className="flex">
                              <Input
                                variant="underlined"
                                label={"Rotation"}
                                labelPlacement="outside-left"
                                size="md"
                                type=""
                                className="!bg-transparent relative w-full m-0 !p-0"
                                radius="none"
                                maxLength={3}
                                classNames={{
                                  inputWrapper: "h-full shadow-none",
                                  innerWrapper: "p-0 m-0",
                                }}
                                // autoFocus
                                defaultValue={
                                  options.rotation && options.rotation
                                }
                                value={
                                  !sharedItems
                                    ? options.rotation
                                    : options.rotation
                                }
                                onChange={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  updateRotation(e);
                                  setOptions((prev) => {
                                    return {
                                      ...prev,
                                      rotation: e.target.value,
                                    };
                                  });
                                  if (e.target.value.length <= 3) {
                                    if (sharedItems) {
                                      updateSharedItem(sharedItems, {
                                        ...item,
                                        options: {
                                          ...options,
                                          rotation: e.target.value,
                                        },
                                      });
                                    } else {
                                      updateItem({
                                        ...item,
                                        options: {
                                          ...options,
                                          rotation: e.target.value,
                                        },
                                      });
                                    }
                                  }
                                  // setUpdate((prev) => !prev);
                                  // setTextBoxOpen(false)
                                }}
                                onBlur={(e) => {
                                  if (options.rotation === "") {
                                    updateItem({
                                      ...item,
                                      options: {
                                        ...item.options,
                                        rotation: "0",
                                      },
                                      svg:renderToString(
                                        getSVG(
                                          item.title,
                                          {
                                            ...item.options,
                                            rotation: "0",
                                          },
                                          item.size,
                                          item?.orientation,
                                          false,
                                          null,
                                          item.id
                                        )
                                      )
                                    });
                                    addHistory(
                                      {
                                        ...item,
                                        options: {
                                          ...item.options,
                                          rotation: "0",
                                        },
                                        
                                      },
                                      "item",
                                      "update",
                                      item
                                    );
                                    setOptions((prev) => {
                                      return { ...prev, rotation: "0" };
                                    });
                                    if (sharedItems) {
                                      updateSharedItem(sharedItems, {
                                        ...item,
                                        options: {
                                          ...options,
                                          rotation: "0",
                                        },
                                      });
                                    } else {
                                      updateItem({
                                        ...item,
                                        options: {
                                          ...item.options,
                                          rotation: "0",
                                        },
                                      });
                                      addHistory(
                                        {
                                          ...item,
                                          options: {
                                            ...item.options,
                                            rotation: "0",
                                          },
                                        },
                                        "item",
                                        "update",
                                        item
                                      );
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-6 w-full justify-around gap-2">
                              {angles.map((angle, index) => {
                                return (
                                  <Button
                                    variant="flat"
                                    size="sm"
                                    //  style={{ backgroundColor: clr }}
                                    radius="sm"
                                    onPress={(e) => {
                                      setOptions((prev) => {
                                        return {
                                          ...prev,
                                          rotation: angle,
                                        };
                                      });
                                      updateItem({
                                        ...item,
                                        options: {
                                          ...item.options,
                                          rotation: angle,
                                        },
                                      });
                                      addHistory(
                                        {
                                          ...item,
                                          options: {
                                            ...item.options,
                                            rotation: angle,
                                          },
                                        },
                                        "item",
                                        "update",
                                        item
                                      );
                                    }}
                                    key={`angle-${index}`}
                                    isIconOnly
                                  >
                                    {angle}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
                          <span className="pt-2 pb-2">
                            Layer : {item?.layer}
                          </span>
                          <div className="flex gap-4">
                            <Button
                              aria-label="Bring To Front"
                              size="sm"
                              isIconOnly
                              variant="flat"
                              onPress={() => {
                                const index = items.findIndex(
                                  (ele) => ele.id === item.id
                                );

                                if (index !== -1) {
                                  const newItems = [...items];
                                  const removedItem = newItems.splice(
                                    index,
                                    1
                                  )[0];
                                  newItems.push(removedItem);
                                  console.log(newItems);
                                  setItems(newItems);
                                }

                                // setUpdate((prev) => !prev);
                                // setPositionUpdate((prev) => !prev);
                                // let highestLayer = -Infinity;
                                // items.forEach((obj) => {
                                //   if (obj.layer > highestLayer) {
                                //     highestLayer = obj.layer;
                                //   }
                                // });
                                // if (sharedItems) {
                                //   updateSharedItem(sharedItems, {
                                //     ...item,
                                //     layer: highestLayer + 1,
                                //   });
                                // } else {
                                //   updateItem({...item,
                                //     layer: highestLayer + 1,})
                                //     setUpdate((prev) => !prev);
                                //   // setItems((prev) => {
                                //   //   const index = prev.findIndex(
                                //   //     (el) => el.id === item.id
                                //   //   );
                                //   //   if (index !== -1) {
                                //   //     const removed = prev.splice(index, 1);
                                //   //   }
                                //   //   console.log(item.layer);
                                //   //   prev.push({
                                //   //     ...item,
                                //   //     layer: highestLayer + 1,
                                //   //   });
                                //   //   console.log(item);
                                //   //   setUpdate((prev) => !prev);
                                //   //   return prev;
                                //   // });
                                // }
                              }}
                            >
                              <BringToFront size={18} />
                            </Button>
                            <Button
                              onPress={() => {
                                const index = items.findIndex(
                                  (ele) => ele.id === item.id
                                );
                                if (
                                  index !== -1 &&
                                  index !== items.length - 1
                                ) {
                                  const newItems = [...items];
                                  const removedItem = newItems.splice(
                                    index,
                                    1
                                  )[0];
                                  newItems.splice(index + 1, 0, removedItem);
                                  console.log(newItems);
                                  setItems(newItems);
                                }
                                // setUpdate((prev) => !prev);

                                // if (sharedItems) {
                                //   updateSharedItem(sharedItems, {
                                //     ...item,
                                //     layer: item.layer + 1,
                                //   });
                                // } else {
                                //   updateItem({...item,layer: item.layer + 1,})
                                //   setUpdate((prev) => !prev);
                                //   // setItems((prev) => {
                                //   //   const index = prev.findIndex(
                                //   //     (el) => el.id === item.id
                                //   //   );
                                //   //   if (index !== -1) {
                                //   //     const removed = prev.splice(index, 1);
                                //   //   }
                                //   //   console.log(item.layer);
                                //   //   prev.push({
                                //   //     ...item,
                                //   //     layer: item.layer + 1,
                                //   //   });
                                //   //   console.log(item);
                                //   //   setUpdate((prev) => !prev);
                                //   //   return prev;
                                //   // });
                                // }
                              }}
                              aria-label="Bring Forward"
                              size="sm"
                              isIconOnly
                              variant="flat"
                            >
                              <ChevronsUp size={18} />
                            </Button>
                            <Button
                              onPress={() => {
                                const index = items.findIndex(
                                  (ele) => ele.id === item.id
                                );
                                if (index !== -1 && index !== 0) {
                                  const newItems = [...items];
                                  const removedItem = newItems.splice(
                                    index,
                                    1
                                  )[0];
                                  newItems.splice(index - 1, 0, removedItem);
                                  console.log(newItems);
                                  setItems(newItems);
                                }

                                // setUpdate((prev) => !prev);

                                // if (sharedItems) {
                                //   updateSharedItem(sharedItems, {
                                //     ...item,
                                //     layer: item.layer - 1,
                                //   });
                                // } else {
                                //   updateItem({...item,layer: item.layer - 1,})
                                //   setUpdate((prev) => !prev);
                                //   // setItems((prev) => {
                                //   //   const index = prev.findIndex(
                                //   //     (el) => el.id === item.id
                                //   //   );
                                //   //   if (index !== -1) {
                                //   //     const removed = prev.splice(index, 1);
                                //   //   }
                                //   //   prev.push({
                                //   //     ...item,
                                //   //     layer: item.layer - 1,
                                //   //   });
                                //   //   setUpdate((prev) => !prev);

                                //   //   return prev;
                                //   // });
                                // }
                              }}
                              aria-label="Send Backward"
                              size="sm"
                              isIconOnly
                              variant="flat"
                            >
                              <ChevronsDown size={18} />
                            </Button>
                            <Button
                              aria-label="Send To Back"
                              size="sm"
                              isIconOnly
                              variant="flat"
                              onPress={() => {
                                const index = items.findIndex(
                                  (ele) => ele.id === item.id
                                );
                                if (index !== -1) {
                                  const newItems = [...items];
                                  const removedItem = newItems.splice(
                                    index,
                                    1
                                  )[0];
                                  newItems.unshift(removedItem);
                                  console.log(newItems);
                                  setItems(newItems);
                                }

                                // setUpdate((prev) => !prev);
                                // setPositionUpdate((prev) => !prev);

                                // let lowestLayer = Infinity;
                                // items.forEach((obj) => {
                                //   if (obj.layer < lowestLayer) {
                                //     lowestLayer = obj.layer;
                                //   }
                                // });
                                // if (sharedItems) {
                                //   updateSharedItem(sharedItems, {
                                //     ...item,
                                //     layer: lowestLayer - 1,
                                //   });
                                // } else {
                                //   updateItem({...item,layer: lowestLayer - 1,})
                                //   setUpdate((prev) => !prev);
                                //   // setItems((prev) => {
                                //   //   const index = prev.findIndex(
                                //   //     (el) => el.id === item.id
                                //   //   );
                                //   //   if (index !== -1) {
                                //   //     const removed = prev.splice(index, 1);
                                //   //   }
                                //   //   console.log(item.layer);
                                //   //   prev.push({
                                //   //     ...item,
                                //   //     layer: lowestLayer - 1,
                                //   //   });
                                //   //   console.log(item);
                                //   //   setUpdate((prev) => !prev);
                                //   //   return prev;
                                //   // });
                                // }
                              }}
                            >
                              <SendToBack size={18} />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
                          <span className="pt-2 pb-2">Align :</span>
                          <div className="flex gap-4">
                            <Button
                              aria-label="Align Top"
                              size="sm"
                              isIconOnly
                              variant="flat"
                              onPress={() => {
                                console.log(item);
                                let posX = item?.position?.x;
                                let posY = "2%";
                                console.log(posX, posY);
                                if (sharedItems) {
                                  updateSharedItem(sharedItems, {
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: "0%",
                                    },
                                  });
                                } else {
                                  updateItem({
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                  setUpdate((prev) => !prev);
                                  // setItems((prev) => {
                                  //   const index = prev.findIndex(
                                  //     (el) => el.id === item.id
                                  //   );
                                  //   if (index !== -1) {
                                  //     const removed = prev.splice(index, 1);
                                  //   }
                                  //   console.log(item.layer);
                                  //   prev.push({
                                  //     ...item,
                                  //     top: posY,
                                  //     left: posX,
                                  //     position: {
                                  //       x: posX,
                                  //       y: posY,
                                  //     },
                                  //   });
                                  //   console.log(item);
                                  //   setUpdate((prev) => !prev);
                                  //   return prev;
                                  // });
                                }
                              }}
                            >
                              <AlignStartHorizontal size={18} />
                            </Button>
                            <Button
                              aria-label="Align Middle"
                              size="sm"
                              isIconOnly
                              variant="flat"
                              onPress={() => {
                                console.log(item);
                                let posX = item?.position?.x;
                                let posY = "50%";
                                console.log(posX, posY);
                                if (sharedItems) {
                                  updateSharedItem(sharedItems, {
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                } else {
                                  updateItem({
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                  setUpdate((prev) => !prev);
                                  // setItems((prev) => {
                                  //   const index = prev.findIndex(
                                  //     (el) => el.id === item.id
                                  //   );
                                  //   if (index !== -1) {
                                  //     const removed = prev.splice(index, 1);
                                  //   }
                                  //   console.log(item.layer);
                                  //   prev.push({
                                  //     ...item,
                                  //     top: posY,
                                  //     left: posX,
                                  //     position: {
                                  //       x: posX,
                                  //       y: posY,
                                  //     },
                                  //   });
                                  //   console.log(item);
                                  //   setUpdate((prev) => !prev);
                                  //   return prev;
                                  // });
                                }
                              }}
                            >
                              <AlignCenterHorizontal size={18} />
                            </Button>
                            <Button
                              aria-label="Send Backward"
                              size="sm"
                              isIconOnly
                              variant="flat"
                              onPress={() => {
                                console.log(item);
                                let posX = item?.position?.x;
                                let posY = item?.position?.y;
                                const containerHeight =
                                  document.getElementById(
                                    "editorShell"
                                  ).offsetHeight;
                                const offsetY =
                                  (size.height / containerHeight) * 100;
                                posY = `${100 - offsetY - 4}%`;
                                if (sharedItems) {
                                  updateSharedItem(sharedItems, {
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                } else {
                                  updateItem({
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                  setUpdate((prev) => !prev);
                                  // setItems((prev) => {
                                  //   const index = prev.findIndex(
                                  //     (el) => el.id === item.id
                                  //   );
                                  //   if (index !== -1) {
                                  //     const removed = prev.splice(index, 1);
                                  //   }
                                  //   console.log(item.layer);
                                  //   prev.push({
                                  //     ...item,
                                  //     top: posY,
                                  //     left: posX,
                                  //     position: {
                                  //       x: posX,
                                  //       y: posY,
                                  //     },
                                  //   });
                                  //   console.log(item);
                                  //   setUpdate((prev) => !prev);
                                  //   return prev;
                                  // });
                                }
                              }}
                            >
                              <AlignEndHorizontal size={18} />
                            </Button>
                          </div>
                          <div className="flex gap-4">
                            <Button
                              aria-label="Align Left"
                              size="sm"
                              isIconOnly
                              variant="flat"
                              onPress={() => {
                                console.log(item);
                                let posX = "0%";
                                let posY = item?.position?.y;
                                console.log(posX, posY);
                                if (sharedItems) {
                                  updateSharedItem(sharedItems, {
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                } else {
                                  updateItem({
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                  setUpdate((prev) => !prev);
                                  // setItems((prev) => {
                                  //   const index = prev.findIndex(
                                  //     (el) => el.id === item.id
                                  //   );
                                  //   if (index !== -1) {
                                  //     const removed = prev.splice(index, 1);
                                  //   }
                                  //   console.log(item.layer);
                                  //   prev.push({
                                  //     ...item,
                                  //     top: posY,
                                  //     left: posX,
                                  //     position: {
                                  //       x: posX,
                                  //       y: posY,
                                  //     },
                                  //   });
                                  //   console.log(item);
                                  //   setUpdate((prev) => !prev);
                                  //   return prev;
                                  // });
                                }
                              }}
                            >
                              <AlignHorizontalJustifyStart size={18} />
                            </Button>
                            <Button
                              aria-label="Bring Forward"
                              size="sm"
                              isIconOnly
                              variant="flat"
                              onPress={() => {
                                console.log(item);
                                let posX = item?.position?.x;
                                let posY = item?.position?.y;
                                const containerWidth =
                                  document.getElementById(
                                    "editorShell"
                                  ).offsetWidth;
                                const offsetX =
                                  (size.width / 2 / containerWidth) * 100;
                                console.log(offsetX);
                                posX = `${50 - offsetX}%`;
                                if (sharedItems) {
                                  updateSharedItem(sharedItems, {
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                } else {
                                  updateItem({
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                  setUpdate((prev) => !prev);
                                  // setItems((prev) => {
                                  //   const index = prev.findIndex(
                                  //     (el) => el.id === item.id
                                  //   );
                                  //       setUpdate((prev) => !prev);
                                  //   if (index !== -1) {
                                  //     const removed = prev.splice(index, 1);
                                  //   }
                                  //   console.log(item.layer);
                                  //   prev.push({
                                  //     ...item,
                                  //     top: posY,
                                  //     left: posX,
                                  //     position: {
                                  //       x: posX,
                                  //       y: posY,
                                  //     },
                                  //   });
                                  //   console.log(item);
                                  //   setUpdate((prev) => !prev);
                                  //   return prev;
                                  // });
                                }
                              }}
                            >
                              <AlignCenterVertical size={18} />
                            </Button>
                            <Button
                              aria-label="Send Backward"
                              size="sm"
                              isIconOnly
                              variant="flat"
                              onPress={() => {
                                console.log(item);
                                let posX = item?.position?.x;
                                let posY = item?.position?.y;
                                const containerWidth =
                                  document.getElementById(
                                    "editorShell"
                                  ).offsetWidth;
                                const offsetY =
                                  (size.width / containerWidth) * 100;
                                posX = `${100 - offsetY}%`;
                                if (sharedItems) {
                                  updateSharedItem(sharedItems, {
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                } else {
                                  updateItem({
                                    ...item,
                                    top: posY,
                                    left: posX,
                                    position: {
                                      x: posX,
                                      y: posY,
                                    },
                                  });
                                  setUpdate((prev) => !prev);
                                  // setItems((prev) => {
                                  //   const index = prev.findIndex(
                                  //     (el) => el.id === item.id
                                  //   );
                                  //   if (index !== -1) {
                                  //     const removed = prev.splice(index, 1);
                                  //   }
                                  //   console.log(item.layer);
                                  //   prev.push({
                                  //     ...item,
                                  //     top: posY,
                                  //     left: posX,
                                  //     position: {
                                  //       x: posX,
                                  //       y: posY,
                                  //     },
                                  //   });
                                  //   console.log(item);
                                  //   setUpdate((prev) => !prev);
                                  //   return prev;
                                  // });
                                }
                              }}
                            >
                              <AlignHorizontalJustifyEnd size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </span>
                <span
                  className="hover:cursor-pointer flex justify-center items-center bg-[#e8713c]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemClicked(null);
                    setSelectedItem(null);
                    addHistory(item, "item", "delete");
                    handleRemoveItem(item);
                  }}
                >
                  <X className="w-4 h-4 text-black hover:text-white" />
                </span>
              </p>
            </span>
          )}
          <div
            style={{
              transform: `scale(${options?.scale || 0.7}) rotate(${
                item.options?.rotation || 0
              }deg)`,
            }}
          >
            {svg}
          </div>
        </div>
        {!isDragging && isHovered && isEditable && options?.rotation && (
          <div className="absolute left-[45%] justify-center flex h-[40px] items-end">
            <span className="absolute -z-1 top-0 w-[2px] h-[30px] bg-[#e8713c]"></span>
            <div
              className="flex bg-white hover:bg-[#05686E] hover:text-white transition-all text-[#05686E] rounded-full border p-1"
              onMouseDown={onMouseDown}
            >
              <RefreshCw size={18} />
            </div>
          </div>
        )}
      </Resizable>
    </>
  );
};

export default ShapeField;
