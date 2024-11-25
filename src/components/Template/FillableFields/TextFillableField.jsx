import { MenuItem, Select } from '@mui/material';
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
  SelectItem,
} from '@nextui-org/react';
import {
  ArrowBigLeft,
  Copy,
  CopyPlus,
  GripHorizontal,
  GripVertical,
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


const TextFillableField = ({
  items,
  item,
  updateItem,
  setSelectedFieldItem,
  handleRemoveItem,
  data,
  recipients,
  sharedItems,
  updateSharedItem,
  setItemClicked,
  setMenuItem,
  setMenuOpen,
  pageSize,
  pageOreintation,
  setSelectedItem,
}) => {
  console.log(items)
  const [text, setText] = useState('');
  const { addHistory } = useDocHistory()
  const [placeholder, setPlaceholder] = useState(item.placeholder || '');
  const [width, setWidth] = useState(300);
  const [value, setValue] = useState(item?.signee?.email);
  const [size, setSize] = useState(item.size);
  const [isHovered,setIsHovered] = useState(false);
  const {attributes, listeners, setNodeRef, transform,isDragging} = useDraggable({
    id: item.id,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };
const {isEditable} = usePageDataStore();
//   useEffect(() => {
//     if (sharedItems) {
//       const yarray = sharedItems.getArray('fillableFields');
//       let index = -1;
//       yarray.map((ele, idx) => {
//         if (item?.signee?.email === ele?.signee?.email) {
//           index = idx;
//         }
//       });
//       if (index !== -1) {
//         const yItem = yarray.get(index);
//         if (yItem && yItem?.signee?.email !== value) {
//           setValue([yItem?.signee?.email])
//         }
//       }
//     }
//   }, [item?.signee?.email])
//   useEffect(()=>{
//     updateItem({...item,size:size})
//     // setItems((prev)=>{
//     //   const index = prev.findIndex((ele)=>ele?.id === item.id);
//     //   if(index!==-1){
//     //     prev[index] = {
//     //       ...prev[index],
//     //       size
//     //     }
//     //   }
//     //   return prev.map((ele)=>ele);
//     // })
//   },[size])
  // useEffect(()=>{
  //   console.log(size)
  // },[size])

  // useEffect(()=>{
  //   console.log(item?.height);
  // },[item?.height])
  const maxWidth = pageOreintation==='landscape'?1000:700;

  return (
    <Resizable
      defaultSize={{
        width: 200,
        height: 50,
      }}
      maxWidth={maxWidth}
      size={sharedItems ? { height: item.height, width: item.width } :  { height: item.size.height, width: item.size.width }}
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
        //       : 300 + d.width,
        //     height: item.height ? item?.height + d.height : 50 + d.height,
        //   });
        // }
      }}
      onResizeStart={(e)=>{
        console.log(e)
        setMenuOpen(false)
        setItemClicked(false)
      }}
      // size={{ height: 50 }}
      boundsByDirection
      // handleComponent={<ArrowBigLeft />}
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
      { !isDragging && isHovered && isEditable &&

        <span className="absolute w-full top-[-22.7px]  flex justify-end">
          <p className="flex justify-center gap-1 items-center h-fit text-[11px] text-white px-[6px] py-[2px] bg-[#e8713c]">
            {item.title === "date"
              ? "Date"
              : item.placeholder
              ? item.placeholder
              : "Textfield"}
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
                    <div className="">
                      <Input
                        variant="bordered"
                        aria-label={item.field}
                        label={"Placeholder"}
                        size="md"
                        className="!bg-transparent relative w-full m-0 !p-0"
                        radius="none"
                        classNames={{
                          inputWrapper: "h-full shadow-none",
                          innerWrapper: "p-0 m-0",
                        }}
                        autoFocus
                        defaultValue={item.placeholder && item.placeholder}
                        value={!sharedItems ? placeholder : item.placeholder}
                        onChange={(e) => {
                          setPlaceholder(e.target.value);
                          if (sharedItems) {
                            updateSharedItem(sharedItems, {
                              ...item,
                              placeholder: e.target.value,
                            });
                          } else {
                            addHistory({...item, placeholder: e.target.value,}, "item", "update", {...item,placeholder:null})
                            updateItem({...item,  placeholder: e.target.value,})
                            // setItems((prev) => {
                            //   const index = prev.findIndex(
                            //     (el) => el.id === item.id
                            //   );
                            //   if (index !== -1) {
                            //     const removed = prev.splice(index, 1);
                            //   }
                            //   prev.push({
                            //     ...item,
                            //     placeholder: e.target.value,
                            //   });
                            //   //   console.log(text, item);

                            //   return prev;
                            // });
                          }
                          // setUpdate((prev) => !prev);
                          // setTextBoxOpen(false)
                        }}
                        // onFocus={()=> {setDisable(true);}}
                        onBlur={(e) => {
                          // console.log('focusout (self or child)');
                          if (e.currentTarget === e.target) {
                            // console.log('blur (self)');
                          }
                          if (!e.currentTarget.contains(e.relatedTarget)) {
                            // console.log('focusleave');
                            // setSelectedFieldItem(null);
                            //   setTextBoxOpen(false);
                          }
                        }}
                        onKeyDown={(event) => {
                          event.stopPropagation();
                        }}
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
                                          (el) => el.email === participant.email
                                        ),
                                      });
                                    } else {
                                      setValue(participant.email);
                                      console.log(participant.email);
                                      updateItem({...item,  signee: recipients?.find(
                                        (el) =>
                                          el.email === participant.email
                                      ),})
                                      addHistory({...item,     signee: recipients?.find(
                                        (el) =>
                                          el.email === participant.email
                                      )}, "item", "update", {...item,signee:null})
                                      // setItems((prev) => {
                                      //   const index = prev.findIndex(
                                      //     (el) => el.id === item.id
                                      //   );
                                      //   if (index !== -1) {
                                      //     const removed = prev.splice(index, 1);
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
      }

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
          // position:'relative'
        }}
        id={item.id}
        onClick={(e)=>{
          e.stopPropagation();
          setSelectedItem(item);
        }}
        // draggable="true"
        // onDragStart={(e) => setSelectedFieldItem({ ...item, size })}
        className={`flex p-1 px-3 w-full h-full text-[#151513] z-[49] items-center hover:cursor-pointer`}
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
          {
            isEditable && 
            <>
            <GripVertical className="text-[#05686E]" />
            </>
          }
          <span className="text-[12px] break-all">
            {!sharedItems
              ? recipients?.find((el) => el.email === value)
                ? `${item?.placeholder || item?.field} placeholder for ${
                    recipients?.find((el) => el.email === value)?.fullname ||
                    recipients?.find((el) => el.email === value)?.email
                  }`
                : `Please Select the Recipient`
              : item?.signee?.fullname
              ? `${item?.placeholder || item?.field} placeholder for ${
                  item?.signee?.fullname
                    ? item?.signee?.fullname
                    : item?.signee?.email
                }`
              : "Please select a recipient"}
          </span>


          
          
          

        </div>
      </div>
    </Resizable>
  );
};

export default TextFillableField;
