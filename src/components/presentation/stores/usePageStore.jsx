import { create } from "zustand";
import { devtools } from 'zustand/middleware';
const BASE_ITEM = {
    notes:[],
    visibility: true,
    transition: "none",
    transitionSpeed: "default",
    duration: 5
}

export const usePageStore = create(devtools((set) => ({
  IsDraggings: false,
  setIsDragginginStore: (bool)=>{
    return set(()=>({IsDraggings: bool}));
  },
  pages: [{...BASE_ITEM}],
  selectedPage: null,
  isDuration : false,
  pageSetup : null,
  pagePercent : 70,
  isPlay : false,
  setPagePercent: (pagePercent)=>{ 
    return set((state)=>({pagePercent :pagePercent}))
  },
  setPageSetup: (pageSetup)=>{ 
    return set((state)=>({pageSetup :pageSetup}))
  },
  setIsPlay: (isPlay)=>{ 
    return set(()=>({isPlay :isPlay}))
  },
  addPage: ()=>{ 
    return set((state)=>({pages : [...state.pages,{...BASE_ITEM}]}))
  },
  addAtIndex: (index)=>{
    set((state)=>{
        const newPages = state.pages
        newPages.splice(index,0,{...BASE_ITEM})
   return ({pages:newPages})
  })},
  deleteAtIndex: (index)=>{
    set((state)=>{
        const newPages = state.pages
        newPages.splice(index,1)
   return ({pages:newPages})
  })},
  setSelectedPage: (page,index)=>set(()=>({selectedPage:{...page, pageIndex:index}})),
  setDefaultSelectedPage: ()=>set((state)=>({selectedPage:{...state.pages[0], pageIndex:0}})),
  setVisibility : (index, visibility)=>{
    set((state)=>{
        const page = state.pages[index]
        const newPages = state.pages
        newPages.splice(index,1,{...page, visibility:visibility})
   return ({pages:newPages})
  })},
  setIsDuration : (duration)=>{
    set(()=>({isDuration:duration}))
  },
  updateAtIndex : (pageIndex,options) => {
    set((state)=>{
        const page = state.pages[pageIndex]
        const newPages = state.pages
        newPages.splice(pageIndex,1,{...page, ...options})
   return ({pages:newPages});
  })},
  setPages :(pages) => {
    set(()=>{
   return ({pages:pages})
  })},
  duplicatePage: (index)=>{  
    set((state)=>{
      const newPage = {...state.pages[index]}
      const newPages = [...state.pages]
      newPages.splice(index,0,newPage)
      return ({pages:newPages})
     })
  }
})));
