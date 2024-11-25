/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';

import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HistoryPlugin } from "../../../../lib/helpers/LexicalHisPlugIn";
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import useLexicalEditable from '@lexical/react/useLexicalEditable';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { createWebsocketProvider } from './collaboration';
import { useSettings } from './context/SettingsContext';
import { useSharedHistoryContext } from './context/SharedHistoryContext';
import ActionsPlugin from './plugins/ActionsPlugin';
import AutocompletePlugin from './plugins/AutocompletePlugin';
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
import CommentPlugin from './plugins/CommentPlugin';
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import ContextMenuPlugin from './plugins/ContextMenuPlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
// import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import DraggableBlockPlugin from '@/Utils/Lexical/Plugins/DraggableBlockPlugin';

import EmojiPickerPlugin from './plugins/EmojiPickerPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
import ExcalidrawPlugin from './plugins/ExcalidrawPlugin';
import FigmaPlugin from './plugins/FigmaPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import InlineImagePlugin from './plugins/InlineImagePlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin';
// import MentionsPlugin from './plugins/MentionsPlugin';
import VariablesPlugin from './plugins/VariablesPlugin';
import PageBreakPlugin from './plugins/PageBreakPlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import TwitterPlugin from './plugins/TwitterPlugin';
import YouTubePlugin from './plugins/YouTubePlugin';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';
import { CAN_USE_DOM } from './shared/canUseDOM';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import { getUserProfile } from '../../../../Apis/login';
import Cookies from "js-cookie";
import { getColorPreset } from '../../../../Utils/Collaboration/colorHelper';
import { MultipleEditorStorePlugin } from './plugins/MultiEditorStorPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, LexicalEditor } from 'lexical';
import FillableFieldsRenderer from './FillableFieldsRenderer';
import { CommentStore } from './commenting';
import { Droppable } from '../../../Template/DnD/Droppable';
import { DndContext, DragOverlay, KeyboardSensor, KeyboardSensorProps, PointerSensor, rectIntersection, SensorOptions, SensorProps, useSensor, useSensors } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { Button, Modal, ModalContent, useDisclosure } from '@nextui-org/react';
import { usePageDataStore } from '@/components/Template/stores/usePageDataStore';
import {handleInsertNode} from '../../../../Utils/Template/TemplateHelper'
import useModal from './hooks/useModal';
import QuoteModal from "../../../Template/QuoteBuilder/QuoteModal"
import { useTabsStore } from '@/components/Template/stores/useDocTabsStore';
import {getPageHeight, getPageHeightHeaderFooter, getPageWidth, pixelToNumber} from '@/lib/helpers/templateHelpers';
import AutoRemovePlugin from './plugins/AutoRemovePlugin';
import { useDocItemStore } from '@/components/Template/stores/useDocItemStore';
import {useDocHistory} from '@/components/Template/stores/useDocHistoryStore'
const gridSize = 1; // pixels
const snapToGridModifier = createSnapModifier(gridSize);

const skipCollaborationInit =
  // @ts-expect-error
  window.parent != null && window.parent.frames.right === window;




