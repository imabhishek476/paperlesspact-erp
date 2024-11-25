import { isEditorStateEmpty } from "@/lib/helpers/templateHelpers";
import { CLEAR_EDITOR_COMMAND } from "lexical";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const BASE_LAYOUT = {
    pageNo: 1,
    ref: null,
    isPageEmpty: true,
    isDbInit: false,
    bgColor: "#FFF",
    id: crypto.randomUUID()
};
const initialState = {
    pages: [{ ...BASE_LAYOUT }],
    serverData: null,
    refs: [],
    pageHeader: null,
    pageFooter: null,
    headerActive: false,
    footerActive: false,
    headerState: null,
    activeHeaderFooterPageHeight: '1080px',
    headerPadding: '50px',
    isEditable: true,
}

export const usePageDataStore = create(devtools((set) => ({
    pages: [{ ...BASE_LAYOUT }],
    serverData: null,
    refs: [],
    pageHeader: null,
    pageFooter: null,
    headerActive: false,
    footerActive: false,
    headerState: null,
    activeHeaderFooterPageHeight: '1080px',
    headerPadding: '50px',
    footerPadding: '50px',
    showPageNo: false,
    isEditable: true,
    setHeaderPadding: (padding) => {
        set(() => { return { headerPadding: padding } });
    },
    setFooterPadding: (padding) => {
        set(() => { return { footerPadding: padding } });
    },
    setShowPageNo: (showPageNo) => {
        set(() => { return { showPageNo: showPageNo } })
    },
    setHeaderState: (item) => set(() => {
        return ({ headerState: item })
    }),
    setHeaderActive: (item) => set(() => {
        return ({ headerActive: item })
    }),
    setFooterActive: (item) => set(() => {
        return ({ footerActive: item })
    }),
    setPageHeader: (item) => set(() => {
        return ({ pageHeader: item })
    }),
    setPageFooter: (item) => set(() => {
        return ({ pageFooter: item })
    }),
    setPages: (pages) => set(() => {
        return ({ pages: pages })
    }),
    addNewPage: (editor, index) => {
        set((state) => {
            console.log(editor)
            const newPages = [...state.pages];
            newPages.push({
                ...BASE_LAYOUT,
                id: crypto.randomUUID(),
                ref: { current: editor },
                pageNo: index + 2,
                isPageEmpty: true,
                isDbInit: true
            })
            return { pages: newPages };
        });
    },
    addPageAt: (editor, tempBg) => {
        set((state) => {
            console.log(editor)
            const newPages = [...state.pages];
            newPages.push({
                ...BASE_LAYOUT,
                id: crypto.randomUUID(),
                ref: { current: editor },
                pageNo: state.pages.length + 1,
                isPageEmpty: true,
                isDbInit: true,
                bgColor: tempBg,
            })
            console.log(newPages)
            return { pages: newPages }
        });
    },
    updatePage: (pageIndex, options) => {
        console.log(options)
        set((state) => {
            const newPages = [...state.pages]
            const update = newPages.map((page, index) => {
                console.log(index === pageIndex)
                if (index === pageIndex) {
                    return { ...page, ...options };
                }
                return page;
            });
            return { pages: update };
        });
    },
    deletePage: (index) => {
        set((state) => {
            console.log(state?.pages)
            const newPages = [...state.pages];
            newPages.splice(index, 1);
            for (let i = index; i < newPages.length; i++) {
                newPages[i].pageNo = i + 1;
            }
            console.log(newPages)
            return { pages: newPages };
        });
    },
    duplicatePage: (editor, index, bgColor) => {
        set((state) => {
            const newPages = [...state.pages];
            newPages.push({
                ...BASE_LAYOUT,
                id: crypto.randomUUID(),
                ref: { current: editor },
                pageNo: index + 2,
                isPageEmpty: false,
                isDbInit: true,
                bgColor: bgColor
            })
            // newItems.sort((a, b) => a.pageIndex - b.pageIndex);
            return { pages: newPages };
        });
    },
    duplicatePageAt: (editor, tempBg) => {
        set((state) => {
            const newPages = [...state.pages];
            newPages.push({
                ...BASE_LAYOUT,
                id: crypto.randomUUID(),
                ref: { current: editor },
                pageNo: state.pages.length + 1,
                isPageEmpty: false,
                isDbInit: true,
                bgColor: tempBg,
            })
            console.log(newPages)
            return { pages: newPages }
        });
    },
    pageUp: (index) => {
        set((state) => {
            let newPagesData = [...state.pages];
            if (index !== -1 && index - 1 !== -1) {
                let currentBg = newPagesData[index].bgColor;
                let prevBg = newPagesData[index - 1].bgColor;
                console.log(currentBg, prevBg)
                newPagesData[index].bgColor = prevBg ? prevBg : "#fff";
                newPagesData[index - 1].bgColor = currentBg;
            }
            return { pages: newPagesData };
        });
    },
    pageDown: (index, nextIndex) => {
        set((state) => {
            let newPagesData = [...state.pages];
            if (index !== -1 && nextIndex !== -1) {
                let currentBg = newPagesData[index].bgColor;
                let nextBg = newPagesData[nextIndex].bgColor;
                console.log(currentBg, nextBg)
                newPagesData[index].bgColor = nextBg ? nextBg : "#fff";
                newPagesData[nextIndex].bgColor = currentBg;
            }
            return { pages: newPagesData };
        });
    },
    setServerData: (data) => {
        set((state) => {
            return {
                ...state,
                serverData: data
            }
        })
    },
    setRefs: (pageIndex, ref) => {
        return set((state) => {
            const index = state.refs.findIndex((ele) => ele?.pageId === state.pages[pageIndex].id);
            if (index === -1) {
                state.refs.push({
                    pageId: state.pages[pageIndex].id,
                    ref: ref
                })
            } else {
                state.refs[index].ref = ref;
            }
            // debugger;
            return { ref: state.refs }

        })
    },
    setActiveHeaderFooterPageHeight: (height) => {
        set(() => {
            return { activeHeaderFooterPageHeight: height }
        })
    },
    setIsEditable: (isEditable) => {
        set(() => {
            return { isEditable: isEditable }
        });
    },
    deletePageUndo: (editor, index,bgColor) => {
        set((state) => {
            const pages = state.pages;
            pages.push({
                ...pages[pages.length - 1],
                pageNo: pages.length + 1,
                ref: { current: editor },
                isDbInit: true,
                bgColor:bgColor
            });
            // debugger;
            if (index !== pages.length - 1 && length > 0) {
                let tempEditorState;
                let tempBgColor;
                for (let i = pages.length - 1; i > 0; i--) {
                    if (i !== index) {
                        const prevEditorState = pages[i - 1]?.ref?.current?.getEditorState();
                        const prevBgColor = pages[i - 1]?.bgColor;
                        if (pages[i]?.ref?.current?._pendingEditorState) {
                            tempEditorState = pages[i].ref.current._pendingEditorState;
                        }
                        else {
                            tempEditorState = pages[i]?.ref?.current.getEditorState();
                        }
                        tempBgColor = pages[i]?.bgColor;
                        if (isEditorStateEmpty(prevEditorState)) {
                            pages[i]?.ref?.current.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                        } else {
                            pages[i]?.ref?.current.setEditorState(prevEditorState.clone(null),{
                                tag:'pageOperation'
                            });
                        }
                        pages[i]['bgColor'] = prevBgColor;
                        if (isEditorStateEmpty(tempEditorState)) {
                            pages[i - 1]?.ref?.current.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                        } else {
                            pages[i - 1]?.ref?.current.setEditorState(tempEditorState.clone(null),{
                                tag:'pageOperation'
                            });
                        }
                        pages[i-1]['bgColor'] = tempBgColor;
                        if(i !== pages.length-1){
                            pages[i]['pageNo'] = Number(pages[i]?.pageNo)+1;
                        }
                    } else {
                        break;
                    }
                }
            }
            return { pages: pages }
        })
    },
    deletePageRedo:(index)=>{
        set((state)=>{
            const pages = [...state.pages];
            // debugger;
            if(index !== pages.length-1){
                for(let i=index;i<pages.length-2;i++){
                    const next = pages[i+1]?.ref?.current?.getEditorState();
                    const nextBgColor = pages[i+1]?.bgColor;
                    if(isEditorStateEmpty(next)){
                        pages[i]?.ref?.current?.dispatchCommand(CLEAR_EDITOR_COMMAND,undefined);
                    }else{
                        pages[i]?.ref?.current?.setEditorState(next.clone(null),{
                            tag:'pageOperation'
                        });
                    }
                    pages[i]['bgColor'] = nextBgColor;
                    pages[i]["pageNo"] = pages[i]?.pageNo - 1;
                }
            }
            pages.splice(index,1);
            return {pages:pages};
        })
    },
    reset: () => {
        set(initialState)
    }
})));
