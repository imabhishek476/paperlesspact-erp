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
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import ToolbarPlugin from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/ToolbarPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import TableCellResizer from "../../LexicalTemplatePlayground/lexical-playground/src/plugins/TableCellResizer";
import TableCellActionMenuPlugin from "../../LexicalTemplatePlayground/lexical-playground/src/plugins/TableActionMenuPlugin";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Copy, CopyPlus, Trash2, X } from "lucide-react";
import { $setSelection, BLUR_COMMAND, COMMAND_PRIORITY_NORMAL, FOCUS_COMMAND } from "lexical";
import ResizeHandlers from "./ResizeHandlers";
import useModal from "@/components/LexicalTemplatePlayground/lexical-playground/src/hooks/useModal";
import { InsertTableDialog } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/TablePlugin";
import InsertLayoutDialog from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/LayoutPlugin/InsertLayoutDialog";
import { LayoutPlugin } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/LayoutPlugin/LayoutPlugin";
import { useDocItemStore } from "../stores/useDocItemStore";
import { useTabsStore } from "../stores/useDocTabsStore";
import { usePageDataStore } from "../stores/usePageDataStore";
import { useDocHistory } from "../stores/useDocHistoryStore";
import VariablesPlugin from '@playground/plugins/VariablesPlugin';
import { HistoryPlugin } from "@/lib/helpers/LexicalHisPlugIn";