export default function Editor({
  activeRef,
  menuItem,
  setMenuOpen,
  setMenuItem,
  setItemClicked,
  itemClicked,
  setCopiedItem,
  editorRef,
  roomId,
  showComments,
  isCollab,
  participantsIndex,
  setGlobalEditorState,
  id,
  updateSharedItem,
  handleDrop,
  sharedItems,
  participants,
  serverData,
  items,
  setItems,
  // setSelectedFieldItem,
  setIsRefSet,
  commentStore,
  commentData,
  setCommentData,
  activePageIndex,
  setActiveRef,
  selectedParticipant,
  pageOreintation,
  pageSize,
  selectedItem,
}: {
  activeRef:any,
  menuItem:any,
  setMenuItem: any,
  setItemClicked: any;
  itemClicked: any;
  setCopiedItem: any;
  selectedItem: any;
  editorRef: any;
  updateSharedItem: any;
  roomId: string;
  setGlobalEditorState: any;
  showComments: boolean;
  isCollab: boolean;
  participantsIndex: Number;
  handleDrop: any;
  sharedItems: any;
  participants: any;
  serverData: any;
  items: any;
  setItems: any;
  // setSelectedFieldItem: any
  id: Number;
  commentData: any;
  setCommentData: React.Dispatch<React.SetStateAction<CommentStore[]>>;
  setIsRefSet: React.Dispatch<React.SetStateAction<boolean>>;
  commentStore: any,
  activePageIndex: any,
  setActiveRef: any
  selectedParticipant: any;
  pageSize: { height: string, width: string };
  pageOreintation: string,
  setMenuOpen: any,
}): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const { historyState } = useSharedHistoryContext();
  // const isCollab = true;
  // // console.log(editorRef,id);
  // const isCharLimit = true;
  // // console.log(items)
  const {
    settings: {
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      showTableOfContents,
      shouldUseLexicalContextMenu,
      tableCellMerge,
      tableCellBackgroundColor,
    },
  } = useSettings();
  const {
    setSelectedItem,handleDropItem,setQuoteEditorRef,setQuoteTargetNode,setSelectedFieldItem,quoteEditorRef,quoteTargetNode,isTableResizing, tableActive,isTableDragging
  }=useDocItemStore();
  // console.log(historyState);
  const {setRefs} = usePageDataStore();
  const {pageSetup} = useTabsStore();
  // useEffect(()=>{
  //   console.log(pageSetup);
  // },[pageSetup])
  let item = null
  let handleRemoveItem2 = null
  const [modal, showModal] = useModal(item, handleRemoveItem2);
  const isEditable = useLexicalEditable();
  const {isEditable : isEditableStore} = usePageDataStore();
  const text = 'Enter some text...';
  const placeholder = <Placeholder className='Placeholder__root__editor'>{text}</Placeholder>;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null && !isTableResizing && !isTableDragging && tableActive) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };
  const [update, setUpdate] = useState(false)
  const [activeId, setActiveId] = useState<any>()
  const [isKeyboardDragging, setisKeyboardDragging] = useState(false)

  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const sensors = useSensors(
    mouseSensor,
  )
  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);
  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(accessToken);
        setUsername(userProfile?.data?.fullname);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [])


  useEffect(()=>{
    const floatingAnchorElem  = document.getElementById(`editor${id}`) as HTMLDivElement;
    console.log(floatingAnchorElem);
    setFloatingAnchorElem(floatingAnchorElem);
  },[editorRef])

  const refInit = React.useCallback((instance: LexicalEditor) => {
    // console.log(id);
    // setRefs(id,instance);
    editorRef.current = instance;
  }, [])

  const [bgColor, setBgColor] = useState()
  const getEditorBg = () => {
    commentData?.map((page: any) => {
      if (page.pageNo - 1 === id) {
        setBgColor(page.bgColor)
      }
    })
  }
  const {addHistory,undoStack}=useDocHistory()
  useEffect(() => {
    getEditorBg()
  }, [commentData, id])
  const quoteBuilderModal = useDisclosure();
  const { setHeaderActive, headerActive, footerActive, setFooterActive,activeHeaderFooterPageHeight,showPageNo } = usePageDataStore();
  return (
    <>
      <div
        className={`editor-container h-full ${showTreeView ? "tree-view" : ""
          } ${!isRichText ? "plain-text" : ""}`}
        id="editorShell"
      >
            <Modal
        size="5xl"
        isOpen={quoteBuilderModal.isOpen}
        onOpenChange={quoteBuilderModal.onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent className="bg-[#eee]">
          {(onClose) => (
            <QuoteModal
              editor={quoteEditorRef}
              setEditorRef={setQuoteEditorRef}
              quoteTargetNode={quoteTargetNode}
              setQuoteTargetNode={setQuoteTargetNode}
              onClose={onClose}
            />
          )}
        </ModalContent>
      </Modal>
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <DragDropPaste />
        <AutoFocusPlugin />
        <AutoRemovePlugin id={`editor_${id}_content`} allowedHeight={activeHeaderFooterPageHeight}/>
        <ClearEditorPlugin />
        <ComponentPickerPlugin />
        {/* <EmojiPickerPlugin /> */}
        <AutoEmbedPlugin />
        <EditorRefPlugin editorRef={refInit} />
        <VariablesPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <SpeechToTextPlugin />
        <AutoLinkPlugin />
        {commentStore && (
          <CommentPlugin
            roomId={roomId}
            providerFactory={isCollab ? createWebsocketProvider : undefined}
            isShowComments={showComments}
            commentStore={commentStore}
            commentData={commentData}
            setCommentData={setCommentData}
            id={id}
          />
        )}
        {isRichText ? (
          <>
            {isCollab ? (
              <CollaborationPlugin
                id={`${roomId}-${id}`}
                providerFactory={createWebsocketProvider}
                shouldBootstrap={true}
                username={username}
                cursorColor={getColorPreset(participantsIndex)}
              />
            ) : (
              // <></>
              <HistoryPlugin addHistory={addHistory}  pageIndex={id}   />
            )}
            {/* {console.log(commentData)} */}
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div
                    style={{
                      backgroundColor: bgColor,
                      height:getPageHeightHeaderFooter(pageSetup,headerActive,footerActive,activeHeaderFooterPageHeight),
                    }}
                    className={`editor relative   overflow-hidden  ${activePageIndex === id && 'border-2 border-[#05686E] !box-content'} transition-colors duration-500 `}
                    id={`editor${id}`}
                    onDrop={(e) => {
                      // console.log(id)
                      e.preventDefault();
                      e.stopPropagation();
                      handleDropItem(e, false, id, editorRef, false, null, sharedItems, updateSharedItem, handleInsertNode, showModal, quoteBuilderModal, setQuoteEditorRef, setQuoteTargetNode, setSelectedFieldItem,addHistory)
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
                    // ref={(e:HTMLDivElement) => {
                    //   console.log('calling ref');
                    //   if(!isTableResizing&&!isTableDragging && tableActive){
                    //     onRef(e);
                    //   }
                    // }}
                  >
                    {!footerActive && showPageNo &&(
                <div className="absolute bottom-[5px] left-[50%]">
                  {Number(id)+1}
                </div>)}
                    <DndContext
                      modifiers={[snapToGridModifier]}
                      sensors={sensors}
                      onDragEnd={(e) => {
                        if(!isEditableStore) return;
                        setActiveId(null)
                        if (!((e.active.rect.current.translated?.left === e.active.rect.current.initial?.left) &&
                          (e.active.rect.current.translated?.top === e.active.rect.current.initial?.top))) {
                          const div = document.getElementById(`editor_${id}_content`);
                          div?.focus({ preventScroll: true });
                          handleDropItem(e, false, id, editorRef, false, {
                            clientX: e.active.rect.current.translated?.left,
                            clientY: e.active.rect.current.translated?.top
                          }, sharedItems, updateSharedItem, handleInsertNode, showModal, quoteBuilderModal, setQuoteEditorRef, setQuoteTargetNode, setSelectedFieldItem,addHistory)
                        }
                      }}
                      onDragStart={(e) => {
                        if(!isEditableStore) return;
                        setActiveId(e.active.id)
                        setItemClicked(false)
                        setMenuOpen(false)
                        setSelectedFieldItem(
                          items.find((el: any) => el.id === e.active.id)
                        )
                      }}
                    >
                      <Droppable id={`droppable-${id}`}>
                        {Array.isArray(items) &&
                          items
                            .filter((item) => item?.pageIndex === id)
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
                                  pageOreintation={pageSetup?.orientation}
                                  activePageIndex={activePageIndex}
                                  id={id}
                                />
                              );
                            })}
                      </Droppable>
                    </DndContext>
                    <ContentEditable id={`editor_${id}_content`}  
                    style={{
                      width: getPageWidth(pageSetup),
                      minHeight:getPageHeightHeaderFooter(pageSetup,headerActive,footerActive,activeHeaderFooterPageHeight),
                    }}
                    />
                  </div>
                </div>
              }
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TablePlugin
              hasCellMerge={tableCellMerge}
              hasCellBackgroundColor={tableCellBackgroundColor}
            />
            <InlineImagePlugin />
            <LinkPlugin />
            <TwitterPlugin />
            <YouTubePlugin />
            <FigmaPlugin />
            {!isEditable && <LexicalClickableLinkPlugin />}
            <HorizontalRulePlugin />
            <ExcalidrawPlugin />
            <TabFocusPlugin />
            <CollapsiblePlugin />
            <PageBreakPlugin />
            <LayoutPlugin />
            {floatingAnchorElem && !isSmallWidthViewport && (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
                <TableCellActionMenuPlugin
                  anchorElem={floatingAnchorElem}
                  cellMerge={true}
                  item={null}
                  handleRemoveItem={null}
                />
              </>
            )}
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            {/* <HistoryPlugin addHistory={addHistory} externalHistoryState={historyState} /> */}
          </>
        )}
        {isAutocomplete && <AutocompletePlugin />}
        <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
        {shouldUseLexicalContextMenu && <ContextMenuPlugin />}

      </div>
      {modal}
    </>
  );
}
