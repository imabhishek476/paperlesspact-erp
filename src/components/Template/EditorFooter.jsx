import { LexicalComposer } from "@lexical/react/LexicalComposer";
import React, { useEffect, useRef, useState } from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import PlaygroundNodes from "../LexicalTemplatePlayground/lexical-playground/src/nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "../LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { usePageDataStore } from "./stores/usePageDataStore";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useDocItemStore } from "./stores/useDocItemStore";
import FillableFieldsRenderer from "../LexicalTemplatePlayground/lexical-playground/src/FillableFieldsRenderer";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Droppable } from "../Template/DnD/Droppable";
import { createSnapModifier } from "@dnd-kit/modifiers";
import { getPageWidth } from "../../lib/helpers/templateHelpers";
import { useTabsStore } from "./stores/useDocTabsStore";
import { useDocHistory } from "./stores/useDocHistoryStore";
import { isEqual } from "lodash-es";
import AutoRemovePlugin from '@playground/plugins/AutoRemovePlugin';
const gridSize = 1; // pixels
const snapToGridModifier = createSnapModifier(gridSize);

const EditorFooter = ({
  setActiveRef,
  pageIndex,
  activePageIndex,
  pageNo,
  setActivePageIndex,
  pageOreintation,
  pageSize,
  menuItem,
  setMenuOpen,
  setMenuItem,
  itemClicked,
  setItemClicked,
  activeRef,
  update,
  setUpdate,
  handleDrop,
  participants,
  serverData,
  sharedItems,
  setCopiedItem,
  updateSharedItem,
}) => {
  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const {addHistory}=useDocHistory()
  const sensors = useSensors(mouseSensor);
  const [activeId, setActiveId] = useState();
  const [allowDrop, setAllowDrop] = useState("");
  const { setPageFooter, pageFooter, pages,footerPadding,footerActive,showPageNo } = usePageDataStore();
  const { handleDropItem, items, setSelectedFieldItem, selectedFieldItem } =
    useDocItemStore();
    const {pageSetup} = useTabsStore();
  const editorRef = useRef(null);
  const initialConfig = {
    editorState: null,
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };
  let editorDb = null;
  const initConfig = pageFooter?.editorStateDb && editorDb? {...initialConfig,editorState:editorDb}: pageFooter?.editorState && !pageFooter?.editorState?.isEmpty()   ?{
    ...initialConfig,
    editorState:pageFooter?.editorState
  } : {...initialConfig};
  useEffect(() => {
    const pgNo = pages[pageIndex].pageNo;
    if (
      pgNo !== pageFooter?.pageNo &&
      pageFooter?.pageNo &&
      pageFooter?.editorState
    ) {
      if(pageFooter?.editorState && !pageFooter?.editorState?.isEmpty()){
        editorRef?.current?.setEditorState(pageFooter?.editorState);
      }
    }
  }, [pageFooter?.editorState]);
  if (pageFooter?.editorStateDb) {
    const editorState = editorRef?.current?.parseEditorState(
      pageFooter?.editorStateDb
    );
    if(editorState && !editorState?.isEmpty()){
    editorRef?.current?.setEditorState(editorState);
    }
  }
//   useEffect(() => {
//     if (activePageIndex === pageIndex) {
//       editorRef?.current?.setEditable(true);
//     } else {
//       editorRef?.current?.setEditable(false);
//     }
//   }, [activePageIndex]);
  // useEffect(() => {
  //     if (selectedFieldItem?.type !== "inEditorImage" || selectedFieldItem?.type !== "textArea") {
  //         console.log("in")
  //         setAllowDrop("cursor-no-drop")
  //     }
  // }, [selectedFieldItem])
  console.log(allowDrop);
  return (
    <div onClick={() => setActiveRef(editorRef.current)}>
      <LexicalComposer initialConfig={initConfig}>
        <RichTextPlugin
          contentEditable={
            <>
              <div
                id={`EditorFooter${pageIndex}`}
                onDrop={(e) => {
                  // console.log(id)
                  e.preventDefault();
                  e.stopPropagation();
                  if (
                    selectedFieldItem?.type === "inEditorImage" ||
                    selectedFieldItem?.type === "textArea"
                  ) {
                    handleDropItem(
                      e,
                      "EditorFooter",
                        pageIndex,
                        editorRef,
                        null,
                        null,
                        sharedItems,
                        updateSharedItem,
                        null,
                        null,
                        null,
                        null,
                        null,
                        setSelectedFieldItem,
                        addHistory
                      
                    );
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{
                  width:getPageWidth(pageSetup),
                  backgroundColor: pages[pageIndex]?.bgColor,
                  // cursor:(selectedFieldItem?.type !== "inEditorImage" || selectedFieldItem?.type !== "textArea") && "no-drop"
                }}
                className={`h-32 w-full   overflow-hidden  mx-auto shadow-sm relative `}
              >
                {footerActive && showPageNo &&(
                <div className="absolute bottom-[5px] left-[50%]">
                  {pageIndex+1}
                </div>)}
                <div
                  onClick={() => {
                    setActivePageIndex(pageNo - 1);
                  }}
                  className={`${
                    activePageIndex === pageIndex &&
                    "border-2 border-[#05686E] border-t-2"
                  } mx-auto h-full border-t-1 overflow-y-hidden`}
                >
                  <DndContext
                    modifiers={[snapToGridModifier]}
                    sensors={sensors}
                    onDragEnd={(e) => {
                      setActiveId(null);
                      if (
                        !(
                          e.active.rect.current.translated?.left ===
                            e.active.rect.current.initial?.left &&
                          e.active.rect.current.translated?.top ===
                            e.active.rect.current.initial?.top
                        )
                      ) {
                        if (
                          selectedFieldItem?.type === "inEditorImage" ||
                          selectedFieldItem?.type === "textArea"
                        ) {
                          handleDropItem(
                            e,
                            "EditorFooter",
                            pageIndex,
                            editorRef,
                            false,
                            {
                              clientX: e.active.rect.current.translated?.left,
                              clientY: e.active.rect.current.translated?.top,
                            },
                            sharedItems,
                            updateSharedItem,
                            null,
                            null,
                            null,
                            null,
                            null,
                            setSelectedFieldItem,
                            addHistory
                          );
                        }
                      }
                    }}
                    onDragStart={(e) => {
                      setActiveId(e.active.id);
                      setSelectedFieldItem(
                        items.find((el) => el.id === e.active.id)
                      );
                    }}
                  >
                    <Droppable id={`droppable-${"footer"}`}>
                      {Array.isArray(items) &&
                        items
                          .filter((item) => item?.from === "EditorFooter")
                          .map((item) => {
                            return (
                              <FillableFieldsRenderer
                                menuItem={menuItem}
                                setMenuOpen={setMenuOpen}
                                setMenuItem={setMenuItem}
                                setItemClicked={setItemClicked}
                                itemClicked={itemClicked}
                                setCopiedItem={setCopiedItem}
                                setActiveRef={setActiveRef}
                                key={item.id}
                                activeRef={activeRef}
                                update={update}
                                item={item}
                                setUpdate={setUpdate}
                                handleDrop={handleDrop}
                                participants={participants}
                                serverData={serverData}
                                sharedItems={sharedItems}
                                updateSharedItem={updateSharedItem}
                                pageOreintation={pageOreintation}
                                activePageIndex={activePageIndex}
                                id={pageIndex}
                              />
                            );
                          })}
                    </Droppable>
                  </DndContext>
                  <ContentEditable className="ContentEditable__root" style={{padding:footerPadding}} id={`footer${pageIndex}`} />
                </div>
              </div>
            </>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <EditorRefPlugin editorRef={editorRef} />
        <AutoRemovePlugin id={`footer${pageIndex}`} allowedHeight={"167.5px"} />
        <OnChangePlugin
          onChange={(editorState, editor) => {
            editor.update(() => {
              const html = $generateHtmlFromNodes(editor, null);
              // setPrevPageIndex(pageIndex)
            //   console.log("hi");
            const currentEditorState = editorState.toJSON();
              const isSame = isEqual(currentEditorState,pageFooter?.editorState?.toJSON()); 
              if(!isSame){
                  setPageFooter({
                    editorState: editorState.clone(null),
                    html: html,
                    pageNo: pages[pageIndex].pageNo,
                  });
              }
            });
          }}
        />
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <LinkPlugin />
      </LexicalComposer>
    </div>

    //     </div>
    // </div>
  );
};

export default EditorFooter;
