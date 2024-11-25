import { TextField } from '@mui/material';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from '@nextui-org/react';
import { ArrowBigLeft, Copy, CopyPlus, GripVertical, Trash2, Upload, X } from 'lucide-react';
import { Resizable } from 're-resizable';
import React, { useEffect, useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import ResizeHandlers from './ResizeHandlers';
import { useTabsStore } from '../stores/useDocTabsStore';
import { usePageDataStore } from '../stores/usePageDataStore';
import { useDocHistory } from '../stores/useDocHistoryStore';


const VideoFillableField = ({
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
  pageOreintation,
  setSelectedItem,
}) => {
  const { addHistory } = useDocHistory()
  const [selected, setSelected] = useState(item?.link ? 'link' : 'file');
  const [link, setLink] = useState(item?.link ? item?.link : null);
  const [linkError, setLinkError] = useState(false);
  const [update, setUpdate] = useState(false);
  const { onClose, onOpen, onOpenChange, isOpen } = useDisclosure();
  const [size, setSize] = useState(item.size)
  const fileInput = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };
  const {isEditable} = usePageDataStore();

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleFileInputChange = async (e) => {
    console.log("hi");
    if (e.target.files && e.target.files.length > 0) {
      updateItem({ ...item, file: e.target.files[0] })
      addHistory({ ...item, thumbnailFile: e.target.files[0] }, "item", "update", item)
      setUpdate((prev) => !prev);
      setSelectedFieldItem(null);
      // setItems((prev) => {
      //   const itemIndex = prev.findIndex((el) => el.id === item.id);
      //   // console.log(itemIndex);
      //   // if (index !== -1) {
      //   //   const removed = prev.splice(
      //   //     index,
      //   //     1
      //   //   );
      //   // }
      //   // console.log([prev.map((el) => el.id === item.id)]);
      //   const newPrev = [...prev];
      //   newPrev[itemIndex] = {
      //     ...item,
      //     file: e.target.files[0],
      //   };
      //   //   console.log(text, item);
      //   console.log(e.target.files[0].size);
      //   setUpdate((prev) => !prev);
      //   setSelectedFieldItem(null);
      //   return newPrev;
      // });
    }
    // fileInput.current.value = null
  };
  const thumbnailInput = useRef(null);

  const handleThumbnailClick = () => {
    thumbnailInput.current.click();
  };
  const handlethumbnailInputChange = async (e) => {
    // console.log(thumbnailInput.current.value);
    if (e.target.files && e.target.files.length > 0) {
      updateItem({ ...item, thumbnailFile: e.target.files[0] })
      addHistory({ ...item, thumbnailFile: e.target.files[0] }, "item", "update", item)
      setUpdate((prev) => !prev);
      setSelectedFieldItem(null);
      // setItems((prev) => {
      //   const itemIndex = prev.findIndex((el) => el.id === item.id);
      //   // console.log(itemIndex);
      //   // if (index !== -1) {
      //   //   const removed = prev.splice(
      //   //     index,
      //   //     1
      //   //   );
      //   // }
      //   // console.log([prev.map((el) => el.id === item.id)]);
      //   const newPrev = [...prev];
      //   newPrev[itemIndex] = {
      //     ...item,
      //     thumbnailFile: e.target.files[0],
      //   };
      //   console.log(e.target.files[0].size);
      //   // setOption(null);
      //   setUpdate((prev) => !prev);
      //   setSelectedFieldItem(null);
      //   return newPrev;
      // });
    }
    // fileInput.current.value = null
  };
  useEffect(() => {
    if (link) {
      const expression =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      const regex = new RegExp(expression);
      const match = regex.test(link);
      if (!match) {
        setLinkError(true);
      } else {
        setLinkError(false);
        updateItem({...item,link: link})
        addHistory({
          ...item, link: link
        }, "item", "update", item)
        setUpdate((prev) => !prev);
        // setItems((prev) => {
        //   const index = prev.findIndex((el) => el.id === item.id);
        //   if (index !== -1) {
        //     const removed = prev.splice(index, 1);
        //   }
        //   prev.push({
        //     ...item,
        //     link: link,
        //   });
        //   setUpdate((prev) => !prev);
        //   return prev;
        // });
      }
    }
  }, [link]);
  // useEffect(() => {
  //   updateItem({...item,size:size})
  //   // setItems((prev) => {
  //   //   const index = prev.findIndex((ele) => ele?.id === item.id);
  //   //   if (index !== -1) {
  //   //     prev[index] = {
  //   //       ...prev[index],
  //   //       size
  //   //     }
  //   //   }
  //   //   return prev.map((ele) => ele);
  //   // })
  // }, [size])
  // console.log(item)
  const maxWidth = pageOreintation === 'landscape' ? 1000 : 700;

  return (
    <Resizable
      defaultSize={{
        width: 300,
        height: 50,
      }}
      maxWidth={maxWidth}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      onResizeStop={(e, direction, ref, d) => {
        // console.log(d.width);
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
        // if (!sharedItems) {
        //   setSize((prev) => {
        //     const width = prev.width + d.width;
        //     if (width > maxWidth) {
        //       return {
        //         width: maxWidth,
        //         height: prev.height + d.height
        //       }
        //     }
        //     return {
        //       width: prev.width + d.width,
        //       height: prev.height + d.height
        //     }
        //   })
        // } else {
        //   updateSharedItem(sharedItems, {
        //     ...item,
        //     width: item.width
        //       ? (item?.width + d.width) > 700
        //         ? 700
        //         : item?.width + d.width
        //       : 300 + d.width,
        //     height: item.height ? item?.height + d.height : 50 + d.height
        //   })
        // }
      }}
      onResizeStart={(e) => {
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
      {!isDragging && isHovered &&isEditable && (
        <span className='absolute w-full top-[-22.7px]  flex justify-end' >
          <p className='flex justify-center h-fit text-[11px] text-white px-[6px] py-[2px] bg-[#e8713c] capitalize'>{'Video/Audio'}
            <span
              className="hover:cursor-pointer flex justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(null);
                addHistory(item, "item", "delete")
                handleRemoveItem(item);
              }}
            >
              <X className="ms-2 w-4 h-4 text-black hover:text-white" />
            </span>
          </p>
        </span>
      )}
      {(update || !update) && (
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
            cursor: 'grap',
          }}
          id={item.id}
          // draggable="true"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedItem(item);
          }}
          // onDragStart={(e) => setSelectedFieldItem(item)}
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
            <ResizeHandlers />
          }
          <div
            onContextMenu={(e) => {
              e.preventDefault();
              setItemClicked(true);
              setMenuItem(item);
            }}
            className="relative w-full h-full flex justify-center items-center">
            
            {
              isEditable &&
              <>
              <GripVertical className="text-[#05686E]" />
              <span className="text-[12px] break-all " onClick={onOpen}>
              Click here to {(item?.file || item?.link) ? "update" : "add"} video/audio link/file.
            </span>
              </>
            }
            <div className="h-full flex flex-col justify-center items-center">
            </div>
          </div>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Add Video/Audio
                  </ModalHeader>
                  <ModalBody>
                    <div className="w-full flex flex-col gap-4">
                      <RadioGroup
                        label="Select video input type."
                        orientation="horizontal"
                        color="secondary"
                        value={selected}
                        onValueChange={setSelected}
                      >
                        <Radio value="file">File</Radio>
                        <Radio value="link">Link</Radio>
                      </RadioGroup>
                      {selected === 'link' ? (
                        <>
                          <TextField
                          fullWidth
                            sx={{ mb: 0, }}
                            label="Enter Link*"
                            color="secondary"
                            size="small"
                            variant="outlined"
                            value={link}
                            onChange={(e) => {
                              setLink(e.target.value);
                            }}
                            name="link"
                            id="link"
                            error={linkError}
                            helperText={
                              linkError && (
                                <span className="text-danger">
                                  Please enter valid link.
                                </span>
                              )
                            }
                          />
                        </>
                      ) : (
                        <div
                          className="flex items-center gap-2 cursor-pointer border-dashed border-2 p-2 justify-start"
                          onClick={handleClick}
                        >
                          <input
                            // accept={accept}
                            // multiple={multiple}
                            type="file"
                            ref={fileInput}
                            onChange={handleFileInputChange}
                            accept="video/mp4,video/x-m4v,video/*"
                            //   className='w-full'
                            hidden
                          />
                          <Upload sx={{ fontSize: '40px' }} />
                          {!item.file && !item.link && <span>Upload</span>}
                          {item?.file && <span className='truncate break-all'>{item?.file?.name}</span>}
                          {item?.link && <span className='truncate break-all'>{item?.link}</span>}
                        </div>
                      )}
                      <div
                        className="flex items-center gap-2 cursor-pointer border-dashed border-2 p-2 justify-start"
                        onClick={handleThumbnailClick}
                      >
                        <input
                          // accept={accept}
                          // multiple={multiple}
                          type="file"
                          ref={thumbnailInput}
                          onChange={handlethumbnailInputChange}
                          accept="image/*"
                          //   className='w-full'
                          hidden
                        />
                        <Upload sx={{ fontSize: '40px' }} />
                        {!item?.thumbnailFile && !item?.thumbnailLink && (
                          <span>Upload Thumbnail (optional)</span>
                        )}
                        {item?.thumbnailFile && <span className='truncate break-all'>{item?.thumbnailFile?.name}</span>}
                        {item?.thumbnailLink && <span className='truncate break-all'>{item?.thumbnailLink}</span>}
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      )}
    </Resizable>
  );
};

export default VideoFillableField;
