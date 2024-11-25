import React, { useEffect } from "react";
import ItemWrapper from "./ItemWrapper";
import { getSVG } from "../../Template/shapes/shapeSvgConstants";
import { useItemStore } from "../stores/useItemStore";
const VideoField = ({ item, fromOverlay,fromPreview,fromImport }) => {
  const { setSelectedItem, updateItem } = useItemStore();
  return (
    <ItemWrapper item={item} fromOverlay={fromOverlay} fromPreview={fromPreview} fromImport={fromImport}>
      <div
        className="w-full h-full"
        onClick={(e) =>{e.preventDefault(); e.stopPropagation(); setSelectedItem(item)}}
        // onBlur={() => setSelectedItem(null)}
      >
        {item.link && (
          <video
            className="rounded-xl"
            // autoPlay
            controls
            // width={item.size.width}
            // height={item.size.height}
            poster={item?.thumbnailLink || item?.thumbnailLink}
          >
            <source src={item?.link} />
            {/* <source src="movie.ogg" type="video/ogg"> */}
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </ItemWrapper>
  );
};

export default VideoField;
