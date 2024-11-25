import { Accordion, AccordionItem } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

const PagesPreviewPane = ({
  document,
  handlePageIndexChange,
  currentPageIndex,
}) => {
  // console.log(currentPageIndex);
  return (
    <div className="hidden lg:flex flex-col col-span-2 h-full bg-gray-50 overflow-y-auto border-r border-t border-gray-400 mb-[50px]">
      <p className="p-2 pt-3 pl-5 font-semibold border-b border-gray-400 text-[#151513]">
        Pages
      </p>
      <div>
        <div className="flex flex-col  gap-3 py-4 pt-2 mb-[50px]">
          {document&&
          document.stampImgUrls &&
          document.stampImgUrls.length>0&&
          document.stampImgUrls.map((ele,idx)=>{
            return (
              <div
                className="flex flex-col  justify-center items-center"
                key={crypto.randomUUID()}
              >
                <Image
                  src={ele}
                  height={220}
                  width={150}
                  alt="preview"
                  className={`border border-gray-300  ${
                    idx === currentPageIndex
                      ? "border-2 border-gray-400 drop-shadow-md"
                      : ""
                  }`}
                  onClick={() => handlePageIndexChange(idx)}
                />
                <p>{idx+1}</p>
              </div>
            );
          })
          }
          {document &&
            document.imageUrls &&
            document.imageUrls.length > 0 &&
            document.imageUrls.map((img, index) => {
              return (
                <div
                  className="flex flex-col  justify-center items-center"
                  key={index}
                >
                  <img
                    src={img}
                    height={220}
                    width={150}
                    alt="preview"
                    className={`border border-gray-300  ${
                      index === currentPageIndex
                        ? "border-2 border-gray-400 drop-shadow-md"
                        : ""
                    }`}
                    onClick={() => handlePageIndexChange(index)}
                  />
                  <p>{document.stampImgUrls&&document.stampImgUrls.length>0?document.stampImgUrls.length+index+1:index + 1}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PagesPreviewPane;
