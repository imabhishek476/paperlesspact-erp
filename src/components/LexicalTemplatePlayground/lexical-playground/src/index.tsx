/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $createLinkNode } from "@lexical/link";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  $createParagraphNode,
  $createTextNode,
  $getNearestNodeFromDOMNode,
  $getRoot,
} from "lexical";
import * as React from "react";
import { $createStickyNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/StickyNode";
import { $createCollapsibleTitleNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleTitleNode";
import { $createCollapsibleContainerNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContainerNode";
import { $createCollapsibleContentNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContentNode";
import InsertLayoutDialog from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/LayoutPlugin/InsertLayoutDialog";
import { InsertTableDialog } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/TablePlugin";
import { $createHorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createPageBreakNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/PageBreakNode";
import useModal from "@/components/LexicalTemplatePlayground/lexical-playground/src/hooks/useModal";
import { InsertImageDialog } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/ImagesPlugin";
import { isDevPlayground } from "./appSettings";
import { SettingsContext, useSettings } from "./context/SettingsContext";
import { SharedAutocompleteContext } from "./context/SharedAutocompleteContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import Editor from "./Editor";
// import logo from "./images/logo.svg";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import DocsPlugin from "./plugins/DocsPlugin";
import PasteLogPlugin from "./plugins/PasteLogPlugin";
import { TableContext } from "./plugins/TablePlugin";
import TestRecorderPlugin from "./plugins/TestRecorderPlugin";
import TypingPerfPlugin from "./plugins/TypingPerfPlugin";
import Settings from "./Settings";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import { CommentStore } from "./commenting";
import { useTabsStore } from "@/components/Template/stores/useDocTabsStore";
import { getPageHeightHeaderFooter, getPageWidth } from "@/lib/helpers/templateHelpers";

console.warn(
  "If you are profiling the playground app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting."
);

function App({
  menuItem,
  setMenuOpen,
  setMenuItem,
  setItemClicked,
  itemClicked,
  setCopiedItem,
  setActiveRef,
  editorRef,
  activeRef,
  setGlobalEditorState,
  roomId,
  handleDrop,
  selectedFieldItem,
  setSelectedFieldItem,
  showComments,
  isCollab,
  participantsIndex,
  editorId,
  updateSharedItem,
  sharedItems,
  participants,
  serverData,
  items,
  setItems,
  setIsRefSet,
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
}: {
  setMenuOpen:any,
  setItemClicked: any;
  itemClicked: any;
  setCopiedItem: any;
  selectedItem: any;
  setSelectedItem: any;
  editorRef: any;
  roomId: string;
  handleDrop: (e: any) => void;
  selectedFieldItem: any;
  showComments: boolean;
  isCollab: boolean;
  participantsIndex: Number;
  setGlobalEditorState: any;
  editorId: Number;
  setSelectedFieldItem: any;
  updateSharedItem: any;
  sharedItems: any;
  participants: any;
  serverData: any;
  items: any;
  setItems: any;
  commentData: any
  setCommentData: React.Dispatch<React.SetStateAction<CommentStore[]>>;
  setIsRefSet: React.Dispatch<React.SetStateAction<boolean>>;
  commentStore: any;
  activePageIndex: any;
  setActiveRef: any
  selectedParticipant: any;
  pageOreintation: string;
  setPageOreintation: React.Dispatch<React.SetStateAction<string>>;
  pageSize: { height: string, width: string };
  setMenuItem: any,
  setPageSize: React.Dispatch<React.SetStateAction<{ height: string, width: string }>>,
  menuItem:any,
  activeRef:any
}): JSX.Element {
  const {
    settings: { emptyEditor, measureTypingPerf },
  } = useSettings();
  const {pageSetup,headerActive,footerActive,activeHeaderFooterPageHeight} = useTabsStore();
  console.log('in playgrground');
  // const [modal, showModal] = useModal();
  //   const [activeEditor, setActiveEditor] = React.useState(editorRef[1].current);
  // const handleDragEnd = (e:any)  => {
  //     const rect = e.target.getBoundingClientRect();
  //     const editor = editorRef.current;
  //     const keys = editor
  //       .getEditorState()
  //       .read(() => $getRoot().getChildrenKeys());
  //     const elements = keys.map((key:any) => editor.getElementByKey(key));
  //     const distanceFromElements = elements.map((element:any) => {
  //       const { x, y } = element.getBoundingClientRect();
  //       const yC = (y - e.clientY) * (y - e.clientY);
  //       const xC = (x - e.clientX) * (x - e.clientX);
  //       console.log(Math.sqrt(yC + xC));
  //       return Math.sqrt(yC + xC);
  //     });
  //     const minIndex = distanceFromElements.reduce((
  //       minIndex :any,
  //       currentValue:any,
  //       currentIndex:any,
  //       array:any
  //     ) => currentValue < array[minIndex] ? currentIndex : minIndex,
  //     0);
  //     const targetKey = keys[minIndex];
  //     console.log(keys, targetKey);
  //     let targetNode:any = null;
  //     let targetEle = null;
  //     editorRef.current.update(() => {
  //       targetEle = editorRef.current.getElementByKey(targetKey);
  //       targetNode = $getNearestNodeFromDOMNode(targetEle);
  //       console.log(targetNode);
  //       console.log(keys, targetKey);
  //       if (targetNode) {
  //         const newNode = $createParagraphNode();
  //         console.log(selectedFieldItem);
  //         switch (selectedFieldItem.title) {
  //           case 'text':
  //             newNode.append($createTextNode('Start Writing'));
  //             break;
  //           case 'image':
  //             console.log('in image');
  //             showModal('Insert Image', (onClose) => (
  //               <InsertImageDialog
  //                 isTopAdd={false}
  //                 activeEditor={activeEditor}
  //                 onClose={onClose}
  //                 fromEditor={true}
  //                 targetNode={newNode}
  //               />
  //             ));
  //             break;
  //           case 'table':
  //             console.log('in image');
  //             showModal('Insert Table', (onClose) => (
  //               <InsertTableDialog
  //               isTopAdd={false}

  //                 activeEditor={activeEditor}
  //                 onClose={onClose}
  //                 fromEditor={true}
  //                 targetNode={newNode}
  //               />
  //             ));
  //             break;
  //           case "Columns Layout":
  //             console.log("in image");
  //             showModal('Insert Columns Layout', (onClose) => (
  //               <InsertLayoutDialog
  //               isTopAdd={false}

  //                 activeEditor={activeEditor}
  //                 onClose={onClose}
  //                 fromEditor={true}
  //                 targetNode={targetNode}
  //               />
  //             ));
  //             break;
  //           case 'Collapsible Container':
  //             const title = $createCollapsibleTitleNode();
  //             const paragraph = $createParagraphNode();
  //             newNode.insertAfter(
  //               $createCollapsibleContainerNode(true).append(
  //                 title.append(paragraph),
  //                 $createCollapsibleContentNode().append($createParagraphNode())
  //               )
  //             );
  //             break;
  //           case 'Page-Break':
  //             newNode.append($createPageBreakNode());
  //             break;
  //           case 'Horizontal Rule':
  //             newNode.append($createHorizontalRuleNode());
  //             break;
  //           case 'Sticky Note':
  //             const root = $getRoot();
  //             const stickyNode = $createStickyNode(0, 0);
  //             console.log(root);
  //             root.append(stickyNode);
  //             break;

  //           default:
  //             newNode.append($createTextNode('Start Writing'));
  //             break;
  //         }

  //         // const elementNode =editorRef.current.getElementByKey(newNode.getKey())
  //         // console.lo
  //         targetNode.insertBefore(newNode);
  //         setSelectedFieldItem(null)
  //       }
  //     });
  //   };

  React.useEffect(() => {
    console.log(pageOreintation, pageSize);
  }, [pageOreintation])
  return (
    <SharedHistoryContext>
      <TableContext>
        <SharedAutocompleteContext>
          <div
            className="editor-shell shadow-md"
            // onDrop={(e) => {
            //   console.log(selectedFieldItem);
            //   if(selectedFieldItem){
            //     if (selectedFieldItem?.type) {
            //       handleDrop(e);
            //     } else {
            //       // handleDragEnd(e)
            //     }
            //   }
            // }}
            style={{
              width: getPageWidth(pageSetup),
              height:activeHeaderFooterPageHeight,
            }}
          >
            <Editor
            activeRef={activeRef}
                menuItem={menuItem}
              setMenuOpen={setMenuOpen}
              setMenuItem={setMenuItem}
              setItemClicked={setItemClicked}
              itemClicked={itemClicked}
              setCopiedItem={setCopiedItem}
              setActiveRef={setActiveRef}
              editorRef={editorRef}
              handleDrop={handleDrop}
              setGlobalEditorState={setGlobalEditorState}
              roomId={roomId}
              showComments={showComments}
              isCollab={isCollab}
              participantsIndex={participantsIndex}
              id={editorId}
              items={items}
              selectedItem={selectedItem}
              setItems={setItems}
              participants={participants}
              serverData={serverData}
              sharedItems={sharedItems}
              updateSharedItem={updateSharedItem}
              setIsRefSet={setIsRefSet}
              commentStore={commentStore}
              commentData={commentData}
              setCommentData={setCommentData}
              activePageIndex={activePageIndex}
              selectedParticipant={selectedParticipant}
              pageOreintation={pageOreintation}
              pageSize={pageSize}
            />
          </div>
          {/* <Settings />
            {isDevPlayground ? <DocsPlugin /> : null}
            {isDevPlayground ? <PasteLogPlugin /> : null}
            {isDevPlayground ? <TestRecorderPlugin /> : null}

            {measureTypingPerf ? <TypingPerfPlugin /> : null} */}
        </SharedAutocompleteContext>
      </TableContext>
    </SharedHistoryContext>
  );
}

export default function PlaygroundApp({
  activeRef,
  setMenuOpen,
  setItemClicked,
  itemClicked,
  setCopiedItem,
  editorRef,
  roomId,
  handleDrop,
  selectedFieldItem,
  showComments,
  setSelectedFieldItem,
  isCollab,
  participantsIndex,
  setGlobalEditorState,
  updateSharedItem,
  sharedItems,
  participants,
  serverData,
  items,
  setItems,
  editorId,
  setIsRefSet,
  commentStore,
  commentData,
  setCommentData,
  activePageIndex,
  setActiveRef,
  selectedParticipant,
  pageOreintation,
  setPageOreintation,
  pageSize,
  setPageSize,
  selectedItem,
  setSelectedItem,
  setMenuItem,
  menuItem
}: {
  setMenuOpen:any,
  setItemClicked: any;
  itemClicked: any;
  setCopiedItem: any;
  selectedItem: any;
  setSelectedItem: any;
  editorRef: any;
  roomId: string;
  setGlobalEditorState: any;
  handleDrop: () => void;
  selectedFieldItem: any;
  showComments: boolean;
  isCollab: boolean;
  participantsIndex: Number;
  updateSharedItem: any;
  sharedItems: any;
  participants: any;
  serverData: any;
  items: any;
  setItems: any;
  editorId: Number;
  setSelectedFieldItem: any;
  commentData: any;
  setCommentData: React.Dispatch<React.SetStateAction<CommentStore[]>>;
  setIsRefSet: React.Dispatch<React.SetStateAction<boolean>>
  commentStore: any,
  activePageIndex: any,
  setActiveRef: any
  selectedParticipant: any;
  pageOreintation: string;
  setPageOreintation: React.Dispatch<React.SetStateAction<string>>
  pageSize: { height: string, width: string };
  setMenuOpenId: any,
  setMenuItem: any,
  menuItem:any,
  activeRef:any,
  setPageSize: React.Dispatch<React.SetStateAction<{ height: string, width: string }>>
}): JSX.Element {
  console.log('in app')
  return (
    <App
    menuItem={menuItem}
    setMenuOpen={setMenuOpen}
      setMenuItem={setMenuItem}
      setItemClicked={setItemClicked}
      itemClicked={itemClicked}
      setCopiedItem={setCopiedItem}
      setActiveRef={setActiveRef}
      activeRef={activeRef}
      setGlobalEditorState={setGlobalEditorState}
      // handleDrop={handleDrop}
      editorRef={editorRef}
      roomId={roomId}
      handleDrop={handleDrop}
      selectedFieldItem={selectedFieldItem}
      showComments={showComments}
      isCollab={isCollab}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
      setSelectedFieldItem={setSelectedFieldItem}
      participantsIndex={participantsIndex}
      editorId={editorId}
      items={items}
      setItems={setItems}
      participants={participants}
      serverData={serverData}
      sharedItems={sharedItems}
      updateSharedItem={updateSharedItem}
      setIsRefSet={setIsRefSet}
      commentStore={commentStore}
      commentData={commentData}
      setCommentData={setCommentData}
      activePageIndex={activePageIndex}
      selectedParticipant={selectedParticipant}
      pageOreintation={pageOreintation}
      setPageOreintation={setPageOreintation}
      pageSize={pageSize}
      setPageSize={setPageSize}
    />
  );
}
