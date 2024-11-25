import React, { useEffect } from 'react'
import ItemWrapper from './ItemWrapper'
import { getSVG } from '../../Template/shapes/shapeSvgConstants'
import { useItemStore } from '../stores/useItemStore'
import Image from 'next/image'
const ImageField = ({item,fromOverlay,fromPreview,fromImport}) => {
    const {setSelectedItem,updateItem} = useItemStore()
  return (
    <ItemWrapper item={item} fromOverlay={fromOverlay} fromPreview={fromPreview} fromImport={fromImport}>
            <div
        className="w-full h-full"
        onClick={(e) =>{e.preventDefault(); e.stopPropagation(); setSelectedItem(item)}}
        // onBlur={() => setSelectedItem(null)}
      >
        {item?.link &&
            <img
            src={item?.link}
            alt=""
            height={item?.size?.height}
            width={item?.size?.width}
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

export default ImageField