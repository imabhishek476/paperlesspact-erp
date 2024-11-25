import React, { useEffect, useRef, useState } from 'react'
import Reveal from 'reveal.js';
import '/node_modules/reveal.js/dist/reveal.css';
import {useItemStore} from "../stores/useItemStore";
import {usePageStore} from "../stores/usePageStore";
import PresentationItemRenderer from './PresentationItemRenderer';
import { getSVG } from '../../Template/shapes/shapeSvgConstants';
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { MousePointer2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { useUserStore } from '../stores/userDetailStore';

import {getColorPreset} from '../../../Utils/Collaboration/colorHelper'
// import '/node_modules/reveal.js/dist/theme/black.css';

const RevealComponent = ({selected, pages, pageSetup, items, isOwner, roomId, selectedPage,setSelectedPage }) => {
    const deck = useRef(null); // keep deck instance in a ref
    const [pageItems,setPageItems] =useState([])
    const [selectedPageIndex,setSelectedPageIndex] =useState(0)
    const [doc, setDoc] = useState(null);
    const [awarenessProvider, setAwarenessProvider] = useState(null);
    const [mousePos, setMousePos] = useState(null);
    const [localClientId, setLocalClientId] = useState("");
    const [isCollabFailed, setIsCollabFailed] = useState(false);
    const [pointers, setPointers] = useState([]);
  const { details, setUserDetails } = useUserStore();
  useEffect(() => {
    if (!details) {
      const accessToken = Cookies.get("accessToken");
      setUserDetails(accessToken);
    }
  }, []);


    
   
    useEffect(() => {
      console.log(isOwner)
      
      console.log(pageSetup?.size?.height?.split("px")[0])
        if(isOwner){
          deck.current = new Reveal({
            backgroundTransition: "slide",
            transition: "slide",
            autoSlide: selected === "autoplay" ? 1000 : false,
            height:pageSetup?.size?.height?.split("px")[0],
            width:pageSetup?.size?.width?.split("px")[0],
            laydisableLayout: false,
            controls:true,
            keyboard:false,

        });
        } else{
          deck.current = new Reveal({
            backgroundTransition: "slide",
            transition: "slide",
            autoSlide: selected === "autoplay" ? 1000 : false,
            loop:true,
            height:pageSetup?.size?.height?.split("px")[0],
            width:pageSetup?.size?.width?.split("px")[0],
            laydisableLayout: false,
            controls:false,
            keyboard:false,
            touch:false,
        });
        }
        
        deck.current.initialize({})
        
        deck.current.on('slidechanged', event => {
          if(isOwner){
            let state=deck.current.getState()
            console.log(state)
            setSelectedPageIndex({
              h:state.indexh,
              v:state.indexv,
            })
            setSelectedPage(prev=>{
              return({
                ...prev,
                pageIndex:state.indexh
              })
            })
          } else {
            console.log(event.indexh)

          }
          // event.previousSlide, event.currentSlide, event.indexh, event.indexv
        } );
    }, []); // only launch useEffect at first render
    
    useEffect(() => {
      if (doc && !isOwner) {
        const slideState = doc.getArray("slideState");
        // console.log(messagesArray.toArray());
        const updateSlideState = () => {
          const slideStates = slideState.toArray()
          const latestSlide = slideStates[0]
          const state=deck.current.getState()
          if(!isOwner && latestSlide && deck.current){
            deck.current.setState({
              ...state,
              indexh: latestSlide.h,
              indexv:latestSlide.v
            })
          }
        };
  
        slideState.observe(updateSlideState);
  
        return () => {
          slideState.unobserve(updateSlideState);
        };
      }
    }, [doc,deck]);


    

    useEffect(() => {
      console.log(details?.data?.providerId);
      if (awarenessProvider && details) {
        // console.log(getColorPreset(index));
        awarenessProvider.setLocalState({
          name: details?.data?.fullname,
          x: mousePos?.x,
          y: mousePos?.y,
          color: getColorPreset(details?.data?.providerId),
        });
      }
    }, [mousePos, details, awarenessProvider]);

    useEffect(() => {
      const createWebsocketProvider = () => {        
        const ydoc = new Doc();
        // ydoc.define("slideState", Array);

        setLocalClientId(ydoc.clientID);
        const wsProvider = new WebsocketProvider(
          "wss://20.204.17.85:4001",
          // 'ws://20.204.17.85:4001', //local
          `presentation-broadcast-${roomId}`,
          ydoc
        );
        wsProvider.on("status", (event) => {
          if (event.status === "connected") {
            setDoc(wsProvider.doc);
            setIsCollabFailed(false);
          } else {
            setIsCollabFailed(true);
          }
        });
  
        wsProvider.on("error", (error) => {
          console.log(error)
          setTimeout(() => {
            wsProvider.destroy();
          }, 3000);
        });
  
        return wsProvider;
      };
      let wsProvider = null;
      let awareness = null;
      wsProvider = createWebsocketProvider();
      awareness = wsProvider.awareness;
      setAwarenessProvider(awareness);
      const awarenessUpdateHandler = ({ added, updated, removed }) => {
        const awarenessStates = Array.from(awareness.getStates());
        // console.log(awarenessStates);
        // awarenessStates.findIndex((ele)=>)
        const index = awarenessStates.findIndex(
          (ele) => ele[0] === localClientId
        );
        if (index !== -1) {
          // setIndex(index);
        }
        const filter = awarenessStates.filter(
          (ele) => ele[0] !== localClientId
        );
        // console.log(filter)
        setPointers(filter);
      };
      const handleMouseMove = (e) => {
        // console.log(e.x,e.y);
        const { height, width,x,y } = document
          .getElementById("collabWrapperDiv")
          .getBoundingClientRect();
        setMousePos({
          x: Math.floor((Math.floor(e.x) / Math.floor(width)) * 100),
          y: Math.floor(((Math.floor(e.y) - 73) / Math.floor(height)) * 100),
          // x:e.x,
          // y:e.y
        });
      };
      document.addEventListener("mousemove", handleMouseMove);
      awareness.on("update", awarenessUpdateHandler);
      return () => {
        if (wsProvider) {
          wsProvider.destroy();
        }
        if (awareness) {
          awareness.setLocalState(null);
          // document.removeEventListener("mousemove", handleMouseMove);
        }
        // clearInterval(interval);
      };
      // }
    }, []);
    useEffect(() => {
      if (doc && selectedPageIndex && isOwner ) {
        doc.getArray("slideState").insert(0,[selectedPageIndex]);
      }
    }, [selectedPageIndex,doc]);

    useEffect(()=>{
      if(doc&&deck){
        console.log('hello')
        console.log(selectedPage)
        const state=deck?.current.getState()
          if(deck && deck?.current){
            deck?.current?.setState({
              ...state,
              indexh: selectedPage.pageIndex
            })
          }
      }
    },[deck,selectedPage])
   
    
    return (
      <>
      {pointers &&
          pointers.length > 0 &&
          pointers.map((ele, index) => {
            // console.log(ele);
            if (ele[0] !== localClientId) {
              return (
                <span
                  key={ele[0]}
                  style={{
                    position: "absolute",
                    top: `${ele[1].y}%`,
                    left: `${ele[1].x}%`,
                    transition: "all 650ms",
                    zIndex: 100,
                    color: ele[1]?.color,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MousePointer2 color={ele[1]?.color} fill={ele[1]?.color} />
                  <p
                    style={{ backgroundColor: ele[1]?.color }}
                    className="text-white text-[10px] bg-gray-200 p-[2px] rounded-lg font-semibold"
                  >
                    {ele[1].name ? ele[1]?.name : "collaborator"}
                  </p>
                </span>
              );
            }
          })}
      <div className="slides" id='slid'
        style={{textAlign:"auto"}}
      >
        {pages?.map((page, index) => {
          // console.log(!page?.visibility)
          return (
          <section
            className="overflow-hidden flex justify-center items-center "
            key={index}
            id={"currentPage"}
            style={{
              minHeight:pageSetup?.size?.height,
              minWidth: pageSetup?.size?.width,
              height:pageSetup?.size?.height,
              width: pageSetup?.size?.width,
            }}
            data-transition={page?.transition}
            data-transition-speed={page?.transitionSpeed}
            data-autoslide={(page?.duration || 1) * 1000}
            data-visibility={!page?.visibility && "hidden"}
          >
            <div className='w-full h-full  border-4 bg-white'>
            {items
              ?.filter((item) => item?.pageIndex === page?.pageNo-1)
              ?.map((item, index) => {
                console.log(items)
                return <PresentationItemRenderer isPreview={true} key={index} item={item} pageSize={pageSetup?.size}/>
              })}
            </div>
          </section>
        )})}
      </div>
      </>
    );

}

export default RevealComponent