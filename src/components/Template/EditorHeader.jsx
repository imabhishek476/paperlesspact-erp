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
import { isEqual } from "lodash-es";
import AutoRemovePlugin from '@playground/plugins/AutoRemovePlugin';
import { useDocHistory } from "./stores/useDocHistoryStore";
const gridSize = 1; // pixels
const snapToGridModifier = createSnapModifier(gridSize);

const EditorHeader = ({
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
  const [update, setUpdate] = useState(false);
  const [activeId, setActiveId] = useState();
  const [allowDrop, setAllowDrop] = useState("");
  const { setPageHeader, pageHeader, pages,headerPadding } = usePageDataStore();
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
  // if (pageHeader?.editorStateDb) {
  //   editorDb = editorRef?.current?.parseEditorState(
  //     pageHeader?.editorStateDb
  //   );
  // }


  const initConfig = pageHeader?.editorStateDb && editorDb? {...initialConfig,editorState:editorDb}: pageHeader?.editorState && !pageHeader?.editorState?.isEmpty()   ?{
    ...initialConfig,
    editorState:pageHeader?.editorState
  } : {...initialConfig};


  // console.log(initConfig);
  console.log(pageHeader?.editorStateDb);

  useEffect(() => {
    const pgNo = pages[pageIndex].pageNo;
    if (
      pgNo !== pageHeader?.pageNo &&
      pageHeader?.pageNo &&
      pageHeader &&
      pageHeader?.editorState &&
      editorRef &&
      editorRef.current
    ) {
      // editorRef.current.setEditorState(pageHeader?.editorState.clone(null));
      if(pageHeader?.editorState && !pageHeader?.editorState?.isEmpty()){
        editorRef?.current?.setEditorState(pageHeader?.editorState);
      }
    }
  }, [pageHeader?.editorState]);




  if (pageHeader?.editorStateDb) {
    const editorState = editorRef?.current?.parseEditorState(
      pageHeader?.editorStateDb
    );
    if(editorState && !editorState?.isEmpty()){
      editorRef?.current?.setEditorState(editorState);
    }
  }
  // console.log(pageSetup,);
  return (
    <div>
      <LexicalComposer initialConfig={initConfig}>
        <RichTextPlugin
          contentEditable={
            <>
              <div
                id={`EditorHeader${pageIndex}`}
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
                      "EditorHeader",
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
                  height: "128px",
                  // cursor:(selectedFieldItem?.type !== "inEditorImage" || selectedFieldItem?.type !== "textArea") && "no-drop"
                }}
                className={`h-32 w-full   overflow-hidden  mx-auto shadow-sm relative `}
              >
                <div
                  onClick={() => {
                    // editorRef?.current?.setEditable(false);
                    setActivePageIndex(pageNo - 1);
                    setActiveRef(editorRef.current);
                  }}
                  className={` ${
                    activePageIndex === pageIndex &&
                    "border-2 border-[#05686E] border-b-0"
                  } mx-auto h-full border-b-1 overflow-y-hidden`}
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
                            "EditorHeader",
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
                    <Droppable id={`droppable-${"header"}`}>
                      {(update || !update) &&
                        Array.isArray(items) &&
                        items
                          .filter((item) => item?.from === "EditorHeader")
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
                  <ContentEditable className="ContentEditable__root" style={{padding:headerPadding}}  id={`header${pageIndex}`} />
                </div>
              </div>
            </>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <EditorRefPlugin editorRef={editorRef} />
        <AutoRemovePlugin id={`header${pageIndex}`} allowedHeight={"167.5px"} />
        <OnChangePlugin
          onChange={(editorState, editor) => {
            editor.update(() => {
              const html = $generateHtmlFromNodes(editor, null);
              // setPrevPageIndex(pageIndex)

              console.log(editorState.toJSON());
              console.log(pageHeader?.editorState);
              const currentEditorState = editorState.toJSON();
            //   if(activePageIndex !== pageIndex){
            //       debugger;
            //   }
              const isSame = isEqual(currentEditorState,pageHeader?.editorState?.toJSON()); 
               
            //   editor.setEditorState(pageHeader?.editorState.clone(null));
            if(!isSame){
                setPageHeader({
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

export default EditorHeader;
