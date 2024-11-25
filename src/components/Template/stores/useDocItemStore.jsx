import PlaygroundNodes from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/PlaygroundNodes";
import { createEditor } from "lexical";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import EditorTheme from "@/components/LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
const initialState = {
  items: [],
  selectedItem: null,
  draggedItem: null,
  selectedParticipant: null,
  selectedFieldItem: null,
  quoteEditorRef: null,
  quoteTargetNode: null,
  backgroundItemUpdate:false
};

export const useDocItemStore = create(
  devtools((set) => ({
    items: [],
    selectedItem: null,
    draggedItem: null,
    selectedParticipant: null,
    selectedFieldItem: null,
    quoteEditorRef: null,
    quoteTargetNode: null,
    isTableResizing: false,
    isTableDragging: false,
    tableActive: false,
    backgroundItemUpdate:false,
    setBackgroundItemUpdate:(update)=>{
      set(()=>{
          return {backgroundItemUpdate:update}
      })
  },
    setIsTableResizing: (isTableResizing) =>
      set(() => ({ isTableResizing: isTableResizing })),
    setIsTableDragging: (isTableDragging) =>
      set(() => ({ isTableDragging: isTableDragging })),
    setTableActive: (tableActive) => set(() => ({ tableActive: tableActive })),
    setSelectedItem: (item) => set(() => ({ selectedItem: item })),
    setSelectedParticipant: (item) =>
      set(() => ({ selectedParticipant: item })),
    setSelectedFieldItem: (item) => set(() => ({ selectedFieldItem: item })),
    setQuoteEditorRef: (item) => set(() => ({ quoteEditorRef: item })),
    setQuoteTargetNode: (item) => set(() => ({ quoteTargetNode: item })),
    addItem: (item) => {
      return set((state) => ({ items: [...state.items, item] }));
    },
    setItems: (items) => {
      set(() => {
        return { items: items };
      });
    },
    updateItem: (item) => {
      return set((state) => {
        console.log(item);
        const prevItems = state.items;
        const index = prevItems.findIndex((el) => el.id === item.id);
        if (index !== -1) {
          const removed = prevItems.splice(index, 1, { ...item });
        } else {
          prevItems.push({ ...item });
        }
        console.log(prevItems)
        return { items: prevItems };
      });
    },
    deleteItem: (item) => {
      return set((state) => {
        const newItems = state.items;
        const index = newItems.findIndex((el) => el.id === item.id);
        if (index !== -1) {
          const removed = newItems.splice(index, 1);
        }
        return { items: newItems, selectedFieldItem: null };
      });
    },
    duplicateItem: (item,id) => {
      return set((state) => {
        const newItems = state.items;
        const prevItem = newItems.find((el) => el.id === item.id);
        let newEditor = null;
        if (prevItem.type === "textArea" || prevItem.type === "table") {
          const initialConfig = {
            namespace: item?.type,
            nodes: [...PlaygroundNodes],
            editorState: null,
            onError: (error) => {
              throw error;
            },
            theme: EditorTheme,
            editable: false,
          };
          newEditor = createEditor({
            ...initialConfig,
            editorState: item.ref.getEditorState(),
          });
        }
        newItems.push({ ...prevItem, ref: newEditor, id:id });
        return { items: newItems };
      });
    },
    itemPageUP: (index) => {
      const promise = new Promise((resolve,reject)=>{
        let newItems = [];
        set((state) => {
           newItems = state.items.map((item) => {
            if (item.pageIndex === index) {
              return { ...item, pageIndex: item.pageIndex - 1 };
            } else if (item.pageIndex === index - 1) {
              return { ...item, pageIndex: item.pageIndex + 1 };
            }
            return item;
          });
          // newItems.forEach(item => {
          //     if (item.pageIndex === index) {
          //         item.pageIndex -= 1;
          //     } else if (item.pageIndex === index - 1) {
          //         item.pageIndex += 1;
          //     }
          // });
          console.log(newItems);
          return { items: newItems };
        });
        resolve(newItems);
      })
      return promise;
    },
    itemPageDown: (index) => {

      const promise = new Promise((resolve,reject)=>{
        let newItems = [];
        set((state) => {
          newItems = state.items.map((item) => {
            if (item.pageIndex === index) {
              return { ...item, pageIndex: item.pageIndex + 1 };
            } else if (item.pageIndex === index + 1) {
              return { ...item, pageIndex: item.pageIndex - 1 };
            }
            return item;
          });
          // newItems = newItems.sort((a, b) => a.pageIndex - b.pageIndex);
  
          return { items: newItems };
        });
        resolve(newItems);
      })
      return promise;
      
    },
    itemPageDuplicate: (index) => {

      const promise = new Promise((resolve,reject)=>{
        let temp = [];
        set((state) => {
         state.items.forEach((item) => {
          if(!item?.from){
            if (item.pageIndex < index) {
              temp.push(item);
            }
            if (item.pageIndex === index) {
              temp.push(item);
              console.log(item);
              const newId = crypto.randomUUID();
              let newEditor = null;
              if (item.type === "textArea" || item.type === "table") {
                const initialConfig = {
                  namespace: item?.type,
                  nodes: [...PlaygroundNodes],
                  editorState: item.ref.getEditorState(),
                  onError: (error) => {
                    throw error;
                  },
                  theme: EditorTheme,
                  editable: false,
                };
    
                newEditor = createEditor({
                  ...initialConfig,
                });
                console.log(newEditor);
              }
              temp.push({
                ...item,
                id: newId,
                ref: newEditor,
                pageIndex: item?.pageIndex + 1,
              });
            }
            if (item.pageIndex > index) {
              temp.push({
                ...item,
                pageIndex: item.pageIndex + 1,
              });
            }
          }else{
            temp.push(item);
          }
         });
         console.log(temp);
         return { items: temp };
       });
       return resolve(temp);
      })
      
      return promise;
    },
    itemPageDelete: (index) => {
      // debugger
      const promise = new Promise((resolve, reject) => {
        const newItems = [];
        set((state) => {
          for (const item of state.items) {
            if (item.pageIndex !== index) {
              newItems.push({
                ...item,
                pageIndex:
                  item.pageIndex > index ? item.pageIndex - 1 : item.pageIndex,
              });
            }
          }
          // debugger;
          console.log(newItems);
          return { items: newItems };
        });
        resolve(newItems);
      });
      return promise;
    },
    itemPageAdd:(pageIndex)=>{
    
      const promise = new Promise((resolve,reject)=>{
        let newItems =[];
        set((state)=>{
           newItems = state.items.map((ele) => {
            console.log(ele.pageIndex > pageIndex);
            if (ele.pageIndex > pageIndex) {
              return { ...ele, pageIndex: ele.pageIndex + 1 };
            }
            return ele;
          });
          const backgroundItemWithPageIndex = {
            id: `backgroundItem${pageIndex}`,
            type: "background",
            pageIndex: pageIndex,
          };
          const newBackgroundItemWithPageIndex ={
            id: `backgroundItem${pageIndex+1}`,
            type: "background",
            pageIndex: pageIndex+1,
          }
          if(!(newItems.some((item)=>item.type==='background' && item.pageIndex===pageIndex)))
          newItems.splice(pageIndex, 0, backgroundItemWithPageIndex);
        newItems.splice(pageIndex+1,0,newBackgroundItemWithPageIndex)
          return {items:newItems}
        })
        resolve(newItems);
      })
      return promise;
    },

    resetItem: () => {
      set(initialState);
    },
    handleDropItem: (
      e,
      header,
      pageIndex,
      editorRef,
      fromImage,
      position,
      sharedItems,
      updateSharedItem,
      handleDragEnd,
      showModal,
      quoteBuilderModal,
      setQuoteEditorRef,
      setQuoteTargetNode,
      setSelectedFieldItem,
      addHistory
    ) =>
      set((state) => {
        if (fromImage) {
          // debugger
          // console.log(e)
          const event = e.target;
          const { x, y, height, width } = e.target.getBoundingClientRect();
          const posX = Math.floor(((e.clientX - x) / width) * 100) + "%";
          const posY = Math.floor(((e.clientY - y) / height) * 100) + "%";
          if (state.selectedFieldItem.id) {
            const newItems = [...state.items];
            const index = newItems?.findIndex(
              (el) => el.id === state.selectedFieldItem.id
            );
            if (index !== -1) {
              const removed = newItems?.splice(index, 1);
            }
            let newItem = {
              ...state.selectedFieldItem,
              left: posX,
              top: posY,
              position: {
                x: posX,
                y: posY,
              },
              isSigned: "0",
            };
            if (!header) {
              newItem = { ...newItem, pageIndex: pageIndex }
            }
            if (state.selectedParticipant) {
              newItem = {
                ...newItem,
                signee: selectedParticipant,
              };
            }
            newItems.push(newItem);
            console.log(newItem);
            // setSelectedFieldItem(null);
            return { items: newItems, selectedFieldItem: null };
          }
          // setSelectedFieldItem(null);
        } else {
          // debugger
          let prevState=null
          const newItems = [...state.items];
          console.log(pageIndex);
          if (state.selectedFieldItem?.type) {
            let currentDiv = `editor${pageIndex}`
            if (header ) {
              if(header==="EditorHeader"){
                currentDiv = `EditorHeader${pageIndex}`
              }
             else if(header==="EditorFooter"){
              currentDiv = `EditorFooter${pageIndex}`
             }
            }
            console.log(currentDiv)
            const editorShell = document.getElementById(`${currentDiv}`);
            console.log(editorShell);
            const { x, y, height, width } = editorShell.getBoundingClientRect();
            console.log(height);
            console.log(x);
            console.log(((position?.clientX - x) / width) * 100 + "%");
            console.log(((position?.clientY - y) / height) * 100 + "%");
            const posX = !position
              ? ((e.clientX - x - state.selectedFieldItem?.size?.width / 2) /
                width) *
              100 +
              "%"
              : ((position.clientX - x) / width) * 100 + "%";
            const posY = !position
              ? ((e.clientY - y - state.selectedFieldItem?.size?.height / 2) /
                height) *
              100 +
              "%"
              : ((position.clientY - y) / height) * 100 + "%";

            if (state.selectedFieldItem?.id) {
              console.log(state.selectedFieldItem);
             
              if (!sharedItems) {
                const index = newItems?.findIndex(
                  (el) => el.id === state.selectedFieldItem.id
                );
                if (index !== -1) {
                  prevState=newItems[index]
                  const removed = newItems?.splice(index, 1);
                }
                let newItem = {
                  ...state.selectedFieldItem,
                  position: {
                    x: posX,
                    y: posY,
                  },
                  left: posX,
                  top: posY,
                  isSigned: "0",
                };
                
                if (header) {
                  if(header==="EditorHeader"){
                    newItem = { ...newItem ,from:"EditorHeader",headerIndex:pageIndex}
                  
                  }
                 else if(header==="EditorFooter"){
                  newItem = { ...newItem,from:"EditorFooter",footerIndex:pageIndex}
                 }
               
                }
                else{
                  newItem = { ...newItem, pageIndex: pageIndex }
                }
                if (state.selectedParticipant) {
                  newItem = {
                    ...newItem,
                    signee: state.selectedParticipant,
                  };
                }
                if(index===-1)
                  newItems.push(newItem);
                else{
                  newItems.splice(index, 0, newItem);
                }
                console.log(newItems);
                // setSelectedFieldItem(null);
                console.log(prevState);
                if(position){
                  addHistory(newItem,"item","update",prevState)
                }
                else{
                  addHistory(newItem,"item","add")
                }
             
                return { items: newItems, selectedFieldItem: null };
              } else {
                let newItem = {
                  ...state.selectedFieldItem,
                  position: {
                    x: posX,
                    y: posY,
                  },
               
                  left: posX,
                  top: posY,
                  isSigned: "0",
                };
                if (header) {
                  if(header==="EditorHeader"){
                    newItem = { ...newItem,from:"EditorHeader",headerIndex:pageIndex}
                  
                  }
                 else if(header==="EditorFooter"){
                  newItem = { ...newItem,from:"EditorFooter",footerIndex:pageIndex}
                 }
               
                }
                else{
                  newItem = { ...newItem, pageIndex: pageIndex }
                }
                if (state.selectedParticipant) {
                  newItem = {
                    ...newItem,
                    signee: state.selectedParticipant,
                  };
                }
                const yarray = sharedItems.getArray("fillableFields");
                let index = -1;
                yarray.map((ele, idx) => {
                  if (ele?.id === state.selectedFieldItem?.id) {
                    index = idx;
                  }
                });
                if (index !== -1) {
                  updateSharedItem(sharedItems, newItem);
                } else {
                  sharedItems.getArray("fillableFields").push([newItem]);
                }
                addHistory(newItem,"item","add")
                return { items: newItems, selectedFieldItem: null };
              }
              // return { items: newItems };
            }
          } else {
            if (state.selectedFieldItem) {
              // console.log(state)
              console.log(state.selectedFieldItem);
              handleDragEnd(
                e,
                editorRef,
                showModal,
                quoteBuilderModal,
                setQuoteEditorRef,
                setQuoteTargetNode,
                setSelectedFieldItem,
                state.selectedFieldItem
              );
              return { items: state.items, selectedFieldItem: null };
            }
          }
        }
        return { items: state.items, selectedFieldItem: null };
      }),
  }))
);
