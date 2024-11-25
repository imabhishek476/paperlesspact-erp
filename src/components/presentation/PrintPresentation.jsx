import React, { useEffect, useRef, useState } from 'react'
import Reveal from 'reveal.js';
import PresentationItemRenderer from './PresentationView/PresentationItemRenderer';
import { getSVG } from '../Template/shapes/shapeSvgConstants';
import '/node_modules/reveal.js/dist/reveal.css';

const PrintPresentation = ({data,pages}) => {
    const deck = useRef(null); // keep deck instance in a ref
    useEffect(()=>{
        if(deck.current) return
        deck.current = new Reveal({
            backgroundTransition: "slide",
            transition: "slide",
            height:parseInt(data?.pageSetup?.size?.height?.split("px")[0]),
            width:parseInt(data?.pageSetup?.size?.width?.split("px")[0]),
            pdfMaxPagesPerSlide:1,
            margin : 0,
            // disableLayout:true,
            pdfPageHeightOffset: -1,
            pdfSeparateFragments:false
        });
        deck.current.initialize()
        
        deck.current.on("error",()=>{console.log("yays")})
    },[])
  return (
    <div className="slides" style={{textAlign:"auto"}}>
        {pages?.map(({page,items}, index) => {
          return (
          <section
            // className="overflow-hidden flex justify-center items-center "
            key={index}
            className='h-full w-full relative !bg-white'
            style={{
                pageBreakAfter:"always",
            }}
            data-transition={page?.transition}
            data-transition-speed={page?.transitionSpeed}
            data-autoslide={(page?.duration || 1) * 1000}
            data-visibility={!page?.visibility && "hidden"}
          >
            <div 
            id='currentPage'
            style={{
                minHeight:data?.pageSetup?.size?.height,
                minWidth: data?.pageSetup?.size?.width,
                height:data?.pageSetup?.size?.height,
                width: data?.pageSetup?.size?.width,
                pageBreakAfter:"always",
                position:"relative"
            }}>
    
            {items?.length > 0 && items?.map((item, itemIndex) => {
                return <PresentationItemRenderer isPreview={true} key={itemIndex} item={item} fromPrint={true} pageSize={data?.pageSetup?.size}/>
              })}
            </div>
          </section>
        )})}
      </div>
  )
}

export default PrintPresentation

