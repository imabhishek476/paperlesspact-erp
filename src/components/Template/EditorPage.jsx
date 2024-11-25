import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import NextImage from "next/image";
import CancelIcon from "@mui/icons-material/Cancel";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  Computer,
  Copy,
  Plus,
  FilePlus2,
  Trash2,
  Undo2,
  Upload,
  UploadCloud,
  PaintBucket,
  CopyPlus,
  Clipboard,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEditor } from "../LexicalTemplatePlayground/lexical-playground/src/context/EditorProvider";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import Carousel from "../Carousel/Carousel";
import Image from "next/image";
import { Nunito } from "next/font/google";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { getDocument } from "../../Apis/document";
import { getRentalAgreementById } from "../../Apis/legalAgreement";
import FillableFieldsRenderer from "../../components/LexicalTemplatePlayground/lexical-playground/src/FillableFieldsRenderer";
export const animals = [
  { label: "Rental Agreement", value: "rental" },
  { label: "Loan Agreement", value: "loan" },
  { label: "Sales Contract", value: "sales" },
  { label: "Service Agreement", value: "service" },
  { label: "Non-Disclosure Agreement", value: "non-disclosure" },
  { label: "Job Offer Letter", value: "job-offer" },
];
const nunito = Nunito({ subsets: ["latin"] });

import EnvelopeDocument from "./EnvelopeDocument";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $setSelection,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_NORMAL,
  EditorState,
  FOCUS_COMMAND,
  LexicalEditor,
  createEditor,
} from "lexical";
import EditorTheme from "../../components/LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
import PlaygroundNodes from "../LexicalTemplatePlayground/lexical-playground/src/nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "../LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
import { CommentStore } from "../LexicalTemplatePlayground/lexical-playground/src/commenting";
import DropdownColorPicker from "../LexicalTemplatePlayground/lexical-playground/src/ui/DropdownColorPicker";
import GlobalTemplateUse from "./TemplateComponents/GlobalTemplateUse";
import { usePageDataStore } from "./stores/usePageDataStore";
import { useDocItemStore } from "./stores/useDocItemStore";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useTabsStore } from "./stores/useDocTabsStore";
import { getPageWidth } from "../../lib/helpers/templateHelpers";
import EditorHeader from "./EditorHeader";
import EditorFooter from "./EditorFooter";
import { useDocHistory } from "./stores/useDocHistoryStore";
import { useDebounce } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CodeActionMenuPlugin/utils";
import { pageAddHelper, pageDeleteHelper, pageDownHelper, pageDuplicateHelper, pageUpHelper } from "../../lib/helpers/pageHelpers";
import { isEqual } from "lodash-es";
const PlaygroundApp = dynamic(
  () => import("@/components/LexicalTemplatePlayground/lexical-playground/src"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex  items-center justify-center"></div>
    ),
  }
);

