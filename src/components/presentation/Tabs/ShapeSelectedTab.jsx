import { Tab, Tabs } from '@nextui-org/react'
import React from 'react'
import ShapeConfigTab from './ShapeConfigTab'
import ShapePropertiesTab from './ShapePropertiesTab'
import ShapeAnimationTab from './ShapeAnimationTab'
import { useItemStore } from '../stores/useItemStore'

const ShapeSelectedTab = () => {
    const {selectedItem} = useItemStore()
  return (
    <Tabs aria-label="Options">
        <Tab key="photos" title="Position">
            <ShapeConfigTab />
        </Tab>
        <Tab key="music" title="Properties" isDisabled={!selectedItem?.options}>
           <ShapePropertiesTab />
        </Tab>
        <Tab key="videos" title="Animation">
           <ShapeAnimationTab />
        </Tab>
      </Tabs>
  )
}

export default ShapeSelectedTab