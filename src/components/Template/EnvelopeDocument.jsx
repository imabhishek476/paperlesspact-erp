import React, { useState, useEffect } from 'react'
import FillableFieldsRenderer from '../LexicalTemplatePlayground/lexical-playground/src/FillableFieldsRenderer'
import Image from 'next/image'
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Droppable } from "./DnD/Droppable"
import { createSnapModifier } from '@dnd-kit/modifiers'
import { Clipboard, Copy, CopyPlus, Trash2 } from 'lucide-react'
import { useDocItemStore } from './stores/useDocItemStore'
import { useTabsStore } from './stores/useDocTabsStore'
import { usePageDataStore } from './stores/usePageDataStore'
import { useDocHistory } from './stores/useDocHistoryStore'


const gridSize = 1 // pixels
const snapToGridModifier = createSnapModifier(gridSize);

const EnvelopeDocument = ({
  handleDrop,
  participants,
  serverData,
  updateSharedItem,
  sharedItems,
  setItems,
  docImg,
  update,
  setUpdate,
  setActiveRef,
  menuItem,
  setMenuOpen,
  setMenuItem,
  setItemClicked,
  itemClicked,
  setCopiedItem,
  pageOreintation,
  setPoints,
  menuOpen,
  points,
  handleRemoveItem,
  handlePaste,
  handleDuplicate,
  copyItem,
  handleCopy,
  setActivePageIndex,
  selectedFieldItem
}
) => {
  console.log(docImg)
  const [active, setActive] = useState(false)
  const {isEditable} = usePageDataStore();
  const {pageSetup} = useTabsStore();

  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  // eslint-disable-next-line 
  // @ts-ignore

  // @ts-ignore
  const sensors = useSensors(
    mouseSensor
  )
  useEffect(() => {
    const handleClick = () => { setItemClicked(false), setMenuOpen(false) };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);
  useEffect(() => {
    if (selectedFieldItem) {
      setActive(true)
    }
  }, [selectedFieldItem])
  const {addHistory}=useDocHistory()
  const {
    setSelectedItem, handleDropItem, setQuoteEditorRef, setQuoteTargetNode, setSelectedFieldItem, quoteEditorRef, quoteTargetNode, items, selectedItem,resetItem
  } = useDocItemStore()
// useEffect(()=>{
//   resetItem()
// },[docImg])
  return (
    <div>
      {docImg &&
        docImg && docImg?.agreements[0]?.imageUrls?.map((img, index) => {
          return <div key={index} className={`flex flex-col justify-center items-center gap-5 w-[768px] mx-auto overflow-hidden`}>
            {(update || !update) && (
              <div
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (menuItem) {
                    setMenuOpen(true)
                  }
                  setActivePageIndex(index)
                  const pageId = `editor${index}`
                  const pageEle = document.getElementById(pageId)
                  const pageX = pageEle.getBoundingClientRect().left
                  const pageY = pageEle.getBoundingClientRect().top
                  if (e.clientX - pageX < 768) {
                    setPoints({
                      x: e.clientX - pageX + 160,
                      y: e.clientY - pageY,
                    });
                  }
                  else {
                    setItemClicked(false), setMenuOpen(false)
                  }
                }}

                className={`relative ${index !== 0 && 'pt-[35px]'}`}>
                <DndContext
                  modifiers={[snapToGridModifier]}
                  sensors={sensors}
                  onDragEnd={(e) => {
                    //  setSelectedFieldItem(null)
                    if (!((e.active.rect.current.translated?.left === e.active.rect.current.initial?.left) &&
                      (e.active.rect.current.translated?.top === e.active.rect.current.initial?.top))) {

                        handleDropItem(e,null, index, null,false, {
                          clientX: e.active.rect.current.translated?.left,
                          clientY: e.active.rect.current.translated?.top
                        },sharedItems,
                        updateSharedItem,
                        null,
                        null,
                        null,
                        null,
                        null,
                        setSelectedFieldItem,
                        addHistory)

                      // handleDrop(e, index, null, null, {
                      //   clientX: e.active.rect.current.translated?.left,
                      //   clientY: e.active.rect.current.translated?.top
                      // });
                    }
                  }}
                  onDragStart={(e) => {
                    setSelectedFieldItem(
                      items.find((el) => el.id === e.active.id)
                    )
                  }}
                // onDragMove={e=>e.active.rect}
                >
                  <Droppable id={`droppable-${index}`}>
                    <Image
                      id={`editor${index}`}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(e)
                        handleDropItem(e,null, index,null,false,null,sharedItems,
                        updateSharedItem,
                        null,
                        null,
                        null,
                        null,
                        null,
                        setSelectedFieldItem,
                        addHistory)
                        // handleDrop(e, index);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      // ref={onRef}
                      src={img}
                      width={768}
                      height={1080}
                      placeholder='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgICggIBw0IBwcHCAoHBwcHDQ8ICQcKFREWFhURExMYKCggGBolGxMTITEhJSkrLi4uFx8zODMtNygtLisBCgoKDQ0NDg0NDjcZFRktKysrKy0tKysrKystKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKgBLAMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAAAAwECBAUH/8QAJRABAAIBBAICAwADAAAAAAAAAAECEwMxYaFxgRESQVGRBBQh/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwD9rtP1j5cZOHWrt7RBTJwZOEwFMnBk4TAUycGThMBTJwZOEwFMnBk4TAUycGXhMBTLP6Mk/pNoO8vBkn9JtB3kn9GSf04Ad5ODJwmApk4MvCbJBSdbhzP+T8fiP6lZK8ixf/b4j+n+3xH9eOZZWUXHvj/J+fxH9dRr8PJWVaqyvl4bl4RhqiuXgy8JiCmSf0ZZ/SYCtdT5mI+N/wDjtGm8eYWBzq7e0VtXb2iAAAAAAAAAAAABDWQ0AY0ACAAAYyWskHFkLytZDUkWI2krLm8lZZaeikrVQpK1ZajNUh1DmJdKjQEGsAHVN48wsjTePMLA51dvaK2rt7RAAAAAAAAAAAAAgIAGsaAQEAwACWS2XMgnd59SV7y82rIsRvLKy4vZkWRp69OV6y8dLvRSyxmvRDuEa2UiVR22GQ2EAAHVN48wsjTePMLA51dvaK2rt7RAAAAAAAAAAAAAgIAGsaAQEAwCQZMp2l1aUb2Uc6lnk1bKalnk1bLhri9nEXcXsn9jDXspqPRTUfNrdamomD6dLr0s+bp6j16dweuJdwjSytUHQAOqbx5hZGm8eYWBzq7e0VtXb2iAAAAAAAAAAAABAQANY0AGAMlrmwJ3l59Sy15eXUlqIjqWeW8rakoWbRKycqWhxMGDn5dVs4liWD16V3t0bvmacvZoWZrT6enZesvJpS9VJZFGshoOqbx5hZGm8eYWBzq7e0VtXb2iAAAAAAAAAAAABAQANY0BjWAS4s7lxYEdR5dT8vVqPNqQ1EeW6Noei8JWhtEJhxMLTDiYUSmHEwrMOZhBlHs0fw8tYevRhmq92j+Hro8ujGz1UYVWGshoOqbx5hZGm8eYWBzq7e0VtXb2iAAAAAAAAAAAABAQANY0BjQGObOmSCN4ee8PVaEbw0jyXqlaHqtVG1WkeeYcTC9quJqohMOfqvNWRQE6VevRq5ppvTpUYqraUPTSEtOq9YZVrQB1TePMLI03jzCwOdXb2itq7e0QAAAAAAAAAAAAICABrGgEBAMJAHMwlaFpczCjzWqlar1zVOaKjyTRzNHrmjn6Lo8n0dRpvTjdRppojTTXpR3WilaopWHcEQ1AAB1TePMLI03jzCwOdXb2itq7e0QAAAAAAAAAAAAICGgxrGgEBAMAAY0BzMOZhRnwCc1Z9Vfg+FEvq6irv4PhBkQ34b8AAAAAOqbx5hZGm8eYWBzq7e0VtXb2iAAAAAAAAAAAABAADWNAY1gAAAAAAAAAAAAAAAAOqbx5hZGm8eYWBlo+0fGzjFz0AGLnoxc9ABi56MXPQAYuejFz0AGLnoxc9ABi56MXPQAYuejFz0AGLnoxc9NAZi56MXPTQDFz0zFz0AGLnoxc9ABi56MXPQAYuejFz0AGLnoxc9ABi56MXPQAYuejFz0AGLnoxc9ABi56MXPQA2un8TE/O3/XYA//2Q=='
                      alt={img} />
                  </Droppable>
                  <div className="flex justify-end ">Page {index + 1}</div>
                  {Array.isArray(items) && items.filter((item) => item.pageIndex === index).map((item) => {
                    console.log(item)
                    return <FillableFieldsRenderer
                      menuItem={menuItem}
                      setMenuOpen={setMenuOpen}
                      setMenuItem={setMenuItem}
                      setItemClicked={setItemClicked}
                      itemClicked={itemClicked}
                      setCopiedItem={setCopiedItem}
                      setActiveRef={setActiveRef}
                      key={item.id}
                      selectedItem={selectedItem}
                      setSelectedItem={setSelectedItem}
                      update={update}
                      item={item}
                      setUpdate={setUpdate}
                      handleDrop={handleDrop}
                      items={items}
                      setItems={setItems}
                      participants={participants}
                      serverData={serverData}
                      setSelectedFieldItem={setSelectedFieldItem}
                      sharedItems={sharedItems}
                      updateSharedItem={updateSharedItem}
                      pageOreintation={pageSetup?.orientation}
                    />

                  })}
                </DndContext>
                {(menuOpen || itemClicked) && isEditable && (
                  <div style={{ top: points.y, left: points.x - 160, zIndex: 100 }} className="absolute  w-40 bg-gray-800 text-white text-sm rounded-sm py-2">
                    <ul>

                      <li style={{ display: (copyItem && !itemClicked && menuItem) ? "flex" : "none" }} onClick={() => { handlePaste(), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Clipboard size={20} /> Paste</li>
                      <>
                        <li style={{ display: itemClicked ? "flex" : "none" }} onClick={() => { handleDuplicate(), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><CopyPlus size={20} /> Duplicate</li>
                        <li style={{ display: itemClicked ? "flex" : "none" }} onClick={() => { handleCopy(menuItem), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Copy size={20} /> Copy</li>
                        <li style={{ display: itemClicked ? "flex" : "none" }} onClick={() => { handleRemoveItem(), setItemClicked(false), setMenuOpen(false) }} className="flex flex-row gap-2 items-center px-7 py-2 hover:bg-gray-900 hover:cursor-pointer"><Trash2 size={20} /> Delete</li>
                      </>
                    </ul>
                  </div>
                )}
              </div>

            )}
          </div>
        })
      }
    </div>
  )
}

export default EnvelopeDocument
