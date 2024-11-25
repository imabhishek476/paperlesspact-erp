import React, { useRef, useState } from 'react';
import {
  $getNearestNodeFromDOMNode,
  $getRoot,
  $getSelection,
  RootNode,
  TextNode,
} from 'lexical';
import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { NodeEventPlugin } from '@lexical/react/LexicalNodeEventPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { lexicalTheme } from './LexicalTheme';
import { nodeList } from '@/Utils/Lexical/Nodes/NodesList';
import DraggableBlockPlugin from '@/Utils/Lexical/Plugins/DraggableBlockPlugin';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
// import { TablePlugin } from "./plugins/TablePlugin";

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

function onError(error) {
  console.error(error);
}

const initialConfig = {
  namespace: 'MyEditor',
  lexicalTheme,
  onError,
  editable: true,
  nodes: [TableNode, TableCellNode, TableRowNode],
};

const LexicalEditorComponent = ({ editorRef }) => {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);

  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };
  const handleDragEnter = (e) => {
    const editor = editorRef.current;
    const keys = editor
      .getEditorState()
      .read(() => $getRoot().getChildrenKeys());
    const elements = keys.map((key) => editor.getElementByKey(key));
    const distanceFromElements = elements.map((element) => {
      const { x, y } = element.getBoundingClientRect();
      const yC = (y - e.clientY) * (y - e.clientY);
      const xC = (x - e.clientX) * (x - e.clientX);
      console.log(Math.sqrt(yC + xC));
      return Math.sqrt(yC + xC);
    });
    const minIndex = distanceFromElements.reduce(function (
      minIndex,
      currentValue,
      currentIndex,
      array
    ) {
      return currentValue < array[minIndex] ? currentIndex : minIndex;
    },
    0);
    const targetKey = keys[minIndex];
    console.log(targetKey);

    editor.update(() => {
      const targetEle = editor.getElementByKey(targetKey);
      const targetNode = $getNearestNodeFromDOMNode(targetEle);
      // targetEle.
      targetEle.classList.add('hovered');
      setTimeout(() => {
        targetEle.classList.remove('hovered');
      }, 100);
      console.log(targetNode);
      console.log(targetEle);
      // if(targetNode){
      // const newNode = $createParagraphNode();
      // newNode.append($createTextNode("Start Writing"))

      // // const elementNode =editorRef.current.getElementByKey(newNode.getKey())
      // // console.lo
      // targetNode.insertBefore(newNode);
      // console.log(newNode);
      // }
    });
  };
  // useEffect(() => {
  //   console.log(editorRef.current);
  //   // const removeMutationListener =
  //   //   editorRef && editorRef.current
  //   //     ? editorRef.current.registerRootListener((rootEle, prevRootEle) => {
  //   //         console.log(typeof rootEle, rootEle, rootEle.addEventListner);

  //   //         rootEle.addEventListner("click", (e) => {
  //   //           e.preventDefault();
  //   //           console.log("click", e);
  //   //         });
  //   //         // rootEle.addEventListner("dragleave",(e)=>{
  //   //         //   e.preventDefault();
  //   //         //   console.log(e);
  //   //         // })
  //   //         // rootEle.addEventListner("drop",(e)=>{
  //   //         //   e.preventDefault();
  //   //         //   console.log(e);
  //   //         // })
  //   //         // prevRootEle.removeEventListner("dragover",(e)=>{
  //   //         //   e.preventDefault();
  //   //         //   console.log(e);
  //   //         // })
  //   //         // prevRootEle.removeEventListner("dragleave",(e)=>{
  //   //         //   e.preventDefault();
  //   //         //   console.log(e);
  //   //         // })
  //   //         // prevRootEle.removeEventListner("drop",(e)=>{
  //   //         //   e.preventDefault();
  //   //         //   console.log(e);
  //   //         // })
  //   //       })
  //   //     : null;
  //   // if (editorRef.current && editorRef.current._nodes.length > 0) {
  //   //   // removeMutationListener();
  //   // }
  //   const removeMutationListener = editorRef?.current?.registerMutationListener(
  //     nodeList,
  //     (mutations) => {
  //       const registeredElements = new WeakSet();
  //       editorRef.current.getEditorState().read(() => {
  //         for (const [key, mutation] of mutations) {
  //           const element = editorRef.current.getElementByKey(key);
  //           if (
  //             // Updated might be a move, so that might mean a new DOM element
  //             // is created. In this case, we need to add and event listener too.
  //             (mutation === "created" || mutation === "updated") &&
  //             element !== null &&
  //             !registeredElements.has(element)
  //           ) {
  //             registeredElements.add(element);
  //             element.addEventListener("click", (event) => {
  //               alert("Nice!");
  //             });
  //           }
  //         }
  //       });
  //     }
  //   );
  //   return () => {
  //     console.log(removeMutationListener);
  //     if (removeMutationListener) {
  //       // removeMutationListener();
  //     }
  //   };
  // }, [editorRef]);
  // console.log(EditorRefPlugin);

  return (
    <div
      className="flex-1 bg-[#e4e4e480] px-2 "
      // onDragEnter={(e) => {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   console.log(e);
      // }}
      // onDrop={(e) => {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   console.log(e);
      //   console.log("in drop");
      // }}
    >
      <div
        className="editor-shell bg-white !rounded-lg py-2"
        onDrop={(e) => {
          // e.preventDefault();
          e.stopPropagation();
          console.log('drop');
        }}
        onDragEnter={handleDragEnter}
      >
        <LexicalComposer initialConfig={initialConfig}>
          {/* <NodeEventPlugin
            nodeType={RootNode}
            eventType={"click"}
            eventListener={(e) => {
              console.log("click ", e);
              alert("Nice!");
            }}
          /> */}
          <EditorRefPlugin editorRef={editorRef} />
          <TablePlugin />
          {/* <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} /> */}
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable className="ContentEditable__root" />
                </div>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <MyCustomAutoFocusPlugin />
          {floatingAnchorElem && (
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
          )}
        </LexicalComposer>
      </div>
    </div>
  );
};

export default LexicalEditorComponent;
