import React, { useEffect, useState } from "react";
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
  Dot,
  Minus,
  Plus,
  RefreshCw,
  SendToBack,
  Settings,
  Slash,
  Square,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { createPortal } from "react-dom";
import { Button, Input, Slider, Tab, Tabs } from "@nextui-org/react";
import { useItemStore } from "../stores/useItemStore";
import { usePageStore } from "../stores/usePageStore";
import LayerItemRenderer from "../PageComponent/LayerItemRenderer";

function normalizePositionAndAlignment(
  elementWidth,
  elementHeight,
  pageWidth,
  pageHeight,
  rotationAngle
) {
  // Convert rotation angle to radians
  const angleInRadians = (rotationAngle * Math.PI) / 180;

  // Calculate normalized coordinates of the element's center after rotation
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  const rotatedCenterX =
    centerX * Math.cos(angleInRadians) - centerY * Math.sin(angleInRadians);
  const rotatedCenterY =
    centerX * Math.sin(angleInRadians) + centerY * Math.cos(angleInRadians);

  // Calculate the normalized position of the left and top edges
  const left = rotatedCenterX - elementWidth / 2;
  const top = rotatedCenterY - elementHeight / 2;

  // Calculate the normalized position of the right and bottom edges
  const right = rotatedCenterX + elementWidth / 2;
  const bottom = rotatedCenterY + elementHeight / 2;

  // Calculate normalized alignment based on the position
  const horizontalAlignment =
    left <= 0 ? "left" : right >= pageWidth ? "right" : "center";
  const verticalAlignment =
    top <= 0 ? "top" : bottom >= pageHeight ? "bottom" : "middle";

  return { left, top, horizontalAlignment, verticalAlignment };
}

