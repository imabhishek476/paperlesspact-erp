import PlaygroundNodes from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/PlaygroundNodes";
import EditorTheme from "@/components/LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
import {
    CLEAR_EDITOR_COMMAND,
    createEditor,
} from "lexical";
import { isEditorStateEmpty } from "./templateHelpers";
const initialConfig = {
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    editorState: null,
    onError: (error) => {
        throw error;
    },
    theme: EditorTheme,
    editable: false,
};

export const pageUpHelper = async (pageIndex, pages, pageUp, itemPageUP, addHistory, history = null) => {
    console.log(pageIndex)
    const nextIndex = pageIndex - 1;
    const nextState =
        pages[nextIndex]?.ref?.current?.getEditorState();
    const currentState =
        pages[pageIndex]?.ref?.current?.getEditorState();
    // console.log(
    //     !nextState.isEmpty() && !currentState.isEmpty()
    // );
    if (isEditorStateEmpty(nextState)) {
        pages[pageIndex]?.ref?.current?.dispatchCommand(CLEAR_EDITOR_COMMAND);
    } else {
        pages[pageIndex]?.ref?.current?.setEditorState(
            nextState.clone(null),{
                tag:'pageOperation'
            }
        );
    }
    if (isEditorStateEmpty(currentState)) {
        pages[nextIndex]?.ref?.current?.dispatchCommand(CLEAR_EDITOR_COMMAND);
    } else {
        pages[nextIndex]?.ref?.current?.setEditorState(
            currentState.clone(null),{
                tag:'pageOperation'
            }
        );
    }
    const res = await itemPageUP(pageIndex);
    if (res) {
        pageUp(pageIndex);
        if (!history) {
            addHistory(pageIndex - 1, "page", "pageUp", null, pages)
        }

    }
}
export const pageDownHelper = async (pageIndex, pages, pageDown, itemPageDown, addHistory, history = null) => {
    console.log(pageIndex)
    const nextIndex = pageIndex + 1;
    const nextState =
        pages[nextIndex]?.ref?.current?.getEditorState();
    const currentState =
        pages[pageIndex]?.ref?.current?.getEditorState();
    if (isEditorStateEmpty(nextState)) {
        pages[pageIndex]?.ref?.current?.dispatchCommand(CLEAR_EDITOR_COMMAND);
    } else {
        pages[pageIndex]?.ref?.current?.setEditorState(
            nextState.clone(null),{
                tag:'pageOperation'
            }
        );
    }
    if (isEditorStateEmpty(currentState)) {
        pages[nextIndex]?.ref?.current?.dispatchCommand(CLEAR_EDITOR_COMMAND);
    } else {
        pages[nextIndex]?.ref?.current?.setEditorState(
            currentState.clone(null),{
                tag:'pageOperation'
            }
        );
    }
    console.log(history)
    const res = await itemPageDown(pageIndex);
    if (res) {
        pageDown(pageIndex, nextIndex);
        if (!history) {
            addHistory(pageIndex, "page", "pageDown", nextIndex, pages)
        }

    }
}
export const pageDuplicateHelper = async (pageIndex, pages, duplicatePage, duplicatePageAt, itemPageDuplicate, initialConfig, addHistory) => {
    if (pageIndex !== pages.length - 1) {
        console.log(pages[pageIndex])
        const prevState = pages[pageIndex].ref.current.getEditorState()
        const newEditorD = createEditor({
            ...initialConfig,
            editorState: prevState,
        });
        addHistory(pageIndex, "page", "add", newEditorD)
        let tempState =
            pages[pageIndex + 1]?.ref?.current?.getEditorState();
        let tempColor = pages[pageIndex + 1]?.bgColor;
        for (let i = pageIndex + 2; i < pages.length; i++) {
            const tState =
                pages[i]?.ref?.current?.getEditorState();
            const tColor = pages[i]?.bgColor;

            if (!isEditorStateEmpty(tempState)) {
                pages[i]?.ref?.current?.setEditorState(tempState.clone(null),{
                    tag:'pageOperation'
                });
            } else {
                pages[i]?.ref?.current?.dispatchCommand(
                    CLEAR_EDITOR_COMMAND,
                    undefined
                );
            }
            pages[i]["bgColor"] = tempColor;
            tempState = tState;
            tempColor = tColor;
        }

        // dup data page index
        const dupState =
            pages[pageIndex]?.ref?.current?.getEditorState();
        if (!isEditorStateEmpty(dupState)) {
            pages[pageIndex + 1]?.ref?.current?.setEditorState(
                dupState.clone(null),{
                    tag:'pageOperation'
                }
            );
        } else {
            pages[pageIndex + 1]?.ref?.current?.dispatchCommand(
                CLEAR_EDITOR_COMMAND,
                undefined
            );
        }

        pages[pageIndex + 1]["bgColor"] =
            pages[pageIndex].bgColor;

        // ref for new last page
        const newEditor = createEditor({
            ...initialConfig,
            editorState: tempState,
        });
        const res = await itemPageDuplicate(pageIndex);
        if (res) {
            duplicatePageAt(newEditor, tempColor);
        }
    } else {
        const newEditor = createEditor({
            ...initialConfig,
            editorState: isEditorStateEmpty(pages[pageIndex]?.ref?.current?.getEditorState())
                ? null
                : pages[pageIndex]?.ref?.current?.getEditorState(),
        });
        const prevState = pages[pageIndex].ref.current.getEditorState()
        const newEditorD = createEditor({
            ...initialConfig,
            editorState: prevState,
        });
        const bgColor = pages[pageIndex]?.bgColor;
        const res = await itemPageDuplicate(pageIndex);
        console.log(pages[pageIndex + 1])
        if (res) {
            duplicatePage(newEditor, pageIndex, bgColor);
            addHistory(pageIndex + 1, "page", "add", newEditorD)
        }
        // setUpdate((prev) => !prev);
    }
}
export const pageDeleteHelper = async (pageIndex, pages, items, itemPageDelete, deletePage, addHistory,fromHistory=false) => {
    const res = await itemPageDelete(pageIndex)
    if(!fromHistory){
        console.log(items)
        if (res) {
            deletePage(pageIndex);
        }
    
        const prevState = pages[pageIndex].ref.current.getEditorState()
        const newEditor = createEditor({
            ...initialConfig,
            editorState: prevState,
        });
        console.log(prevState)
        console.log(newEditor._pendingEditorState)
        addHistory(pageIndex, "page", "delete", newEditor, pages, items,pages[pageIndex]?.bgColor)
    }
}
export const pageAddHelper = async (pageIndex, pages, itemPageAdd, addPageAt, addNewPage, setItems, items, initialConfig, addHistory, history) => {
    // debugger
    console.log(pages)
    if (pageIndex !== pages.length - 1) {
        if (!history) {
            addHistory(pageIndex, "page", "add", pages[pageIndex], pages, items)
        }
        console.log(pageIndex);
        let tempState =
            pages[pageIndex + 1]?.ref?.current?.getEditorState();
        console.log(tempState);
        let tempColor = pages[pageIndex + 1]?.bgColor;
        for (let i = pageIndex + 2; i < pages.length; i++) {
            const tState =
                pages[i]?.ref?.current?.getEditorState();
            const tColor = pages[i]?.bgColor;
            console.log(tState);
            if (!isEditorStateEmpty(tempState)) {
                pages[i]?.ref?.current?.setEditorState(tempState.clone(null),{
                    tag:'pageOperation'
                });
            } else {
                console.log("hi");
                pages[i]?.ref?.current?.dispatchCommand(
                    CLEAR_EDITOR_COMMAND,
                    undefined
                );
            }
            pages[i]["bgColor"] = tempColor;

            tempState = tState;
            tempColor = tColor;
        }
        pages[pageIndex + 1]["bgColor"] = "#fff";
        const newEditor = createEditor({
            ...initialConfig,
            editorState: tempState,
        });
        pages[pageIndex + 1]?.ref?.current?.dispatchCommand(
            CLEAR_EDITOR_COMMAND,
            undefined
        );
        const res = await itemPageAdd(pageIndex);
        if (res) {
            addPageAt(newEditor, tempColor);
        }
    } else {

        const newEditor = createEditor(initialConfig);
        addNewPage(newEditor, pageIndex);
        const backgroundItemWithPageIndex = {
            id: `backgroundItem${pageIndex}`,
            type: "background",
            pageIndex: pageIndex,
        };
        const newBackgroundItemWithPageIndex = {
            id: `backgroundItem${pageIndex + 1}`,
            type: "background",
            pageIndex: pageIndex + 1,
        }
        if (!history) {
            addHistory(pageIndex + 1, "page", "add", pages[pageIndex + 1], pages, items)
        }

        const newItems = [...items]
        if (!(newItems.some((item) => item.type === 'background' && item.pageIndex === pageIndex)))
            // if(!history){

            // }
            newItems.splice(pageIndex, 0, backgroundItemWithPageIndex);
        newItems.splice(pageIndex + 1, 0, newBackgroundItemWithPageIndex)
        setItems(newItems)
    }
} 