import { create } from "zustand";
import { isEqual } from "lodash-es";
export const usePresHistory = create((set) => ({
  undoStack: [],
  redoStack: [],
  canRedoItem: false,
  canUndoItem: false,
  addHistory: (
    item,
    type,
    operation,
    prevState = null,
    pages = null,
    allItems = null,
    bgColor
  ) => {
    console.log(item);
    console.log(prevState);
    console.log(type, operation);
    set((state) => {
      let newHistory;
      const tRedoStack = [...state.redoStack];
      console.log(state.undoStack);
      if (operation === "update") {
        console.log(item, prevState);
        if (!isEqual(item, prevState)) {
          newHistory = {
            currentState: item,
            prevState: prevState,
            type,
            operation,
            pages: pages,
            allItems: allItems,
          };
        }
      } else if (operation === "visible") {
        newHistory = {
          currentState: item,
          type,
          operation,
          pages: pages,
          visibility: prevState,
        };
      } else {
        newHistory = {
          currentState: item,
          type,
          operation,
          prevState: prevState,
          pages: pages,
          allItems: allItems,
          bgColor: bgColor,
        };
      }
      let tUndoStack = [...state.undoStack];
      if (newHistory) {
        tUndoStack = [...tUndoStack, newHistory];
      }
      let undoStatus = false;
      let redoStatus = false;
      if (tUndoStack?.length > 0) {
        undoStatus = true;
      }
      if (tRedoStack?.length > 0) {
        redoStatus = true;
      }
      console.log(newHistory);
      console.log(tUndoStack);
      return {
        undoStack: tUndoStack,
        redoStack: tRedoStack,
        canUndoItem: undoStatus,
        canRedoItem: redoStatus,
      };
    });
  },
  undo: (
    deleteItem,
    updateItem,
    addItem,
    setSelectedItem,
    deleteAtIndex,
    setItems,
    addAtIndex,
    shiftItemsPage,
    pages,
    setPages,
    deletePageItems
  ) => {
    const tempPages = pages;
    set((state) => {
      if (state.undoStack.length === 0) return;
      const tUndoStack = [...state.undoStack];
      const actionToUndo = tUndoStack.pop();
      console.log(actionToUndo);
      const tRedoStack = [...state.redoStack, actionToUndo];
      console.log(actionToUndo.operation);
      if (actionToUndo?.type === "item") {
        switch (actionToUndo.operation) {
          case "add":
            console.log(actionToUndo?.currentState);
            setSelectedItem(null);
            deleteItem(actionToUndo.currentState);
            break;
          case "update":
            console.log(actionToUndo.prevState);
            console.log(actionToUndo.currentState);
            updateItem(actionToUndo.prevState);
            break;
          case "delete":
            addItem(actionToUndo.currentState);
            break;
          default:
            console.log("No item in stack");
        }
      }
      if (actionToUndo?.type === "page") {
        const items = actionToUndo.allItems;
        const pages = actionToUndo.pages;
        console.log(actionToUndo?.currentState);
        console.log(items);
        // console.log(actionToUndo?.prevState)
        switch (actionToUndo.operation) {
          case "add":
            console.log(actionToUndo);
            console.log(tempPages.length);
            deleteAtIndex(actionToUndo.currentState);
            // deletePageItems(actionToUndo.currentState)
            // shiftItemsPage(actionToUndo.currentState-1, -1);
            if (actionToUndo.currentState != pages?.length - 1) {
              shiftItemsPage(actionToUndo.currentState, -1);
            }
            break;
          case "duplicate":
            console.log(actionToUndo);
            console.log(tempPages.length);
            deleteAtIndex(actionToUndo.currentState);
            // deletePageItems(actionToUndo.currentState)
            // shiftItemsPage(actionToUndo.currentState-1, -1);
            if (actionToUndo.currentState != pages?.length - 1) {
              shiftItemsPage(actionToUndo.currentState-1, -1);
            }
            break;
          case "update":
            console.log(actionToUndo.prevState);
            console.log(actionToUndo.currentState);
            updatePage(actionToUndo?.currentState, actionToUndo.prevState);
            break;
          case "visible":
            console.log(tempPages);
            const page = tempPages[actionToUndo?.currentState];
            const newPages = tempPages;
            newPages.splice(actionToUndo?.currentState, 1, { ...page, visibility: !actionToUndo.visibility });
            break;
          case "delete":
            console.log(actionToUndo);
            setItems(items);
            addAtIndex(actionToUndo.prevState);
            break;
          default:
            console.log("No item in stack");
        }
      }
      let undoStatus = false;
      let redoStatus = false;
      if (tUndoStack?.length > 0) {
        undoStatus = true;
      }
      if (tRedoStack?.length > 0) {
        redoStatus = true;
      }
      console.log(tUndoStack);
      console.log(tRedoStack);
      return {
        undoStack: tUndoStack,
        redoStack: tRedoStack,
        canUndoItem: undoStatus,
        canRedoItem: redoStatus,
      };
    });
  },
  redo: (
    deleteItem,
    updateItem,
    addItem,
    setSelectedItem,
    deleteAtIndex,
    setSelectedPage,
    addAtIndex,
    shiftItemsPage,
    pages,
    setPages,
    deletePageItems
  ) => {
    const tempPages = pages;
    set((state) => {
      if (state.redoStack.length === 0) return;

      const tRedoStack = [...state.redoStack];
      const actionToRedo = tRedoStack.pop();
      const tUndoStack = [...state.undoStack, actionToRedo];
      console.log(actionToRedo);
      console.log(state.redoStack);
      if (actionToRedo.type === "item") {
        switch (actionToRedo.operation) {
          case "add":
            addItem(actionToRedo.currentState);
            break;
          case "delete":
            setSelectedItem(null);
            deleteItem(actionToRedo?.currentState);
            break;
          case "update":
            updateItem(actionToRedo.currentState);
            break;

          default:
            console.log("No item in stack");
        }
      }
      if (actionToRedo?.type === "page") {
        console.log(actionToRedo);
        console.log(actionToRedo.currentState);
        const pages = actionToRedo.pages;
        const items = actionToRedo.allItems;

        console.log(items);
        switch (actionToRedo.operation) {
          case "add":
            addAtIndex(actionToRedo.currentState);
            shiftItemsPage(actionToRedo.currentState-1,1)
            break;
          case "duplicate":
            addAtIndex(actionToRedo.currentState);
            shiftItemsPage(actionToRedo.currentState-2,1)
            break;
           case "visible":
            console.log(tempPages);
            const page = tempPages[actionToRedo?.currentState];
            const newPages = tempPages;
            newPages.splice(actionToRedo?.currentState, 1, { ...page, visibility: actionToRedo.visibility });
            break;
          case "update":
            console.log(actionToRedo.prevState);
            console.log(actionToRedo.currentState);
            updatePage(actionToRedo?.currentState, actionToRedo.prevState);
            break;
          case "delete":
            setSelectedPage(
              actionToRedo.currentState - 1 > -1
                ? actionToRedo.currentState - 1
                : 0
            );
            deleteAtIndex(actionToRedo.currentState);
            deletePageItems(actionToRedo.currentState)
            shiftItemsPage(actionToRedo.currentState, -1);
            break;
          default:
            console.log("No item in stack");
        }
      }
      let undoStatus = false;
      let redoStatus = false;
      if (tUndoStack?.length > 0) {
        undoStatus = true;
      }
      if (tRedoStack?.length > 0) {
        redoStatus = true;
      }
      console.log(tRedoStack);
      return {
        undoStack: tUndoStack,
        redoStack: tRedoStack,
        canUndoItem: undoStatus,
        canRedoItem: redoStatus,
      };
    });
  },
  resetHistory: () => {
    set(() => {
      return {
        undoStack: [],
        redoStack: [],
        canRedoItem: false,
        canUndoItem: false,
      };
    });
  },
}));
