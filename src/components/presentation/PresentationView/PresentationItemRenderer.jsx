import React from 'react'
import { getSVG } from '../../Template/shapes/shapeSvgConstants';
import { useItemStore } from '../stores/useItemStore';

const ItemWrapper = (props) => {  
  console.log(props?.item.size)
  return (  
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        // width: props?.item?.size?.width,
        // height: props?.item?.size?.height,
        // position:"fixed",
        height: props?.item.size.height,
        width: props?.item.size.width,
        zIndex: props?.item?.layer,
        opacity: props?.item?.options?.opacity ? props?.item?.options?.opacity:1,
        transformOrigin: "0 0",
        transform: props?.item?.transformObject && `${props?.item?.transformObject?.translate ? `translate(${props?.item?.transformObject?.translate[0]}px, ${props?.item?.transformObject?.translate[1]}px)` : ""} ${props?.item?.transformObject?.rotate ? `rotate(${props?.item?.transformObject?.rotate}deg)` : ""} ${props?.item?.transformObject?.scale ? `scale(${props?.item?.transformObject?.scale[0]}, ${props?.item?.transformObject?.scale[1]})` : ""}`,
      }}
      className={props?.item?.animation ? `fragment ${props?.item?.animation}`: ""}
    >
      <div className='w-full h-full'>
        {props.children}
      </div>
    </div>
  );
};


const PresentationItemRenderer = ({item,fromPrint,pageSize}) => {

  switch (item?.type) {
    case "text":
        console.log(item.html)
        return <ItemWrapper item={item} fromPrint={fromPrint}>
            <div className='w-full h-full break-words' 
            style={{
              // textDecoration:"none",
              // wordBreak:"break-word",
              fontSize:"15px",
              textAlign:"left",
              lineHeight:1.5,
              fontFamily: "Arial"}}
            dangerouslySetInnerHTML={{__html:item.html}}>

            </div>
        </ItemWrapper>;
      case "shape":
        console.log(pageSize)
        return <ItemWrapper item={item} fromPrint={fromPrint}>
            <div className='w-full h-full'>
            {getSVG(item.title, item.options, item.size, item?.orientation,false,pageSize)}
        </div>
        </ItemWrapper>;
        case "image":
        return (
          <ItemWrapper item={item} fromPrint={fromPrint}>
              {item?.link && (
                <img
                  src={item?.link}
                  alt=""                                
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: `${parseInt(item?.options?.radius)}px`,
                }}
                />
              )}
          </ItemWrapper>
        );
        case "avatar":
        return (
          <ItemWrapper item={item} fromPrint={fromPrint}>
              {item?.image && (
                <img
                  src={item?.image}
                  alt=""                                
                  className="w-full h-full"
                />
              )}
          </ItemWrapper>
        );
        case "video":
        return (
          <ItemWrapper item={item} fromPrint={fromPrint}>
              {item?.link &&
               <video data-autoplay height={item?.height} width={item?.width}>
               <source data-src={item?.link} />
               </video>
              }
          </ItemWrapper>
        );
      default:
        return <></>;
    }
}

export default PresentationItemRenderer