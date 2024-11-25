import { InputAdornment, TextField } from '@mui/material';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from '@nextui-org/react';
import {
  ArrowBigLeft,
  Copy,
  CopyPlus,
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

const CheckboxFillableField = ({
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
  pageOreintation,
}) => {
  // console.log(item);
  const { addHistory } = useDocHistory()
  const [value, setValue] = useState(item?.signee?.email);
  const [isSelected, setIsSelected] = useState(item.isSelected && item.isSelected);
  const [size,setSize] = useState(item.size);
  const [isHovered,setIsHovered] = useState(false);
  const {attributes, listeners, setNodeRef, transform,isDragging} = useDraggable({
    id: item.id,
  });
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };
  const {isEditable} = usePageDataStore();
//   useEffect(() => {
//     if(isDragging){
//       setItemClicked(false)
//     }
//   }, [isDragging]);

//   useEffect(()=>{
//     updateItem({...item, isSelected: isSelected,})
//     // setItems((prev) => {
//     //     const index = prev.findIndex(
//     //       (el) => el.id === item.id
//     //     );
//     //     if (index !== -1) {
//     //       const removed = prev.splice(index, 1);
//     //     }
//     //     prev.push({
//     //       ...item,
//     //       isSelected: isSelected,
//     //     });
//     //     return prev;
//     //   });
// },[isSelected])
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
  // setItems((prev)=>{
  //   const index = prev.findIndex((ele)=>ele?.id === item.id);
  //   if(index!==-1){
  //     prev[index] = {
  //       ...prev[index],
  //       size
  //     }

  //   }
  // }, [isDragging]);

//   useEffect(()=>{
//     updateItem({...item, isSelected: isSelected})
//     // setItems((prev) => {
//     //     const index = prev.findIndex(
//     //       (el) => el.id === item.id
//     //     );
//     //     if (index !== -1) {
//     //       const removed = prev.splice(index, 1);
//     //     }
//     //     prev.push({
//     //       ...item,
//     //       isSelected: isSelected,
//     //     });
//     //     return prev;
//     //   });
// },[isSelected])
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

const maxWidth = pageOreintation==='landscape'?1000:700;
// console.log(sharedItems?{height:item.height,width:item.width}:size);
console.log(maxWidth);
  return (
    <Resizable
      defaultSize={{
        width: 100,
        height: 75,
      }}
      maxWidth={maxWidth}
      onMouseOver={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
      size={sharedItems?{height:item.height,width:item.width}:{ height: item.size.height, width: item.size.width }}
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
      onResizeStop={(e, direction, ref, d)=> {
        // console.log(d.width);
        const width = item.size.width + d.width;
        const height = item.size.height + d.height;
        updateItem({ ...item, size: { width: width, height: height }})
        addHistory({ ...item, size: { width: width, height: height }}, "item", "update", item)
        // if(!sharedItems){
        //   setSize((prev)=>{
        //     const width = prev.width + d.width;
        //     if(width>maxWidth){
        //       return {
        //         width:maxWidth,
        //         height:prev.height + d.height
        //       }
        //     }
        //     return {
        //       width:prev.width + d.width,
        //       height:prev.height + d.height
        //     }
        //   });
          
        // }else{
        //   updateSharedItem(sharedItems,{
        //     ...item,
        //     width:item.width
        //       ?(item?.width + d.width)>700
        //         ?700
        //           :item?.width + d.width
        //             :100+d.width,
        //     height:item.height?item?.height + d.height:75+d.height
        //   })
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
        position: 'absolute',
        top: item.position.y,
        left: item.position.x,
        zIndex: item?.layer+1||1,
        resize: 'horizontal',
        // position:'relative'
      }}
      className="resizableItem"
    >

      {(update || !update) && (
        <>
        { !isDragging&& isHovered && isEditable && 
        <span className='absolute w-full top-[-22.7px]  flex justify-end' >
          
        <p className='flex justify-center items-center gap-1 h-fit text-[11px] text-white px-[6px] py-[2px] bg-[#e8713c] capitalize'>
          {item.title?item.title:'Check Box'}
              
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
                      <Dropdown>
                        <DropdownTrigger>

                          <Button
                            variant="bordered"
                          >
                            {item?.signee?.email ? item?.signee?.email : "Select Recipeint"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions" items={recipients?.filter((recipient) => recipient.signerRole !== "CC")}>
                          {recipients?.filter((recipient) => recipient.signerRole !== "CC")?.map((participant) => {
                            // console.log(participant)
                            return <DropdownItem
                              key={participant.email}
                              // color={participant.key === "delete" ? "danger" : "default"}
                              // className={participant.key === "delete" ? "text-danger" : ""}
                              onClick={() => {
                                if (sharedItems) {
                                  updateSharedItem(sharedItems, {
                                    ...item,
                                    signee: recipients?.find((el) => el.email === participant.email),
                                  })
                                } else {
                                  // setValue(participant.email)
                                  console.log(participant.email)
                                  updateItem({...item, signee: recipients?.find((el) => el.email === participant.email)})
                                  addHistory({...item, signee: recipients?.find((el) => el.email === participant.email)}, "item", "update", {...item,signee:null})
                                  // setItems((prev) => {
                                  //   const index = prev.findIndex(
                                  //     (el) => el.id === item.id
                                  //   );
                                  //   if (index !== -1) {
                                  //     const removed = prev.splice(index, 1);
                                  //   }
                                  //   prev.push({
                                  //     ...item,
                                  //     signee: recipients?.find((el) => el.email === participant.email),
                                  //   });
                                  //   return prev;
                                  // });
                                }
                              }}
                            >
                              {item?.signee?.email?item?.signee?.email:participant.email}
                            </DropdownItem>
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
              overflow: isDragging?  "hidden" :"auto",
            // backgroundColor: 'rgba(0, 112, 240, 0.2)',
            cursor: 'grap',
            border : (isHovered || isDragging) && isEditable ? "3px solid #e8713c" : "3px solid #e8713c00"

          }}
          onClick={(e)=>{
            e.stopPropagation();
            setSelectedItem(item);
          }}
          // draggable="true"
          // onDragStart={(e) => setSelectedFieldItem({...item, size})}
          ref={setNodeRef} {...listeners} {...attributes}
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
          id={item.id}
          className={`flex p-1 px-3 w-full h-full text-[#151513] z-[49] items-center hover:cursor-pointer`}
        >
          {isHovered && isEditable &&
            <ResizeHandlers/>
          }
          <div
             onContextMenu={(e) => {
              e.preventDefault();
              setItemClicked(true);
              // setClicked(true)
              setMenuItem(item)
              // const cont = document.getElementById(item?.id)
              // console.log(cont.getBoundingClientRect().x)
              // const ItemX = cont.getBoundingClientRect().x
              // const ItemY = cont.getBoundingClientRect().y
              // setPoints({
              //   x: e.clientX - ItemX,
              //   y: e.clientY - ItemY,
              // });
            }}
          
          className="relative w-full h-full flex justify-center items-center">
            {isEditable && <GripVertical className="text-[#05686E]" />}
            
            <Checkbox 
            isSelected={!sharedItems?isSelected:item?.isSelected}
            isDisabled={true} 
            onValueChange={setIsSelected} 
            color='secondary'
            onChange={(e)=>{
              // console.log(e.target.value);
              // console.log(e.target.checked);
              if(sharedItems){
                updateSharedItem(sharedItems,{...item,isSelected:e.target.checked})
              }
            }}/>
            
          </div>
        </div>
        {/* {clicked && (
              <div style={{ top: points.y, left: points.x ,zIndex:50}} className="absolute z-999 w-40 bg-gray-800 text-white text-sm rounded-sm py-2">
                <ul>
                  <li onClick={() => { handleDuplicate(item), setClicked(false), setItemClicked(false),setIsHovered(false),setIsSelected(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><CopyPlus size={20} /> Duplicate</li>
                  <li onClick={() =>{ handleCopy(item),setClicked(false), setItemClicked(false),setIsHovered(false),setIsSelected(false)}} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Copy size={20} /> Copy</li>
                  <li onClick={() => handleRemoveItem(item)} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Trash2 size={20} /> Delete</li>
                </ul>
              </div>
            )} */}

        </>
      )}
    </Resizable>
  );
};

export default CheckboxFillableField;
