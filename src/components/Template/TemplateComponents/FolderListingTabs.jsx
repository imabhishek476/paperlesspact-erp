import { Tab, Tabs } from '@nextui-org/react';
import React, { useEffect } from 'react'


const FolderListingTabs = ({ sharedFolder, recentFolder, favFolder }) => {
    let tabs = [
        {
            id: "recents",
            label: "Recents",
            content: recentFolder 
        },
        {
            id: "favroties",
            label: "Favroites",
            content: favFolder 
        },
        {
            id: "shared",
            label: "Shared with me",
            content: sharedFolder 
        }
    ];
    return (
        <div>
            <Tabs aria-label="Folder Listing tabs"
                color="primary"
                variant="underlined"
                classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-[#05686E]",
                    base: 'w-full ',
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-[#05686E]"
                }} items={tabs}>
                {(item) => (
                    <Tab key={item.id} title={item.label}>
                        {item?.content}
                    </Tab>
                )}
            </Tabs>
        </div>
    )
}

export default FolderListingTabs
