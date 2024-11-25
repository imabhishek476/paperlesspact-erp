import React, { useEffect, useState } from "react";
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
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignStartHorizontal,
  BringToFront,
  ChevronsDown,
  ChevronsUp,
  GripVertical,
  SendToBack,
} from "lucide-react";
import { Button, Tab, Tabs } from "@nextui-org/react";
import { useDocItemStore } from "../stores/useDocItemStore";
import LayerItemRenderer from "./LayerItemRenderer";
import { usePageDataStore } from "../stores/usePageDataStore";
import { useTabsStore } from "../stores/useDocTabsStore";

const Position = ({
  selectedItem,
  items,
  // setItems,
  sharedItems,
  updateSharedItem,
  setUpdate,
  setSelectedItem,
  activePageIndex,
  setActivePageIndex,
}) => {
  const { updateItem, setItems,backgroundItemUpdate } = useDocItemStore();
  const { pages } = usePageDataStore();
  const {isApprover} = useTabsStore()
  const [positionUpdate, setPositionUpdate] = useState(false);
  console.log(pages);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [activeId, setActiveId] = useState(null);
  const [newItems, setNewItems] = useState(items);
  // const [sortedItems,setSortedItems] =useState([])
  console.log(selectedItem);
  console.log(items);

  // useEffect(() => {
  //   const newItems = items.filter((item) => item.type !== 'background');
  //   newItems.sort((a, b) => a.pageIndex - b.pageIndex);
  //   console.log(newItems)

  //   const sortedItems = [];
  //   let previousPageIndex = null;

  //   newItems.forEach((item) => {
  //     if (item.pageIndex !== previousPageIndex) {
  //       const backgroundItemWithPageIndex = {
  //         id: `backgroundItem${item.pageIndex}`,
  //         type: "background",
  //         pageIndex: item.pageIndex,
  //       };
  //       sortedItems.push(backgroundItemWithPageIndex);
  //     }
  //     sortedItems.push(item);
  //     previousPageIndex = item.pageIndex;
  //   });
  //   console.log(sortedItems)
  //   // debugger
  //   setItems(sortedItems);
  // }, [backgroundItemUpdate]);
  
  useEffect(() => {
    console.log(items)
    const newItems = [...items];
    let backgroundIndex = -1;
  
    for (let i = 0; i < newItems.length; ++i) {
      if (newItems[i].type === "background" && newItems[i].pageIndex === activePageIndex) {
        backgroundIndex = i;
        break;
      }
    }
    for (let i = 0; i < newItems.length; ++i) {
      if (i < backgroundIndex && newItems[i].pageIndex === activePageIndex) {
        newItems[i].layer = -2;
      } else if (i > backgroundIndex && newItems[i].pageIndex === activePageIndex) {
        newItems[i].layer = 1;
      }
    }
  
    setItems(newItems);
  }, [positionUpdate]); 

  return (
    <>
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
                {/* <span className=" pb-2 text-[12px]">Layer :</span> */}
                <div className="grid grid-cols-2 pt-2 gap-4">
                  <Button
                    className="justify-start"
                    aria-label="Bring To Front"
                    size="sm"
                    variant="light"
                    isDisabled={!selectedItem}
                    onPress={() => {
                      const item = items.find(
                        (el) => el.id === selectedItem.id
                      );
                      const index = items.findIndex(
                        (item) => item.id === selectedItem.id
                      );

                      if (index !== -1) {
                        const newItems = [...items];
                        const removedItem = newItems.splice(index, 1)[0];
                        newItems.push(removedItem);
                        console.log(newItems);
                        setItems(newItems);
                      }

                      setUpdate((prev) => !prev);
                      setPositionUpdate((prev) => !prev);

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
                      //   setSelectedItem({
                      //     ...item,
                      //     layer: highestLayer + 1,
                      //   });
                      // } else {
                      //   updateItem({ ...item, layer: highestLayer + 1 });
                      //   setSelectedItem({
                      //     ...item,
                      //     layer: highestLayer + 1,
                      //   });
                      //   setUpdate((prev) => !prev);
                      //   // setItems((prev) => {
                      //   //   const index = prev.findIndex(
                      //   //     (el) => el.id === selectedItem.id
                      //   //   );
                      //   //   if (index !== -1) {
                      //   //     const removed = prev.splice(index, 1);
                      //   //   }
                      //   //   console.log(selectedItem.layer);
                      //   //   prev.push({
                      //   //     ...item,
                      //   //     layer: highestLayer + 1,
                      //   //   });
                      //   //   console.log(selectedItem);
                      //   //   setSelectedItem({
                      //   //     ...item,
                      //   //     layer: highestLayer + 1,
                      //   //   });
                      //   //   setUpdate((prev) => !prev);
                      //   //   return prev;
                      //   // });
                      // }
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
                    isDisabled={!selectedItem}
                    startContent={<ChevronsUp size={18} />}
                    onPress={() => {
                      const item = items.find(
                        (el) => el.id === selectedItem.id
                      );

                      const index = items.findIndex(
                        (item) => item.id === selectedItem.id
                      );
                      if (index !== -1 && index !== items.length - 1) {
                        const newItems = [...items];
                        const removedItem = newItems.splice(index, 1)[0];
                        newItems.splice(index + 1, 0, removedItem);
                        console.log(newItems);
                        setItems(newItems);
                      }
                      setUpdate((prev) => !prev);

                      // const nextHigherLayerItem = items
                      //   .filter(
                      //     (el) =>
                      //       el.layer >= selectedItem.layer &&
                      //       el.id !== selectedItem.id
                      //   )
                      //   .map((item) => item.layer);
                      // nextHigherLayerItem.sort((a, b) => a - b);

                      // console.log(items);
                      // if (sharedItems) {
                      //   console.log("hey");
                      //   updateSharedItem(sharedItems, {
                      //     ...item,
                      //     layer: nextHigherLayerItem[0] + 1,
                      //   });
                      //   setSelectedItem({
                      //     ...item,
                      //     layer: nextHigherLayerItem[0] + 1,
                      //   });
                      // } else {
                      //   if (nextHigherLayerItem.length > 0) {
                      //     console.log("hey");
                      //     updateItem({
                      //       ...item,
                      //       layer: nextHigherLayerItem[0] + 1,
                      //     });
                      //     setSelectedItem({
                      //       ...item,
                      //       layer: nextHigherLayerItem[0] + 1,
                      //     });
                      //   }
                      //   // else{
                      //   //   updateItem({  ...item,
                      //   //     layer: selectedItem.layer + 1,})
                      //   //     setSelectedItem({
                      //   //       ...item,
                      //   //       layer: selectedItem.layer + 1,
                      //   //     });
                      //   // }

                      //   setUpdate((prev) => !prev);
                      //   // setItems((prev) => {
                      //   //   const index = prev.findIndex(
                      //   //     (el) => el.id === selectedItem.id
                      //   //   );
                      //   //   if (index !== -1) {
                      //   //     const removed = prev.splice(index, 1);
                      //   //   }
                      //   //   console.log(selectedItem.layer);
                      //   //   prev.push({
                      //   //     ...item,
                      //   //     layer: selectedItem.layer + 1,
                      //   //   });
                      //   //   console.log(selectedItem);
                      //   //   setSelectedItem({
                      //   //     ...item,
                      //   //     layer: selectedItem.layer + 1,
                      //   //   });
                      //   //   setUpdate((prev) => !prev);
                      //   //   return prev;
                      //   // });
                      // }
                    }}
                  >
                    Forward
                  </Button>
                  <Button
                    className="justify-start"
                    aria-label="Send Backward"
                    size="sm"
                    variant="light"
                    isDisabled={!selectedItem}
                    startContent={<ChevronsDown size={18} />}
                    onPress={() => {
                      const item = items.find(
                        (el) => el.id === selectedItem.id
                      );

                      const index = items.findIndex(
                        (item) => item.id === selectedItem.id
                      );
                      if (index !== -1 && index !== 0) {
                        const newItems = [...items];
                        const removedItem = newItems.splice(index, 1)[0];
                        newItems.splice(index - 1, 0, removedItem);
                        console.log(newItems);
                        setItems(newItems);
                      }

                      setUpdate((prev) => !prev);

                      // const firstLowerLayerItem = items
                      //   .filter(
                      //     (el) =>
                      //       el.layer <= selectedItem.layer &&
                      //       el.id !== selectedItem.id
                      //   )
                      //   .map((item) => item.layer);
                      // firstLowerLayerItem.sort((a, b) => b - a);

                      // if (sharedItems) {
                      //   updateSharedItem(sharedItems, {
                      //     ...item,
                      //     layer: firstLowerLayerItem[0] - 1,
                      //   });
                      //   setSelectedItem({
                      //     ...item,
                      //     layer: firstLowerLayerItem[0] - 1,
                      //   });
                      // } else {
                      //   if (firstLowerLayerItem.length > 0) {
                      //     updateItem({
                      //       ...item,
                      //       layer: firstLowerLayerItem[0] - 1,
                      //     });
                      //     setSelectedItem({
                      //       ...item,
                      //       layer: firstLowerLayerItem[0] - 1,
                      //     });
                      //   }
                      //   setUpdate((prev) => !prev);
                      //   // setItems((prev) => {
                      //   //   const index = prev.findIndex(
                      //   //     (el) => el.id === selectedItem.id
                      //   //   );
                      //   //   if (index !== -1) {
                      //   //     const removed = prev.splice(index, 1);
                      //   //   }
                      //   //   prev.push({
                      //   //     ...item,
                      //   //     layer: selectedItem.layer - 1,
                      //   //   });
                      //   //   setSelectedItem({
                      //   //     ...item,
                      //   //     layer: selectedItem.layer - 1,
                      //   //   });
                      //   //   setUpdate((prev) => !prev);

                      //   //   return prev;
                      //   // });
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
                    isDisabled={!selectedItem}
                    startContent={<SendToBack size={18} />}
                    onPress={() => {
                      const item = items.find(
                        (el) => el.id === selectedItem.id
                      );
                      const index = items.findIndex(
                        (item) => item.id === selectedItem.id
                      );
                      if (index !== -1) {
                        const newItems = [...items];
                        const removedItem = newItems.splice(index, 1)[0];
                        newItems.unshift(removedItem);
                        console.log(newItems);
                        setItems(newItems);
                      }

                      setUpdate((prev) => !prev);
                      setPositionUpdate((prev) => !prev);
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
                      //   setSelectedItem({
                      //     ...item,
                      //     layer: lowestLayer - 1,
                      //   });
                      // } else {
                      //   updateItem({ ...item, layer: lowestLayer - 1 });
                      //   setSelectedItem({
                      //     ...item,
                      //     layer: lowestLayer - 1,
                      //   });
                      //   setUpdate((prev) => !prev);
                      //   // setItems((prev) => {
                      //   //   const index = prev.findIndex(
                      //   //     (el) => el.id === selectedItem.id
                      //   //   );
                      //   //   if (index !== -1) {
                      //   //     const removed = prev.splice(index, 1);
                      //   //   }
                      //   //   console.log(selectedItem.layer);
                      //   //   prev.push({
                      //   //     ...item,
                      //   //     layer: lowestLayer - 1,
                      //   //   });
                      //   //   console.log(selectedItem);
                      //   //   setSelectedItem({
                      //   //     ...item,
                      //   //     layer: lowestLayer - 1,
                      //   //   });
                      //   //   setUpdate((prev) => !prev);
                      //   //   return prev;
                      //   // });
                      // }
                    }}
                  >
                    To Back
                  </Button>
                </div>
              </div>
              <div className="px-4 flex flex-col gap-2 border-b-2 pb-2 mb-2">
                <span className="pt-2 pb-2 text-[12px]">Align to page</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <Button
                      className="justify-start"
                      aria-label="Align Top"
                      size="sm"
                      isDisabled={!selectedItem}
                      startContent={<AlignStartHorizontal size={18} />}
                      variant="light"
                      onPress={() => {
                        console.log(selectedItem);
                        let posX = selectedItem?.position?.x;
                        let posY = "2%";
                        console.log(posX, posY);
                        if (sharedItems) {
                          updateSharedItem(sharedItems, {
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                        } else {
                          updateItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
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
                          //     (el) => el.id === selectedItem.id
                          //   );
                          //   if (index !== -1) {
                          //     const removed = prev.splice(index, 1);
                          //   }
                          //   console.log(selectedItem.layer);
                          //   prev.push({
                          //     ...selectedItem,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   });
                          //   console.log(selectedItem);
                          //   setSelectedItem(prev=>{return{
                          //     ...prev,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   }});
                          //   setUpdate((prev) => !prev);
                          //   return prev;
                          // });
                        }
                      }}
                    >
                      Top
                    </Button>
                    <Button
                      className="justify-start"
                      aria-label="Align Middle"
                      size="sm"
                      isDisabled={!selectedItem}
                      startContent={<AlignCenterHorizontal size={18} />}
                      variant="light"
                      onPress={() => {
                        console.log(selectedItem);
                        let posX = selectedItem?.position?.x;
                        let posY = "50%";
                        const containerHeight =
                          document?.getElementById("editorShell")
                            ?.offsetHeight || 1080;
                        const offsetY =
                          (selectedItem?.size.width / 2 / containerHeight) *
                          100;
                        console.log(posX, posY);
                        posY = `${50 - offsetY}%`;
                        if (sharedItems) {
                          updateSharedItem(sharedItems, {
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                        } else {
                          updateItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
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
                          //     (el) => el.id === selectedItem.id
                          //   );
                          //   if (index !== -1) {
                          //     const removed = prev.splice(index, 1);
                          //   }
                          //   console.log(selectedItem.layer);
                          //   prev.push({
                          //     ...selectedItem,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   });
                          //   console.log(selectedItem);
                          //   setSelectedItem(prev=>{return{
                          //     ...prev,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   }});
                          //   setUpdate((prev) => !prev);
                          //   return prev;
                          // });
                        }
                      }}
                    >
                      Middle
                    </Button>
                    <Button
                      className="justify-start"
                      aria-label="Send Backward"
                      size="sm"
                      isDisabled={!selectedItem}
                      startContent={<AlignEndHorizontal size={18} />}
                      variant="light"
                      onPress={() => {
                        console.log(selectedItem);
                        let posX = selectedItem?.position?.x;
                        let posY = selectedItem?.position?.y;
                        const containerHeight =
                          document.getElementById("editorShell")
                            ?.offsetHeight || 1080;
                        const offsetY =
                          (selectedItem?.size?.height / containerHeight) * 100;
                        posY = `${100 - offsetY - 4}%`;
                        if (sharedItems) {
                          updateSharedItem(sharedItems, {
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                        } else {
                          updateItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
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
                          //     (el) => el.id === selectedItem.id
                          //   );
                          //   if (index !== -1) {
                          //     const removed = prev.splice(index, 1);
                          //   }
                          //   console.log(selectedItem.layer);
                          //   prev.push({
                          //     ...selectedItem,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   });
                          //   console.log(selectedItem);
                          //   setSelectedItem(prev=>{return {
                          //     ...prev,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   }});
                          //   setUpdate((prev) => !prev);
                          //   return prev;
                          // });
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
                      isDisabled={!selectedItem}
                      startContent={<AlignHorizontalJustifyStart size={18} />}
                      variant="light"
                      onPress={() => {
                        console.log(selectedItem);
                        let posX = "0%";
                        let posY = selectedItem?.position?.y;
                        console.log(posX, posY);
                        if (sharedItems) {
                          updateSharedItem(sharedItems, {
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                        } else {
                          updateItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
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
                          //     (el) => el.id === selectedItem.id
                          //   );
                          //   if (index !== -1) {
                          //     const removed = prev.splice(index, 1);
                          //   }
                          //   console.log(selectedItem.layer);
                          //   prev.push({
                          //     ...selectedItem,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   });
                          //   console.log(selectedItem);
                          //   setSelectedItem(prev=>{return {
                          //     ...prev,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   }});
                          //   setUpdate((prev) => !prev);
                          //   return prev;
                          // });
                        }
                      }}
                    >
                      Left
                    </Button>
                    <Button
                      className="justify-start"
                      aria-label="Bring Forward"
                      size="sm"
                      isDisabled={!selectedItem}
                      startContent={<AlignCenterVertical size={18} />}
                      variant="light"
                      onPress={() => {
                        console.log(selectedItem);
                        let posX = selectedItem?.position?.x;
                        let posY = selectedItem?.position?.y;
                        const containerWidth =
                          document?.getElementById("editorShell")
                            ?.offsetWidth || 768;
                        const offsetX =
                          (selectedItem?.size.width / 2 / containerWidth) * 100;
                        console.log(offsetX);
                        posX = `${50 - offsetX}%`;
                        console.log(posX, posY);
                        if (sharedItems) {
                          updateSharedItem(sharedItems, {
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                        } else {
                          updateItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
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
                          //     (el) => el.id === selectedItem.id
                          //   );
                          //   if (index !== -1) {
                          //     const removed = prev.splice(index, 1);
                          //   }
                          //   console.log(selectedItem.layer);
                          //   prev.push({
                          //     ...selectedItem,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   });
                          //   console.log(selectedItem);
                          //   setSelectedItem(prev=>{return {
                          //     ...prev,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   }});
                          //   setUpdate((prev) => !prev);
                          //   return prev;
                          // });
                        }
                      }}
                    >
                      Center
                    </Button>
                    <Button
                      className="justify-start"
                      aria-label="Send Backward"
                      size="sm"
                      isDisabled={!selectedItem}
                      startContent={<AlignHorizontalJustifyEnd size={18} />}
                      variant="light"
                      onPress={() => {
                        console.log(selectedItem);
                        let posX = selectedItem?.position?.x;
                        let posY = selectedItem?.position?.y;
                        const containerWidth =
                          document.getElementById("editorShell")?.offsetWidth ||
                          768;
                        const offsetY =
                          (selectedItem?.size.width / containerWidth) * 100;
                        posX = `${100 - offsetY}%`;
                        if (sharedItems) {
                          updateSharedItem(sharedItems, {
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                        } else {
                          updateItem({
                            ...selectedItem,
                            top: posY,
                            left: posX,
                            position: {
                              x: posX,
                              y: posY,
                            },
                          });
                          setSelectedItem({
                            ...selectedItem,
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
                          //     (el) => el.id === selectedItem.id
                          //   );
                          //   if (index !== -1) {
                          //     const removed = prev.splice(index, 1);
                          //   }
                          //   console.log(selectedItem.layer);
                          //   prev.push({
                          //     ...selectedItem,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   });
                          //   console.log(selectedItem);
                          //   setSelectedItem(prev=>{return {
                          //     ...prev,
                          //     top: posY,
                          //     left: posX,
                          //     position: {
                          //       x: posX,
                          //       y: posY,
                          //     },
                          //   }});
                          //   setUpdate((prev) => !prev);
                          //   return prev;
                          // });
                        }
                      }}
                    >
                      Right
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab key="layers" title="Layers" isDisabled={isApprover}>
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
                                item.pageIndex === activePageIndex
                            )
                            .slice()
                            .reverse()
                            .map((item, index) => {
                              console.log(items);
                              switch (item.type) {
                                case "text":
                                case "image":
                                case "radio":
                                case "checkbox":
                                case "dropdown":
                                case "file":
                                case "payment":
                                  return;
                              }
                              return (
                                <div
                                  key={index}
                                  className="bg-gray-200 px-2 py-1  cursor-pointer rounded-md flex items-center justify-center border hover:border-gray-600"
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
                    {/* <div className="bg-gray-200 px-2 py-1  cursor-pointer rounded-md flex items-center justify-center">
                      <div className="flex items-center justify-center w-full">
                      <div className="h-[50px] w-full flex justify-center max-w-[180px] flex-2 items-center ">
                          <div className="h-[25px] bg-white w-full">

                          </div>
                        </div>
                        <div className="justify-end flex items-center">
                          <GripVertical />
                        </div>
                        
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
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

        const newItems = [...items];
        const [removedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removedItem);
        // if (active.id === 'backgroundItem') {
        //   for (let i = 0; i < newIndex; i++) {
        //     newItems[i].layer = -2;
        //   }
        // }

        setItems(newItems);
        setUpdate((prev) => !prev);
        setPositionUpdate((prev) => !prev);
      }
    }
  }
};

export default Position;
