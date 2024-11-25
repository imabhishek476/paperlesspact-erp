import React, { useEffect, useRef } from 'react'
import Reveal from 'reveal.js';
import '/node_modules/reveal.js/dist/reveal.css';
import {useItemStore} from "../stores/useItemStore";
import {usePageStore} from "../stores/usePageStore";
import PresentationItemRenderer from './PresentationItemRenderer';
// import '/node_modules/reveal.js/dist/theme/black.css';

const RevealComponent = ({selected}) => {
    const deck = useRef(null); // keep deck instance in a ref
    const {items} = useItemStore()
    console.log(items)
    const {pages, pageSetup} = usePageStore()
    useEffect(() => {
      console.log(pageSetup?.size?.height?.split("px")[0])
        deck.current = new Reveal({
            backgroundTransition: "slide",
            transition: "slide",
            autoSlide: selected === "autoplay" ? 1000 : false,
            loop: selected === "autoplay" ,
            height:pageSetup?.size?.height?.split("px")[0],
            width:pageSetup?.size?.width?.split("px")[0],
            laydisableLayout: false,
        });
        deck.current.initialize();
        deck.current.on( 'slidechanged', event => {
          console.log(event)
          // event.previousSlide, event.currentSlide, event.indexh, event.indexv
        } );
    }, []); // only launch useEffect at first render
    
    return (
      <div className="slides" id='slid'
        style={{textAlign:"start"}}
      >
        {pages.map((page, index) => {
          console.log(page.visibility)
          return (
          <section
            className="overflow-hidden flex justify-center items-center "
            key={index}
            style={{
              minHeight: pageSetup=== "landscape" ? pageSetup?.size?.width : pageSetup?.size?.height,
              minWidth: pageSetup=== "landscape" ? pageSetup?.size?.height : pageSetup?.size?.width,
              height: pageSetup=== "landscape" ? pageSetup?.size?.width : pageSetup?.size?.height,
              width: pageSetup=== "landscape" ? pageSetup?.size?.height : pageSetup?.size?.width,
            }}
            data-transition={page?.transition}
            data-transition-speed={page?.transitionSpeed}
            data-autoslide={(page?.duration || 1) * 1000}
            data-visibility={!page?.visibility && "hidden"}
          >
            <div className='w-full h-full  border-4'>
            <span className="text-bold text-3xl">
          {index + 1}
          </span>
            {items
              ?.filter((item) => item?.pageIndex === index)
              ?.map((item, index) => {
                console.log(item)
                return <PresentationItemRenderer key={index} item={item} pageSize={pageSetup?.size}/>
              })}
            </div>
          </section>
        )})}
      </div>
    );

}

export default RevealComponent