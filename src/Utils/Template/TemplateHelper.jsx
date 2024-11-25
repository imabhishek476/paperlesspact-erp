
import {
  $createParagraphNode,
  $createTextNode,
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  createEditor,
} from "lexical";
import { InsertImageDialog } from "../../components/LexicalTemplatePlayground/lexical-playground/src/plugins/ImagesPlugin";
import { InsertTableDialog } from "../../components/LexicalTemplatePlayground/lexical-playground/src/plugins/TablePlugin";
import InsertLayoutDialog from "../../components/LexicalTemplatePlayground/lexical-playground/src/plugins/LayoutPlugin/InsertLayoutDialog";
import { $createPageBreakNode } from "../../components/LexicalTemplatePlayground/lexical-playground/src/nodes/PageBreakNode";
import { $createCollapsibleTitleNode } from "../../components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleTitleNode";
import { $createCollapsibleContainerNode } from "../../components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContainerNode";
import { $createCollapsibleContentNode } from "../../components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContentNode";
import { $createHorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createStickyNode } from "../../components/LexicalTemplatePlayground/lexical-playground/src/nodes/StickyNode";
import { useDocItemStore } from "@/components/Template/stores/useDocItemStore";
export const handleInsertNode = (e, editorRef, showModal, quoteBuilderModal, setQuoteEditorRef, setQuoteTargetNode, setSelectedFieldItem, selectedFieldItem) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const {setQuoteEditorRef,setQuoteTargetNode,setSelectedFieldItem}=useDocItemStore()
  console.log("hi", editorRef.current.getEditorState())

  const editor = editorRef.current;
  const keys = editor
    .getEditorState()
    .read(() => $getRoot().getChildrenKeys());
  console.log(keys)
  const elements = keys.map((key) => editor.getElementByKey(key));
  const distanceFromElements = elements.map((element) => {
    const { x, y } = element.getBoundingClientRect();
    const yC = (y - e.clientY) * (y - e.clientY);
    const xC = (x - e.clientX) * (x - e.clientX);
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
  let targetNode = null;
  let targetEle = null;
  editor.update(() => {
    targetEle = editorRef.current.getElementByKey(targetKey);
    targetNode = $getNearestNodeFromDOMNode(targetEle);
    if (!targetNode) {
      const root = $getRoot();
      const paragraphNode = $createParagraphNode();
      const textNode = $createTextNode(' ');
      paragraphNode.append(textNode);
      root.append(paragraphNode);
      targetNode = paragraphNode
    }
    if (targetNode) {
      const newNode = $createParagraphNode();

      // if(selectedFieldItem.title==="Quote Builder"){
      //     setQuoteTargetNode(targetNode);
      //     setQuoteEditorRef(editorRef);
      //     quoteBuilderModal.onOpen();
      //     setSelectedFieldItem(null);
      // }
      switch (selectedFieldItem?.title) {
        case "text":
          newNode.append($createTextNode("Start Writing"));
          break;
        case "image":
          showModal("Insert Image", (onClose) => (
            <InsertImageDialog
              activeEditor={editorRef.current}
              onClose={onClose}
              fromEditor={true}
              targetNode={newNode}
            />
          ));
          break;
        case "table":
          showModal("Insert Table", (onClose) => (
            <InsertTableDialog
              activeEditor={editorRef.current}
              onClose={onClose}
              fromEditor={true}
              targetNode={newNode}
              setSize={null}
            />
          ));
          break;
        case "Columns Layout":
          showModal("Insert Columns Layout", (onClose) => (
            <InsertLayoutDialog
              activeEditor={editorRef.current}
              onClose={onClose}
              fromEditor={true}
              targetNode={targetNode}
            />
          ));
          break;
        case "Collapsible Container":
          const title = $createCollapsibleTitleNode();
          const paragraph = $createParagraphNode();
          newNode.insertAfter(
            $createCollapsibleContainerNode(true).append(
              title.append(paragraph),
              $createCollapsibleContentNode().append($createParagraphNode())
            )
          );
          break;
        case "Page-Break":
          newNode.append($createPageBreakNode());
          break;
        case "Horizontal Rule":
          newNode.append($createHorizontalRuleNode());
          break;
        case "Sticky Note":
          const root = $getRoot();
          const stickyNode = $createStickyNode(0, 0);
          root.append(stickyNode);
          break;
        case "Quote Builder":

          setQuoteTargetNode(targetNode);
          setQuoteEditorRef(editorRef);
          quoteBuilderModal.onOpen();
          setSelectedFieldItem(null);
          break;
        default:
          newNode.append($createTextNode("Start Writing"));
          break;
      }
      targetNode.insertBefore(newNode);
    }
    // nodeA.insertBefore(newNode, true);
  });
}