const ShapeConfigTab = () => {
  const { items, selectedItem, setSelectedItem, updateItem, setItems } =
    useItemStore();
  const { selectedPage, pageSetup } = usePageStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [activeId, setActiveId] = useState(null);
  console.log(pageSetup);
  const [pageSize, setPageSize] = useState({
    width: 1024,
    height: 576,
  });
  useEffect(() => {
    if (pageSetup?.size) {
      setPageSize({
        height: parseInt(pageSetup?.size?.height?.split("px")[0]),
        width: parseInt(pageSetup?.size?.width?.split("px")[0]),
      });
    }
  }, [pageSetup]);
  const [updatedSelectedItem, setUpdatedSelectedItem] = useState(
    items.find((el) => el.id === selectedItem?.id)
  );
  const [position, setPosition] = useState(
    items.find((el) => el.id === selectedItem?.id)?.position
  );
  const [transformObject, setTransformObject] = useState(
    items.find((el) => el.id === selectedItem?.id)?.transformObject
  );
  useEffect(() => {
    const item = items.find((el) => el.id === selectedItem?.id);
    if (item) {
      setUpdatedSelectedItem(item);
    }
  }, [items, selectedItem]);
  useEffect(() => {
    const item = items.find((el) => el.id === selectedItem?.id);
    if (item) {
      updateItem({ ...item, position: position });
    }
  }, [position]);
  useEffect(() => {
    const item = items.find((el) => el.id === selectedItem?.id);
    if (item) {
      console.log(transformObject);
      updateItem({ ...item, transformObject: transformObject });
    }
  }, [transformObject]);

  return (
    <div className="flex-col">
      <div className="p-4 border-b-2">
        <p className="text-[14px] text-[#05686e]">Position</p>
      </div>
      <div className="w-full overflow-y-auto max-h-[calc(100vh-170px)]">
        <Tabs
          aria-label="Options"
          color="secondary"
          variant="underlined"
          classNames={{
            base: "w-full",
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#05686e]",
            tab: "w-full px-0 h-12",
            tabContent: "group-data-[selected=true]:text-[#05686e]",
          }}
        >
          <Tab key="arrange" title="Arrange">
            <div className="flex-col">
              <div className="px-4 flex flex-col gap-2 border-b-2 pb-2 mb-2">
                <div className="grid grid-cols-2 pt-2 gap-4">
                  <Button
                    className="justify-start"
                    aria-label="Bring To Front"
                    size="sm"
                    variant="light"
                    onPress={() => {
                      console.log(items);
                      const index = items.findIndex(
                        (item) => item.id === updatedSelectedItem.id
                      );

                      if (index !== -1) {
                        const newItems = [...items];
                        const removedItem = newItems.splice(index, 1)[0];
                        newItems.push(removedItem);
                        console.log(newItems);
                        setItems(newItems);
                      }
                      // let highestLayer = -Infinity;
                      // items.forEach((obj) => {
                      //   if (obj.layer > highestLayer) {
                      //     highestLayer = obj.layer;
                      //   }
                      // });
                      // const updatedItem = {
                      //   ...updatedSelectedItem,
                      //   layer: highestLayer + 1,
                      // };
                      // updateItem(updatedItem);
                    }}
                    startContent={<BringToFront size={18} />}
                  >
                    To Front
                  </Button>
                  <Button
                    className="justify-start"
                    aria-label="Bring Forward"
                    size="sm"
                    variant="light"
                    startContent={<ChevronsUp size={18} />}
                    onPress={() => {
                      const index = items.findIndex(
                        (item) => item.id === updatedSelectedItem.id
                      );
                      if (index !== -1 && index !== items.length - 1) {
                        const newItems = [...items];
                        const removedItem = newItems.splice(index, 1)[0];
                        newItems.splice(index + 1, 0, removedItem);
                        console.log(newItems);
                        setItems(newItems);
                      }
                      // const updatedItem = {
                      //   ...updatedSelectedItem,
                      //   layer: updatedSelectedItem?.layer + 1,
                      // };
                      // updateItem(updatedItem);
                    }}
                  >
                    Forward
                  </Button>
                  <Button
                    className="justify-start"
                    aria-label="Send Backward"
                    size="sm"
                    variant="light"
                    startContent={<ChevronsDown size={18} />}
                    onPress={() => {
                      const index = items.findIndex(
                        (item) => item.id === updatedSelectedItem.id
                      );
                      if (index !== -1 && index !== 0) {
                        const newItems = [...items];
                        const removedItem = newItems.splice(index, 1)[0];
                        newItems.splice(index - 1, 0, removedItem);
                        console.log(newItems);
                        setItems(newItems);
                      }
                      // if (updatedSelectedItem?.layer === 0) {
                      //   const newItems = items.map((el) => {
                      //     if (el.pageIndex === selectedPage?.pageIndex) {
                      //       if (el.id !== selectedItem.id) {
                      //         console.log(el.layer);
                      //         return { ...el, layer: el.layer + 1 };
                      //       } else {
                      //         return el;
                      //       }
                      //     } else {
                      //       return el;
                      //     }
                      //   });
                      //   setItems(newItems);
                      // } else {
                      //   const newLayer = updatedSelectedItem?.layer - 1;
                      //   const updatedItem = {
                      //     ...updatedSelectedItem,
                      //     layer: newLayer <= 0 ? 0 : newLayer,
                      //   };
                      //   updateItem(updatedItem);
                      // }
                    }}
                  >
                    Backward
                  </Button>
                  <Button
                    className="justify-start"
                    aria-label="Send To Back"
                    size="sm"
                    variant="light"
                    startContent={<SendToBack size={18} />}
                    onPress={() => {
                      const index = items.findIndex(
                        (item) => item.id === updatedSelectedItem.id
                      );
                      if (index !== -1) {
                        const newItems = [...items];
                        const removedItem = newItems.splice(index, 1)[0];
                        newItems.unshift(removedItem);
                        console.log(newItems);
                        setItems(newItems);
                      }
                      // let lowestLayer = Infinity;
                      // items.forEach((obj) => {
                      //   if (obj.layer < lowestLayer) {
                      //     lowestLayer = obj.layer;
                      //   }
                      // });
                      // lowestLayer = lowestLayer <= 0 ? 0 : lowestLayer - 1;
                      // const updatedItem = {
                      //   ...updatedSelectedItem,
                      //   layer: lowestLayer,
                      // };
                      // updateItem(updatedItem);
                    }}
                  >
                    To Back
                  </Button>
                </div>
              </div>
              <div className="px-4 flex flex-col gap-2 border-b-2 pb-2 mb-2">
                <span className="pt-2 pb-2 text-[12px]">Align to page</span>
                <div className="w-full h-full" id="alignDiv">
                  
                </div>
              </div>
            </div>
          </Tab>
          <Tab key="layers" title="Layers">
            <div className="flex flex-col">
              <div className="p-4 flex flex-col">
                <div>
                  <div className="flex flex-col p-4 pt-0 w-full gap-2 ">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      onDragStart={handleDragStart}
                    >
                      <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                      >
                        {Array.isArray(items) &&
                          items
                            .filter(
                              (item) =>
                                item.pageIndex === selectedPage.pageIndex
                            )
                            .slice()
                            .reverse()
                            .map((item, index) => {
                              console.log(items);
                              return (
                                <div
                                  key={index}
                                  className="bg-gray-200 px-2 py-1  cursor-pointer rounded-md flex items-center justify-center"
                                >
                                  <LayerItemRenderer item={item} />
                                </div>
                              );
                            })}
                      </SortableContext>
                      {createPortal(
                        <DragOverlay>
                          {activeId && (
                            <div className="bg-gray-200 px-2 py-1 cursor-pointer rounded-md flex items-center justify-center">
                              <LayerItemRenderer
                                item={items.find(
                                  (item) => item.id === activeId
                                )}
                              />
                            </div>
                          )}
                        </DragOverlay>,
                        document.body
                      )}
                    </DndContext>
                    <div className="bg-gray-200 px-2 py-1  cursor-pointer rounded-md flex items-center justify-center">
                      <div className="flex items-center justify-center w-full">
                        <div className="h-[50px] w-full flex justify-center max-w-[180px] flex-2 items-center ">
                          <div className="h-[25px] bg-white w-full"></div>
                        </div>
                        {/* <div className="justify-end flex items-center">
                          <GripVertical />
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
  function handleDragStart(event) {
    const { active } = event;
    console.log(active);
    setActiveId(active.id);
  }
  function handleDragEnd(event) {
    const { active, over } = event;
    console.log("active", active, "over", over);

    if (active.id && over.id) {
      if (active.id !== over.id) {
        console.log(items);
        const oldIndex = items.findIndex((el) => el.id === active.id);
        const newIndex = items.findIndex((el) => el.id === over.id);
        console.log(oldIndex, newIndex);
        const newItems = [...items];
        const [removedItem] = newItems.splice(oldIndex, 1);
        console.log(newItems);
        newItems.splice(newIndex, 0, removedItem);
        console.log(newItems);
        setItems(newItems);
        // setUpdate((prev) => !prev);
      }
    }
  }
};

export default ShapeConfigTab;
