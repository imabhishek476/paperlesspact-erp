import React from 'react'
import GlobalTemplateUse from '../TemplateComponents/GlobalTemplateUse'
const TemplateList = ({serverData,handleFileChange}) => {
    return (
        <>
             <GlobalTemplateUse data={serverData} fromTab={true} handleFileChange={handleFileChange} />
        </>
        
    )
}

export default TemplateList
