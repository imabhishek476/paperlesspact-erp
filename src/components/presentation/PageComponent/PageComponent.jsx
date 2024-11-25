import React, { useEffect, useState } from "react";
import { usePageStore } from "../stores/usePageStore";
import PageSlider from "./PageSlider";
import { ChevronDown, CopyPlus, Trash2 } from "lucide-react";
import SideBar from "../SideBar";
import EditablePage from "./EditablePage";
import { useItemStore } from "../stores/useItemStore";
import { Button, Divider } from "@nextui-org/react";
import { usePresHistory } from "../stores/usePresHistoryStore";

const PageComponent = ({ orientation }) => {
  const { selectedPage, setDefaultSelectedPage,deleteAtIndex,setSelectedPage,addAtIndex,pages,setPages } = usePageStore();
  const {
    selectedItem,
    contextMenu,
    setContextMenu,
    duplicateItem,
    deleteItem,
    updateItem,
    addItem,
    setSelectedItem,
    setItems,
    shiftItemsPage,
    deletePageItems,
  } = useItemStore();
  const { canUndoItem, canRedoItem,redoStack,undoStack, undo,redo,addHistory } = usePresHistory();
  console.log(undoStack,canUndoItem,redoStack,canRedoItem)
  const [IS_APPLE, setIS_APPLE] = useState(false);
  console.log(pages)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.document !== "undefined" &&
      typeof window.document.createElement !== "undefined"
    ) {
      setIS_APPLE(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
    }
  }, []);
  // const {undo, redo,clear} =useItemStore.temporal.getState()
  useEffect(() => {
    if (!selectedPage) {
      setDefaultSelectedPage();
    }
  }, []);
  // const handleUndo =()=>{
  //   console.log('heey')
  //   debugger
  //   undo()
  // }

  return (
    <div className="lg:ml-[73px]  flex flex-col justify-between h-[calc(100vh-57px)] w-full overflow-hidden relative bg-[#eee]">
      <div
        className="w-full block bg-white border-b-2 min-h-[45px]"
        onDoubleClick={(e) => {
          e?.preventDefault();
          e?.stopPropagation();
        }}
      >
        <div className="flex items-center h-full">
        <button
        disabled={!canUndoItem}
          onClick={() => {
            console.log('UNDO')
            undo(deleteItem,updateItem,addItem,setSelectedItem,deleteAtIndex,setItems,addAtIndex,shiftItemsPage,pages,setPages,deletePageItems)
          }}
          title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
          type="button"
          className="toolbar-item spaced"
          aria-label="Undo">
          <i className="format undo" />
        </button>
        <button
          disabled={!canRedoItem}
          onClick={() => {
            console.log('REDO')
            redo(deleteItem,updateItem,addItem,setSelectedItem,deleteAtIndex,setSelectedPage,addAtIndex,shiftItemsPage,pages,setPages,deletePageItems)
          }}
          title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
          type="button"
          className="toolbar-item"
          aria-label="Redo">
          <i className="format redo" />
        </button>
        </div>
        {/* <Divider /> */}
      </div>
      <div
        className="w-full h-full flex justify-center overflow-auto"
        onClick={() => {
          if (contextMenu) {
            setContextMenu(null);
          }
        }}
      >
        {contextMenu && (
          <div
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="absolute z-999 w-30 bg-white shadow-md text-[#151513] text-sm rounded-sm py-2"
          >
            <ul>
              {/* <li style={{ display: (copyItem && !itemClicked && menuItem) ? "flex" : "none" }} onClick={() => { handlePaste(), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Clipboard size={20} /> Paste</li> */}
              <>
                <li
                  style={{ display: contextMenu ? "flex" : "none" }}
                  onClick={() => {
                    duplicateItem(contextMenu.item);
                    setContextMenu(null);
                  }}
                  className="flex flex-row gap-2 items-center px-4 py-2 hover:bg-gray-200 hover:cursor-pointer"
                >
                  <CopyPlus size={20} /> Duplicate
                </li>
                <li
                  style={{ display: contextMenu ? "flex" : "none" }}
                  onClick={() => {
                    deleteItem(contextMenu.item);
                    addHistory(contextMenu.item,"item","delete")
                    setContextMenu(null);
                  }}
                  className="flex flex-row gap-2 items-center px-4 py-2 hover:bg-gray-200 hover:cursor-pointer"
                >
                  <Trash2 size={20} /> Delete
                </li>
              </>
            </ul>
          </div>
        )}

        {/* <div className='cursor-pointer' onClick={() => undo()}>hrllo</div> */}
        {selectedPage && <EditablePage />}
      </div>
      <div className="w-full">
        <PageSlider orientation={orientation} />
      </div>
    </div>
  );
};

export default PageComponent;
