import { Checkbox, Tooltip } from '@nextui-org/react';
import React, { useState } from 'react'

const CheckBoxItem = ({
    item,
    setItems,
    setSelectedFieldItem,
    selectedSignee,
    setUpdate,
    colors,
    signees
}) => {
    console.log(item)
    const [isSelected, setIsSelected] = useState(item.text === 'true'?true:false);

    return (
        <Tooltip
            key={item.id}
            content={`This place is for ${item?.signee?.fullname}`}
            isDisabled={item?.signee?.fullname === selectedSignee?.fullname}
        >
            <div
                style={{
                    top: item.top || item.position.y,
                    left: item.left || item.position.x,
                    width: (item?.size ? `${item?.size?.width * 100 / 768}%` : '20%'),
                    height: (item?.size ? `${item?.size?.height * 100 / 1080}%` : '3.6%'),
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

                className={`absolute z-[20] p-1 lg:p-3 text-[#151513] rounded-sm md:rounded-lg hover:cursor-pointer`}
            >
                <div
                    className="w-full h-full relative flex items-center justify-center"
                    id={item.id}
                >
                    <Checkbox
                        isSelected={isSelected}
                        onValueChange={setIsSelected}
                        color='secondary'
                        isDisabled ={item?.signee?.fullname !== selectedSignee?.fullname}
                        onChange={(e) => {
                            console.log(e?.target?.checked)
                            setItems((prev) => {
                                const index = prev.findIndex((el) => el.id === item.id);
                                if (index !== -1) {
                                    const removed = prev.splice(index, 1);
                                }
                                prev.push({
                                    ...item,
                                    text: e?.target?.checked?"true":"false",
                                });
                                setSelectedFieldItem(null)
                                setUpdate((prev) => !prev);
                                return prev;
                            });
                        }}
                    />
                </div>
            </div>
        </Tooltip>
    )
}

export default CheckBoxItem
