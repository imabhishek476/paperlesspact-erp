import { Radio, RadioGroup } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import { useItemStore } from '../stores/useItemStore';


const animations = [
    {
        title: "None",
        value: null,
    },
    {
        title: "Fade Out",
        value: "fade-out",
    },
    {
        title: "Fade Up",
        value: "fade-up",
    },
    {
        title: "Fade Down",
        value: "fade-down",
    },
    {
        title: "Fade Left",
        value: "fade-left",
    },
    {
        title: "Fade Right",
        value: "fade-right",
    },

]

const ShapeAnimationTab = () => {
    const {items, selectedItem,setSelectedItem , updateItem} = useItemStore()
    const [selected, setSelected] = useState(items.find(el=>el.id === selectedItem?.id)?.animation || null);
    useEffect(()=> {
      const item =items.find(el=>el.id === selectedItem?.id)
      updateItem({...item, animation:selected})
    },[selected])
    useEffect(()=>{
        setSelected(items.find(el=>el.id === selectedItem?.id)?.animation || null)
    },[selectedItem])
    return (
      <div className="flex-col">
         <div className="p-4 border-b-2 mb-2">
        <p className="text-[14px] text-[#05686e]">Animation</p>
      </div>
        <RadioGroup
        //   label="Select"
          value={selected}
          onValueChange={setSelected}
        >
            {animations.map((animation, index)=><Radio key={index} value={animation.value}>{animation.title}</Radio>)}
        </RadioGroup>
      </div>
    );
}

export default ShapeAnimationTab