import { Tooltip } from '@nextui-org/react';
import React from 'react';

const Signature = ({item,selectedSignee, setSelectedFieldItem, signees, onOpen,colors}) => {
    console.log(item)
  return (
    <Tooltip
      content={`This place is for ${item?.signee?.fullname}`}
      isDisabled={item?.signee?.fullname === selectedSignee?.fullname}
    >
      <div
        style={{
          top: item.top || item.position.y,
          left: item.left || item.position.x,
          width: (item?.size? `${item?.size?.width*100/ 768}%`:'20%'),
          height: (item?.size? `${item?.size?.height*100/ 1080}%` : '3.6%'),
          backgroundColor:
            colors[
              signees.findIndex(
                (ele) => ele.fullname === item?.signee?.fullname
              ) % 3
            ]?.color,
          cursor:
            item?.signee?.fullname === selectedSignee?.fullname
              ? 'pointer'
              : 'not-allowed',
        }}
        onClick={() => {
        if (item?.signee?.fullname === selectedSignee?.fullname) {
            // if (true) {
                console.log(item.field);
                setSelectedFieldItem(item);
                onOpen();
          }
        }}
        className={`absolute z-[20] p-1 lg:p-3 text-[#151513] rounded-sm md:rounded-lg hover:cursor-pointer`}
      >
        <div
          className="w-full h-full relative flex items-center justify-center"
          id={item.id}
        >
          {item.field === 'Signature' || item.field === 'Initials' ? (
            item.image ? (
              <img
                src={
                  typeof item.image === 'string'
                    ? item.image
                    : URL.createObjectURL(item.image)
                }
                fill
                className="object-contain !relative"
                alt=""
              />
            ) : (
              <span>{item.field}</span>
            )
          ) : null}
        </div>
      </div>
    </Tooltip>
  );
};

export default Signature;
