import React, { useEffect, useRef, useState } from "react";
import { Resizable } from "re-resizable";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import Placeholder from "../../LexicalTemplatePlayground/lexical-playground/src/ui/Placeholder";
import EditorTheme from "../../LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import PlaygroundNodes from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/PlaygroundNodes";
import { $generateHtmlFromNodes } from '@lexical/html';

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import ToolbarPlugin from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/ToolbarPlugin";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ALargeSmall, Copy, CopyPlus, Pen, PenLine, RefreshCcw, Smile, Trash2, Wand, X } from "lucide-react";
import { $setSelection, BLUR_COMMAND, COMMAND_PRIORITY_NORMAL, EditorState, FOCUS_COMMAND } from "lexical";
import ResizeHandlers from './ResizeHandlers';
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import ListMaxIndentLevelPlugin from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/ListMaxIndentLevelPlugin";
import LinkPlugin from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/LinkPlugin";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useTabsStore } from "../stores/useDocTabsStore";
import VariablesPlugin from '@playground/plugins/VariablesPlugin';
import { usePageDataStore } from "../stores/usePageDataStore";
import { useDocHistory } from "../stores/useDocHistoryStore";
import { HistoryPlugin } from "@/lib/helpers/LexicalHisPlugIn";
import { useSharedHistoryContext } from "@/components/LexicalTemplatePlayground/lexical-playground/src/context/SharedHistoryContext";


