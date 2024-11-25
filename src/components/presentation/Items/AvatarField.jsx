import React, { useEffect } from 'react'
import ItemWrapper from './ItemWrapper'
import { getSVG } from '../../Template/shapes/shapeSvgConstants'
import { useItemStore } from '../stores/useItemStore'
const AvatarField = ({item,fromOverlay,fromPreview, fromImport}) => {
    const {setSelectedItem,updateItem} = useItemStore()
  return (
    <ItemWrapper item={item} fromOverlay={fromOverlay} fromPreview={fromPreview} fromImport={fromImport}>
      <div
        className="w-full h-full"
        onClick={(e) =>{e.preventDefault(); e.stopPropagation(); setSelectedItem(item)}}
        // onBlur={() => setSelectedItem(null)}
      >
        {item?.image &&
            <img
            src={item?.image}
            alt=""
            style={{
              height: "100%",
              width: "100%",
              opacity: item?.options?.opacity,
              borderRadius: `${parseInt(item?.options?.radius)}px`,
          }}
            className="block cursor-move"
            />
        }
      </div>
    </ItemWrapper>
  );
}

export default AvatarField