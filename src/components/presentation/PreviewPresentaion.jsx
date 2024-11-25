import React, { useEffect, useState } from "react";
import PresentationNavbar from "./PresentationNavbar";
import PreviewPageSlider from "./PageComponent/PreviewPageSlider";
import PreviewSideBar from "./PreviewSidebar";
import dynamic from "next/dynamic";
import { pageWithNumber } from "../../lib/helpers/presentationHelpers";
const RevealComponent = dynamic(() => import('./PresentationView/PreviewReveal'), { ssr: false, })

const PreviewPresentaion = ({ data, isOwner, roomId, user }) => {

  console.log(data?.pages);
  console.log(data?.pages?.length);
  const visiblePages = data?.pages?.filter((item) => item?.visibility === true)
  const [selectedPage, setSelectedPage] = useState({ ...data?.pages[0], pageIndex: 0 })
  const newPages = pageWithNumber(data?.pages)
  const selectionChange = (page, index) => {
    console.log(page, index)
    setSelectedPage({
      ...page,
      pageIndex: index
    })
  }

  return (
    <>
      <PresentationNavbar
        presentationName={data.name}
        isPreview={true}
        isOwner={isOwner}
        data={data}
      />
      <main>
        <div></div>
        <div className="flex justify-between overflow-y-hidden">
          <div className=" flex flex-col justify-between h-[calc(100vh-57px)] w-full overflow-hidden relative bg-[#eee]">
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              <div className="reveal" id="collabWrapperDiv">
                <RevealComponent isOwner={isOwner} pageSetup={data?.pageSetup} pages={newPages} items={data?.items} roomId={roomId} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
              </div>
            </div>
            {
              isOwner && (
                <div className="w-full">
                  <PreviewPageSlider pages={newPages} items={data?.items} pageSetup={data?.pageSetup} selectedPage={selectedPage} selectionChange={selectionChange} />
                </div>
              )
            }

          </div>
          <PreviewSideBar roomId={roomId} user={user} />
        </div>
      </main>
    </>
  );
};

export default PreviewPresentaion;
