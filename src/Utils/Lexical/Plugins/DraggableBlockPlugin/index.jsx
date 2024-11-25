// import './index.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { eventFiles } from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $createTextNode,
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getRoot,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// import { isHTMLElement } from '../../utils/guard';
// import { Point } from '../../utils/point';
// import { Rect } from '../../utils/rect';
import { Rect } from '@/Utils/Coordinates/Rect/Rect';
import { Point } from '@/Utils/Coordinates/Point/Point';
import { isHTMLElement } from '@/Utils/Guard';
import { GripVertical, Plus, X } from 'lucide-react';
import { Button, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { $createHorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { INSERT_PAGE_BREAK } from '@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/PageBreakPlugin';
import { $createPageBreakNode } from '@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/PageBreakNode';
import { $createStickyNode } from '@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/StickyNode';
import useModal from '@/components/LexicalTemplatePlayground/lexical-playground/src/hooks/useModal';
import { InsertImageDialog } from '@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/ImagesPlugin';
import { InsertTableDialog } from '@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/TablePlugin';
import { $createCollapsibleTitleNode } from '@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleTitleNode';
import { $createCollapsibleContainerNode } from '@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContainerNode';
import { $createCollapsibleContentNode } from '@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContentNode';
import InsertLayoutDialog from '@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/LayoutPlugin/InsertLayoutDialog';

const SPACE = 4;
const TARGET_LINE_HALF_HEIGHT = 2;
const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';
const DRAG_DATA_FORMAT = 'application/x-lexical-drag-block';
const TEXT_BOX_HORIZONTAL_PADDING = 28;

const Downward = 1;
const Upward = -1;
const Indeterminate = 0;

const addItems = [
  {
    title:"Image",
    icon:<i className='icon image w-[20px] h-[20px] popoverItemIcon' />
  },
  {
    title:"Table",
    icon:<i className='icon table w-[20px] h-[20px] popoverItemIcon' />
  },
  // {
  //   title:"Youtube Video",
  //   icon:<i className='icon text' />
  // },
  {
    title:"Page Break",
    icon:<i className='icon page-break w-[20px] h-[20px] popoverItemIcon' />
  },
  {
    title:"Horizontal Rule",
    icon:<i className='icon horizontal-rule w-[20px] h-[20px] popoverItemIcon' />
  },
  // {
  //   title:"Poll",
  //   icon:<i className='icon poll w-[20px] h-[20px] popoverItemIcon' />
  // },
  {
    title:"Columns Layout",
    icon:<i className='icon columns w-[20px] h-[20px] popoverItemIcon' />
  },
  {
    title:"Sticky Note",
    icon:<i className='icon sticky w-[20px] h-[20px] popoverItemIcon' />
  },
  // {
  //   title:"Collapsible Container",
  //   icon:<i className='icon caret-right w-[20px] h-[20px] popoverItemIcon' />
  // },
];

let prevIndex = Infinity;

function getCurrentIndex(keysLength) {
  if (keysLength === 0) {
    return Infinity;
  }
  if (prevIndex >= 0 && prevIndex < keysLength) {
    return prevIndex;
  }

  return Math.floor(keysLength / 2);
}

function getTopLevelNodeKeys(editor) {
  return editor.getEditorState().read(() => $getRoot().getChildrenKeys());
}

function getCollapsedMargins(elem) {
  const getMargin = (element, margin) =>
    element ? parseFloat(window.getComputedStyle(element)[margin]) : 0;

  const { marginTop, marginBottom } = window.getComputedStyle(elem);
  const prevElemSiblingMarginBottom = getMargin(
    elem.previousElementSibling,
    'marginBottom'
  );
  const nextElemSiblingMarginTop = getMargin(
    elem.nextElementSibling,
    'marginTop'
  );
  const collapsedTopMargin = Math.max(
    parseFloat(marginTop),
    prevElemSiblingMarginBottom
  );
  const collapsedBottomMargin = Math.max(
    parseFloat(marginBottom),
    nextElemSiblingMarginTop
  );

  return { marginBottom: collapsedBottomMargin, marginTop: collapsedTopMargin };
}

function getBlockElement(anchorElem, editor, event, useEdgeAsDefault = false) {
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const topLevelNodeKeys = getTopLevelNodeKeys(editor);

  let blockElem = null;

  editor.getEditorState().read(() => {
    if (useEdgeAsDefault) {
      const [firstNode, lastNode] = [
        editor.getElementByKey(topLevelNodeKeys[0]),
        editor.getElementByKey(topLevelNodeKeys[topLevelNodeKeys.length - 1]),
      ];

      const [firstNodeRect, lastNodeRect] = [
        firstNode?.getBoundingClientRect(),
        lastNode?.getBoundingClientRect(),
      ];

      if (firstNodeRect && lastNodeRect) {
        if (event.y < firstNodeRect.top) {
          blockElem = firstNode;
        } else if (event.y > lastNodeRect.bottom) {
          blockElem = lastNode;
        }

        if (blockElem) {
          return;
        }
      }
    }

    let index = getCurrentIndex(topLevelNodeKeys.length);
    let direction = Indeterminate;

    while (index >= 0 && index < topLevelNodeKeys.length) {
      const key = topLevelNodeKeys[index];
      const elem = editor.getElementByKey(key);
      if (elem === null) {
        break;
      }
      const point = new Point(event.x, event.y);
      const domRect = Rect.fromDOM(elem);
      const { marginTop, marginBottom } = getCollapsedMargins(elem);

      const rect = domRect.generateNewRect({
        bottom: domRect.bottom + marginBottom,
        left: anchorElementRect.left,
        right: anchorElementRect.right,
        top: domRect.top - marginTop,
      });

      const {
        result,
        reason: { isOnTopSide, isOnBottomSide },
      } = rect.contains(point);

      if (result) {
        blockElem = elem;
        prevIndex = index;
        break;
      }

      if (direction === Indeterminate) {
        if (isOnTopSide) {
          direction = Upward;
        } else if (isOnBottomSide) {
          direction = Downward;
        } else {
          // stop search block element
          direction = Infinity;
        }
      }

      index += direction;
    }
  });

  return blockElem;
}

function isOnMenu(element) {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

function setMenuPosition(targetElem, floatingElem, anchorElem, buttonElem) {
  if (!targetElem) {
    floatingElem.style.opacity = '0';
    floatingElem.style.transform = 'translate(-10000px, -10000px)';
        buttonElem.style.opacity = '0';
        buttonElem.style.transform = 'translate(-10000px, -10000px)';
    return;
  }
  // if(!)

  const targetRect = targetElem.getBoundingClientRect();
  const targetStyle = window.getComputedStyle(targetElem);
  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();

  const top =
    targetRect.top +
    (parseInt(targetStyle.lineHeight, 10) - floatingElemRect.height) / 2 -
    anchorElementRect.top;  
  const left = SPACE;
  const hei= `${targetRect.bottom - targetRect.top + 23}px`
  floatingElem.style.opacity = '1';
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
  targetElem.border= "1px solid #05686E"
  buttonElem.style.opacity = '1';
  buttonElem.style.height =  hei
  buttonElem.style.transform = `translate(${anchorElementRect.width/2}px, ${top - ((floatingElemRect.height/1.5))}px)`; 
}

function setDragImage(dataTransfer, draggableBlockElem) {
  const { transform } = draggableBlockElem.style;

  // Remove dragImage borders
  draggableBlockElem.style.transform = 'translateZ(0)';
  dataTransfer.setDragImage(draggableBlockElem, 0, 0);

  setTimeout(() => {
    draggableBlockElem.style.transform = transform;
  });
}

function setTargetLine(targetLineElem, targetBlockElem, mouseY, anchorElem) {
  const { top: targetBlockElemTop, height: targetBlockElemHeight } =
    targetBlockElem.getBoundingClientRect();
  const { top: anchorTop, width: anchorWidth } =
    anchorElem.getBoundingClientRect();

  const { marginTop, marginBottom } = getCollapsedMargins(targetBlockElem);
  let lineTop = targetBlockElemTop;
  if (mouseY >= targetBlockElemTop) {
    lineTop += targetBlockElemHeight + marginBottom / 2;
  } else {
    lineTop -= marginTop / 2;
  }

  const top = lineTop - anchorTop - TARGET_LINE_HALF_HEIGHT;
  const left = TEXT_BOX_HORIZONTAL_PADDING - SPACE;

  targetLineElem.style.transform = `translate(${left}px, ${top}px)`;
  targetLineElem.style.width = `${
    anchorWidth - (TEXT_BOX_HORIZONTAL_PADDING - SPACE) * 2
  }px`;
  targetLineElem.style.opacity = '.4';
}

function hideTargetLine(targetLineElem) {
  if (targetLineElem) {
    targetLineElem.style.opacity = '0';
    targetLineElem.style.transform = 'translate(-10000px, -10000px)';
  }
}

function useDraggableBlockMenu(editor, anchorElem, isEditable) {
  const [activeEditor,setActiveEditor] = useState(editor);
  let item=null
  let handleRemoveItem=null
  const [modal, showModal] = useModal(item,handleRemoveItem);
  const scrollerElem = anchorElem.parentElement;
  const buttonRef = useRef(null)
  const menuRef = useRef(null);
  const targetLineRef = useRef(null);
  const isDraggingBlockRef = useRef(false);
  const [draggableBlockElem, setDraggableBlockElem] = useState(null);
  const [isTopAdd,setIsTopAdd] = useState(true);

  useEffect(()=>{
    return  editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  },[editor]);

  useEffect(() => {
    function onMouseMove(event) {
      const target = event.target;
      if (!isHTMLElement(target)) {
        setDraggableBlockElem(null);
        return;
      }

      if (isOnMenu(target)) {
        return;
      }

      const _draggableBlockElem = getBlockElement(anchorElem, editor, event);
      if(_draggableBlockElem){
        _draggableBlockElem.classList.add("hoverBorderBottom")
      }
      setDraggableBlockElem(_draggableBlockElem);
    }

    function onMouseLeave() {
      setDraggableBlockElem(null);
    }

    scrollerElem?.addEventListener('mousemove', onMouseMove);
    scrollerElem?.addEventListener('mouseleave', onMouseLeave);

    return () => {
      scrollerElem?.removeEventListener('mousemove', onMouseMove);
      scrollerElem?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [scrollerElem, anchorElem, editor]);

  useEffect(() => {
    if (menuRef.current) {
      setMenuPosition(draggableBlockElem, menuRef.current, anchorElem, buttonRef.current);
    }
  }, [anchorElem, draggableBlockElem]);

  useEffect(() => {
    function onDragover(event) {
      if (!isDraggingBlockRef.current) {
        return false;
      }
      const [isFileTransfer] = eventFiles(event);
      if (isFileTransfer) {
        return false;
      }
      const { pageY, target } = event;
      if (!isHTMLElement(target)) {
        return false;
      }
      const targetBlockElem = getBlockElement(anchorElem, editor, event, true);
      const targetLineElem = targetLineRef.current;
      if (targetBlockElem === null || targetLineElem === null) {
        return false;
      }
      setTargetLine(targetLineElem, targetBlockElem, pageY, anchorElem);
      // Prevent default event to be able to trigger onDrop events
      event.preventDefault();
      return true;
    }

    function onDrop(event) {
      if (!isDraggingBlockRef.current) {
        return false;
      }
      const [isFileTransfer] = eventFiles(event);
      if (isFileTransfer) {
        return false;
      }
      const { target, dataTransfer, pageY } = event;
      const dragData = dataTransfer?.getData(DRAG_DATA_FORMAT) || '';
      const draggedNode = $getNodeByKey(dragData);
      if (!draggedNode) {
        return false;
      }
      if (!isHTMLElement(target)) {
        return false;
      }
      const targetBlockElem = getBlockElement(anchorElem, editor, event, true);
      if (!targetBlockElem) {
        return false;
      }
      const targetNode = $getNearestNodeFromDOMNode(targetBlockElem);
      if (!targetNode) {
        return false;
      }
      if (targetNode === draggedNode) {
        return true;
      }
      const targetBlockElemTop = targetBlockElem.getBoundingClientRect().top;
      if (pageY >= targetBlockElemTop) {
        targetNode.insertAfter(draggedNode);
      } else {
        targetNode.insertBefore(draggedNode);
      }
      setDraggableBlockElem(null);

      return true;
    }

    return mergeRegister(
      editor.registerCommand(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DROP_COMMAND,
        (event) => {
          return onDrop(event);
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [anchorElem, editor]);

  function onDragStart(event) {
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer || !draggableBlockElem) {
      return;
    }
    setDragImage(dataTransfer, draggableBlockElem);
    let nodeKey = '';
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(draggableBlockElem);
      if (node) {
        nodeKey = node.getKey();
      }
    });
    isDraggingBlockRef.current = true;
    dataTransfer.setData(DRAG_DATA_FORMAT, nodeKey);
  }

  function onDragEnd() {
    isDraggingBlockRef.current = false;
    hideTargetLine(targetLineRef.current);
  }

  const handleAddElement = (anchorElem, editor, event,type) => {
    const targetBlockElem = getBlockElement(anchorElem, editor, event, true);
      if (!targetBlockElem) {
        return false;
      }
      
      activeEditor.update(()=>{
        const targetNode = $getNearestNodeFromDOMNode(targetBlockElem);
        console.log(targetNode);
        if (!targetNode) {
          return ;
        }
        if(targetNode){
          addNodeAfter(targetNode,type);
        }
      });
  }

  const addNodeAfter = (targetNode,type) =>{
    try{
      if(!targetNode||!type){
        throw Error(' no target node found');
      }
      if(type==='Horizontal Rule'){
        const newNode = $createHorizontalRuleNode();
        if(isTopAdd){
          targetNode.insertBefore(newNode);
        }else{
          targetNode.insertAfter(newNode);
        }
        console.log(targetNode);
      }
      if(type==='Page Break'){
        const newNode = $createPageBreakNode();
        if(isTopAdd){
          targetNode.insertBefore(newNode);
        }else{
          targetNode.insertAfter(newNode);
        }
      }
      if(type==='Sticky Note'){
        const root = $getRoot();
        const stickyNode = $createStickyNode(0, 0);
        root.append(stickyNode);
      }
      if(type==='Image'){
        console.log('in image');
        showModal('Insert Image', (onClose) => (
          <InsertImageDialog
            activeEditor={activeEditor}
            onClose={onClose}
            fromEditor={true}
            targetNode={targetNode}
            isTopAdd={isTopAdd}
          />
        ));
      }
      if(type==='Table'){
        console.log('table');
        showModal('Insert Table', (onClose) => (
          <InsertTableDialog
            activeEditor={activeEditor}
            onClose={onClose}
            fromEditor={true}
            targetNode={targetNode}
            isTopAdd={isTopAdd}
            setSize={null}
          />
        ));
      }
      // if(type==='Poll'){
      //   console.log('in poll');
      //   showModal('Insert Poll', (onClose) => (
      //     <InsertPollDialog
      //       activeEditor={activeEditor}
      //       onClose={onClose}
      //       fromEditor={true}
      //       targetNode={targetNode}
      //     />
      //   ));
      // }
      if(type==='Collapsible Container'){
          const title = $createCollapsibleTitleNode();
          const paragraph = $createParagraphNode();
          targetNode.insertAfter(
            $createCollapsibleContainerNode(true).append(
              title.append(paragraph),
              $createCollapsibleContentNode ().append($createParagraphNode()),
            ),
          );
      }
      if(type==='Columns Layout'){
        showModal('Insert Columns Layout', (onClose) => (
          <InsertLayoutDialog
            activeEditor={activeEditor}
            onClose={onClose}
            fromEditor={true}
            targetNode={targetNode}
            isTopAdd={isTopAdd}
          />
        ));
      }
    }
    catch(err){
      console.log(err);
    }
  }


  return createPortal(
    <>
      <div
        className="icon draggable-block-menu"
        ref={menuRef}
        draggable={true}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className={isEditable ? 'icon' : ''} />
      </div>
      <div className="draggable-block-target-line" ref={targetLineRef} />
      <div className="absolute top-0 left-0 flex flex-col justify-between" ref={buttonRef}>
      <Popover 
      placement="bottom"
      classNames={{
        content:'rounded-[8px]'
      }}
      >
        <div className='flex flex-col h-full justify-between'>
      <PopoverTrigger>
          <Button
            // isIconOnly
            onClick={() => {
              console.log('top');
              setIsTopAdd(true);
            }}
            // size="sm"
            radius='full'

            className="bg-[#05686E] min-w-6 w-6 h-6 p-0 m-0"
          >
            <Plus className="w-3 h-3 text-white" />
          </Button>
      </PopoverTrigger>
      <PopoverTrigger>
          <Button
            // isIconOnly
            onClick={() => {
              console.log('bottom');
              setIsTopAdd(false);
            }}
            // size="sm"
            radius='full'

            className="bg-[#05686E] min-w-6 w-6 h-6 p-0 m-0"
          >
            <Plus className="w-3 h-3 text-white" />
          </Button>
      </PopoverTrigger>

        </div>
      <PopoverContent>
      <Listbox
        aria-label="Actions"
      >
        {addItems&&addItems.map((ele,index)=>{
          return (
            <ListboxItem 
            key={ele.title}
            as={Button} 
            onPress={(e)=>handleAddElement(anchorElem, activeEditor, e,ele.title)} 
            className='bg-transparent'
            startContent={ele.icon}
            classNames={{
              title:'text-left text-[#050505]'
            }}
            >
              {ele.title}
            </ListboxItem>
          )
        })}      
      </Listbox>
      </PopoverContent>
    </Popover>
    {modal}
        </div>
        {/* <Button
            // isIconOnly
            onPress={() => {
              console.log(anchorElem);
            }}
            size="sm"
            radius='full'

            className="bg-[#05686E] min-w-2 max-w-5 h-5 "
          >
            <Plus className="w-3 h-3 text-white" />
          </Button> */}
      {/* <div className="border-2" /> */}
    </>,
    anchorElem
  );
}

export default function DraggableBlockPlugin({ anchorElem = document.body }) {
  const [editor] = useLexicalComposerContext();
  return useDraggableBlockMenu(editor, anchorElem, editor._editable);
}
