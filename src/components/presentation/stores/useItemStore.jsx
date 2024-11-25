import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { temporal } from "zundo";
import isDeepEqual from 'fast-deep-equal';
import { isEqual } from "lodash-es";

export const useItemStore = create(
  devtools(
    temporal((set) => ({
      items: [],
      selectedItem: null,
      draggedItem: null,
      contextMenu: null,
            setContextMenu: (contextMenu) => {
        return set(() => ({ contextMenu: contextMenu }));
      },
      addItem: (item) => {
        return set((state) => ({ items: [...state.items, item] }));
      },
      setItems: (items) => {
        return set(() => ({ items: items }));
      },
      updateItem: (item) => {
        return set((state) => {
          const prevItems = state.items;
          const index = prevItems.findIndex((el) => el.id === item?.id);
          if (index !== -1) {
            const removed = prevItems.splice(index, 1, { ...item });
          } else {
            prevItems.push({ ...item });
          }
          return { items: prevItems };
        });

      },
      deleteItem: (item) => {
        return set((state) => {
          const newItems = state.items.filter((el) => el.id !== item.id);
          return { items: newItems };

        });
      },
      duplicateItem: (item) => {
        return set((state) => {
          const newItems = [
            ...state.items,
            { ...item, id: crypto.randomUUID() },
          ];
          return { items: newItems };
        });
      },
      setSelectedItem: (item) => set(() => ({ selectedItem: item })),
      setDraggedItem: (item) => set(() => ({ draggedItem: item })),
      handleDrop: (pageIndex, position, item,addHistory) =>
        set((state) => {
          const container = document.getElementById("currentPage");
          const { x, y } = container?.getBoundingClientRect();
          const posX = position.clientX - x;
          const posY = position.clientY - y;
          const prevItems = state.items;
          const index = prevItems.findIndex((el) => el.id === item.id);
          if (index !== -1) {
            const removed = prevItems.splice(index, 1, {
              ...item,
              position: { posX, posY },
              transformObject: { translate: [posX, posY],rotate:0 },
              pageIndex,
            });
          } else {
            let highestLayer = -Infinity;
            state.items.forEach((obj) => {
              if (obj.layer > highestLayer) {
                highestLayer = obj.layer;
              }
            });
            if (highestLayer < 10) {
              highestLayer = 10;
            }
            const id =crypto.randomUUID()
            let newItem = {
              ...item,
              id: id,
              position: { posX, posY },
              pageIndex,
              transformObject: { translate: [posX, posY],rotate:0 },
              layer: 2,
            }
            prevItems.push(newItem);
            addHistory(newItem,"item","add")
          }
          return { items: prevItems };
        }),
      deletePageItems: (pageIndex) =>
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.pageIndex !== pageIndex
          );
          return { items: newItems };
        }),
      shiftItemsPage: (pageIndex, shiftBy) =>
        set((state) => {
          const newItems = state.items.map((item) =>
            item.pageIndex <= pageIndex
              ? item
              : { ...item, pageIndex: item.pageIndex + shiftBy }
          );
          return { items: newItems };
        }),
      handlePageDropItem: (newIndex, oldIndex) =>
        set((state) => {
          const newItems = state.items.map((item) => {
            if (newIndex > oldIndex) {
              return item.pageIndex < newIndex && item.pageIndex > oldIndex
                ? { ...item, pageIndex: item.pageIndex + 1 }
                : item;
            } else {
              return item.pageIndex > newIndex && item.pageIndex < oldIndex
                ? { ...item, pageIndex: item.pageIndex - 1 }
                : item;
            }
          });
          return { items: newItems };
        }),
    })),
    {
      equality: (pastState, currentState) =>{
        console.log(pastState,"hey",currentState)
        isEqual(pastState, currentState)
      }
    },
    {
      partialize: (state) => {
        const {  items ,...rest } = state;
        return { rest };
      },
    },
    // {
    //   diff: (pastState, currentState) => {
    //     const myDiff = diff(currentState, pastState);
    //     const newStateFromDiff = myDiff.reduce(
    //       (acc, difference) => {
    //         if (difference.type === 'CHANGE') {
    //           const pathAsString = difference.path.join('.')
    //           acc[pathAsString] = difference.value;
    //         }
    //         return acc;
    //       },
    //     );
    //     return isEmpty(newStateFromDiff) ? null : newStateFromDiff;
    //   },
    // },
    
  )
);