const EditorPage = ({
  activeRef,
  copyItem,
  setCopiedItem,
  handlePaste,
  setActiveRef,
  docDetails,
  setDocDetails,
  pageNo,
  // editorRef,
  setIsDisabledFileds,
  offsetX,
  offsetY,
  setOffsetX,
  setOffsetY,
  handleDragEnd,
  pageIndex,
  roomId,
  setGlobalEditorState,
  handleDrop,
  selectedFieldItem,
  showComments,
  initialConfig,
  participants,
  participantsIndex,
  setSelectedFieldItem,
  setEditorRefs,
  updateSharedItem,
  sharedItems,
  items,
  setPagesData,
  pagesData,
  setEditorStates,
  isAdded,
  setActivePageIndex,
  setIsLoading,
  isLoading,
  docId,
  setDocId,
  docImg,
  setDocImg,
  update,
  setUpdate,
  files,
  setFiles,
  handleFileChange,
  editorStates,
  addedIndex,
  setAddedIndex,
  setUpdateDb,
  modal,
  commentStore,
  commentData,
  setCommentData,
  activePageIndex,
  selectedParticipant,
  pageOreintation,
  setPageOreintation,
  pageSize,
  setPageSize,
  selectedItem,
  setSelectedItem,
  setPoints,
  points,
  handleDuplicate,
  handleRemoveItem,
  setMenuItem,
  menuItem,
  handleCopy,
  setItemClicked,
  itemClicked,
  menuOpen,
  setMenuOpen,
  pageId
}) => {
  console.log(pageId);
  const [selectedSignee, setSelectedSignee] = React.useState(null);
  const { pageSetup } = useTabsStore();
  const imageRef = React.useRef(null);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [preview, setPreview] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [clicked, setClicked] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [documentArray, setDocumentArray] = React.useState([]);
  const editorRef = useRef(null);
  const fileRef = useRef();
  const {
    pages,
    deletePage,
    duplicatePage,
    updatePage,
    pageUp,
    pageDown,
    addPageAt,
    addNewPage,
    duplicatePageAt,
    serverData,
    headerActive,
    footerActive,
    isEditable
  } = usePageDataStore();

  const {
    itemPageUP,
    itemPageDown,
    itemPageDuplicate,
    deleteItem,
    duplicateItem,
    setItems,
    itemPageDelete,
    itemPageAdd,
    backgroundItemUpdate,
    setBackgroundItemUpdate
  } = useDocItemStore();
  const { addHistory, undoStack } = useDocHistory()
  useEffect(() => {
    const backgroundItemWithPageIndex = {
      id: `backgroundItem0`,
      type: "background",
      pageIndex: 0,
    };
    let newItems
    if (items) {
      newItems = [...items]
    }
    console.log(items)
    const isAvailable = newItems.some((item) => item.id === 'backgroundItem0')
    if (!isAvailable) {
      newItems.unshift(backgroundItemWithPageIndex)
    }
  }, [])
  // const [itemClicked, setItemClicked] = useState(false)
  console.log(pages);
  const [value, setValue] = React.useState("");
  const handleSelectionChange = (e) => {
    setValue(e.target.value);
  };

  const [floatingAnchorElem, setFloatingAnchorElem] = React.useState(null);
  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };
  // console.log('in editor')
  React.useEffect(() => {
    if (currentPageIndex !== -1 && imageRef && imageRef.current) {
      imageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPageIndex]);

  const [isRefSet, setIsRefSet] = useState(false);
  // const editorRefByPage = useEditor(pageNo);
  // console.log(addedIndex, pageIndex);
  let parsedData = serverData;
  try {
    if (typeof serverData?.editorState === "string") {
      parsedData = {
        ...serverData,
        editorState: JSON.parse(serverData?.editorState)
      };
    }
  } catch (error) {
    parsedData = serverData;
  }


  console.log(pages)
  const initConfig = pages[pageIndex]?.isDbInit
    ? pages[pageIndex]?.ref?.current
      ? {
        ...initialConfig,
        // editorState: pages[pageIndex].ref.current.getEditorState(),
        editor__DEPRECATED: pages[pageIndex]?.ref?.current,
      }
      : {
        ...initialConfig,
      }
    : parsedData?.editorState &&
      parsedData?.editorState[pageIndex] &&
      parsedData?.editorState[pageIndex]?.editorState
      ? {
        ...initialConfig,
        editorState:
          typeof parsedData?.editorState[pageIndex]?.editorState === "string"
            ? parsedData?.editorState[pageIndex]?.editorState
            : parsedData?.editorState[pageIndex]?.editorState?.root?.children
              ?.length === 0
              ? '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
              : JSON.stringify(parsedData.editorState[pageIndex]?.editorState),
      }
      : { ...initialConfig };
  console.log(initConfig)
  useEffect(() => {
    let removeFocusCommand = null;
    if (editorRef) {
      updatePage(pageIndex, { ref: editorRef })

      // editorRef?.current?.registerUpdateListener(
      //   ({ dirtyElements, prevEditorState, tags }) => {
      //     // console.log("yayay", pageNo);
      //     setActiveRef(editorRef?.current);
      //     setActivePageIndex(pageNo - 1);

      //     editorRef?.current?.getEditorState().read(() => {
      //       const root = $getRoot();
      //       const children = root.getChildren();

      //       if (children.length > 1) {
      //         updatePage(pageIndex + 1, { isPageEmpty: false });
      //         setActivePageIndex(pageNo - 1);
      //       } else {
      //         if ($isParagraphNode(children[0])) {
      //           console.log(children);
      //           const paragraphChildren = children[0].getChildren();
      //           if (paragraphChildren.length !== 0) {
      //             updatePage(pageIndex + 1, { isPageEmpty: false });
      //             setActivePageIndex(pageNo - 1);
      //           } else {
      //             updatePage(pageIndex + 1, { isPageEmpty: true });
      //             setActivePageIndex(pageNo - 1);
      //           }
      //         } else {
      //           updatePage(pageIndex + 1, { isPageEmpty: false });
      //         }
      //       }
      //     });
      //   }
      // );
  
      removeFocusCommand = editorRef.current?.registerCommand(
        FOCUS_COMMAND,
        () => {
          setActiveRef(editorRef.current);
          setActivePageIndex(pageNo - 1);
        },
        COMMAND_PRIORITY_NORMAL
      );
    }
    return () => {
      if (removeFocusCommand) {
        removeFocusCommand();
        
      }
    };
  }, [editorRef, editorRef?.current, activePageIndex]);

  console.log(undoStack);

  const [pageBg, setPageBG] = useState("");
  const onBgColorSelect = (value) => {
    console.log(value);
    if (value) {
      setPageBG(value);
    }
  };
  useEffect(() => {
    const handleClick = () => {
      setItemClicked(false), setMenuOpen(false);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);
  useEffect(() => {
    console.log(pages[activePageIndex]?.bgColor);
    if (pageBg) {
      updatePage(activePageIndex, { bgColor: pageBg });
      addHistory(activePageIndex, "page", "update", { bgColor: pages[activePageIndex]?.bgColor })
    }
  }, [pageBg]);
  return (
    <>
      <div className={"relative"} key={pageNo}>
        {editorRef && editorRef?.current && (
          <div
            className="my-4  mx-auto flex justify-between items-center"
            style={{
              maxWidth: getPageWidth(pageSetup),
            }}
          >
            <p>Page {pageIndex + 1}</p>
            {isEditable &&
              <div className="flex gap-3 items-center">
                {pageIndex !== 0 && (
                  <Tooltip
                    content="Move page up"
                    classNames={{
                      base: "rounded-[4px] text-white border-black",
                      content: "rounded-[4px] bg-black p-[2px] text-[10px]",
                    }}
                    delay={1000}
                  >
                    <ChevronUp
                      size={18}
                      onClick={(e) => {
                        e.preventDefault();
                        pageUpHelper(pageIndex, pages, pageUp, itemPageUP, addHistory)
                        setMenuItem("easedraft");
                      }}
                      color={pageNo === 0 ? "#15151360" : "#000"}
                      className={
                        pageNo === 0 ? "cursor-not-allowed" : "cursor-pointer"
                      }
                    />
                  </Tooltip>
                )}
                {pageIndex !== pages.length - 1 && (
                  <Tooltip
                    content="Move page down"
                    classNames={{
                      base: "rounded-[4px] text-white border-black",
                      content: "rounded-[4px] bg-black p-[2px] text-[10px]",
                    }}
                  >
                    <ChevronDown
                      size={18}
                      onClick={(e) => {
                        e.preventDefault();
                        pageDownHelper(pageIndex, pages, pageDown, itemPageDown, addHistory)
                        setMenuItem("easedraft");
                      }}
                      className="cursor-pointer"
                    />
                  </Tooltip>
                )}
                <Tooltip
                  content="Duplicate page"
                  classNames={{
                    base: "rounded-[4px] text-white border-black",
                    content: "rounded-[4px] bg-black p-[2px] text-[10px]",
                  }}
                >
                  <Copy
                    size={18}
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuItem("easefraft");
                      pageDuplicateHelper(pageIndex, pages, duplicatePage, duplicatePageAt, itemPageDuplicate, initialConfig, addHistory)
                      setBackgroundItemUpdate(!backgroundItemUpdate)
                    }}
                    className="cursor-pointer"
                  />
                </Tooltip>
                {pages.length !== 1 && (
                  <Tooltip
                    content="Delete page"
                    classNames={{
                      base: "rounded-[4px] text-white border-black",
                      content: "rounded-[4px] bg-black p-[2px] text-[10px]",
                    }}
                  >
                    <Trash2
                      size={18}
                      onClick={(e) => {
                        e.preventDefault()
                        pageDeleteHelper(pageIndex, pages, items, itemPageDelete, deletePage, addHistory)
                        setActivePageIndex(0)
                      }}
                      className="cursor-pointer"
                    />
                  </Tooltip>
                )}
                {activePageIndex === pageIndex && (
                  <Tooltip
                    content="Page Background"
                    classNames={{
                      base: "rounded-[4px] text-white border-black",
                      content: "rounded-[4px] bg-black p-[2px] text-[10px]",
                    }}
                  >
                    <div className="transition-all duration-1000">
                      <DropdownColorPicker
                        disabled={false}
                        stopCloseOnClickSelf={true}
                        buttonClassName="toolbar-item color-picker !p-0"
                        buttonAriaLabel="Formatting background color"
                        buttonIconClassName="icon-bg-color"
                        color={
                          pages[pageIndex]?.bgColor
                            ? pages[pageIndex]?.bgColor
                            : "#fff"
                        }
                        onChange={onBgColorSelect}
                        title="bg color"
                      />
                    </div>
                  </Tooltip>
                )}
                <Tooltip
                  content="Add new page"
                  classNames={{
                    base: "rounded-[4px] text-white border-black",
                    content: "rounded-[4px] bg-black p-[2px] text-[10px]",
                  }}
                >
                  <FilePlus2
                    onClick={(e) => {
                      e.preventDefault();
                      pageAddHelper(pageIndex, pages, itemPageAdd, addPageAt, addNewPage, setItems, items, initialConfig, addHistory)

                    }}
                  />
                </Tooltip>
              </div>
            }
          </div>
        )}

        {headerActive && <EditorHeader pageNo={pageNo} setActivePageIndex={setActivePageIndex} setActiveRef={setActiveRef} pageIndex={pageIndex} activePageIndex={activePageIndex} pageOreintation={pageOreintation} pageSize={pageSize} participants={participants}
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          menuItem={menuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          setCopiedItem={setCopiedItem}
          serverData={serverData}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          activeRef={activeRef} />}

        <LexicalComposer initialConfig={initConfig}>
          <div className="relative" onContextMenu={(e) => {
            e.preventDefault();
            if (menuItem) {
              setMenuOpen(true)
            }
            setActivePageIndex(pageIndex)
            const pageId = `editor${pageIndex}`
            const pageEle = document.getElementById(pageId)
            const pageX = pageEle.getBoundingClientRect().left
            const pageY = pageEle.getBoundingClientRect().top
            const pageWidth = Number(pageSetup?.size?.width?.replace("px", ""))
            if (e.clientX - pageX < pageWidth) {
              setPoints({
                x: e.pageX - pageX + 160,
                y: e.pageY - pageY,
              });
            }
            else {
              setItemClicked(false); setMenuOpen(false)
            }
          }} >
            <PlaygroundApp
              setMenuOpen={setMenuOpen}
              setMenuItem={setMenuItem}
              menuItem={menuItem}
              setItemClicked={setItemClicked}
              itemClicked={itemClicked}
              setCopiedItem={setCopiedItem}
              pageSize={pageSize}
              setPageSize={setPageSize}
              setActiveRef={setActiveRef}
              activeRef={activeRef}
              activePageIndex={activePageIndex}
              editorRef={editorRef}
              roomId={roomId}
              handleDrop={handleDrop}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              selectedFieldItem={selectedFieldItem}
              setSelectedFieldItem={setSelectedFieldItem}
              setGlobalEditorState={setGlobalEditorState}
              showComments={showComments}
              items={items}
              setItems={setItems}
              participants={participants}
              serverData={serverData}
              sharedItems={sharedItems}
              updateSharedItem={updateSharedItem}
              isCollab={
                // participants &&
                //   ((participants.collaborators &&
                //     participants.collaborators.length > 0) ||
                //     serverData?.approvers?.length > 0)
                //   ? true
                //   : false
                false
              }
              participantsIndex={participantsIndex}
              editorId={pageIndex}
              commentStore={pages[pageIndex] && pages[pageIndex]?.commentStore ? pages[pageIndex]?.commentStore : null}
              commentData={pages}
              setCommentData={setCommentData}
              selectedParticipant={selectedParticipant}
              pageOreintation={pageOreintation}
              setPageOreintation={setPageOreintation}
            // activePageNumber={activePageNumber}
            />
            {(menuOpen || itemClicked) && isEditable && (
              <div style={{ top: points.y, left: pageOreintation === "portrait" ? points.x : points.x - 160, }} className="absolute  w-40 bg-gray-800 text-white text-sm rounded-sm py-2">
                <ul>
                  <li style={{ display: (copyItem && !itemClicked && menuItem) ? "flex" : "none" }} onClick={() => { handlePaste(), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Clipboard size={20} /> Paste</li>
                  <>
                    <li style={{ display: itemClicked ? "flex" : "none" }} onClick={() => { handleDuplicate(), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><CopyPlus size={20} /> Duplicate</li>
                    <li style={{ display: itemClicked ? "flex" : "none" }} onClick={() => { handleCopy(menuItem), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Copy size={20} /> Copy</li>
                    <li style={{ display: itemClicked ? "flex" : "none" }} onClick={() => { handleRemoveItem(), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Trash2 size={20} /> Delete</li>
                  </>
                </ul>
              </div>
            )}
          </div>
          {modal}
        </LexicalComposer >

        {footerActive && <EditorFooter pageNo={pageNo} setActivePageIndex={setActivePageIndex} setActiveRef={setActiveRef} pageIndex={pageIndex} activePageIndex={activePageIndex} pageOreintation={pageOreintation} pageSize={pageSize} participants={participants}
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          menuItem={menuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          setCopiedItem={setCopiedItem}
          serverData={serverData}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          activeRef={activeRef} />}
      </div>
    </>
  );
};

export default EditorPage;