const TextAreaField = ({
  setActiveRef,
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
  menuItem,
  activePageIndex,
  pageIndex,
}) => {
  const { historyState } = useSharedHistoryContext();
  const editorRef = useRef(null);
  const { addHistory } = useDocHistory()
  const [size, setSize] = useState(item.size);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const placeholderText = "Enter Text Here...";

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      disabled: !isDraggable
    });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };
  const {isEditable} = usePageDataStore();
  let initialConfig = {
    namespace: "FreeTextfield",
    nodes: [...PlaygroundNodes],
    editorState: null,
    onError: (error) => {
      throw error;
    },
    theme: EditorTheme,
    editable: false
  };
  console.log(item?.ref)
  let initConfig = item?.ref
    ? {
      ...initialConfig,
      editorState:
        typeof item?.ref === "string"
          ? item?.ref
          :
          item?.ref?.editorState?.root?.children?.length === 0
            ? '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Start Writing Here .......","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
            : JSON.stringify(item?.ref?.editorState),
    }
    : { ...initialConfig };
    console.log(initConfig);
  
  if (item?.ref && menuItem && !item?.from) {
    initConfig = { ...initConfig, editor__DEPRECATED: item.ref }
  }
  if (item?.from && item?.editorState) {
    initConfig = { ...initConfig, editorState:typeof item?.editorState  === 'string' ? item?.editorState : JSON.stringify(item?.editorState) }
  }
  useEffect(() => {
    console.log(item,pageIndex);
    console.log(typeof item?.editorState);
    if (item?.from && item?.editorState && typeof item?.editorState !== 'string' ) {
      // const editorState = typeof item?.editorState === 'string' ? item?.editorState : JSON.stringify(item?.editorState);
      // const editorState = item?.ref?.current?.getEditorState();
      editorRef.current.setEditorState(item?.editorState);
      // $setSelection(null);
    }
  }, [item?.editorState])
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (item?.from) {
      if (activePageIndex === pageIndex) {
        editorRef?.current?.setEditable(true)
      }
      else {
        editorRef?.current?.setEditable(false)
      }
    }
    else {
      setActive(true)
    }
  }, [activePageIndex])
  useEffect(() => {
    if (editorRef) {
      updateItem({ ...item, ref: editorRef.current })
      // setItems((prev) => {
      //   console.log(prev);
      //   if (prev) {
      //     const index = prev.findIndex((ele) => ele?.id === item.id);
      //     if (index !== -1) {
      //       prev[index] = {
      //         ...prev[index],
      //         ref: editorRef?.current,
      //       };
      //     }
      //   }

      //   return prev.map((ele) => ele);
      // });

      // const removeFocusCommand = editorRef.current.registerCommand(
      //   FOCUS_COMMAND,
      //   () => {
      //     setIsEditorActive(true);
      //   },
      //   COMMAND_PRIORITY_NORMAL
      // );
      const removeBlurCommand =
        editorRef.current.registerCommand(
          BLUR_COMMAND,
          () => {
            setIsEditorActive(false);
          },
          COMMAND_PRIORITY_NORMAL
        );
      return () => {
        // removeFocusCommand();
        removeBlurCommand();
      }
    }
  }, [editorRef]);

  function handleInputHeightChange() {
    if(!isEditable) return;
    const inputField = document.getElementById(item.id);
    console.log(inputField)
    const inputHeight = inputField.scrollHeight;
    if (item?.from) {
      console.log(item.ref)
      // item.ref.setEditorState(null);
    }
    else {
      if (inputHeight > size.height) {
        setSize((prev) => {
          return { ...prev, height: inputHeight };
        });
      }
    }

    // updateItem({...item,ref:editorRef.current})
  }
  useEffect(() => {
    if (isHovered) {
      setActiveRef(item.ref);
    }
  }, [isHovered, item.ref]);
  useEffect(() => {
    if (isEditorActive) {
      setIsDraggable(false);
    } else {
      setIsDraggable(true);
    }
  }, [isEditorActive])
  // useEffect(() => {
  //   console.log(editorRef);
  //   updateItem({ ...item, size: size, ref: editorRef.current })
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
  // if(item?.from && editorRef?.current && item?.editorState){
  //   console.log(item.ref)
  //   editorRef?.current?.setEditorState(item?.editorState);
  //   // editorRef?.current.set(item.editorState.clone(null));
  // }
  console.log(activePageIndex, pageIndex);
  const maxWidth = pageOreintation === 'landscape' ? 1000 : 700;
  const handleAIClick = (editor, action) => {
    if (editor) {
      editor.update(() => {
        let html = $generateHtmlFromNodes(editor, null);
        if (html) {
          const parser = new DOMParser()
          const parsedString = parser.parseFromString(html, "text/html")
          console.log(parsedString.documentElement.textContent)
        }
      })
    }
  }
  return (
    <>
      <LexicalComposer initialConfig={initConfig}>
        <Resizable
          defaultSize={{
            width: 200,
            height: 151,
          }}
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          maxWidth={maxWidth}
          size={sharedItems ? { height: item.height, width: item.width } : (item?.from ? { height: item.size.height, width: item.size.width } : { height: item.size.height, width: item.size.width })}
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
            //     if (item?.from) {
            //       return {
            //         width: Number(item.size.width) + d.width,
            //         height: Number(item.size.height) + d.height,
            //       };
            //     }
            //     else {
            //       return {
            //         width: prev.width + d.width,
            //         height: prev.height + d.height,
            //       }
            //     }
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
          onResizeStart={(e) => {
            console.log(e);
            setMenuOpen(false);
            setItemClicked(false);
          }}
          // updateSize={{height:300}}
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
          {!isDragging && isHovered &&isEditable && <ResizeHandlers />}

          <div
            onContextMenu={(e) => {
              e.preventDefault();
              e.preventDefault();
              if (!item?.from) {
                setItemClicked(true);
                // setClicked(true)
                setMenuItem(item)
              }
              // setItemClicked(true);
              // setMenuItem(item)
              // setClicked(true)
              // const cont = document.getElementById(item?.id)
              // console.log(cont.getBoundingClientRect().x)
              // const ItemX = cont.getBoundingClientRect().x
              // const ItemY = cont.getBoundingClientRect().y
              // setPoints({
              //   x: e.clientX - ItemX,
              //   y: e.clientY - ItemY,
              // });
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
                (isHovered || isDragging || isEditorActive) && isEditable 
                  ? "3px solid #e8713c"
                  : "3px solid #e8713c00",
              // backgroundColor: 'rgba(0, 112, 240, 0.2)',
              cursor: "grab",
              // position:'relative'
            }}
            id={item.id}
            // draggable="true"
            onClick={(e) => {
              e.stopPropagation();
              if(!item?.from){
                setSelectedItem(item);
              }
          
            }}
            // onDragStart={(e) => setSelectedFieldItem({ ...item, size })}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={` w-full h-full text-[#151513] z-[49]  hover:cursor-pointer`}
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
            onDoubleClick={() => {
              if(!isEditable) return;
              console.log("in dbl click");
              console.log(editorRef);
              if (editorRef && active) {
                console.log("editable");
                editorRef.current.setEditable(true);
                setIsEditorActive(true);
                editorRef.current.focus();
                setIsDraggable(false);
              }
            }}
          >
            {isEditable && isHovered && (
              <span className="absolute   w-[calc(100%-2px)] top-[-22.7px]  flex justify-end ">
                <p className="h-fit text-[11px] text-white px-[6px] py-[2px] bg-[#e8713c]">
                  {item.title ? item.title : "Free Textfield"}
                </p>
                <Popover placement="right">
                  <PopoverTrigger>
                    <span
                      className="hover:cursor-pointer flex justify-center items-center bg-[#e8713c]">
                      <Wand className=" text-black hover:text-white bg-[#e8713c] w-4 h-4" />
                    </span>

                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <div className="w-50 bg-gray-800 text-white text-sm rounded-sm py-2">
                      <ul>
                        {/* <li style={{ display: (copyItem && !itemClicked && menuItem) ? "flex" : "none" }} onClick={() => { handlePaste(), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Clipboard size={20} /> Paste</li> */}
                        <>
                          <li onClick={() => handleAIClick(editorRef.current, "expand")} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Pen size={20} /> Continue Writing</li>
                          <li onClick={() => handleAIClick(editorRef.current, "summarize")} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><PenLine size={20} /> Summarize</li>
                          <li onClick={() => handleAIClick(editorRef.current, "rewrite")} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><RefreshCcw size={20} /> Rewrite</li>
                          <li onClick={() => handleAIClick(editorRef.current, "fun")} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Smile size={20} /> More Fun</li>
                          <li onClick={() => handleAIClick(editorRef.current, "formal")} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><ALargeSmall size={20} /> More Formal</li>
                        </>
                      </ul>
                    </div>
                  </PopoverContent>
                </Popover>
                <span
                  className="hover:cursor-pointer flex justify-center items-center bg-[#e8713c]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(null);
                    addHistory(item, "item", "delete")
                    handleRemoveItem(item);
                  }}
                >
                  <X className="w-4 h-4 text-black hover:text-white" />
                </span>
              </span>
            )}

            <div className="relative">
              <VariablesPlugin  pageIndex={item.pageIndex}/>
              <ListPlugin />
              <CheckListPlugin />
              <ListMaxIndentLevelPlugin maxDepth={7} />
              <LinkPlugin />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className={"ContentEditable__Free__root"} />
                }
                placeholder={
                  <Placeholder className="Placeholder__root__free absolute top-0">
                    {placeholderText}
                  </Placeholder>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <OnChangePlugin onChange={(editorState, editor) => {
                if (item?.from) {
                  editor.update(() => {
                    if(!item.from){
                      updateItem({ ...item, editorState: editorState })
                    }
                    else{
                      const isSame = isEqual(currentEditorState,item?.editorState?.toJSON());
                      if(!isSame){
                        updateItem({ ...item, editorState: editorState.clone(null) })
                      }
                    }
                  });
                }
                else {
                  // handleInputHeightChange()
                }
              }} />
                  <HistoryPlugin addHistory={addHistory}  pageIndex={pageIndex} />
              {/* {autoFocus !== false && <AutoFocusPlugin />} */}
              {/* <EscapeHandlerPlugin onEscape={onEscape} /> */}
              <ClearEditorPlugin />
              {editorRef !== undefined && (
                <EditorRefPlugin editorRef={editorRef} />
              )}
            </div>
          </div>
        </Resizable>
      </LexicalComposer>
    </>
  );
};

export default TextAreaField;
