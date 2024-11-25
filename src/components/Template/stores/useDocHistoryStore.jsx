
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { isEqual } from 'lodash-es'
import PlaygroundNodes from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/PlaygroundNodes";
import EditorTheme from "@/components/LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
import { CLEAR_EDITOR_COMMAND, REDO_COMMAND, UNDO_COMMAND, createEditor } from "lexical"
import { pageAddHelper, pageDeleteHelper, pageDownHelper, pageDuplicateHelper, pageUpHelper } from "../../../lib/helpers/pageHelpers"
export const useDocHistory = create(
    (set) => ({
        undoStack: [],
        redoStack: [],
        canRedoItem: false,
        canUndoItem: false,
        addHistory: (item, type, operation, prevState = null, pages = null, allItems = null, bgColor) => {
            console.log(item)
            console.log(prevState)
            set((state) => {
                let newHistory;
                const tRedoStack = [...state.redoStack];
                if (operation === 'update') {
                    if (!isEqual(item, prevState)) {
                        newHistory = { current: item, prevState: prevState, type, operation, pages: pages, allItems: allItems };
                    }
                } else {
                    newHistory = { current: item, type, operation, prevState: prevState, pages: pages, allItems: allItems, bgColor: bgColor };
                }
                let tUndoStack = [...state.undoStack]
                if (newHistory) {
                    tUndoStack = [...tUndoStack, newHistory];
                }
                let undoStatus = false
                let redoStatus = false
                if (tUndoStack?.length > 0) {
                    undoStatus = true
                }
                if (tRedoStack?.length > 0) {
                    redoStatus = true
                }
                console.log(newHistory)
                console.log(tUndoStack, tRedoStack, newHistory);
                return { undoStack: tUndoStack, redoStack: tRedoStack, canUndoItem: undoStatus, canRedoItem: redoStatus };
            });
        },
        undo: (deleteItem, updateItem, addItem, addPageAt, addNewPage, deletePage, updatePage, pageDown, pageUp, itemPageUP, itemPageDown, itemPageAdd, setItems, setPages, activeEditor, deletePageUndo, allPages) => {
            set((state) => {
                if (state.undoStack.length === 0) return;
                const tUndoStack = [...state.undoStack];
                const actionToUndo = tUndoStack.pop();
                const tRedoStack = [...state.redoStack, actionToUndo];
                console.log(actionToUndo)
                if (actionToUndo?.type === "item") {
                    switch (actionToUndo.operation) {
                        case "add":
                            console.log(actionToUndo?.current)
                            deleteItem(actionToUndo.current)
                            break;
                        case "update":
                            console.log(actionToUndo.prevState)
                            console.log(actionToUndo.current)
                            updateItem(actionToUndo.prevState)
                            break;
                        case "delete":
                            addItem(actionToUndo.current)
                            break;
                        default:
                            console.log("No item in stack")
                    }
                }
                if (actionToUndo?.type === "page") {
                    // debugger
                    // const edState = actionToUndo?.prevState?.ref?.current?.getEditorState()
                    const items = actionToUndo.allItems
                    const pages = actionToUndo.pages
                    console.log(actionToUndo?.current)
                    console.log(items)
                    // console.log(actionToUndo?.prevState)
                    switch (actionToUndo.operation) {
                        case "add":
                            console.log(actionToUndo?.current)
                            deletePage(actionToUndo.current)
                            break;
                        case "update":
                            console.log(actionToUndo.prevState)
                            console.log(actionToUndo.current)
                            updatePage(actionToUndo?.current, actionToUndo.prevState)
                            break;
                        case "pageUp":
                            const pageIndex = actionToUndo?.current

                            pageDownHelper(pageIndex, pages, pageDown, itemPageDown, null, true)
                            break;
                        case "pageDown":
                            const pgIndex = actionToUndo?.current + 1
                            pageUpHelper(pgIndex, pages, pageUp, itemPageUP, null, true)
                            break;
                        case "delete":
                            console.log(actionToUndo.prevState)
                            setItems(items)
                            deletePageUndo(actionToUndo.prevState, actionToUndo.current, actionToUndo?.bgColor)
                            // addNewPage(newEditor, actionToUndo.current)
                            break;
                        default:
                            console.log("No item in stack")
                    }
                }
                if (actionToUndo?.type === "lexical") {
                    console.log(actionToUndo?.current)
                    // activeEditor.dispatchCommand(REDO_COMMAND, undefined);
                    if (actionToUndo?.current?.editor?._config?.namespace === "FreeTextfield" || actionToUndo?.current?.editor?._config?.namespace === "TableField") {

                        actionToUndo?.current?.editor.dispatchCommand(UNDO_COMMAND, undefined)
                    }
                    else {

                        allPages[actionToUndo?.operation]?.ref?.current?.dispatchCommand(UNDO_COMMAND, undefined);
                    }
                    //    activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
                }
                let undoStatus = false
                let redoStatus = false
                if (tUndoStack?.length > 0) {
                    undoStatus = true
                }
                if (tRedoStack?.length > 0) {
                    redoStatus = true
                }
                console.log(tUndoStack)
                console.log(tRedoStack, tUndoStack)
                return { undoStack: tUndoStack, redoStack: tRedoStack, canUndoItem: undoStatus, canRedoItem: redoStatus, };
            });
        },
        redo: (deleteItem, updateItem, addItem, addPageAt, addNewPage, deletePage, updatePage, pageDown, pageUp, itemPageUP, itemPageDown, itemPageAdd, setItems, setPages, activeEditor, deletePageUndo, deletePageRedo, itemPageDelete,allPages) => {
            set((state) => {
                // debugger
                if (state.redoStack.length === 0) return;
                const tRedoStack = [...state.redoStack];
                const actionToRedo = tRedoStack.pop();
                const tUndoStack = [...state.undoStack, actionToRedo];
                console.log(actionToRedo)
                if (actionToRedo.type === "item") {
                    switch (actionToRedo.operation) {
                        case 'add':
                            addItem(actionToRedo.current)
                            break;
                        case 'delete':
                            deleteItem(actionToRedo?.current)
                            break;
                        case 'update':
                            updateItem(actionToRedo.current)
                            break;
                        default:
                            console.log("No item in stack")
                    }
                }
                if (actionToRedo?.type === "page") {
                    console.log(actionToRedo)
                    console.log(actionToRedo.current)
                    const pages = actionToRedo.pages
                    const items = actionToRedo.allItems

                    console.log(items)
                    switch (actionToRedo.operation) {
                        case "add":
                            deletePageUndo(actionToRedo.prevState, actionToRedo.current)

                            // addNewPage(actionToRedo.current)
                            break;
                        case "pageUp":
                            const pgIndex = actionToRedo?.current;
                            pageUpHelper(pgIndex === 0 ? pgIndex + 1 : pgIndex, pages, pageUp, itemPageUP, null, true)
                            break;
                        case "pageDown":
                            const pageIndex = actionToRedo?.current
                            pageDownHelper(pageIndex, pages, pageDown, itemPageDown, null, true)
                            break;
                        case "update":
                            console.log(actionToRedo.prevState)
                            console.log(actionToRedo.current)
                            updatePage(actionToRedo?.current, actionToRedo.prevState)
                            break;
                        case "delete":
                            // await itemPageDelete(actionToRedo.current);
                            itemPageDelete(actionToRedo.current).then(() => {
                                deletePageRedo(actionToRedo.current)
                            });
                            break;
                        default:
                            console.log("No item in stack")
                    }
                }
                if (actionToRedo?.type === "lexical") {
                    if (actionToRedo?.current?.editor?._config?.namespace === "FreeTextfield" || actionToRedo?.current?.editor?._config?.namespace === "TableField") {

                        actionToRedo?.current?.editor.dispatchCommand(REDO_COMMAND, undefined)
                    }
                    else {

                        allPages[actionToRedo?.operation]?.ref?.current?.dispatchCommand(REDO_COMMAND, undefined);
                    }
                    // activeEditor.dispatchCommand(REDO_COMMAND, undefined);
                    // activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
                }
                let undoStatus = false
                let redoStatus = false
                if (tUndoStack?.length > 0) {
                    undoStatus = true
                }
                if (tRedoStack?.length > 0) {
                    redoStatus = true
                }
                return { undoStack: tUndoStack, redoStack: tRedoStack, canUndoItem: undoStatus, canRedoItem: redoStatus };
            });
        },
        resetHistory: () => {
            set(() => {
                return {
                    undoStack: [],
                    redoStack: [],
                    canRedoItem: false,
                    canUndoItem: false,
                }
            })
        }
    })
)

