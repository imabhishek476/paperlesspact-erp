import { Resizable } from "re-resizable";
import React, { useEffect, useRef, useState } from "react";
import { useItemStore } from "../stores/useItemStore";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import {
  ALargeSmall,
  Copy,
  CopyPlus,
  Delete,
  Pen,
  PenLine,
  RefreshCcw,
  RefreshCw,
  Smile,
  Trash,
  Trash2,
  Wand,
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignStartHorizontal,
  AlignVerticalJustifyStart,
} from "lucide-react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { getSVG } from "../../Template/shapes/shapeSvgConstants";
import ResizeHandlers from "../../Template/FillableFields/ResizeHandlers";
import Moveable from "react-moveable";
import { createPortal, flushSync } from "react-dom";
import { usePageStore } from "../stores/usePageStore";
import { usePresHistory } from "../stores/usePresHistoryStore";
const ItemWrapper = ({
  item,
  fromOverlay,
  fromPreview,
  container,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuTransform, setMenuTransform] = useState(null);
  const moveableRef = useRef();
  const {
    selectedItem,
    items,
    setDraggedItem,
    duplicateItem,
    deleteItem,
    updateItem,
    setSelectedItem,
    contextMenu,
    setContextMenu,
      } = useItemStore();
  const { selectedPage, pageSetup, } = usePageStore();
  const {addHistory} =usePresHistory()
  const targetRef = useRef(null);
  const hoveredRef = useRef(null);
  const [itemIds] = useState(
    items
      ?.filter((item) => item.pageIndex === selectedPage?.pageIndex)
      .map((item) => `.item-${item.id}`)
  );
  useEffect(() => {
    const container = document.getElementById(`hoveredItem-${item?.id}`);
    if (container) {
      if (isHovered) {
        container.classList.add("hoveredItem");
      } else {
        if (selectedItem?.id !== item.id) {
          container.classList.remove("hoveredItem");
        }
      }
    }
  }, [isHovered, selectedItem]);
  const [floatingButtons, setFloatingButtons] = useState({
    x: 0,
    y: 0,
  });
  const [isRendering, setIsRendering] = useState(false);
  const [pageSize] = useState({
    height: parseInt(pageSetup?.size?.height?.split("px")[0]),
    width: parseInt(pageSetup?.size?.width?.split("px")[0]),
  });
  console.log(pageSetup);
  // const alignDiv = document.getElementById("alignDiv");
  useEffect(() => {
    if (moveableRef?.current) {
      const rect = moveableRef?.current?.getRect()
      if (rect) {
        let itemHeightInPx;
        let itemWidthInPx;
        let x;
        let y
        if (typeof item.size?.height === "string") {
          itemHeightInPx = (item.size?.height?.split("%")[0] * pageSize.height) / 100;
          itemWidthInPx = (item.size?.width?.split("%")[0] * pageSize.width) / 100;
        } else {
          itemHeightInPx = item.size?.height;
          itemWidthInPx = item.size?.width;
        }
        if (rect.top <= pageSize.height / 3.5) {
          y = rect.top + rect.height + 30
        } else {
          y = rect.top - 80
        }
        if (rect.top <= pageSize.width / 2) {
          x = rect.left + itemWidthInPx
        } else {
          x = rect.left + itemWidthInPx
        }
        x = x / 2
        // if(pageSetup?.orientation==="landscape"){
        //    if( y < 10 || y > 550){
        //   y = pageSize.height/10
        //   x = pageSize.width/2 - 100
        // }
        // }
        // else{
        //   if( y < 10 || y >pageSize?.height-20){
        //     y = pageSize.height/10
        //     x = pageSize.width/2 - 100
        //   }
        // }
        if (y < 10 || y > pageSize?.height - 20) {
          y = pageSize.height / 10
          x = pageSize.width / 2 - 100
        }
        console.log(x)
        console.log(y)
        setFloatingButtons({ x, y });
      }
    }
  }, [item]);
  const handleAIClick = (html, action) => {
    if (html) {
      const parser = new DOMParser();
      const parsedString = parser.parseFromString(html, "text/html");
      console.log(parsedString.documentElement.textContent);
    }
  };

  // useEffect(()=>{
  //   setItemMoveableRef({pageIndex:item?.pageIndex,ref:moveableRef});
  //   // debugger;
  //   // return ()
  // },[])
  return (
    <>
      {true ? (
        <div
          ref={hoveredRef}
          // className="relative"
          id={`hoveredItem-${item?.id}`}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenu({
              x: e.clientX - 70,
              y: e.clientY - 55,
              item: item,
            });
          }}
        // onBlur={e=>setContextMenu(null)}
        >
          {!isRendering &&
            (item.id === selectedItem?.id) &&
            !fromOverlay &&
            !fromPreview && (
              <>
                {/* north */}
                <span
                  style={{
                    backgroundColor: "white",
                    top: 0,
                    display: "flex",
                    position: "fixed",
                    left: 0,
                    backgroundColor: "#FDFDFD",
                    transformOrigin: "0 0",
                    // zIndex: (item?.layer || 5) +1,
                    zIndex: 999,
                    willChange: "transform",
                    transform: `translate(${floatingButtons?.x}px, ${floatingButtons?.y}px)`,
                  }}
                  className="absolute gap-2 p-1 rounded-md left-[1%] bg-[#FDFDFD] shadow-xl"
                >
                  <Tooltip content="Duplicate" size="sm">
                    <Button
                      variant="light"
                      radius="sm"
                      size="sm"
                      color="primary"
                      className="min-w-5 h-8"
                      startContent={<Copy size={14} />}
                      aria-label="Duplicate"
                      onPress={() => duplicateItem(item)}
                    />
                  </Tooltip>
                  {/* <Button
                    variant="light"
                    radius="sm"
                    size="sm"
                    color="primary"
                    className="min-w-5 h-8"
                    startContent={<Copy size={14} />}
                    aria-label="Duplicate"
                    onPress={() => {
                      console.log(moveableRef.current.getRect());
                      moveableRef.current?.request(
                        "draggable",
                        {
                          // deltaX: -49,
                          // deltaY: 0,
                          x: 0,
                          useSnap: true,
                        },
                        true
                      );
                    }}
                  /> */}
                  <Tooltip content="Delete" size="sm">
                    <Button
                      variant="light"
                      radius="sm"
                      size="sm"
                      color="primary"
                      className="min-w-5 h-8"
                      startContent={<Trash size={14} />}
                      aria-label="Delete"
                      onPress={() => {
                        setSelectedItem(null);
                        deleteItem(item);
                        addHistory(item,"item","delete")
                      }}
                    />
                  </Tooltip>
                  {item?.type === "text" && (
                    <Popover placement="right">
                      <PopoverTrigger>
                        <Button
                          variant="light"
                          radius="sm"
                          size="sm"
                          color="primary"
                          className="min-w-5 h-8"
                          startContent={<Wand size={14} />}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <div className="w-50 bg-white shadow-md  text-[#151513] text-sm rounded-sm py-2">
                          <ul>
                            {/* <li style={{ display: (copyItem && !itemClicked && menuItem) ? "flex" : "none" }} onClick={() => { handlePaste(), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Clipboard size={20} /> Paste</li> */}
                            <>
                              <li
                                onClick={() =>
                                  handleAIClick(item?.html, "expand")
                                }
                                className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-200 hover:cursor-pointer"
                              >
                                <Pen size={20} /> Continue Writing
                              </li>
                              <li
                                onClick={() =>
                                  handleAIClick(item?.html, "summarize")
                                }
                                className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-200 hover:cursor-pointer"
                              >
                                <PenLine size={20} /> Summarize
                              </li>
                              <li
                                onClick={() =>
                                  handleAIClick(item?.html, "rewrite")
                                }
                                className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-200 hover:cursor-pointer"
                              >
                                <RefreshCcw size={20} /> Rewrite
                              </li>
                              <li
                                onClick={() => handleAIClick(item?.html, "fun")}
                                className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-200 hover:cursor-pointer"
                              >
                                <Smile size={20} /> More Fun
                              </li>
                              <li
                                onClick={() =>
                                  handleAIClick(item?.html, "formal")
                                }
                                className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-200 hover:cursor-pointer"
                              >
                                <ALargeSmall size={20} /> More Formal
                              </li>
                            </>
                          </ul>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </span>
              </>
            )}
          {item?.id === selectedItem?.id && !fromPreview && !fromOverlay && document.getElementById("alignDiv") &&

            (createPortal(
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <Button
                    className="justify-start"
                    aria-label="Align Top"
                    size="sm"
                    startContent={<AlignStartHorizontal size={18} />}
                    variant="light"
                    onPress={() => {
                      moveableRef?.current?.request(
                        "draggable",
                        {
                          y: 0,
                          useSnap: true,
                        },
                        true
                      );
                    }}
                  >
                    Top
                  </Button>
                  <Button
                    className="justify-start"
                    aria-label="Align Middle"
                    size="sm"
                    startContent={<AlignCenterHorizontal size={18} />}
                    variant="light"
                    onPress={() => {
                      if (moveableRef?.current) {
                        let itemHeightInPx;
                        if (typeof item?.size?.height === "string") {
                          itemHeightInPx =
                            (item?.size?.height?.split("%")[0] *
                              pageSize?.height) /
                            100;
                        } else {
                          itemHeightInPx = item?.size?.height;
                        }
                        console.log(itemHeightInPx);
                        console.log(moveableRef?.current?.getRect().height);
                        itemHeightInPx = moveableRef?.current?.getRect().height;
                        const middle = itemHeightInPx;
                        const height = pageSize.height;
                        moveableRef?.current?.request(
                          "draggable",
                          {
                            y: (height - middle) / 2,
                            useSnap: true,
                          },
                          true
                        );
                      }
                    }}
                  >
                    Middle
                  </Button>
                  <Button
                    className="justify-start"
                    aria-label="Send Backward"
                    size="sm"
                    startContent={<AlignEndHorizontal size={18} />}
                    variant="light"
                    onPress={() => {
                      if (moveableRef?.current) {
                        let itemHeightInPx;
                        itemHeightInPx = moveableRef?.current?.getRect().height;
                        const middle = itemHeightInPx;
                        console.log(middle, pageSize);
                        const height = pageSize.height;
                        moveableRef?.current?.request(
                          "draggable",
                          {
                            y: height - middle - 6,
                            useSnap: true,
                          },
                          true
                        );
                      }
                    }}
                  >
                    Bottom
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  <Button
                    className="justify-start"
                    aria-label="Align Left"
                    size="sm"
                    startContent={<AlignHorizontalJustifyStart size={18} />}
                    variant="light"
                    onPress={() => {
                      console.log(item)
                      // deleteItem(item)
                      if (moveableRef?.current) {
                        let itemHeightInPx;
                        itemHeightInPx = moveableRef?.current?.getRect().height;
                        const middle = itemHeightInPx;
                        console.log(middle, pageSize);
                        const height = pageSize.height;
                        moveableRef?.current?.request(
                          "draggable",
                          {
                            x: 0,
                            // y: 0,
                            useSnap: true,
                          },
                          true
                        );
                      }
                    }}
                  >
                    Left
                  </Button>
                  <Button
                    className="justify-start"
                    aria-label="Bring Forward"
                    size="sm"
                    startContent={<AlignCenterVertical size={18} />}
                    variant="light"
                    onPress={() => {
                      if (moveableRef?.current) {
                        let itemWidthInPx;
                        itemWidthInPx = moveableRef?.current?.getRect().width;
                        const middle = itemWidthInPx;
                        console.log(middle, pageSize);
                        const width = pageSize.width;
                        moveableRef?.current?.request(
                          "draggable",
                          {
                            x: (width - middle) / 2,
                            useSnap: true,
                          },
                          true
                        );
                      }
                    }}
                  >
                    Center
                  </Button>
                  <Button
                    className="justify-start"
                    aria-label="Send Backward"
                    size="sm"
                    startContent={<AlignHorizontalJustifyEnd size={18} />}
                    variant="light"
                    onPress={() => {
                      if (moveableRef?.current) {
                        let itemWidthInPx;
                        itemWidthInPx = moveableRef?.current?.getRect().width;
                        const middle = itemWidthInPx;
                        console.log(middle, pageSize);
                        const width = pageSize.width;
                        moveableRef?.current?.request(
                          "draggable",
                          {
                            x: width - middle - 6,
                            useSnap: true,
                          },
                          true
                        );
                      }
                    }}
                  >
                    Right
                  </Button>
                </div>
              </div>,
              document.getElementById("alignDiv")
              , item?.id))
          }

          <div
            ref={targetRef}
            className={`snappable item-${item.id} `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              position: item?.transformObject ? "fixed" : "absolute",
              top: 0,
              left: 0,
              aspectRatio: item?.lockAspect ? "1/1" : "auto",
              height: item.size.height,
              width: item.size.width,
              transformOrigin: "0 0",
              transform:
                item?.transformObject &&
                `${item?.transformObject?.translate
                  ? `translate(${item?.transformObject?.translate[0]}px, ${item?.transformObject?.translate[1]}px)`
                  : ""
                } ${item?.transformObject?.rotate
                  ? `rotate(${item?.transformObject?.rotate}deg)`
                  : ""
                } ${item?.transformObject?.scale
                  ? `scale(${item?.transformObject?.scale[0]}, ${item?.transformObject?.scale[1]})`
                  : ""
                }`,
              zIndex: fromOverlay ? 999 : item?.layer,
              willChange: "transform",
            }}
            id={item.id}
          >
            {props?.children}
          </div>
          {!fromPreview && (
            <Moveable
              padding={null}
              flushSync={flushSync}
              container={document.getElementById("currentPage")}
              // rootContainer={document.getElementById("currentPage")}
              target={targetRef}
              ref={moveableRef}
              draggable={true}
              throttleDrag={1}
              edgeDraggable={false}
              startDragRotate={0}
              throttleDragRotate={0}
              keepRatio={false}
              throttleScale={0}
              renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
              snapRotataionThreshold={5}
              // snapRotationDegrees={[0, 90, 180, 270]}
              snappable={true}
              snapDirections={{
                top: true,
                left: true,
                bottom: true,
                right: true,
              }}
              snapThreshold={5}
              scalable={item.id === selectedItem?.id}
              rotatable={item.id === selectedItem?.id}
              throttleRotate={0}
              rotationPosition={"top"}
              useResizeObserver={true}
              useMutationObserver={true}
              originDraggable={true}
              originRelative={true}
              elementGuidelines={itemIds}
              onRotateStart={(e) => {
                const itemContainer = document.getElementById(item?.id);
                const { height, width } = itemContainer.getBoundingClientRect();
                console.log(height, width);
                e.setFixedDirection([0.05, 0.05]);
              }}
              onRenderStart={() => {
                setIsRendering(true);
                setContextMenu(null);
              }}
              onRender={(e) => {
                e.target.style.transform = e.transform;
              }}
            
              onRenderEnd={(e) => {
                setIsRendering(false);
                const regex = /rotate\(([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)deg\)/;
                const match = e.transform.match(regex);
                const rotationDegree = match ? parseFloat(match[1]) : null;
                updateItem({
                  ...item,
                  transformObject: {
                    ...e.transformObject,
                    rotate: rotationDegree || 0,
                  },
                });
                addHistory({
                  ...item,
                  transformObject: {
                    ...e.transformObject,
                    rotate: rotationDegree || 0,
                  },
                },"item","update",item);
                if (item?.id === selectedItem?.id) {
                  setSelectedItem({
                    ...item,
                    // moveableRef: moveableRef?.current,
                    transformObject: {
                      ...e.transformObject,
                      rotate: rotationDegree || 0,
                    },
                  });
                }
              }}
            />
          )}
        </div>
      ) : (
        <div
          ref={targetRef}
          className="snappable"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: "fixed",
            // height: item?.size?.height,
            // width: item?.size?.width,
            transformOrigin: "0 0",
            transform:
              item?.transformObject &&
              `
              ${item?.transformObject?.translate
                ? `translate(${item?.transformObject?.translate[0]}px, ${item?.transformObject?.translate[1]}px)`
                : ""
              }
              ${item?.transformObject?.rotate
                ? `rotate(${item?.transformObject?.rotate}deg)`
                : ""
              }
              ${item?.transformObject?.scale
                ? `scale(${item?.transformObject?.scale[0]}, ${item?.transformObject?.scale[1]})`
                : ""
              }
              `,
            zIndex: fromOverlay ? -1 : item?.layer,
          }}
          id={item.id}
        >
          {props.children}
        </div>
      )}
    </>
  );
};

export default ItemWrapper;
