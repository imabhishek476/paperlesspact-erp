import React, { useEffect, useRef, useState } from "react";
import { Resizable } from "re-resizable";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import Placeholder from "../../LexicalTemplatePlayground/lexical-playground/src/ui/Placeholder";
import EditorTheme from "../../LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import PlaygroundNodes from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/PlaygroundNodes";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { BLUR_COMMAND, COMMAND_PRIORITY_NORMAL, FOCUS_COMMAND, createEditor } from "lexical";
import ToolbarPlugin from "./ToolBarPlugin";
import { useItemStore } from "../stores/useItemStore";
import ItemWrapper from "./ItemWrapper";
import { $generateHtmlFromNodes } from "@lexical/html";
import { usePageStore } from "../stores/usePageStore";
import { createPortal } from "react-dom";
import { usePresHistory } from "../stores/usePresHistoryStore";
import debounce from 'lodash/debounce';

// import {useDebounce} from '../../LexicalTemplatePlayground/lexical-playground/src/plugins/CodeActionMenuPlugin/utils'

const Textfield = ({ item, fromOverlay, fromPreview, fromImport,container }) => {
  const editorRef = useRef(null);
  const [size, setSize] = useState(item.size);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const [isEditorEmpty, setIsEditorEmpty] = useState(false);
  const placeholder = "Enter Text Here...";
  const { deleteItem, updateItem, selectedItem, setSelectedItem } =
    useItemStore();
    const {addHistory} = usePresHistory()
  const { selectedPage } = usePageStore();
  const [initialConfig , setInitialConfig] = useState(null);
  console.log(item);
  useEffect(()=>{
    let initialConfig = {
      namespace: `FreeTextfield-${item?.id}`,
      nodes: [...PlaygroundNodes],
      editorState: item?.editorState || null,
      onError: (error) => {
        throw error;
      },
      theme: EditorTheme,
      editable: false,
    }
    setInitialConfig(initialConfig)
    return ()=>{
      setInitialConfig(null);
    }

  },[selectedPage, selectedItem])
  // useEffect(() => {
  //   console.log(editorRef);
  //   if (editorRef && editorRef?.current) {
  //     const removeBlurCommand = editorRef?.current?.registerCommand(
  //       BLUR_COMMAND,
  //       () => {
  //         setIsEditorActive(false);
  //       },
  //       COMMAND_PRIORITY_NORMAL
  //     );
  //     return () => {
  //       // removeFocusCommand();
  //       removeBlurCommand();
  //     };
  //   }
  // }, [editorRef]);

  useEffect(() => {
    if (isEditorActive) {
      setIsDraggable(false);
    } else {
      setIsDraggable(true);
    }
  }, [isEditorActive]);

  // const addHistoryWithDebounce = ({history,item})=>{
  //   useDebounce(() => {
  //     addHistory(history,"item","update",item)
  //   }, 1000);
  // }

  return (
    <>
    {editorRef.current &&
                    item?.id === selectedItem?.id &&
                    !fromPreview && (
                      createPortal(
                        <ToolbarPlugin
                          activeEditorRef={editorRef?.current}
                          fromPresentation={true}
                          //   setIsLinkEditMode={setIsLinkEditMode}
                          //   pageOreintation={pageOreintation}
                          //   setPageOreintation={setPageOreintation}
                        />,
                        document.getElementById("textItemToolbar")
                      )
                    )}
      {true && (
        <ItemWrapper
          item={item}
          fromOverlay={fromOverlay}
          fromPreview={fromPreview}
          fromImport={fromImport}
          container={container}
        >
          {fromOverlay || fromPreview || (item?.id !== selectedItem?.id)? (
            <div
              style={{
                opacity: item?.options?.opacity ? item?.options?.opacity:1,
                textAlign:"left",
                fontFamily: "Arial",
                fontSize: "15px",
                textWrap : "wrap"
              }}
              className="break-words"     
              dangerouslySetInnerHTML={{ __html: item?.html }}
              onClick={() => setSelectedItem(item)}
            ></div>
          ) : (
            <>
              {initialConfig && (
                <LexicalComposer initialConfig={initialConfig}>
                  
                  <div
                    className="CommentPlugin_CommentInputBox_EditorContainer h-full !m-0 "
                    onClick={() => setSelectedItem(item)}
                    style={{
                      opacity: item?.options?.opacity ? item?.options?.opacity:1
                    }} 
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (editorRef) {
                        editorRef.current.setEditable(true);
                        setIsEditorActive(true);
                        editorRef.current.focus();
                        setIsDraggable(false);
                      }
                    }}
                    // onBlur={() => {
                    //   editorRef.current.blur();
                    //   // setSelectedItem(null)
                    // }}
                  >
                    <RichTextPlugin
                      contentEditable={
                        <ContentEditable
                          className="ContentEditable__Free__root"
                          style={{
                            minHeight:isEditorEmpty && "100px",
                            minWidth:isEditorEmpty && "200px",
                          }}
                          id={`text-${item.id}`}
                        />
                      }
                      placeholder={
                        <Placeholder className="Placeholder__root__free absolute top-0">
                          {placeholder}
                        </Placeholder>
                      }
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                  
                    <OnChangePlugin
                      onChange={(editorState, editor) => {
                        editor.update(() => {
                          const html = $generateHtmlFromNodes(editor, null);
                          const inputField = document.getElementById(
                            `text-${item.id}`
                          );
                          const inputHeight = inputField.scrollHeight;
                          const inputWidth = inputField.scrollWidth;
                          let size = item.size;
                          const container =
                            document.getElementById("currentPage");
                          let height = container?.scrollHeight;
                          let width = container?.scrollWidth;
                          
                          const updatedItemHeightInPercent =
                            (inputHeight * 100) / (height > width ? 1024 : 576);
                          size = {
                            
                            height: inputHeight,
                            width: inputWidth,
                          };
                          console.log(updatedItemHeightInPercent)
                          if(editorState.isEmpty){
                            setIsEditorEmpty(true)
                          } else {
                            setIsEditorEmpty(false)
                          }
                          updateItem({
                            ...item,
                            editorState: JSON.stringify(editorState),
                            html: html,
                            size: size,
                            // ref: editorRef?.current
                          });
                          addHistory({
                            ...item,
                            editorState: JSON.stringify(editorState),
                            html: html,
                            size: size,
                            // ref: editorRef?.current
                          },"item","update",item)
                          // const debouncedAddHistory = debounce(() => {
                          //   addHistory({
                          //     ...item,
                          //     editorState: JSON.stringify(editorState),
                          //     html: html,
                          //     size: size,
                          //     // ref: editorRef?.current
                          //   }, "item", "update", item);
                          // }, 1000);
                    
                          // debouncedAddHistory();
                          
                        });
                      }}
                    />
                    <HistoryPlugin />
                    {/* {autoFocus !== false && <AutoFocusPlugin />} */}
                    {/* <EscapeHandlerPlugin onEscape={onEscape} /> */}                    
                    <ClearEditorPlugin />
                    {editorRef !== undefined && (
                        <EditorRefPlugin
                          editorRef={editorRef}
                        />
                      )}
                  </div>
                </LexicalComposer>
              )}
            </>
          )}
        </ItemWrapper>
      )}
    </>
  );
};

export default Textfield;