const TableField = ({
  setActiveRef,
  items,
  item,
  updateItem,
  setSelectedFieldItem,
  handleRemoveItem,
  setSelectedItem,
  data,
  recipients,
  sharedItems,
  updateSharedItem,
  setItemClicked,
  setMenuItem,
  setMenuOpen,
  menuItem,
  pageOreintation,
}) => {
  console.log(item);
  const { addHistory } = useDocHistory()
  const editorRef = useRef(null);
  const [size, setSize] = useState(item?.size);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const placeholder = "Enter Text Here...";
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);
  const [modal, showModal] = useModal(item, handleRemoveItem);
  const divRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const { setIsTableResizing, setIsTableDragging, setTableActive } =
    useDocItemStore();
  const {isEditable} = usePageDataStore();

  const { attributes, listeners, setNodeRef, transform, isDragging, node } =
    useDraggable({
      id: item.id,
      disabled: !isDraggable,
    });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };
  let initialConfig = {
    namespace: "TableField",
    nodes: [...PlaygroundNodes],
    editorState: null,
    onError: (error) => {
      throw error;
    },
    theme: EditorTheme,
    editable: false,
  };
  let initConfig = item?.ref
    ? {
        ...initialConfig,
        editorState:
          typeof item?.ref === "string"
            ? item?.ref
            : item?.ref?.editorState?.root?.children?.length === 0
            ? '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Start Writing Here .......","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
            : JSON.stringify(item?.ref?.editorState),
      }
    : { ...initialConfig };

  useEffect(() => {
    if (editorRef) {
      console.log("in ref");
      updateItem({ ...item, ref: editorRef?.current });
      // addHistory({ ...item,  ref: editorRef?.current}, "item", "update", item)
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
      if (!item.ref) {
        if (item.render === "table") {
          handleInsertTable(editorRef?.current);
        } else {
          handleColumnInsert(editorRef?.current);
        }
      }

      const removeFocusCommand = editorRef.current.registerCommand(
        FOCUS_COMMAND,
        () => {
          setActiveRef(editorRef.current);
          setTableActive(true);
          $setSelection(null);
        },
        COMMAND_PRIORITY_NORMAL
      );
      const removeBlurCommand = editorRef.current.registerCommand(
        BLUR_COMMAND,
        () => {
          setIsEditorActive(false);
          setTableActive(false);
        },
        COMMAND_PRIORITY_NORMAL
      );
      return () => {
        removeFocusCommand();
        removeBlurCommand();
      };
    }
  }, [editorRef]);
  const isSizeEqual = () => {
    if (item.height === size.height && item.width === size.width) {
      return true;
    }
    return false;
  };
  // useEffect(()=>{
  //   console.log('in size');
  //   if(!isSizeEqual()){
  //     updateItem({...item,size:size,ref: editorRef?.current})
  //   }
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
  if (item?.ref && menuItem) {
    initConfig = { ...initConfig, editor__DEPRECATED: item.ref };
  }
  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null && !isDragging && !isResizing) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const floatingAnchorElem = document.getElementById(`free-${item.id}`);
    console.log(floatingAnchorElem);
    setFloatingAnchorElem(floatingAnchorElem);
  }, [editorRef]);

  useEffect(() => {
    setIsTableDragging(isDragging);
  }, [isDragging]);

  // useEffect(() => {
  //   if (isHovered && isEditorActive ) {
  //     setActiveRef(item.ref);
  //   }

  // }, [isHovered]);

  // console.log(item.id);

  useEffect(() => {
    if (isEditorActive) {
      setIsDraggable(false);
    } else {
      setIsDraggable(true);
    }
  }, [isEditorActive]);

  console.log(item);
  const handleInsertTable = (editorRef) => {
    console.log("in modal");
    showModal("Insert Table", (onClose) => (
      <InsertTableDialog
        setSize={setSize}
        activeEditor={editorRef}
        onClose={onClose}
        fromEditor={false}
        // setSize={null}
      />
    ));
  };
  const handleColumnInsert = (editorRef) => {
    console.log("in modal");
    showModal("Insert Columns Layout", (onClose) => (
      <InsertLayoutDialog
        activeEditor={editorRef}
        onClose={onClose}
        fromEditor={false}
      />
    ));
  };
  // useEffect(()=>{
  //   handleInsertTable()
  // },[])
  const maxWidth = pageOreintation === "landscape" ? 1000 : 700;
  function handleInputHeightChange() {
    if(!isEditable) return;
    const inputField = document.getElementById(item.id);
    console.log(inputField);
    const inputHeight = inputField.scrollHeight;
    if (inputHeight > size.height) {
      setSize((prev) => {
        return { ...prev, height: inputHeight };
      });
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
          // maxHeight={size?.height}
          bounds="parent"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
          onResizeStart={() => {
            setIsResizing(true);
            setIsTableResizing(true);
            editorRef?.current?.blur();
            setMenuOpen(false);
            setItemClicked(false);
          }}
          onResizeStop={(e, direction, ref, d) => {
            setIsResizing(false);
            setIsTableResizing(false);
            // console.log(d.width);
            let tSize = null;
            const width = size.width + d.width;
            // const height = prev.height + d.height;
            // const inputField = document.getElementById(item.id);
            // console.log(inputField);
            // const inputHeight = inputField.scrollHeight;
            // const inputWidth = inputField.scrollWidth;
            // if(width>=inputWidth &&height >= inputHeight ){
            if (width > maxWidth) {
              tSize = {
                width: maxWidth,
                height: size.height + d.height,
              };
              return tSize;
            }
            tSize = {
              width: size.width + d.width,
              height: size.height + d.height,
            };
            if (!sharedItems) {
              setSize(tSize);
              console.log(tSize);
              updateItem({
                ...item,
                size: tSize,
              });
              addHistory({ ...item, size: tSize}, "item", "update", item)
            } else {
              updateSharedItem(sharedItems, {
                ...item,
                width: item.width
                  ? item?.width + d.width > 700
                    ? 700
                    : item?.width + d.width
                  : 300 + d.width,
                height: item.height ? item?.height + d.height : 50 + d.height,
              });
            }
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
          // enable={{
          //   top:false,
          //   right:true,
          //   bottom:false,
          //   left:true,
          //   topRight:true,
          //   bottomRight:true,
          //   bottomLeft:true,
          //   topLeft:true
          // }}
        >
          {!isDragging && isHovered &&isEditable && <ResizeHandlers />}

          <div
            onContextMenu={(e) => {
              e.preventDefault();
              setItemClicked(true);
              setMenuItem(item);
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
                (isHovered || isDragging) && isEditable 
                  ? "3px solid #e8713c"
                  : "3px solid #e8713c00",
              // backgroundColor: 'rgba(0, 112, 240, 0.2)',
              cursor: "grab",
              // position:'relative'
            }}
            id={item.id}
            // draggable="true"
            // onDragStart={(e) => {
            //   editorRef?.current?.blur();
            //   setSelectedFieldItem({ ...item, size });
            // }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(item);
            }}
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
              if (editorRef) {
                console.log("editable");
                setActiveRef(item.ref);
                editorRef.current.setEditable(true);
                setIsEditorActive(true);
                editorRef.current.focus();
                setIsDraggable(false);
              }
            }}
          >
            {isHovered &&isEditable && (
              <span className="absolute   w-[calc(100%-2px)] top-[-22.7px]  flex justify-end ">
                <p className="h-fit text-[11px] text-white px-[6px] py-[2px] bg-[#e8713c]">
                  {item.title ? item.title : "Free Textfield"}
                </p>
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

            <div className="z-[50] relative">
              <RichTextPlugin
                contentEditable={
                  <div
                    // ref={(e) => {
                    //   if(!isDraggable&&!isResizing){
                    //     onRef(e);
                    //   }
                    //   }}
                    id={`free-${item.id}`}
                  >
                    <ContentEditable
                      className={"ContentEditable__Free__root"}
                    />
                  </div>
                }
                placeholder={
                  <Placeholder className="Placeholder__root__free absolute top-0">
                    {placeholder}
                  </Placeholder>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <OnChangePlugin onChange={handleInputHeightChange} />
              <HistoryPlugin addHistory={addHistory}  pageIndex={item?.pageIndex} />
              <VariablesPlugin />
              <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
              <LayoutPlugin />
              {isEditorActive && isHovered && isEditable && (
                <TableCellResizer divRef={node.current} />
              )}
              {floatingAnchorElem && isEditable && (
                <TableCellActionMenuPlugin
                  anchorElem={floatingAnchorElem}
                  cellMerge={true}
                  item={item}
                  handleRemoveItem={handleRemoveItem}
                />
              )}
              {/* {autoFocus !== false && <AutoFocusPlugin />} */}
              {/* <EscapeHandlerPlugin onEscape={onEscape} /> */}
              <ClearEditorPlugin />
              {editorRef !== undefined && (
                <EditorRefPlugin editorRef={editorRef} />
              )}
            </div>
          </div>
          {/* {clicked && (
            <div style={{ top: points.y, left: points.x }} className="absolute z-999 w-40 bg-gray-800 text-white text-sm rounded-sm py-2">
              <ul>
                <li onClick={() => { handleDuplicate(item), setClicked(false), setItemClicked(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><CopyPlus size={20} /> Duplicate</li>
                <li onClick={() => { handleCopy(item), setClicked(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Copy size={20} /> Copy</li>
                <li onClick={() => handleRemoveItem(item)} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Trash2 size={20} /> Delete</li>

              </ul>
            </div>
          )} */}
        </Resizable>
      </LexicalComposer>
      {modal}
    </>
  );
};

export default TableField;
