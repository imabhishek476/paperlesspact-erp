import { ModalBody, ModalHeader } from "@nextui-org/react";
import dynamic from "next/dynamic";
import React from "react";

const RevealComponent = dynamic(() => import('./Reveal'), { ssr: false, })
const PreviewRevealComponent =dynamic(() => import('./PreviewReveal'), { ssr: false, })
const PresenterModal = ({selected, isPreview,data}) => {
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Presentation</ModalHeader>
      <ModalBody className="z-999">
        <div className="reveal">
          {
            isPreview ? (
              <PreviewRevealComponent pageSetup={data?.pageSetup} pages={data?.pages} items={data?.items} selected={selected}/>
            ):(
              <RevealComponent selected={selected}/>
            )
          }
        
        </div>
      </ModalBody>
    </>
  );
};

export default PresenterModal;
