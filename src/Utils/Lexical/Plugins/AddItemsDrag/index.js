import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createPortal } from "react-dom";

const useAddDragItems = (
    editor,
     selectedItem, 
     offsetX, 
     offsetY, 
     anchorEle) => {
        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // console.log(e);
          };
          const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // console.log(e);
          };
          const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // console.log(e);
          };
          const handleDrop = (e, pageIndex) => {
            e.preventDefault();
            e.stopPropagation();
            // console.log(e);
            console.log("in drop");
            const { x, y, height, width } = e.target.getBoundingClientRect();
            const posX = Math.floor(((e.clientX - x) / width) * 100) + "%";
            const posY = Math.floor(((e.clientY - y) / height) * 100) + "%";
            // handleAdditem(selectedFieldItem, pageIndex, posX, posY);
            setSelectedFieldItem(null);
            setUpdate((prev) => !prev);
          };
        // const eleClone = anchorEle;
        anchorEle.addEventListner('ondrop',(e)=>{
            e.preventDefault();
            e.stopPropagation();
            console.log(e,"in drop");
        })

  return createPortal(
    <>
        <div
        className="w-full"
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
        ></div>
      <div className="draggable-block-target-line" ref={targetLineRef} />
    </>,
    anchorEle
  );
// return anchorEle;
};

export default AddItemsDrag = ({
  anchorEle,
  selectedItem,
  offsetX,
  offsetY,
}) => {
  const [editor] = useLexicalComposerContext();
  return useAddDragItems(editor, selectedItem, offsetX, offsetY, anchorEle);
};
