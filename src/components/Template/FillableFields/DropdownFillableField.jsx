import { InputAdornment, TextField } from '@mui/material';
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from '@nextui-org/react';
import {
  ArrowBigLeft,
  Copy,
  CopyPlus,
  GripHorizontal,
  GripVertical,
  Image,
  Minus,
  Plus,
  Settings,
  Trash2,
  X,
} from 'lucide-react';
import { Resizable } from 're-resizable';
import React, { useEffect, useState } from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import ResizeHandlers from './ResizeHandlers';
import { useTabsStore } from '../stores/useDocTabsStore';
import { usePageDataStore } from '../stores/usePageDataStore';
import { useDocHistory } from '../stores/useDocHistoryStore';

const DropdownFillableField = ({
  items,
  item,
  updateItem,
  setSelectedFieldItem,
  handleRemoveItem,
  setSelectedItem,
  data,
  update,
  setUpdate,
  recipients,
  sharedItems,
  updateSharedItem,
  setItemClicked,
  setMenuItem,
  setMenuOpen,
  pageOreintation
}) => {
  const { addHistory } = useDocHistory()
  const [value, setValue] = useState(item?.signee?.email);
  const [option, setOption] = useState(new Set([]));
  const [addOption, setAddOption] = useState(`Option ${item.labels.length + 1}`);
  const [size,setSize] = useState(item.size);
  const [isHovered,setIsHovered] = useState(false);

  const {attributes, listeners, setNodeRef, transform,isDragging} = useDraggable({
    id: item.id,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };
  const { isApprover } = useTabsStore();
  const {isEditable} = usePageDataStore();
console.log(item)
//   useEffect(()=>{
//     if(!sharedItems){
//       updateItem({...item, value: option?.currentKey,})
//       // setItems((prev) => {
//       //     const index = prev.findIndex((el) => el.id === item.id);
//       //     if (index !== -1) {
//       //       const removed = prev.splice(index, 1);
//       //     }
  
//       //     prev.push({
//       //       ...item,
//       //       value: option?.currentKey,
//       //     });
//       //     //   console.log(text, item);
//       //     setUpdate((prev) => !prev);
//       //     return prev;
//       //   });
//     }
// },[option])
// useEffect(()=>{
//   // console.log(index);
//   if(sharedItems){
//     const yarray  = sharedItems.getArray('fillableFields');
//     let index=-1;
//     yarray.map((ele,idx)=>{
//       if(item?.signee?.email===ele?.signee?.email){
//         index = idx;
//       }
//     });
//     // console.log(index);
//     if(index!==-1){
//       const yItem = yarray.get(index);
//       if(yItem&&yItem?.signee?.email!==value){
//         setValue([yItem?.signee?.email])
//       }
//     }
//   }
// },[item?.signee?.email])
// useEffect(()=>{
//   updateItem({...item,size:size})
//   // setItems((prev)=>{
//   //   const index = prev.findIndex((ele)=>ele?.id === item.id);
//   //   if(index!==-1){
//   //     prev[index] = {
//   //       ...prev[index],
//   //       size
//   //     }
//   //   }
//   //   return prev.map((ele)=>ele);
//   // })
// },[size])
  // console.log(item);
  const maxWidth = pageOreintation==='landscape'?1000:700;
  return (
    <Resizable
      defaultSize={{
        width: 325,
        height: 80,
      }}
      maxWidth={maxWidth}
      size={sharedItems ? { height: item.height, width: item.width } : { height: item.size.height, width: item.size.width }}
      enable={
            {
              top:isEditable,
              left:isEditable,
              bottom:isEditable,
              right:isEditable,
              topLeft:isEditable,
              topRight:isEditable,
              bottomLeft:isEditable,
              bottomRight:isEditable
            }
          }
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onResizeStop={(e, direction, ref, d) => {
        const width = item.size.width + d.width;
        const height = item.size.height + d.height;
        if(width>maxWidth){
          return {
            width:maxWidth,
            height:prev.height + d.height
          }
        }
        updateItem({ ...item, size: { width: width, height: height }})
        addHistory({ ...item, size: { width: width, height: height }}, "item", "update", item)
        // console.log(d.width);
        // if (!sharedItems) {
        //   setSize((prev) => {
        //     const width = prev.width + d.width;
        //     if (width > maxWidth) {
        //       return {
        //         width: maxWidth,
        //         height: prev.height + d.height,
        //       };
        //     }
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
        //         ? 700
        //         : item?.width + d.width
        //       : 325 + d.width,
        //     height: item.height ? item?.height + d.height : 80 + d.height,
        //   });
        // }
      }}
      onResizeStart={(e)=>{
        console.log(e)
        setMenuOpen(false)
        setItemClicked(false)
      }}
      boundsByDirection
      handleComponent={<ArrowBigLeft />}
      style={{
        position: "absolute",
        top: item.position.y,
        left: item.position.x,
        zIndex: item?.layer+1||1,
        resize: "horizontal",
        // position:'relative'
      }}
      className="resizableItem"
    >
      {!isDragging && isHovered &&isEditable && (
        <span className="absolute  w-full top-[-22.7px]  flex justify-end">
          <p className="flex justify-center items-center gap-1 h-fit text-[11px] text-white px-[6px] py-[2px] bg-[#e8713c] capitalize">
            {item.title ? item.title : "Dropdown"}
            <span
                  className=" hover:cursor-pointer"
                  //   onClick={() => handleRemoveItem(item)}
                >
                  <Popover placement="top" offset={4}>
                    <PopoverTrigger>
                      <Settings className="w-4 h-4 text-black hover:text-white" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="px-1 py-2">
                        <div className="flex flex-col w-full gap-4">
                          {item?.labels?.map((label, index) => {
                            return (
                              <TextField
                                key={index}
                                //   sx={{ width: '100%' }}
                                id="outlined-basic"
                                //   label="Add Option"
                                size="small"
                                //   required
                                color="secondary"
                                variant="outlined"
                                value={label}
                                onChange={(e) => {
                                  if (sharedItems) {
                                    const newLabels = [...item.labels];
                                    newLabels[index] = e.target.value;
                                    updateSharedItem(sharedItems, {
                                      ...item,
                                      labels: newLabels,
                                    });
                                  } else {
                                    const newLabels = [...item.labels];
                                    newLabels[index] = e.target.value;
                                    updateItem({...item, labels: newLabels})
                                    addHistory({...item, labels: newLabels}, "item", "update", {...item,labels:null})
                                    setUpdate((prev) => !prev);
                                    setSelectedFieldItem(null)
                                    // setItems((prev) => {
                                    //   const itemIndex = prev.findIndex(
                                    //     (el) => el.id === item.id
                                    //   );
                                    //   // console.log(itemIndex);
                                    //   // if (index !== -1) {
                                    //   //   const removed = prev.splice(
                                    //   //     index,
                                    //   //     1
                                    //   //   );
                                    //   // }
                                    //   // console.log([
                                    //   //   prev.map((el) => el.id === item.id),
                                    //   // ]);
                                    //   const newLabels = [...item.labels];
                                    //   newLabels[index] = e.target.value;
                                    //   const newPrev = [...prev];
                                    //   newPrev[itemIndex] = {
                                    //     ...item,
                                    //     labels: newLabels,
                                    //   };
                                    //   //   console.log(text, item);
                                    //   // setOption(null);
                                    //   setUpdate((prev) => !prev);
                                    //   setSelectedFieldItem(null);
                                    //   return newPrev;
                                    // });
                                  }
                                }}
                                InputProps={{
                                  maxLength: 10,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      {item.labels.length > 1 && (
                                        <Button
                                          type="button"
                                          size="sm"
                                          radius="sm"
                                          color="danger"
                                          //   className=''
                                          variant="bordered"
                                          isIconOnly
                                          onPress={() => {
                                            if (sharedItems) {
                                              const newLabels = [
                                                ...item.labels,
                                              ];
                                              newLabels.splice(index, 1);
                                              updateSharedItem(sharedItems, {
                                                ...item,
                                                labels: newLabels,
                                              });
                                            }
                                            const newLabels = [
                                              ...item.labels,
                                            ];
                                            newLabels.splice(index, 1);
                                            updateItem({...item, labels: newLabels,})
                                            addHistory({...item, labels: newLabels}, "item", "update", {...item,labels:null})
                                            setUpdate((prev) => !prev);
                                            setSelectedFieldItem(null);
                                            // setItems((prev) => {
                                            //   const itemIndex = prev.findIndex(
                                            //     (el) => el.id === item.id
                                            //   );
                                            //   // console.log(itemIndex);
                                            //   // if (index !== -1) {
                                            //   //   const removed = prev.splice(
                                            //   //     index,
                                            //   //     1
                                            //   //   );
                                            //   // }
                                            //   // console.log([
                                            //   //   prev.map(
                                            //   //     (el) => el.id === item.id
                                            //   //   ),
                                            //   // ]);
                                            //   const newLabels = [
                                            //     ...item.labels,
                                            //   ];
                                            //   newLabels.splice(index, 1);
                                            //   const newPrev = [...prev];
                                            //   newPrev[itemIndex] = {
                                            //     ...item,
                                            //     labels: newLabels,
                                            //   };
                                            //   //   console.log(text, item);
                                            //   // setOption(null);
                                            //   setUpdate((prev) => !prev);
                                            //   setSelectedFieldItem(null);
                                            //   return newPrev;
                                            // });
                                          }}
                                          //   isLoading={isSubmitting}
                                        >
                                          <Minus className="text-red" />
                                        </Button>
                                      )}
                                    </InputAdornment>
                                  ),
                                }}
                                //   error={error}
                                name={`Option ${index}- ${item.id}`}
                                //   helperText={error}
                              />
                            );
                          })}

                          <TextField
                            sx={{ width: "100%" }}
                            id="outlined-basic"
                            label="Add Option"
                            size="small"
                            //   required
                            color="secondary"
                            variant="outlined"
                            value={item.labels.addOption}
                            onChange={(e) => setAddOption(e.target.value)}
                            //   error={error}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button
                                    type="button"
                                    size="sm"
                                    radius="sm"
                                    className="bg-[#fda178] hover:text-[white] hover:bg-[black]"
                                    isIconOnly
                                    onPress={() => {
                                      if (sharedItems) {
                                        updateSharedItem(sharedItems, {
                                          ...item,
                                          labels: [...item.labels, addOption],
                                        });
                                      }
                                      updateItem({...item,  labels: [...item.labels, addOption]})
                                      addHistory({...item,  labels: [...item.labels, addOption]}, "item", "update", {...item,labels: [...item.labels, null]})
                                      setAddOption(
                                        `Option ${item.labels.length + 2}`
                                      );
                                      setUpdate((prev) => !prev);
                                      // setItems((prev) => {
                                      //   const index = prev.findIndex(
                                      //     (el) => el.id === item.id
                                      //   );
                                      //   if (index !== -1) {
                                      //     const removed = prev.splice(index, 1);
                                      //   }
                                      //   // console.log({
                                      //   //   ...item,
                                      //   //   value: addOption,
                                      //   // });
                                      //   prev.push({
                                      //     ...item,
                                      //     labels: [...item.labels, addOption],
                                      //   });
                                      //   //   console.log(text, item);
                                      //   setAddOption(
                                      //     `Option ${item.labels.length + 2}`
                                      //   );
                                      //   setUpdate((prev) => !prev);
                                      //   return prev;
                                      // });
                                    }}
                                    //   isLoading={isSubmitting}
                                  >
                                    <Plus />
                                  </Button>
                                </InputAdornment>
                              ),
                            }}
                            name="Add Option"
                            //   helperText={error}
                          />
                        </div>
                        <Divider />
                        <div className="">
                          <Dropdown>
                            <DropdownTrigger>
                              <Button variant="bordered">
                                {item?.signee?.email ? item?.signee?.email : "Select Recipeint"}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              aria-label="Dynamic Actions"
                              items={recipients?.filter(
                                (recipient) => recipient.signerRole !== "CC"
                              )}
                            >
                              {recipients
                                ?.filter(
                                  (recipient) => recipient.signerRole !== "CC"
                                )
                                ?.map((participant) => {
                                  // console.log(participant)
                                  return (
                                    <DropdownItem
                                      key={participant.email}
                                      // color={participant.key === "delete" ? "danger" : "default"}
                                      // className={participant.key === "delete" ? "text-danger" : ""}
                                      onClick={() => {
                                        if (sharedItems) {
                                          updateSharedItem(sharedItems, {
                                            ...item,
                                            signee: recipients?.find(
                                              (el) =>
                                                el.email === participant.email
                                            ),
                                          });
                                        } else {
                                          // setValue(participant.email);
                                          console.log(participant.email);
                                          updateItem({...item,     signee: recipients?.find(
                                            (el) =>
                                              el.email === participant.email
                                          )})
                                          addHistory({...item,     signee: recipients?.find(
                                            (el) =>
                                              el.email === participant.email
                                          )}, "item", "update", {...item,signee:null})
                                          // setItems((prev) => {
                                          //   const index = prev.findIndex(
                                          //     (el) => el.id === item.id
                                          //   );
                                          //   if (index !== -1) {
                                          //     const removed = prev.splice(
                                          //       index,
                                          //       1
                                          //     );
                                          //   }
                                          //   prev.push({
                                          //     ...item,
                                          //     signee: recipients?.find(
                                          //       (el) =>
                                          //         el.email === participant.email
                                          //     ),
                                          //   });
                                          //   return prev;
                                          // });
                                        }
                                      }}
                                    >
                                      {item?.signee?.email?item?.signee?.email:participant.email}
                                    </DropdownItem>
                                  );
                                })}
                              {/* {(item) => (
                              <DropdownItem
                                key={item.email}
                                // color={item.key === "delete" ? "danger" : "default"}
                                // className={item.key === "delete" ? "text-danger" : ""}
                                onClick={()=>setValue(item.value)}
                              >
                                {item.value}
                              </DropdownItem>
                            )} */}
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </span>
            <span
                  className="hover:cursor-pointer flex justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(null);
                    addHistory(item, "item", "delete")
                    handleRemoveItem(item);
                  }}
                >
                  <X className="w-4 h-4 text-black hover:text-white" />
                </span>
               
          </p>
        </span>
      )}
      {(update || !update) && (
        <>
          <div
            //   key={item.id}
            style={{
              top: item.position.y,
              left: item.position.x,
              // width: '17%',
              // height: '3.6%',
              // resize:"horizontal",
              ...style,
              overflow: isDragging ? "hidden" : "auto",
              border: (isHovered || isDragging) && isEditable ? "3px solid #e8713c" : "3px solid #e8713c00",
              // backgroundColor: 'rgba(0, 112, 240, 0.2)',
              cursor: "grap",
            }}
            id={item.id}
            // draggable="true"
            // onDragStart={(e) => setSelectedFieldItem(item)}
            onClick={(e)=>{
              e.stopPropagation();
              setSelectedItem(item);
            }}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onBlur={() => {
              console.log("yay");
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
            className={`flex p-1 px-3 w-full h-full text-[#151513] z-[49] items-center hover:cursor-pointer`}
          >
            {!isDragging && isHovered && isEditable &&
              <ResizeHandlers/>
            }
            <div 
               onContextMenu={(e) => {
                e.preventDefault();
                setItemClicked(true);
                setMenuItem(item)
              }}
            
            className="relative w-full h-full flex justify-center items-center">
              {isEditable && <GripVertical className="text-[#05686E]" />}
              
              <div className="p-1 w-full">
                <Select
                  variant="bordered"
                  placeholder="Select"
                  radius="none"
                  selectedKeys={option}
                  size="sm"
                  isDisabled={true}
                  onSelectionChange={setOption}
                >
                  {item.labels.map((label, index) => (
                    <SelectItem key={index} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </>
      )}
    </Resizable>
  );
};

export default DropdownFillableField;
