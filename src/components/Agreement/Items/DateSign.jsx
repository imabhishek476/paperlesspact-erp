import { Tooltip } from '@nextui-org/react';
import React from 'react';
import { formatDate } from "@/Utils/dateTimeHelpers";



const DateSign = ({item, setUpdate, setItems,setSelectedFieldItem,selectedSignee,signees,colors}) => {
    const onDateHandler = (item) => {
        setItems((prev) => {
          const index = prev.findIndex((el) => el.id === item.id);
          if (index !== -1) {
            const removed = prev.splice(index, 1);
          }
          // console.log(index)
          // prev[index] = {
          //   ...item,
          //   left:posX,
          //   top:posY,
          //   pageIndex,
          // }
    
          const date = formatDate(new Date());
          console.log(date);
          prev.push({
            ...item,
            text: date,
          });
          setSelectedFieldItem(null);
          return prev;
        });
        setUpdate((prev) => !prev);
      };
      console.log(item)
  return (
    <Tooltip
      key={item.id}
      content={`This place is for ${item?.signee?.fullname}`}
      isDisabled={item?.signee?.fullname === selectedSignee?.fullname}
    >
      <div
        // key={item.id}
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
              onDateHandler(item);
            }
        }}
        className={`absolute z-[20] p-1 lg:p-3 text-[#151513] rounded-sm md:rounded-lg hover:cursor-pointer`}
      >
        <div
          className="w-full h-full relative flex items-center justify-center"
          id={item.id}
        >
        
          {item.text ? <span>{item.text}</span>: <span>{item.field}</span>}
        </div>
      </div>
    </Tooltip>
  );
};

export default DateSign;
